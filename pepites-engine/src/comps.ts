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
  soldPrice?: number;
  price?: number;
  currency?: string;
  soldDate?: string;
  url?: string;
}

export async function searchComps(query: string): Promise<Comp[]> {
  const key = env("SOLDCOMPS_KEY");
  const base = env("SOLDCOMPS_URL");
  if (!key || !base) {
    console.warn("[comps] SOLDCOMPS_KEY/SOLDCOMPS_URL absents — pas de comps automatiques.");
    return [];
  }
  const url = `${base}?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { authorization: `Bearer ${key}` } });
  if (!res.ok) {
    console.warn(`[comps] HTTP ${res.status} — comps ignorés pour cette requête.`);
    return [];
  }
  const data = (await res.json()) as { items?: SoldCompsItem[] } | SoldCompsItem[];
  const items = Array.isArray(data) ? data : (data.items ?? []);
  return items
    .map((it): Comp | null => {
      const p = it.soldPrice ?? it.price;
      if (!it.title || typeof p !== "number") return null;
      return { title: it.title, soldPriceEur: p, soldAt: it.soldDate, url: it.url };
    })
    .filter((c): c is Comp => c !== null);
}

export function compsMock(): Comp[] {
  return [
    { title: "Comp mock A", soldPriceEur: 900 },
    { title: "Comp mock B", soldPriceEur: 1200 },
    { title: "Comp mock C", soldPriceEur: 1050 },
  ];
}
