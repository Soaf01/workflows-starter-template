import { env } from "./config.js";
import type { ResaleDraft, ScoredCandidate } from "./types.js";

// Discord notification channel (webhook — no bot, no gateway, 5-minute setup).
// Notifications only: the decision buttons live in Pépites Manager; each
// message links there. Active as soon as DISCORD_WEBHOOK_URL is set.

const EMBED_COLOR = 0xd4a24e; // house accent

function webhookUrl(): string | undefined {
  return env("DISCORD_WEBHOOK_URL");
}

function appUrl(): string | undefined {
  return env("PEPITES_API_URL");
}

async function post(payload: Record<string, unknown>): Promise<void> {
  const url = webhookUrl();
  if (!url) {
    console.log("[discord:absent] notification ignorée (DISCORD_WEBHOOK_URL manquant).");
    return;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.warn(`[discord] HTTP ${res.status} : ${await res.text()}`);
    }
  } catch (e) {
    console.warn(`[discord] envoi impossible : ${(e as Error).message}`);
  }
}

export async function sendCandidateToDiscord(s: ScoredCandidate): Promise<void> {
  const i = s.identification;
  const comps =
    s.comps.length > 0
      ? `${s.medianCompEur} € (median of ${s.comps.length} sales)`
      : "none — check manually";
  const decideLine = appUrl()
    ? `\n\n➡️ **Decide in [Pépites Manager](${appUrl()})**`
    : "";
  await post({
    embeds: [
      {
        title: s.listing.title.slice(0, 256),
        url: s.listing.url,
        color: EMBED_COLOR,
        description: `${i.summary}${decideLine}`.slice(0, 4096),
        image: s.listing.imageUrls[0] ? { url: s.listing.imageUrls[0] } : undefined,
        fields: [
          {
            name: "Attribution",
            value: `${i.designersOrEditors.join(" / ")} — ${i.attributionLevel} (${Math.round(i.confidence * 100)} %)`,
            inline: false,
          },
          { name: "Asking price", value: `${s.listing.priceEur} €`, inline: true },
          { name: "Sold comps", value: comps, inline: true },
          { name: "Est. net gain", value: `${s.estimatedNetGainEur} €`, inline: true },
          { name: "Verify before buying", value: i.detailsToVerify.join(" · ").slice(0, 1024), inline: false },
        ],
        footer: { text: `${s.listing.location} · ${s.listing.source}` },
      },
    ],
  });
}

export async function sendDraftToDiscord(d: ResaleDraft): Promise<void> {
  await post({
    embeds: [
      {
        title: `📦 Resale draft ready — ${d.platform} — ${d.priceEur} €`,
        color: EMBED_COLOR,
        description: `**${d.title}**\n\n${d.description}`.slice(0, 4096),
      },
    ],
  });
}
