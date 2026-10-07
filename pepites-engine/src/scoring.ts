import { COSTS, THRESHOLDS } from "./config.js";
import type {
  Comp,
  Identification,
  RawListing,
  ScoredCandidate,
  SizeClass,
  TriageResult,
} from "./types.js";

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function sizeClassOf(family: string): SizeClass {
  if (family === "objet" || family === "luminaire") return "petit";
  if (family === "rangement") return "gros";
  return "moyen";
}

export function score(
  listing: RawListing,
  triage: TriageResult,
  identification: Identification,
  comps: Comp[],
): ScoredCandidate {
  const med = median(comps.map((c) => c.soldPriceEur));
  const sizeClass = sizeClassOf(triage.family);
  const transport = COSTS.transportEurBySize[sizeClass];
  const commission = med * COSTS.marketplaceCommission;
  const netGain = med > 0 ? med - listing.priceEur - transport - commission : 0;
  return {
    listing,
    triage,
    identification,
    comps,
    medianCompEur: med,
    sizeClass,
    estimatedNetGainEur: Math.round(netGain),
    score: Math.round(netGain * identification.confidence),
  };
}

export function passesAlertThreshold(s: ScoredCandidate): boolean {
  // « style » = « dans le style de » : par définition pas une pièce attribuable,
  // donc jamais d'alerte, quelle que soit la confiance du modèle.
  if (s.identification.attributionLevel === "style") return false;
  if (s.identification.designersOrEditors.length === 0) return false;
  if (s.identification.confidence < THRESHOLDS.minIdentConfidence) return false;
  // Sans comps, on alerte quand même si l'identification est forte : la
  // fourchette se vérifie à la main plutôt que de rater une vraie pièce.
  if (s.comps.length === 0) return s.identification.confidence >= 0.7;
  return s.estimatedNetGainEur >= THRESHOLDS.minNetGainEur;
}
