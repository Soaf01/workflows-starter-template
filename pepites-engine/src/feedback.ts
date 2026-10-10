import { sendDraftToDiscord } from "./discord.js";
import { generateResaleDraft, resaleDraftMock } from "./resale.js";
import { loadState, saveState } from "./store.js";
import { answerCallback, getUpdates, sendResaleDraft, sendText } from "./telegram.js";
import { checkListingAlive, MAX_CHECKS_PER_SWEEP, RECHECK_GAP_MS, STALE_TTL_MS } from "./stale.js";
import {
  ackDecisions,
  fetchPendingCandidates,
  fetchUnprocessedDecisions,
  postDraft,
  postExpired,
  webappConfigured,
} from "./webapp.js";
import type { Decision } from "./types.js";

// Boucle humaine : lit les clics sur les boutons d'alerte, enregistre la
// décision (jeu de calibration), et au clic "Acheté" déclenche l'Étage 5.
export async function processFeedback(dryRun: boolean): Promise<void> {
  const state = loadState();
  const updates = await getUpdates(state.telegramOffset);
  for (const u of updates) {
    state.telegramOffset = u.update_id + 1;
    const data = u.callback_query?.data;
    if (!u.callback_query || !data || !data.startsWith("d:")) continue;

    const sep = data.lastIndexOf(":");
    const listingId = data.slice(2, sep);
    const decision = data.slice(sep + 1) as Decision;
    state.decisions[listingId] = { decision, at: new Date().toISOString() };
    await answerCallback(u.callback_query.id, `Noté : ${decision}`);

    if (decision === "achete") {
      const pending = state.pending[listingId];
      if (!pending) {
        await sendText(`Candidat ${listingId} introuvable — brouillon de revente impossible.`);
        continue;
      }
      try {
        const draft = dryRun ? resaleDraftMock(pending) : await generateResaleDraft(pending);
        await sendResaleDraft(draft);
      } catch (e) {
        await sendText(`Échec de génération du brouillon : ${(e as Error).message}`);
      }
    }
    delete state.pending[listingId];
  }
  saveState(state);
  console.log(`[feedback] Telegram : ${updates.length} update(s) traité(s).`);

  await processWebappDecisions(dryRun);
}

// Décisions prises dans Pépites Manager : enregistrement local (calibration)
// + génération du brouillon de revente s'il manque, reposté vers l'app.
async function processWebappDecisions(dryRun: boolean): Promise<void> {
  if (!webappConfigured()) return;
  const state = loadState();
  const items = await fetchUnprocessedDecisions();
  const acked: string[] = [];
  for (const it of items) {
    if (it.status === "pending") continue;
    state.decisions[it.id] = {
      decision: it.status,
      at: it.decidedAt ?? new Date().toISOString(),
    };
    if (it.status === "achete" && !it.draft) {
      try {
        const draft = dryRun ? resaleDraftMock(it.candidate) : await generateResaleDraft(it.candidate);
        await postDraft(it.id, draft);
        await sendDraftToDiscord(draft);
      } catch (e) {
        console.warn(`[webapp] brouillon ${it.id} : ${(e as Error).message}`);
      }
    }
    delete state.pending[it.id];
    acked.push(it.id);
  }
  await ackDecisions(acked);
  saveState(state);
  console.log(`[feedback] Webapp : ${acked.length} décision(s) traitée(s).`);

  await sweepStaleCandidates(dryRun);
}

// Fraîcheur de la file : une annonce disparue du site est retirée de la file
// (« expiree ») ; une annonce invérifiable depuis plus de 7 jours aussi.
async function sweepStaleCandidates(dryRun: boolean): Promise<void> {
  if (dryRun || !webappConfigured()) return;
  const state = loadState();
  const pending = await fetchPendingCandidates();
  let checked = 0;
  let expired = 0;
  for (const it of pending) {
    if (checked >= MAX_CHECKS_PER_SWEEP) break;
    const last = state.staleChecks[it.id];
    if (last && Date.now() - Date.parse(last) < RECHECK_GAP_MS) continue;
    checked++;
    state.staleChecks[it.id] = new Date().toISOString();
    const liveness = await checkListingAlive(it.candidate.listing.url);
    const ageMs = it.receivedAt ? Date.now() - Date.parse(it.receivedAt) : 0;
    if (liveness === "gone" || (liveness === "unknown" && ageMs > STALE_TTL_MS)) {
      await postExpired(it.id);
      delete state.pending[it.id];
      delete state.staleChecks[it.id];
      expired++;
      console.log(
        `[stale] « ${it.candidate.listing.title.slice(0, 50)} » retirée de la file (${liveness === "gone" ? "annonce disparue" : "invérifiable depuis 7 j"}).`,
      );
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  saveState(state);
  if (checked > 0) console.log(`[stale] ${checked} vérifiée(s), ${expired} expirée(s).`);
}
