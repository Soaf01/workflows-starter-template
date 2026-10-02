import { CAPS, SOURCES, THRESHOLDS } from "./config.js";
import { compsMock, searchComps } from "./comps.js";
import { ingest } from "./ingest.js";
import { prefilter } from "./prefilter.js";
import { passesAlertThreshold, score } from "./scoring.js";
import { loadState, markSeen, saveState } from "./store.js";
import { candidateCaption, sendCandidate } from "./telegram.js";
import { postCandidate } from "./webapp.js";
import { identify, identifyMock } from "./vision/identify.js";
import { passesTriage, triage, triageMock } from "./vision/triage.js";
import type { RawListing, ScoredCandidate } from "./types.js";

export async function runPipeline(dryRun: boolean): Promise<void> {
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
  const survivors: RawListing[] = [];
  for (const l of listings) {
    const r = prefilter(l, state);
    if (r.pass) survivors.push(l);
    markSeen(state, l.id);
  }
  stats.prefiltered = survivors.length;

  // Étage 2A — triage vision (plafond dur)
  const scored: ScoredCandidate[] = [];
  for (const l of survivors) {
    if (state.counters.visionA >= CAPS.visionAPerDay) {
      console.warn("[caps] Plafond vision A atteint — reste reporté à demain.");
      break;
    }
    state.counters.visionA++;
    const t = dryRun ? triageMock(l) : await triage(l);
    if (!passesTriage(t)) continue;
    stats.triaged++;

    // Étage 2B — identification (plafond dur)
    if (state.counters.visionB >= CAPS.visionBPerDay) {
      console.warn("[caps] Plafond vision B atteint — reste reporté à demain.");
      break;
    }
    state.counters.visionB++;
    let ident;
    try {
      ident = dryRun ? identifyMock(l, t) : await identify(l, t);
    } catch (e) {
      console.warn(`[identify] ${l.id} : ${(e as Error).message}`);
      continue;
    }
    stats.identified++;

    // Étage 3 — comps + scoring
    const comps = dryRun ? compsMock() : await searchComps(ident.compsQuery);
    const s = score(l, t, ident, comps);
    if (passesAlertThreshold(s)) scored.push(s);
  }

  // Étage 4 — alertes (top N)
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, THRESHOLDS.maxAlertsPerRun);
  for (const s of top) {
    if (dryRun) {
      console.log(`\n=== ALERTE (dry-run) ===\n${candidateCaption(s)}\n`);
    } else {
      await sendCandidate(s); // Telegram (optionnel)
      await postCandidate(s); // Pépites Manager (optionnel)
    }
    state.pending[s.listing.id] = s;
    stats.alerted++;
  }

  saveState(state);
  console.log(
    `[pipeline] ingérées ${stats.ingested} → pré-filtre ${stats.prefiltered} → triage ${stats.triaged} → identifiées ${stats.identified} → alertes ${stats.alerted}`,
  );
}
