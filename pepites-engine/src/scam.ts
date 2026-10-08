import type { RawListing } from "./types.js";

// Heuristiques anti-arnaque gratuites (texte + prix). Chaque signal est un
// drapeau lisible ; le risque combiné se calcule dans le pipeline avec
// l'analyse vision. Références : règles classiques des fraudes petites
// annonces (paiement hors plateforme, urgence, transporteur du vendeur,
// prix irréaliste, coordonnées dans l'annonce).

const PAYMENT_RED_WORDS = [
  "western union",
  "moneygram",
  "mandat cash",
  "transcash",
  "pcs",
  "coupon",
  "paypal amis",
  "paypal entre proches",
];

const URGENCY_RED_WORDS = [
  "urgent",
  "départ à l'étranger",
  "je suis à l'étranger",
  "mutation",
  "mon transporteur",
  "ma société de transport",
  "livraison uniquement",
];

const CONTACT_PATTERNS = [
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i, // email dans l'annonce
  /\bwhatsapp\b/i,
  /(?:\+33|0)[67](?:[\s.-]?\d{2}){4}/, // mobile FR
];

export function heuristicScamFlags(l: RawListing, medianCompEur: number): string[] {
  const flags: string[] = [];
  const text = `${l.title} ${l.description}`.toLowerCase();

  if (medianCompEur > 0 && l.priceEur > 0 && l.priceEur < medianCompEur * 0.12) {
    flags.push(`prix à ${Math.round((l.priceEur / medianCompEur) * 100)} % de la cote — trop beau`);
  }
  for (const w of PAYMENT_RED_WORDS) {
    if (text.includes(w)) {
      flags.push(`mode de paiement à risque mentionné (${w})`);
      break;
    }
  }
  for (const w of URGENCY_RED_WORDS) {
    if (text.includes(w)) {
      flags.push(`urgence / livraison imposée (« ${w} »)`);
      break;
    }
  }
  for (const p of CONTACT_PATTERNS) {
    if (p.test(text)) {
      flags.push("coordonnées de contact hors plateforme dans l'annonce");
      break;
    }
  }
  if (l.imageUrls.length === 1 && l.priceEur >= 200) {
    flags.push("une seule photo pour une pièce chère");
  }
  return flags;
}

export function combinedScamRisk(modelRisk: number | undefined, flags: string[]): number {
  const heuristic = Math.min(1, flags.length * 0.25);
  return Math.max(modelRisk ?? 0, heuristic);
}
