import { env } from "./config.js";
import type { ScoredCandidate, ResaleDraft } from "./types.js";

function api(method: string): string | null {
  const token = env("TELEGRAM_BOT_TOKEN");
  if (!token) return null;
  return `https://api.telegram.org/bot${token}/${method}`;
}

async function call(method: string, payload: Record<string, unknown>): Promise<unknown> {
  const url = api(method);
  const chatId = env("TELEGRAM_CHAT_ID");
  if (!url || !chatId) {
    console.log(`[telegram:absent] ${method} →\n${JSON.stringify(payload, null, 2)}`);
    return null;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, ...payload }),
  });
  if (!res.ok) {
    console.warn(`[telegram] ${method} HTTP ${res.status} : ${await res.text()}`);
    return null;
  }
  return res.json();
}

export function candidateCaption(s: ScoredCandidate): string {
  const i = s.identification;
  const comps =
    s.comps.length > 0
      ? `Comps (médiane) : ${s.medianCompEur} € sur ${s.comps.length} ventes`
      : "⚠️ Pas de comps automatiques — vérifier la cote à la main";
  return [
    `🔍 ${i.designersOrEditors.join(" / ")} — confiance ${(i.confidence * 100).toFixed(0)} % (${i.attributionLevel})`,
    i.summary,
    `Prix demandé : ${s.listing.priceEur} € · ${comps}`,
    `Gain net estimé : ${s.estimatedNetGainEur} €`,
    `À vérifier : ${i.detailsToVerify.join(" · ")}`,
    `À demander : ${i.questionsForSeller.join(" · ")}`,
    s.listing.url,
  ].join("\n");
}

export async function sendCandidate(s: ScoredCandidate): Promise<void> {
  await call("sendPhoto", {
    photo: s.listing.imageUrls[0],
    caption: candidateCaption(s).slice(0, 1024),
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Acheté", callback_data: `d:${s.listing.id}:achete` },
          { text: "👀 Vu-rejeté", callback_data: `d:${s.listing.id}:rejete` },
          { text: "❌ Faux positif", callback_data: `d:${s.listing.id}:faux` },
        ],
      ],
    },
  });
}

export async function sendText(text: string): Promise<void> {
  await call("sendMessage", { text: text.slice(0, 4096) });
}

export async function sendResaleDraft(d: ResaleDraft): Promise<void> {
  await sendText(
    [
      `📦 Brouillon de revente — ${d.platform} — ${d.priceEur} €`,
      "",
      `Titre : ${d.title}`,
      "",
      d.description,
    ].join("\n"),
  );
}

export interface TelegramUpdate {
  update_id: number;
  callback_query?: { id: string; data?: string };
}

export async function getUpdates(offset: number): Promise<TelegramUpdate[]> {
  const url = api("getUpdates");
  if (!url) {
    console.log("[telegram:absent] getUpdates ignoré.");
    return [];
  }
  const res = await fetch(`${url}?offset=${offset}&timeout=0`);
  if (!res.ok) return [];
  const data = (await res.json()) as { ok: boolean; result?: TelegramUpdate[] };
  return data.result ?? [];
}

export async function answerCallback(id: string, text: string): Promise<void> {
  await call("answerCallbackQuery", { callback_query_id: id, text });
}
