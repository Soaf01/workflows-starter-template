export interface SourceConfig {
  id: string;
  country: string;
  language: string;
  adapter: "apify" | "fixtures";
  // Mots-clés génériques de la langue — jamais de nom de designer :
  // une annonce qui nomme le designer est déjà au prix.
  keywords: string[];
  // À l'étranger, ne garder que l'expédiable (contrainte logistique, cf. spec).
  requireShippable: boolean;
}

export const SOURCES: SourceConfig[] = [
  {
    id: "leboncoin-fr",
    country: "FR",
    language: "fr",
    adapter: "apify",
    keywords: [
      "fauteuil vintage",
      "chaise ancienne",
      "lampadaire",
      "lampe ancienne",
      "enfilade",
      "bureau vintage",
      "étagère métal",
      "table basse vintage",
      "meuble ancien",
    ],
    requireShippable: false,
  },
  // Extension multi-pays : dupliquer une entrée, traduire les mots-clés,
  // mettre requireShippable: true. L'adaptateur Apify prend l'URL de
  // l'acteur dans APIFY_ACTOR_<ID en majuscules, tirets → underscores>.
];

export const THRESHOLDS = {
  // Pré-filtre
  maxAskPriceEur: 800, // au-delà, le vendeur sait ce qu'il vend
  // Vision
  triageMinConfidence: 0.3, // laxiste exprès : rappel > précision
  // Alerte
  minNetGainEur: 300,
  minIdentConfidence: 0.5,
  maxAlertsPerRun: 3,
};

// Plafonds durs d'appels/jour — protège contre la dérive de coût.
export const CAPS = {
  visionAPerDay: 300,
  visionBPerDay: 15,
};

export const COSTS = {
  consignmentCommission: 0.3, // salle des ventes
  marketplaceCommission: 0.15, // Pamono / Selency / eBay ordre de grandeur
  transportEurBySize: { petit: 15, moyen: 60, gros: 150 } as Record<string, number>,
};

export const MODELS = {
  triage: "claude-haiku-4-5",
  identify: "claude-opus-5-5",
  resale: "claude-opus-5-5",
};

export function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.length > 0 ? v : undefined;
}

export function requireEnv(name: string): string {
  const v = env(name);
  if (!v) throw new Error(`Variable d'environnement manquante : ${name}`);
  return v;
}
