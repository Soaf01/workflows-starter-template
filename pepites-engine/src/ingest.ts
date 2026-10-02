import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env, type SourceConfig } from "./config.js";
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

async function fetchFromApify(src: SourceConfig): Promise<RawListing[]> {
  const token = env("APIFY_TOKEN");
  const actor = env(actorEnvName(src.id));
  if (!token || !actor) {
    console.warn(
      `[ingest] ${src.id} : APIFY_TOKEN ou ${actorEnvName(src.id)} absent — source ignorée.`,
    );
    return [];
  }
  const url = `https://api.apify.com/v2/acts/${encodeURIComponent(actor)}/run-sync-get-dataset-items?token=${token}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ queries: src.keywords, maxItems: 500 }),
  });
  if (!res.ok) {
    throw new Error(`[ingest] Apify ${src.id} : HTTP ${res.status} ${await res.text()}`);
  }
  const items = (await res.json()) as ApifyItem[];
  return items
    .map((it) => mapApifyItem(it, src))
    .filter((l): l is RawListing => l !== null);
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
