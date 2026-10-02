import type Anthropic from "@anthropic-ai/sdk";
import { MODELS } from "../config.js";
import { extractJson, getClient, textOf } from "../llm.js";
import { refsAsPromptBlock, refsForFamily } from "../refs.js";
import type { Identification, RawListing, TriageResult } from "../types.js";

const MAX_IMAGES = 6;

function buildPrompt(l: RawListing, t: TriageResult): string {
  const refs = refsAsPromptBlock(refsForFamily(t.family));
  return `Tu es un expert en design du XXe siècle travaillant pour un chineur. Analyse TOUTES les photos de cette annonce.

Annonce :
- Titre : ${l.title}
- Description : ${l.description}
- Prix demandé : ${l.priceEur} €
- Lieu : ${l.location}

Références de silhouettes à forte cote pour la famille « ${t.family} » :
${refs}

Tâche : dire si l'objet est plausiblement attribuable à un designer/éditeur coté, avec quel niveau de preuve VISIBLE sur les photos, et quoi vérifier avant achat.
Règle stricte sur attributionLevel :
- "prouvee" UNIQUEMENT si une étiquette, estampille ou marquage d'éditeur est visible sur les photos ;
- "attribuee" si la construction et les détails correspondent fortement sans marquage visible ;
- "style" sinon.
Réponds UNIQUEMENT ce JSON :
{"summary": "...", "designersOrEditors": ["..."], "attributionLevel": "prouvee"|"attribuee"|"style", "confidence": 0.0-1.0, "detailsToVerify": ["..."], "questionsForSeller": ["..."], "compsQuery": "requête courte pour chercher les prix réalisés, ex. 'fauteuil Pierre Guariche Steiner'"}`;
}

export async function identify(l: RawListing, t: TriageResult): Promise<Identification> {
  const client = getClient();
  const content: Anthropic.ContentBlockParam[] = [
    ...l.imageUrls.slice(0, MAX_IMAGES).map(
      (url): Anthropic.ContentBlockParam => ({
        type: "image",
        source: { type: "url", url },
      }),
    ),
    { type: "text", text: buildPrompt(l, t) },
  ];
  // `fallbacks` n'est pas encore dans les types du SDK 0.74 — le cast le
  // laisse passer dans le corps de requête, que l'API accepte avec le header
  // beta correspondant.
  const params = {
    model: MODELS.identify,
    max_tokens: 8000,
    output_config: { effort: "high" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    messages: [{ role: "user", content }],
  } as unknown as Anthropic.Beta.Messages.MessageCreateParamsNonStreaming;
  const resp = await client.beta.messages.create(params);
  if (resp.stop_reason === "refusal") {
    throw new Error("Analyse refusée par le modèle (après fallback).");
  }
  return extractJson<Identification>(
    textOf(resp.content as Anthropic.ContentBlock[]),
  );
}

// Dry-run : identification plausible sans appel réseau.
export function identifyMock(l: RawListing, t: TriageResult): Identification {
  return {
    summary: `Candidat ${t.family} à vérifier (mock dry-run) : ${l.title}`,
    designersOrEditors: ["Pierre Guariche (hypothèse mock)"],
    attributionLevel: "attribuee",
    confidence: 0.6,
    detailsToVerify: ["marquage éditeur sous l'assise", "visserie d'époque"],
    questionsForSeller: ["Photo du dessous ?", "Étiquette ou tampon visible ?"],
    compsQuery: `${t.family} design 1950 vintage`,
  };
}
