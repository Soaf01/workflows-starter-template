export interface RawListing {
  id: string;
  source: string; // id de la source (ex. "leboncoin-fr")
  country: string; // "FR", "BE", ...
  url: string;
  title: string;
  description: string;
  priceEur: number;
  location: string;
  imageUrls: string[];
  postedAt?: string;
  shippable?: boolean;
  category?: string;
}

export interface TriageResult {
  candidate: boolean;
  family: string; // "assise", "luminaire", "rangement", "table", "objet", "autre"
  confidence: number; // 0..1
}

// Libellé d'attribution autorisé dans une annonce de revente, selon la preuve.
export type AttributionLevel = "prouvee" | "attribuee" | "style";

export interface Identification {
  summary: string;
  designersOrEditors: string[];
  attributionLevel: AttributionLevel;
  confidence: number; // 0..1
  detailsToVerify: string[];
  questionsForSeller: string[];
  compsQuery: string; // requête de recherche de prix réalisés
  scamRisk?: number; // 0..1 — probabilité que l'annonce soit frauduleuse
  scamFlags?: string[]; // signaux visuels + heuristiques
}

export interface Comp {
  title: string;
  soldPriceEur: number;
  soldAt?: string;
  url?: string;
}

export type SizeClass = "petit" | "moyen" | "gros";

export interface ScoredCandidate {
  listing: RawListing;
  triage: TriageResult;
  identification: Identification;
  comps: Comp[];
  medianCompEur: number;
  sizeClass: SizeClass;
  estimatedNetGainEur: number;
  score: number;
}

export interface ResaleDraft {
  platform: string;
  title: string;
  description: string;
  priceEur: number;
}

export type Decision = "achete" | "rejete" | "faux";
