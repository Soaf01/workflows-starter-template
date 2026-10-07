import { THRESHOLDS } from "./config.js";
import type { State } from "./store.js";
import type { RawListing } from "./types.js";

// Noms à forte cote : si l'annonce les cite, le vendeur sait — on écarte.
const KNOWN_DESIGNER_WORDS = [
  "prouvé",
  "prouve",
  "perriand",
  "jeanneret",
  "royère",
  "royere",
  "matégot",
  "mategot",
  "mouille",
  "eames",
  "jacobsen",
  "wegner",
  "juhl",
  "aalto",
  "ponti",
  "parisi",
  "borsani",
  "paulin",
  "guariche",
  "knoll",
  "cassina",
  "vitra",
  "thonet",
];

const JUNK_WORDS = [
  "ikea",
  "conforama",
  "but ",
  "maisons du monde",
  "la redoute",
  "neuf sous emballage",
  "style scandinave neuf",
  "reproduction",
  "replica",
  "copie conforme",
];

export interface PrefilterResult {
  pass: boolean;
  reason: string;
}

// Catégories Leboncoin dans le périmètre — tout le reste (locations, autos,
// emploi…) est écarté AVANT la vision, pour ne jamais brûler d'appel dessus.
const CATEGORY_ALLOW = [
  "ameublement",
  "décoration",
  "luminaire",
  "antiquité",
  "art",
  "collection",
];

export function prefilter(l: RawListing, state: State): PrefilterResult {
  if (state.seen.includes(l.id)) return { pass: false, reason: "déjà vu" };
  if (l.category) {
    const c = l.category.toLowerCase();
    if (!CATEGORY_ALLOW.some((a) => c.includes(a))) {
      return { pass: false, reason: `catégorie hors périmètre (${l.category})` };
    }
  }
  if (l.priceEur > THRESHOLDS.maxAskPriceEur)
    return { pass: false, reason: `prix > ${THRESHOLDS.maxAskPriceEur} €` };
  if (l.imageUrls.length === 0) return { pass: false, reason: "sans photo" };

  const text = `${l.title} ${l.description}`.toLowerCase();
  for (const w of KNOWN_DESIGNER_WORDS) {
    if (text.includes(w)) return { pass: false, reason: `designer cité (${w})` };
  }
  for (const w of JUNK_WORDS) {
    if (text.includes(w)) return { pass: false, reason: `mot-clé exclu (${w.trim()})` };
  }
  return { pass: true, reason: "ok" };
}
