import { generateResaleDraft, resaleDraftMock } from "./resale.js";
import { loadState, saveState } from "./store.js";
import { answerCallback, getUpdates, sendResaleDraft, sendText } from "./telegram.js";
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
  console.log(`[feedback] ${updates.length} update(s) traité(s).`);
}
