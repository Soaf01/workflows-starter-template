import Anthropic from "@anthropic-ai/sdk";
import { MODELS } from "./config.js";

let client: Anthropic | null = null;

export function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

export function isAuthError(e: unknown): boolean {
  return e instanceof Anthropic.AuthenticationError;
}

// Vérifie la clé AVANT de payer quoi que ce soit (count_tokens est gratuit).
export async function preflightAuth(): Promise<void> {
  try {
    await getClient().messages.countTokens({
      model: MODELS.triage,
      messages: [{ role: "user", content: "ping" }],
    });
  } catch (e) {
    if (isAuthError(e)) {
      const k = process.env.ANTHROPIC_API_KEY;
      const used = k ? `${k.slice(0, 14)}… (${k.length} caractères)` : "AUCUNE (ni .env ni shell)";
      throw new Error(
        `Clé Anthropic refusée (401). Clé effectivement utilisée : ${used}. ` +
          "Vérifie la ligne ANTHROPIC_API_KEY du .env : clé complète (sk-ant-api…), sans guillemets ni espace, " +
          "PAS une clé Admin (sk-ant-admin…), et que le fichier est bien en texte brut.",
      );
    }
    throw e;
  }
}

// Les modèles répondent en JSON mais parfois entouré de texte : extraction tolérante.
export function extractJson<T>(text: string): T {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Pas de JSON dans la réponse : ${text.slice(0, 200)}`);
  }
  return JSON.parse(text.slice(start, end + 1)) as T;
}

export function textOf(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}
