import { env } from "./config.js";
import type { Comp } from "./types.js";

// Fournisseur de prix réalisés (comps). v1 : SoldComps (eBay vendus) si
// configuré, sinon vide — le scoring marque alors le candidat « comps
// manquants » et l'alerte le signale au lieu d'inventer une fourchette.
//
// NOTE : la forme exacte de l'API SoldComps (chemin, paramètres, champs) est
// à vérifier dans leur documentation à l'inscription — le code ci-dessous
// lit le chemin dans SOLDCOMPS_URL pour ne rien figer de non vérifié.

interface SoldCompsItem {
  title?: string;
  itemTitle?: string;
  name?: string;
  soldPrice?: number | string;
  price?: number | string;
  currency?: string;
  soldDate?: string;
  dateSold?: string;
  url?: string;
  itemUrl?: string;
  link?: string;
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

export async function searchComps(query: string): Promise<Comp[]> {
  const key = env("SOLDCOMPS_KEY");
  const url = compsUrl(query);
  if (!key || !url) {
    console.warn("[comps] SOLDCOMPS_KEY/SOLDCOMPS_URL absents — pas de comps automatiques.");
    return [];
  }
  const res = await fetch(url, { headers: { authorization: `Bearer ${key}` } });
  if (!res.ok) {
    console.warn(`[comps] HTTP ${res.status} — comps ignorés pour cette requête.`);
    return [];
  }
  const data = (await res.json()) as { items?: SoldCompsItem[] } | SoldCompsItem[];
  const items = Array.isArray(data) ? data : (data.items ?? []);
  return items
    .map((it): Comp | null => {
      const title = it.title ?? it.itemTitle ?? it.name;
      const price = toPrice(it.soldPrice ?? it.price);
      if (!title || price === null) return null;
      return {
        title,
        soldPriceEur: price,
        soldAt: it.soldDate ?? it.dateSold,
        url: it.url ?? it.itemUrl ?? it.link,
      };
    })
    .filter((c): c is Comp => c !== null);
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
