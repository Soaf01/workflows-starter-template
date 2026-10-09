import { CAPS, discoveryMode, SOURCES, THRESHOLDS } from "./config.js";
import { compsMock, searchComps } from "./comps.js";
import { ingest } from "./ingest.js";
import { prefilter } from "./prefilter.js";
import { passesAlertThreshold, score } from "./scoring.js";
import { isAuthError, preflightAuth } from "./llm.js";
import { combinedScamRisk, heuristicScamFlags } from "./scam.js";
import { loadState, markSeen, saveState } from "./store.js";
import { candidateCaption, sendCandidate } from "./telegram.js";
import { postCandidate } from "./webapp.js";
import { sendCandidateToDiscord } from "./discord.js";
import { identify, identifyMock } from "./vision/identify.js";
import { passesTriage, triage, triageMock } from "./vision/triage.js";
import type { RawListing, ScoredCandidate, TriageResult } from "./types.js";

export async function runPipeline(dryRun: boolean): Promise<void> {
  if (!dryRun) await preflightAuth(); // avant l'ingestion : ne pas payer Apify avec une clé morte
  const state = loadState();
  const stats = { ingested: 0, prefiltered: 0, triaged: 0, identified: 0, alerted: 0 };

  // Étage 1 — ingestion
  const listings: RawListing[] = [];
  for (const src of SOURCES) {
    const batch = await ingest(src, dryRun);
    listings.push(...batch);
  }
  stats.ingested = listings.length;

  // Pré-filtre texte (gratuit)
  // Les refusés sont marqués vus tout de suite ; les retenus seulement une
  // fois réellement analysés — sinon un plafond atteint les perdrait en silence.
  const survivors: RawListing[] = [];
  for (const l of listings) {
    const r = prefilter(l, state);
    if (r.pass) survivors.push(l);
    else markSeen(state, l.id);
  }
  stats.prefiltered = survivors.length;
  console.log(
    `[pipeline] pré-filtre : ${survivors.length}/${listings.length} retenus — tri vision séquentiel (~5 s/annonce, soit ~${Math.ceil((survivors.length * 5) / 60)} min).`,
  );

  // Étage 2A — triage vision de TOUT le passage d'abord ; l'étage cher ne
  // traite ensuite que les meilleurs candidats, classés par promesse — les
  // créneaux quotidiens ne partent plus au premier venu de la matinée.
  const scored: ScoredCandidate[] = [];
  const identifiedAll: ScoredCandidate[] = [];
  const candidates: Array<{ l: RawListing; t: TriageResult }> = [];
  let progress = 0;
  for (const l of survivors) {
    progress++;
    if (progress % 10 === 0) console.log(`[triage] ${progress}/${survivors.length}…`);
    if (state.counters.visionA >= CAPS.visionAPerDay) {
      console.warn("[caps] Plafond vision A atteint — reste reporté à demain.");
      break;
    }
    state.counters.visionA++;
    markSeen(state, l.id); // analysé (ou tenté) — ne reviendra plus
    let t;
    try {
      t = dryRun ? triageMock(l) : await triage(l);
    } catch (e) {
      if (isAuthError(e)) throw e; // inutile de continuer, tout échouera
      console.warn(`[triage] ${l.id} : ${(e as Error).message}`);
      continue;
    }
    if (!passesTriage(t)) continue;
    stats.triaged++;
    candidates.push({ l, t });
  }
  candidates.sort((a, b) => b.t.confidence - a.t.confidence);
  if (candidates.length > 0) {
    const slots = Math.max(0, CAPS.visionBPerDay - state.counters.visionB);
    console.log(
      `[triage] ${candidates.length} candidat(s) — analyse approfondie des ${Math.min(slots, candidates.length)} plus prometteurs (budget restant : ${slots}).`,
    );
  }

  // Étage 2B — identification des meilleurs (plafond dur)
  for (const { l, t } of candidates) {
    if (state.counters.visionB >= CAPS.visionBPerDay) {
      console.warn("[caps] Plafond vision B atteint — meilleurs servis d'abord, reste demain.");
      break;
    }
    state.counters.visionB++;
    console.log(
      `[identify] « ${l.title.slice(0, 60)} » (${t.family}, conf ${t.confidence})…`,
    );
    let ident;
    try {
      ident = dryRun ? identifyMock(l, t) : await identify(l, t);
    } catch (e) {
      console.warn(`[identify] ${l.id} : ${(e as Error).message}`);
      continue;
    }
    stats.identified++;

    // Étage 3 — comps + scoring + fusion anti-arnaque
    const comps = dryRun ? compsMock() : await searchComps(ident.compsQuery);
    const s = score(l, t, ident, comps);
    const heurFlags = heuristicScamFlags(l, s.medianCompEur);
    const allFlags = [...(s.identification.scamFlags ?? []), ...heurFlags];
    const risk = combinedScamRisk(s.identification.scamRisk, heurFlags);
    s.identification.scamRisk = risk;
    s.identification.scamFlags = allFlags;
    if (risk >= 0.6) {
      s.identification.summary = `🚨 RISQUE D'ARNAQUE ${Math.round(risk * 100)} % — NE PAS ACHETER sans lever chaque signal : ${s.identification.summary}`;
      console.log(`[scam] ${l.id} écarté des alertes (risque ${risk.toFixed(2)} : ${allFlags.join(" · ")})`);
    } else if (allFlags.length > 0) {
      s.identification.summary = `${s.identification.summary} ⚠️ Signaux à lever : ${allFlags.join(" · ")}`;
    }
    // Sans comps eBay mais avec une cote modèle : la valeur reste visible.
    const iLow = s.identification.marketLowEur ?? 0;
    const iHigh = s.identification.marketHighEur ?? 0;
    if (s.comps.length === 0 && iHigh > 0) {
      s.identification.summary = `${s.identification.summary} 💶 Cote estimée par le modèle : ${iLow}–${iHigh} € (pas de comps eBay sur ce passage — à vérifier) · gain net potentiel ≈ ${s.estimatedNetGainEur} €`;
    }
    identifiedAll.push(s);
    if (passesAlertThreshold(s)) scored.push(s);
  }

  // Étage 4 — alertes (top N) ; mode découverte si rien ne passe le seuil
  scored.sort((a, b) => b.score - a.score);
  let top = scored.slice(0, THRESHOLDS.maxAlertsPerRun);
  if (top.length === 0 && identifiedAll.length > 0 && discoveryMode()) {
    const best = [...identifiedAll].sort((a, b) => {
      const aRisk = (a.identification.scamRisk ?? 0) >= 0.6 ? 1 : 0;
      const bRisk = (b.identification.scamRisk ?? 0) >= 0.6 ? 1 : 0;
      if (aRisk !== bRisk) return aRisk - bRisk;
      const aStyle = a.identification.attributionLevel === "style" ? 1 : 0;
      const bStyle = b.identification.attributionLevel === "style" ? 1 : 0;
      if (aStyle !== bStyle) return aStyle - bStyle;
      return b.identification.confidence - a.identification.confidence || b.score - a.score;
    })[0];
    best.identification.summary = `👁 DÉCOUVERTE (sous le seuil d'alerte — sert la calibration, pas une recommandation d'achat) : ${best.identification.summary}`;
    top = [best];
    console.log("[pipeline] mode découverte : meilleur candidat du passage envoyé malgré le seuil.");
  }
  for (const s of top) {
    if (dryRun) {
      console.log(`\n=== ALERTE (dry-run) ===\n${candidateCaption(s)}\n`);
    } else {
      await sendCandidate(s); // Telegram (optionnel)
      await postCandidate(s); // Pépites Manager (optionnel)
      await sendCandidateToDiscord(s); // Discord (optionnel)
    }
    state.pending[s.listing.id] = s;
    stats.alerted++;
  }

  saveState(state);
  console.log(
    `[pipeline] ingérées ${stats.ingested} → pré-filtre ${stats.prefiltered} → triage ${stats.triaged} → identifiées ${stats.identified} → alertes ${stats.alerted}`,
  );
}
