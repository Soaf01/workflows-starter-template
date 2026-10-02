// Pépites API — Worker Cloudflare (KV) servant aussi l'app single-file.
// Auth : moteur = Authorization: Bearer <ENGINE_TOKEN> ; app = x-app-key <APP_KEY>.
// Secrets Wrangler : ENGINE_TOKEN, APP_KEY. Binding KV : PEPITES_KV.

const IDX_KEY = "idx";
const IDX_CAP = 500;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function isEngine(request, env) {
  const h = request.headers.get("authorization") || "";
  return Boolean(env.ENGINE_TOKEN) && h === `Bearer ${env.ENGINE_TOKEN}`;
}

function isApp(request, env) {
  const k = request.headers.get("x-app-key") || "";
  return Boolean(env.APP_KEY) && k === env.APP_KEY;
}

async function getIndex(env) {
  try {
    const raw = await env.PEPITES_KV.get(IDX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function putIndex(env, idx) {
  await env.PEPITES_KV.put(IDX_KEY, JSON.stringify(idx.slice(0, IDX_CAP)));
}

async function getItem(env, id) {
  try {
    const raw = await env.PEPITES_KV.get(`cand:${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function putItem(env, item) {
  await env.PEPITES_KV.put(`cand:${item.id}`, JSON.stringify(item));
}

async function handleApi(request, env, path) {
  const method = request.method;

  if (path === "/api/health") return json({ ok: true });

  // --- Moteur → app : nouveau candidat --------------------------------
  if (path === "/api/candidates" && method === "POST") {
    if (!isEngine(request, env)) return json({ error: "unauthorized" }, 401);
    let candidate;
    try {
      candidate = await request.json();
    } catch {
      return json({ error: "bad json" }, 400);
    }
    const id = candidate?.listing?.id;
    if (!id) return json({ error: "candidate.listing.id manquant" }, 400);
    const existing = await getItem(env, id);
    if (existing) return json({ ok: true, duplicate: true });
    const item = {
      id,
      status: "pending",
      receivedAt: new Date().toISOString(),
      decidedAt: null,
      engineAcked: false,
      draft: null,
      candidate,
    };
    await putItem(env, item);
    const idx = await getIndex(env);
    idx.unshift(id);
    await putIndex(env, idx);
    return json({ ok: true });
  }

  // --- App : liste complète -------------------------------------------
  if (path === "/api/candidates" && method === "GET") {
    if (!isApp(request, env)) return json({ error: "unauthorized" }, 401);
    const idx = await getIndex(env);
    const items = [];
    for (const id of idx) {
      const it = await getItem(env, id);
      if (it) items.push(it);
    }
    return json({ items });
  }

  // --- App : décision ---------------------------------------------------
  if (path === "/api/decision" && method === "POST") {
    if (!isApp(request, env)) return json({ error: "unauthorized" }, 401);
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "bad json" }, 400);
    }
    const { id, decision } = body || {};
    if (!id || !["achete", "rejete", "faux"].includes(decision)) {
      return json({ error: "id/decision invalides" }, 400);
    }
    const item = await getItem(env, id);
    if (!item) return json({ error: "introuvable" }, 404);
    item.status = decision;
    item.decidedAt = new Date().toISOString();
    item.engineAcked = false;
    await putItem(env, item);
    return json({ ok: true, item });
  }

  // --- App ou moteur : attacher un brouillon de revente -----------------
  if (path === "/api/draft" && method === "POST") {
    if (!isApp(request, env) && !isEngine(request, env)) {
      return json({ error: "unauthorized" }, 401);
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "bad json" }, 400);
    }
    const { id, draft } = body || {};
    if (!id || !draft) return json({ error: "id/draft manquants" }, 400);
    const item = await getItem(env, id);
    if (!item) return json({ error: "introuvable" }, 404);
    item.draft = draft;
    await putItem(env, item);
    return json({ ok: true });
  }

  // --- Moteur : décisions non traitées + ack ----------------------------
  if (path === "/api/decisions" && method === "GET") {
    if (!isEngine(request, env)) return json({ error: "unauthorized" }, 401);
    const idx = await getIndex(env);
    const items = [];
    for (const id of idx) {
      const it = await getItem(env, id);
      if (it && it.status !== "pending" && !it.engineAcked) items.push(it);
    }
    return json({ items });
  }

  if (path === "/api/decisions/ack" && method === "POST") {
    if (!isEngine(request, env)) return json({ error: "unauthorized" }, 401);
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "bad json" }, 400);
    }
    for (const id of body?.ids || []) {
      const item = await getItem(env, id);
      if (item) {
        item.engineAcked = true;
        await putItem(env, item);
      }
    }
    return json({ ok: true });
  }

  // --- App : stats ------------------------------------------------------
  if (path === "/api/stats" && method === "GET") {
    if (!isApp(request, env)) return json({ error: "unauthorized" }, 401);
    const idx = await getIndex(env);
    return json({ ok: true, total: idx.length });
  }

  return json({ error: "not found" }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      try {
        return await handleApi(request, env, url.pathname);
      } catch (e) {
        return json({ error: `interne : ${e.message}` }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  },
};
