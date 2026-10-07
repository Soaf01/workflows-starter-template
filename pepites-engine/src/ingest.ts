import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env, SOURCES, type SourceConfig } from "./config.js";
import type { RawListing } from "./types.js";

// --- Adaptateur Apify -------------------------------------------------------
// L'acteur exact (et la forme de son output) se choisit sur apify.com ;
// APIFY_ACTOR_<SOURCE> = identifiant de l'acteur (ex. "silentflow~leboncoin-scraper").
// Le mapping ci-dessous couvre les champs usuels des acteurs Leboncoin et doit
// être ajusté une fois l'acteur choisi — voir README.

interface ApifyItem {
  id?: string | number;
  url?: string;
  title?: string;
  subject?: string;
  description?: string;
  body?: string;
  price?: number | string;
  location?: { city?: string } | string;
  images?: string[];
  imageUrls?: string[];
  shippable?: boolean;
}

function actorEnvName(sourceId: string): string {
  return `APIFY_ACTOR_${sourceId.toUpperCase().replace(/-/g, "_")}`;
}

// Si un fichier apify-input.json existe à la racine du moteur, son contenu
// remplace l'input par défaut envoyé à l'acteur — copier/coller l'exemple
// d'input depuis l'onglet « Input » de l'acteur sur Apify, aucun code à changer.
function apifyInputFor(src: SourceConfig): Record<string, unknown> {
  try {
    const raw = fs.readFileSync("apify-input.json", "utf-8");
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return { queries: src.keywords, maxItems: 500 };
  }
}

export async function fetchApifyRaw(src: SourceConfig, maxItems?: number): Promise<ApifyItem[]> {
  const token = env("APIFY_TOKEN");
  const actor = env(actorEnvName(src.id));
  if (!token || !actor) {
    console.warn(
      `[ingest] ${src.id} : APIFY_TOKEN ou ${actorEnvName(src.id)} absent — source ignorée.`,
    );
    return [];
  }
  const input = apifyInputFor(src);
  if (maxItems !== undefined) input.maxItems = maxItems;
  const url = `https://api.apify.com/v2/acts/${encodeURIComponent(actor)}/run-sync-get-dataset-items?token=${token}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`[ingest] Apify ${src.id} : HTTP ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as ApifyItem[];
}

async function fetchFromApify(src: SourceConfig): Promise<RawListing[]> {
  const items = await fetchApifyRaw(src);
  return items
    .map((it) => mapApifyItem(it, src))
    .filter((l): l is RawListing => l !== null);
}

// `npm run probe` : appelle l'acteur avec 5 items max et montre le brut et
// le mappé — c'est le test de compatibilité avant le premier vrai run.
export async function probeApify(): Promise<void> {
  const src = SOURCES[0];
  const items = await fetchApifyRaw(src, 5);
  console.log(`[probe] ${items.length} item(s) brut(s) reçus de l'acteur.`);
  if (items.length > 0) {
    console.log("[probe] Premier item brut :");
    console.log(JSON.stringify(items[0], null, 2).slice(0, 3000));
  }
  const mapped = items
    .map((it) => mapApifyItem(it, src))
    .filter((l): l is RawListing => l !== null);
  console.log(`[probe] ${mapped.length}/${items.length} mappé(s) avec succès.`);
  if (mapped.length > 0) {
    console.log("[probe] Premier item mappé :");
    console.log(JSON.stringify(mapped[0], null, 2));
  } else if (items.length > 0) {
    console.log(
      "[probe] ⚠️ Rien de mappé — envoie-moi le premier item brut ci-dessus pour que j'ajuste le mapping.",
    );
  }
}

function mapApifyItem(it: ApifyItem, src: SourceConfig): RawListing | null {
  const title = it.title ?? it.subject ?? "";
  const urlStr = it.url ?? "";
  if (!title || !urlStr) return null;
  const price =
    typeof it.price === "string" ? Number.parseFloat(it.price) : (it.price ?? Number.NaN);
  if (!Number.isFinite(price)) return null;
  const images = it.images ?? it.imageUrls ?? [];
  const location =
    typeof it.location === "string" ? it.location : (it.location?.city ?? "");
  return {
    id: `${src.id}:${String(it.id ?? urlStr)}`,
    source: src.id,
    country: src.country,
    url: urlStr,
    title,
    description: it.description ?? it.body ?? "",
    priceEur: price,
    location,
    imageUrls: images,
    shippable: it.shippable,
  };
}

// --- Adaptateur fixtures (dry-run et tests) ---------------------------------

function loadFixtures(src: SourceConfig): RawListing[] {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const file = path.resolve(here, "..", "fixtures", "sample-listings.json");
  const all = JSON.parse(fs.readFileSync(file, "utf-8")) as RawListing[];
  return all.map((l) => ({ ...l, source: src.id, country: src.country }));
}

// --- Entrée unique ----------------------------------------------------------

export async function ingest(src: SourceConfig, dryRun: boolean): Promise<RawListing[]> {
  const listings =
    dryRun || src.adapter === "fixtures" ? loadFixtures(src) : await fetchFromApify(src);
  if (src.requireShippable) return listings.filter((l) => l.shippable === true);
  return listings;
}
