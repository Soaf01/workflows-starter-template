import { env } from "./config.js";
import type { Comp } from "./types.js";

// Fournisseur de prix réalisés (comps). v1 : SoldComps (eBay vendus) si
// configuré, sinon vide — le scoring marque alors le candidat « comps
// manquants » et l'alerte le signale au lieu d'inventer une fourchette.
//
// NOTE : la forme exacte de l'API SoldComps (chemin, paramètres, champs) est
// à vérifier dans leur documentation à l'inscription — le code ci-dessous
// lit le chemin dans SOLDCOMPS_URL pour ne rien figer de non vérifié.

// Champs réels vérifiés sur un item live le 07/10/2026 : soldPrice (string),
// soldCurrency ("USD"), endedAt ("2026-09-28"), url, title, bestOfferAccepted.
interface SoldCompsItem {
  title?: string;
  itemTitle?: string;
  name?: string;
  soldPrice?: number | string;
  price?: number | string;
  currency?: string;
  soldCurrency?: string;
  soldDate?: string;
  dateSold?: string;
  endedAt?: string;
  url?: string;
  itemUrl?: string;
  link?: string;
  bestOfferAccepted?: boolean;
}

// Conversion vers EUR — taux approximatifs, ajustables dans .env
// (FX_USD_EUR, FX_GBP_EUR). L'API renvoie de l'eBay US, donc des USD.
function fxToEur(currency: string | undefined): number {
  const c = (currency ?? "EUR").toUpperCase();
  if (c === "EUR") return 1;
  const envRate = (name: string, fallback: number): number => {
    const r = Number.parseFloat(env(name) ?? "");
    return Number.isFinite(r) && r > 0 ? r : fallback;
  };
  if (c === "USD") return envRate("FX_USD_EUR", 0.9);
  if (c === "GBP") return envRate("FX_GBP_EUR", 1.15);
  return 1;
}

// Forme réelle vérifiée (07/10/2026) : GET api.sold-comps.com/v1/scrape
// ?keyword=… , Bearer auth, réponse {keyword, page, totalItems, items:[…]}.
// L'URL du .env est normalisée : tout query-string collé depuis les docs
// (ex. ?keyword=iphone+15+pro) est retiré avant usage.
function compsUrl(query: string): string | null {
  const base = env("SOLDCOMPS_URL");
  if (!base) return null;
  const stripped = base.split("?")[0].replace(/\/$/, "");
  return `${stripped}?keyword=${encodeURIComponent(query)}`;
}

function toPrice(p: number | string | undefined): number | null {
  if (typeof p === "number") return p;
  if (typeof p === "string") {
    const n = Number.parseFloat(p.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

// Rythme : l'API limite les rafales (429 constaté à 24 requêtes d'affilée).
// Espacement minimal + un retry après pause + cache par requête sur le run.
const MIN_GAP_MS = 4000;
let lastCallAt = 0;
const runCache = new Map<string, Comp[]>();

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function searchComps(query: string): Promise<Comp[]> {
  const key = env("SOLDCOMPS_KEY");
  const url = compsUrl(query);
  if (!key || !url) {
    console.warn("[comps] SOLDCOMPS_KEY/SOLDCOMPS_URL absents — pas de comps automatiques.");
    return [];
  }
  const cached = runCache.get(query);
  if (cached) return cached;

  const wait = lastCallAt + MIN_GAP_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastCallAt = Date.now();

  let res = await fetch(url, { headers: { authorization: `Bearer ${key}` } });
  if (res.status === 429) {
    console.warn("[comps] HTTP 429 — pause 15 s puis nouvel essai.");
    await sleep(15_000);
    lastCallAt = Date.now();
    res = await fetch(url, { headers: { authorization: `Bearer ${key}` } });
  }
  if (!res.ok) {
    console.warn(`[comps] HTTP ${res.status} — comps ignorés pour cette requête.`);
    return [];
  }
  const data = (await res.json()) as { items?: SoldCompsItem[] } | SoldCompsItem[];
  const items = Array.isArray(data) ? data : (data.items ?? []);
  const comps = items
    .map((it): Comp | null => {
      const title = it.title ?? it.itemTitle ?? it.name;
      const price = toPrice(it.soldPrice ?? it.price);
      if (!title || price === null) return null;
      // bestOfferAccepted : eBay affiche le prix demandé, pas l'offre acceptée
      // (inconnue) — le comp est donc un plafond ; la médiane amortit le biais.
      return {
        title,
        soldPriceEur: Math.round(price * fxToEur(it.soldCurrency ?? it.currency)),
        soldAt: it.soldDate ?? it.dateSold ?? it.endedAt,
        url: it.url ?? it.itemUrl ?? it.link,
      };
    })
    .filter((c): c is Comp => c !== null);
  runCache.set(query, comps);
  return comps;
}

// `npm run comps -- "ta requête"` : appelle l'API avec tes identifiants et
// montre le statut HTTP, le début du corps brut, puis ce que le mapping en
// tire — l'outil de diagnostic pour aligner l'intégration sur la vraie API.
export async function debugComps(query: string): Promise<void> {
  const key = env("SOLDCOMPS_KEY");
  const url = compsUrl(query);
  if (!key || !url) {
    console.log("[comps] SOLDCOMPS_URL / SOLDCOMPS_KEY absents du .env.");
    return;
  }
  console.log(`[comps] GET ${url}`);
  try {
    const res = await fetch(url, { headers: { authorization: `Bearer ${key}` } });
    const body = await res.text();
    console.log(`[comps] HTTP ${res.status}`);
    console.log(`[comps] Corps brut (1500 premiers caractères) :\n${body.slice(0, 1500)}`);
    const parsed = await searchComps(query);
    console.log(`[comps] Mapping actuel : ${parsed.length} comp(s) extraits.`);
    if (parsed.length > 0) console.log(JSON.stringify(parsed.slice(0, 3), null, 2));
  } catch (e) {
    console.log(`[comps] Échec réseau : ${(e as Error).message}`);
  }
}

export function compsMock(): Comp[] {
  return [
    { title: "Comp mock A", soldPriceEur: 900 },
    { title: "Comp mock B", soldPriceEur: 1200 },
    { title: "Comp mock C", soldPriceEur: 1050 },
  ];
}
