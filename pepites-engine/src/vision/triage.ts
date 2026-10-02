import type Anthropic from "@anthropic-ai/sdk";
import { MODELS, THRESHOLDS } from "../config.js";
import { extractJson, getClient, textOf } from "../llm.js";
import type { RawListing, TriageResult } from "../types.js";

const PROMPT = `Tu es un œil de marchand de design du XXe siècle. Regarde la photo et le titre d'une petite annonce.
Question unique : cet objet POURRAIT-il être une pièce de design attribuable (années 1930-1980), par sa silhouette, ses matériaux, sa construction ?
Sois volontairement large : un doute = candidat. Réponds UNIQUEMENT ce JSON :
{"candidat": true|false, "famille": "assise"|"luminaire"|"rangement"|"table"|"bureau"|"objet"|"autre", "confiance": 0.0-1.0}`;

export async function triage(l: RawListing): Promise<TriageResult> {
  const client = getClient();
  const content: Anthropic.ContentBlockParam[] = [
    { type: "image", source: { type: "url", url: l.imageUrls[0] } },
    { type: "text", text: `Titre : ${l.title}\n\n${PROMPT}` },
  ];
  const resp = await client.messages.create({
    model: MODELS.triage,
    max_tokens: 200,
    messages: [{ role: "user", content }],
  });
  const j = extractJson<{ candidat: boolean; famille: string; confiance: number }>(
    textOf(resp.content),
  );
  return { candidate: j.candidat, family: j.famille, confidence: j.confiance };
}

// Dry-run : décision déterministe sans appel réseau.
export function triageMock(l: RawListing): TriageResult {
  const t = l.title.toLowerCase();
  const families: Array<[string, string]> = [
    ["fauteuil", "assise"],
    ["chaise", "assise"],
    ["lampadaire", "luminaire"],
    ["lampe", "luminaire"],
    ["applique", "luminaire"],
    ["enfilade", "rangement"],
    ["étagère", "rangement"],
    ["bureau", "bureau"],
    ["table", "table"],
  ];
  for (const [kw, fam] of families) {
    if (t.includes(kw)) return { candidate: true, family: fam, confidence: 0.6 };
  }
  return { candidate: false, family: "autre", confidence: 0.1 };
}

export function passesTriage(t: TriageResult): boolean {
  return t.candidate && t.confidence >= THRESHOLDS.triageMinConfidence;
}
