import fs from "node:fs";

// Charge ./.env (KEY=VALUE, une par ligne) sans dépendance — les variables
// déjà présentes dans l'environnement gardent la priorité.
(function loadDotEnv(): void {
  let raw: string;
  try {
    raw = fs.readFileSync(".env", "utf-8");
  } catch {
    return; /* pas de .env : variables d'environnement classiques */
  }
  if (raw.startsWith("{\\rtf")) {
    console.warn(
      "[env] ⚠️ .env a été sauvé au format RTF (TextEdit) — il est illisible. " +
        "Dans TextEdit : Format → Convertir au format Texte, puis réenregistrer.",
    );
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, "");
    if (value === "") continue;
    // Le .env du projet GAGNE sur une variable shell héritée : sur une machine
    // qui a d'autres projets Anthropic, une vieille clé exportée dans ~/.zshrc
    // écraserait silencieusement celle-ci (cause classique de 401).
    if (process.env[m[1]] !== undefined && process.env[m[1]] !== value) {
      console.warn(`[env] ${m[1]} du shell remplacé par la valeur du .env du projet.`);
    }
    process.env[m[1]] = value;
  }
  const key = process.env.ANTHROPIC_API_KEY;
  if (key && !key.startsWith("sk-ant-")) {
    console.warn(
      `[env] ⚠️ ANTHROPIC_API_KEY ne ressemble pas à une clé (commence par « ${key.slice(0, 6)}… ») — caractères invisibles ou copie partielle ?`,
    );
  }
})();

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
    // Vocabulaire « adjacent à la valeur » : les mots qu'emploie un vendeur
    // qui ne sait pas ce qu'il a, mais qui décrivent des pièces cotées —
    // jamais de nom de designer (annonce déjà au prix).
    keywords: [
      "fauteuil années 50",
      "fauteuil années 60",
      "fauteuil scandinave vintage",
      "chaise bois courbé",
      "lampadaire tripode",
      "lampe d'atelier",
      "applique potence",
      "lampadaire laiton vintage",
      "enfilade scandinave",
      "enfilade teck",
      "bureau années 50",
      "étagère tôle perforée",
      "meuble de métier",
      "fauteuil rotin vintage",
      "table basse teck",
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
  triageMinConfidence: 0.4, // les créneaux chers vont aux candidats classés — barre un cran plus haute
  // Alerte
  minNetGainEur: 300,
  minIdentConfidence: 0.5,
  maxAlertsPerRun: 3,
};

// Plafonds durs d'appels/jour — protège contre la dérive de coût.
export const CAPS = {
  visionAPerDay: 300,
  visionBPerDay: 24, // ~1,5 €/jour au pire — les créneaux vont aux mieux classés
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

// Mode découverte : quand rien ne passe le seuil d'alerte, envoyer quand même
// le meilleur candidat identifié du passage, étiqueté « DÉCOUVERTE » — utile
// pendant la calibration pour voir des résultats réels. DISCOVERY_MODE=0 pour couper.
export function discoveryMode(): boolean {
  return env("DISCOVERY_MODE") !== "0";
}

export function requireEnv(name: string): string {
  const v = env(name);
  if (!v) throw new Error(`Variable d'environnement manquante : ${name}`);
  return v;
}
