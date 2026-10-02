import { env } from "./config.js";
import type { ResaleDraft, ScoredCandidate } from "./types.js";

// Canal « webapp » : Pépites Manager (pepites-app). Coexiste avec Telegram ;
// actif dès que PEPITES_API_URL + ENGINE_TOKEN sont posés.

export interface WebappItem {
  id: string;
  status: "pending" | "achete" | "rejete" | "faux";
  decidedAt: string | null;
  draft: ResaleDraft | null;
  candidate: ScoredCandidate;
}

function base(): { url: string; token: string } | null {
  const url = env("PEPITES_API_URL");
  const token = env("ENGINE_TOKEN");
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

async function call<T>(path: string, init?: RequestInit): Promise<T | null> {
  const b = base();
  if (!b) {
    console.log(`[webapp:absent] ${path} ignoré (PEPITES_API_URL/ENGINE_TOKEN manquants).`);
    return null;
  }
  const res = await fetch(`${b.url}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${b.token}`,
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    console.warn(`[webapp] ${path} HTTP ${res.status} : ${await res.text()}`);
    return null;
  }
  return (await res.json()) as T;
}

export async function postCandidate(s: ScoredCandidate): Promise<void> {
  await call("/api/candidates", { method: "POST", body: JSON.stringify(s) });
}

export async function fetchUnprocessedDecisions(): Promise<WebappItem[]> {
  const data = await call<{ items: WebappItem[] }>("/api/decisions");
  return data?.items ?? [];
}

export async function postDraft(id: string, draft: ResaleDraft): Promise<void> {
  await call("/api/draft", { method: "POST", body: JSON.stringify({ id, draft }) });
}

export async function ackDecisions(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await call("/api/decisions/ack", { method: "POST", body: JSON.stringify({ ids }) });
}

export function webappConfigured(): boolean {
  return base() !== null;
}
