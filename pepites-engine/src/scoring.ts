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
  // Sans comps réels, repli sur la fourchette de cote du modèle, décotée de
  // 15 % par prudence — toujours une valeur plutôt qu'un « gain 0 € » muet.
  const modelMid =
    ((identification.marketLowEur ?? 0) + (identification.marketHighEur ?? 0)) / 2;
  const effectiveValue = med > 0 ? med : Math.round(modelMid * 0.85);
  const sizeClass = sizeClassOf(triage.family);
  const transport = COSTS.transportEurBySize[sizeClass];
  const commission = effectiveValue * COSTS.marketplaceCommission;
  const netGain =
    effectiveValue > 0 ? effectiveValue - listing.priceEur - transport - commission : 0;
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
  if ((s.identification.scamRisk ?? 0) >= 0.6) return false;
  if (s.identification.attributionLevel === "style") return false;
  if (s.identification.designersOrEditors.length === 0) return false;
  if (s.identification.confidence < THRESHOLDS.minIdentConfidence) return false;
  // Sans comps NI cote modèle, on alerte quand même si l'identification est
  // forte ; sinon le gain (comps réels ou cote modèle décotée) fait foi.
  if (s.comps.length === 0 && s.estimatedNetGainEur === 0) {
    return s.identification.confidence >= 0.7;
  }
  return s.estimatedNetGainEur >= THRESHOLDS.minNetGainEur;
}
