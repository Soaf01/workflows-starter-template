import fs from "node:fs";
import path from "node:path";
import type { Decision, ScoredCandidate } from "./types.js";

export interface State {
  seen: string[];
  counters: { date: string; visionA: number; visionB: number };
  decisions: Record<string, { decision: Decision; at: string }>;
  // Candidats alertés en attente de décision — nécessaires pour générer
  // l'annonce de revente au clic "Acheté".
  pending: Record<string, ScoredCandidate>;
  telegramOffset: number;
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const STATE_FILE = path.join(DATA_DIR, "state.json");
const SEEN_CAP = 50_000;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadState(): State {
  try {
    const raw = fs.readFileSync(STATE_FILE, "utf-8");
    const s = JSON.parse(raw) as State;
    if (s.counters.date !== today()) {
      s.counters = { date: today(), visionA: 0, visionB: 0 };
    }
    return s;
  } catch {
    return {
      seen: [],
      counters: { date: today(), visionA: 0, visionB: 0 },
      decisions: {},
      pending: {},
      telegramOffset: 0,
    };
  }
}

export function saveState(s: State): void {
  if (s.seen.length > SEEN_CAP) s.seen = s.seen.slice(-SEEN_CAP);
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2));
}

export function markSeen(s: State, id: string): void {
  if (!s.seen.includes(id)) s.seen.push(id);
}
