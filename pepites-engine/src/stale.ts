// Balayage de fraîcheur : vérifie que les annonces encore en attente dans
// Pépites Manager existent toujours sur le site source. Une annonce partie
// (vendue/retirée) est retirée de la file avec le statut « expiree ».
// DataDome peut masquer la page à un simple fetch : dans ce cas le statut
// est « unknown » et un TTL de 7 jours fait foi.

const GONE_MARKERS = [
  "n'est plus disponible",
  "annonce supprimée",
  "annonce désactivée",
  "cette annonce est désactivée",
];

const BLOCK_MARKERS = ["datadome", "captcha"];

export type Liveness = "live" | "gone" | "unknown";

export async function checkListingAlive(url: string): Promise<Liveness> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
        "accept-language": "fr-FR,fr;q=0.9",
      },
    });
    clearTimeout(timer);
    if (res.status === 404 || res.status === 410) return "gone";
    if (!res.ok) return "unknown";
    const text = (await res.text()).toLowerCase();
    for (const m of GONE_MARKERS) if (text.includes(m)) return "gone";
    for (const m of BLOCK_MARKERS) if (text.includes(m)) return "unknown";
    return "live";
  } catch {
    return "unknown";
  }
}

export const STALE_TTL_MS = 7 * 24 * 3600 * 1000; // expiration par défaut
export const RECHECK_GAP_MS = 6 * 3600 * 1000; // au plus une vérif / 6 h / annonce
export const MAX_CHECKS_PER_SWEEP = 12;
