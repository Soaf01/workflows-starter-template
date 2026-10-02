import { MODELS } from "./config.js";
import { extractJson, getClient, textOf } from "./llm.js";
import type { ResaleDraft, ScoredCandidate } from "./types.js";

// Étage 5 — boucle de revente. Au clic "Acheté", on génère le paquet de
// revente. La PUBLICATION reste manuelle en v1 (Leboncoin/Vinted/Selency
// n'ont pas d'API de publication) ; eBay Sell API = TODO après enrôlement
// développeur. Règle d'honnêteté : le libellé suit attributionLevel —
// "de X" seulement si prouvé, sinon "attribué à", sinon "dans le style de".

const ATTRIBUTION_WORDING: Record<string, string> = {
  prouvee: "de",
  attribuee: "attribué à",
  style: "dans le style de",
};

export function resalePriceEur(s: ScoredCandidate): number {
  // Médiane des comps × 0,95 pour la liquidité ; sans comps, 3× le prix
  // d'achat comme point de départ à ajuster à la main.
  const base = s.medianCompEur > 0 ? s.medianCompEur * 0.95 : s.listing.priceEur * 3;
  return Math.round(base / 10) * 10;
}

function buildPrompt(s: ScoredCandidate): string {
  const i = s.identification;
  const wording = ATTRIBUTION_WORDING[i.attributionLevel];
  return `Rédige une annonce de revente honnête et vendeuse pour cette pièce, en français.

Pièce : ${i.summary}
Designers/éditeurs : ${i.designersOrEditors.join(", ")}
Niveau de preuve : ${i.attributionLevel} — tu DOIS utiliser le libellé « ${wording} [nom] » dans le titre et la description, jamais plus affirmatif.
Détails authentifiants constatés : ${i.detailsToVerify.join(" ; ")}
Prix de vente : ${resalePriceEur(s)} €

Contraintes :
- Titre ≤ 70 caractères.
- Description : 3 courts paragraphes — ce que c'est et pourquoi ça a de la valeur (période, édition, détails), état constaté SANS rien masquer, conditions (retrait/expédition).
- Aucune invention : uniquement ce qui est fourni ci-dessus.
Réponds UNIQUEMENT ce JSON : {"title": "...", "description": "..."}`;
}

export async function generateResaleDraft(s: ScoredCandidate): Promise<ResaleDraft> {
  const client = getClient();
  const resp = await client.messages.create({
    model: MODELS.resale,
    max_tokens: 2000,
    messages: [{ role: "user", content: buildPrompt(s) }],
  });
  const j = extractJson<{ title: string; description: string }>(textOf(resp.content));
  return {
    platform: s.sizeClass === "petit" ? "eBay (expédiable)" : "Selency / Leboncoin",
    title: j.title,
    description: j.description,
    priceEur: resalePriceEur(s),
  };
}

export function resaleDraftMock(s: ScoredCandidate): ResaleDraft {
  const i = s.identification;
  const wording = ATTRIBUTION_WORDING[i.attributionLevel];
  return {
    platform: "Selency / Leboncoin",
    title: `Pièce ${wording} ${i.designersOrEditors[0] ?? "designer XXe"} (mock)`,
    description: `${i.summary}\n\nÉtat : voir photos. ${wording} ${i.designersOrEditors.join(", ")}.\n\nRetrait ou expédition à discuter.`,
    priceEur: resalePriceEur(s),
  };
}
