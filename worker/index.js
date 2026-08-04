/**
 * Plume — Worker backend.
 * Rôles : servir l'app single-file (public/index.html), proxifier tous les appels IA
 * (aucun appel navigateur→Anthropic), persister l'état via Durable Object SQLite.
 * Secrets Wrangler requis : ANTHROPIC_API_KEY, PLUME_PASSWORD.
 */

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL_BASE = "claude-sonnet-5";
const MODEL_CRITIC = "claude-opus-5";

const TAXONOMY = [
	["ACC-SV", "Accord sujet-verbe"],
	["ACC-GN", "Accord dans le groupe nominal (genre/nombre)"],
	["PP-AVOIR", "Participe passé avec avoir (COD antéposé)"],
	["PP-ETRE", "Participe passé avec être / verbes pronominaux"],
	["E-VERB", "Terminaisons homophones en /E/ (-er, -é, -ez, -ait)"],
	["HOM-GRAM", "Homophones grammaticaux (a/à, ou/où, et/est, se/ce, ses/ces, son/sont, sa/ça, la/là)"],
	["CONJ", "Conjugaison (forme verbale erronée)"],
	["MODE", "Mode ou temps inadapté (subjonctif, concordance)"],
	["ACCENTS", "Accents manquants ou erronés"],
	["ORTH-LEX", "Orthographe lexicale (lettres muettes, doubles consonnes)"],
	["MAJ", "Majuscules"],
	["PONCT", "Ponctuation"],
	["REGISTRE", "Registre oral/familier dans un écrit formel"],
	["ANGLICISME", "Anglicisme"],
	["SYNTAXE", "Construction de phrase incorrecte"],
	["PREP", "Préposition erronée"],
	["VOCAB", "Mot imprécis ou impropre"],
	["ELISION", "Élision / apostrophe (l', d', qu')"],
	["NEG", "Négation incomplète"],
	["AUTRE", "Autre"],
];

const taxonomyPrompt = TAXONOMY.map(([c, l]) => `${c} = ${l}`).join("\n");

function json(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "content-type": "application/json; charset=utf-8" },
	});
}

async function sha256hex(s) {
	const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
	return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function expectedToken(env) {
	return sha256hex("plume:v1:" + env.PLUME_PASSWORD);
}

async function checkAuth(request, env) {
	const tok = request.headers.get("x-plume-auth") || "";
	return tok.length > 0 && tok === (await expectedToken(env));
}

/** Appel Anthropic avec extraction JSON robuste. */
async function callClaude(env, { model, system, user, maxTokens = 4000, temperature = 0.3 }) {
	const res = await fetch(ANTHROPIC_URL, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			"x-api-key": env.ANTHROPIC_API_KEY,
			"anthropic-version": "2023-06-01",
		},
		body: JSON.stringify({
			model,
			max_tokens: maxTokens,
			temperature,
			system,
			messages: [{ role: "user", content: user }],
		}),
	});
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Anthropic ${res.status}: ${body.slice(0, 300)}`);
	}
	const data = await res.json();
	const text = (data.content || []).map((c) => c.text || "").join("");
	return text;
}

function extractJson(text) {
	let t = text.trim();
	const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
	if (fence) t = fence[1].trim();
	const start = Math.min(...["[", "{"].map((ch) => (t.indexOf(ch) === -1 ? Infinity : t.indexOf(ch))));
	if (start !== Infinity) t = t.slice(start);
	const end = Math.max(t.lastIndexOf("]"), t.lastIndexOf("}"));
	if (end !== -1) t = t.slice(0, end + 1);
	return JSON.parse(t);
}

/** Localise chaque édit dans le texte (rejet des spans hallucinés). */
function locateEdits(text, edits) {
	const used = [];
	const located = [];
	for (const e of edits) {
		if (!e || typeof e.original !== "string" || e.original.length === 0) continue;
		let idx = -1;
		let from = 0;
		while (true) {
			idx = text.indexOf(e.original, from);
			if (idx === -1) break;
			const overlaps = used.some(([s, en]) => idx < en && idx + e.original.length > s);
			if (!overlaps) break;
			from = idx + 1;
		}
		if (idx === -1) continue;
		used.push([idx, idx + e.original.length]);
		located.push({ ...e, start: idx, end: idx + e.original.length });
	}
	return located;
}

const DETECT_SYSTEM = `Tu es un correcteur expert du français écrit, spécialiste des locuteurs « héritage » (oral fort, écrit faible, fautes phonologiquement plausibles). Tu détectes les erreurs dans un texte d'apprenant préparant le TEF/TCF Canada.

Règles strictes :
1. Signale UNIQUEMENT de vraies erreurs (orthographe grammaticale, orthographe lexicale, conjugaison, syntaxe, ponctuation fautive, registre oral dans un écrit, anglicismes). Ne réécris JAMAIS le style. En cas de doute, ne signale pas.
2. Pour chaque erreur : "original" = la plus petite sous-chaîne EXACTE du texte contenant l'erreur (copie caractère par caractère, espaces compris), "correction" = l'édit minimal, "category" = un code de la taxonomie, "explanation" = la règle en une phrase.
3. Réponds UNIQUEMENT avec un tableau JSON : [{"original": "...", "correction": "...", "category": "...", "explanation": "..."}]. Tableau vide [] si aucune erreur.

Taxonomie :
${taxonomyPrompt}`;

async function detectPass(env, text, temperature) {
	const out = await callClaude(env, {
		model: MODEL_BASE,
		system: DETECT_SYSTEM,
		user: `Texte de l'apprenant :\n<<<\n${text}\n>>>\nListe les erreurs (JSON uniquement).`,
		temperature,
	});
	const arr = extractJson(out);
	return Array.isArray(arr) ? arr : [];
}

const VERIFY_SYSTEM = `Tu es un vérificateur adversarial de corrections du français. Pour chaque édit proposé sur le texte, décide s'il s'agit d'une VRAIE erreur (règle nommable, édit minimal, le sens et le style sont préservés) ou d'une sur-correction stylistique / d'un faux positif.

Réponds UNIQUEMENT en JSON : un tableau, un objet par édit, même ordre :
[{"keep": true|false, "category": "CODE", "rule": "nom court de la règle", "explanation": "explication pédagogique en une ou deux phrases", "socratic": "question socratique qui guide vers la correction SANS la donner", "register_only": true|false}]
"register_only" = true si c'est un choix de registre oral/familier plutôt qu'une faute.

Taxonomie :
${taxonomyPrompt}`;

async function verifyEdits(env, text, edits) {
	if (edits.length === 0) return [];
	const list = edits
		.map((e, i) => `${i + 1}. "${e.original}" → "${e.correction}" [${e.category}] (${e.explanation || ""})`)
		.join("\n");
	const out = await callClaude(env, {
		model: MODEL_CRITIC,
		system: VERIFY_SYSTEM,
		user: `Texte :\n<<<\n${text}\n>>>\nÉdits proposés :\n${list}\nVérifie chaque édit (JSON uniquement, ${edits.length} objets).`,
		temperature: 0.1,
		maxTokens: 6000,
	});
	const arr = extractJson(out);
	return Array.isArray(arr) ? arr : [];
}

/** Pipeline complet : 3 passes de détection → vote majoritaire → vérification critique. */
async function detectPipeline(env, text) {
	const temps = [0.2, 0.5, 0.8];
	const settled = await Promise.allSettled(temps.map((t) => detectPass(env, text, t)));
	const passes = settled.filter((s) => s.status === "fulfilled").map((s) => s.value);
	const failures = settled.filter((s) => s.status === "rejected").map((s) => String(s.reason).slice(0, 200));
	if (passes.length === 0) {
		throw new Error("Toutes les passes de détection ont échoué : " + failures.join(" | "));
	}
	const counts = new Map();
	for (const pass of passes) {
		const seen = new Set();
		for (const e of pass) {
			if (!e || !e.original || typeof e.correction !== "string") continue;
			const key = e.original.trim() + "→" + e.correction.trim();
			if (seen.has(key)) continue;
			seen.add(key);
			const cur = counts.get(key) || { ...e, votes: 0 };
			cur.votes += 1;
			if (!cur.category && e.category) cur.category = e.category;
			counts.set(key, cur);
		}
	}
	const threshold = passes.length >= 2 ? 2 : 1;
	const majority = [...counts.values()].filter((e) => e.votes >= threshold);
	const located = locateEdits(text, majority);
	located.sort((a, b) => a.start - b.start);

	let verdicts = [];
	try {
		verdicts = await verifyEdits(env, text, located);
	} catch (err) {
		verdicts = located.map(() => null);
	}
	const errors = [];
	const discuss = [];
	located.forEach((e, i) => {
		const v = verdicts[i];
		const item = {
			start: e.start,
			end: e.end,
			original: e.original,
			correction: e.correction,
			category: (v && v.category) || e.category || "AUTRE",
			rule: (v && v.rule) || "",
			explanation: (v && v.explanation) || e.explanation || "",
			socratic: (v && v.socratic) || "Quelle règle s'applique ici ?",
			votes: e.votes,
			passes: passes.length,
		};
		if (v && v.keep === false) return;
		if (v && v.register_only) {
			item.category = "REGISTRE";
			discuss.push(item);
		} else if (!v && e.votes < passes.length) {
			discuss.push(item);
		} else {
			errors.push(item);
		}
	});
	return { errors, discuss, passesUsed: passes.length, failures };
}

const GRADE_SYSTEM = `Tu es un examinateur certifié TEF Canada / TCF Canada pour l'expression écrite. Tu évalues une copie selon les trois familles de critères officielles, en bandes de 0 à 5 :
- pragmatique : respect de la consigne et du format, cohérence, connecteurs, développement ;
- linguistique : grammaire, orthographe, richesse et précision du lexique, complexité des phrases ;
- sociolinguistique : registre adapté au destinataire et au genre.

Estime aussi : le niveau CECR de la copie (A2, B1, B1+, B2, C1), l'équivalent NCLC (4 à 10), un score TEF /450 et un score TCF /20 pour l'épreuve entière si toutes les tâches étaient de ce niveau. Sois réaliste et exigeant, ni sévère ni complaisant. Ce sont des ESTIMATIONS d'entraînement, pas des scores officiels.

Réponds UNIQUEMENT en JSON :
{"pragmatique": n, "linguistique": n, "sociolinguistique": n, "cecr": "…", "nclc": n, "tef450": n, "tcf20": n, "forces": ["…"], "faiblesses": ["…"], "conseil": "…"}`;

async function gradeText(env, { examType, task, prompt, text }) {
	const user = `Examen visé : ${examType || "TCF Canada"}. Tâche : ${task || "production écrite"}.
Consigne donnée au candidat :
<<<${prompt || "(non fournie)"}>>>
Copie du candidat :
<<<
${text}
>>>
Évalue (JSON uniquement).`;
	const settled = await Promise.allSettled([
		callClaude(env, { model: MODEL_BASE, system: GRADE_SYSTEM, user, temperature: 0.2 }),
		callClaude(env, { model: MODEL_CRITIC, system: GRADE_SYSTEM, user, temperature: 0.2 }),
	]);
	const grades = [];
	for (const s of settled) {
		if (s.status !== "fulfilled") continue;
		try {
			grades.push(extractJson(s.value));
		} catch (e) {
			/* passe ignorée si JSON invalide */
		}
	}
	if (grades.length === 0) throw new Error("Les deux passes de notation ont échoué.");
	const avg = (k) => {
		const vals = grades.map((g) => Number(g[k])).filter((v) => !Number.isNaN(v));
		return vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : null;
	};
	const first = grades[0];
	return {
		pragmatique: avg("pragmatique"),
		linguistique: avg("linguistique"),
		sociolinguistique: avg("sociolinguistique"),
		nclc: avg("nclc"),
		tef450: avg("tef450"),
		tcf20: avg("tcf20"),
		cecr: first.cecr || "",
		forces: first.forces || [],
		faiblesses: first.faiblesses || [],
		conseil: first.conseil || "",
		doubleMarked: grades.length === 2,
	};
}

/* ---------- Dialogue Plume (hors apprentissage) — SCIM-first ---------- */

const SCIM_URL = "https://scim-api.soaf01.workers.dev";

/**
 * Protocole studio : tout texte libre destiné à un modèle passe d'abord par SCIM
 * (analyze → clarify → brief). Le contrat exact de l'API SCIM n'a pas pu être
 * vérifié (KB inaccessible depuis cette session) : l'appel est donc tenté en
 * best-effort et, en cas d'échec, le dialogue continue en direct — jamais de
 * blocage utilisateur. Le drapeau scimUsed est remonté pour transparence.
 */
async function tryScim(text) {
	try {
		const res = await fetch(SCIM_URL + "/analyze", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ text, source: "plume", mode: "clarify-brief" }),
		});
		if (!res.ok) return null;
		const data = await res.json();
		return data && (data.brief || data.result || data.analysis) ? data : null;
	} catch (err) {
		return null;
	}
}

const PLUME_PERSONA = `Tu es Plume, le tuteur personnel d'écriture du français de l'utilisateur. Tu le tutoies. Tu es chaleureux, direct, exigeant et encourageant — jamais condescendant. Tu connais son profil : locuteur « héritage » (français appris oralement dans l'enfance), oral aisé mais registre à élever, écrit en construction, objectif NCLC 7 à l'écrit pour la résidence permanente canadienne (TEF ou TCF Canada). Réponds en français, brièvement (2 à 5 phrases), sauf si on te demande un développement.`;

const CHAT_SYSTEM = PLUME_PERSONA + `

Cette conversation sert à faire connaissance et à parler de tout ce qui N'EST PAS un exercice : son parcours, sa motivation, ses questions sur la méthode, les examens, l'organisation. Tu ne corriges pas ses messages ici (sauf s'il le demande explicitement) — ce n'est pas une session d'entraînement. Si tu apprends des faits utiles sur son profil (parcours, habitudes, échéances), termine ta réponse par une ligne : PROFIL: {"note": "…"} — sinon, pas de ligne PROFIL.`;

async function chat(env, messages) {
	const last = messages.length ? String(messages[messages.length - 1].content || "") : "";
	const scim = await tryScim(last);
	let system = CHAT_SYSTEM;
	if (scim) {
		system += "\n\nAnalyse SCIM du dernier message (contexte, à ne pas citer) : " + JSON.stringify(scim).slice(0, 1200);
	}
	const convo = messages
		.slice(-12)
		.map((m) => (m.role === "user" ? "Utilisateur : " : "Plume : ") + m.content)
		.join("\n");
	const out = await callClaude(env, {
		model: MODEL_BASE,
		system,
		user: convo + "\nPlume :",
		temperature: 0.6,
		maxTokens: 800,
	});
	let reply = out.trim();
	let profileNote = null;
	const m = reply.match(/PROFIL:\s*(\{[\s\S]*\})\s*$/);
	if (m) {
		try {
			profileNote = JSON.parse(m[1]).note || null;
		} catch (err) {
			profileNote = null;
		}
		reply = reply.slice(0, m.index).trim();
	}
	return { reply, profileNote, scimUsed: !!scim };
}

const ELEVATE_SYSTEM = `Tu es Plume, un professeur de français qui aide un apprenant B1 à écrire au niveau B2. Sa phrase est CORRECTE grammaticalement mais peut être enrichie. Propose UNE montée en gamme : vocabulaire plus précis, subordination, connecteur, nominalisation — sans changer le sens, sans jargon inutile.
Réponds UNIQUEMENT en JSON : {"b2": "la phrase réécrite au niveau B2", "levier": "ce qui a été amélioré, en une phrase"}`;

async function elevate(env, sentence) {
	const out = await callClaude(env, {
		model: MODEL_BASE,
		system: ELEVATE_SYSTEM,
		user: `Phrase : ${sentence}\n(JSON uniquement)`,
		temperature: 0.4,
		maxTokens: 500,
	});
	return extractJson(out);
}

const DICTATION_SYSTEM = `Tu es Plume, générateur de dictées ciblées pour un apprenant B1+ (locuteur héritage, objectif B2/NCLC 7, vit à Toronto). On te donne des codes de catégories d'erreurs : génère des phrases de dictée NATURELLES (vie quotidienne canadienne, travail, immigration) dont chacune contient un ou deux pièges correspondant exactement à ces catégories. Longueur : 12 à 20 mots. Orthographe et grammaire irréprochables.
Réponds UNIQUEMENT en JSON : [{"text": "…", "cats": ["CODE"]}]

Taxonomie :
${taxonomyPrompt}`;

async function makeDictation(env, categories, count) {
	const out = await callClaude(env, {
		model: MODEL_BASE,
		system: DICTATION_SYSTEM,
		user: `Catégories cibles : ${categories.join(", ")}. Génère ${count} phrases (JSON uniquement).`,
		temperature: 0.7,
		maxTokens: 1200,
	});
	const arr = extractJson(out);
	if (!Array.isArray(arr)) throw new Error("Génération de dictée invalide.");
	return arr.filter((s) => s && typeof s.text === "string" && s.text.length > 10).slice(0, count);
}

const REPORT_SYSTEM = PLUME_PERSONA + `

Tu rédiges le rapport de fin de session d'écriture. On te donne le texte de l'apprenant et la liste de ses erreurs confirmées. Réponds UNIQUEMENT en JSON :
{"bien": ["3 choses précises réussies dans CE texte"], "priorites": ["3 priorités de travail, formulées en règles actionnables"], "reformulations": [{"avant": "phrase exacte du texte", "apres": "la même idée écrite au niveau B2", "levier": "ce qui a été amélioré"}]}
2 reformulations maximum, choisies parmi les phrases CORRECTES du texte (pas celles qui contiennent des erreurs).`;

async function makeReport(env, text, errors) {
	const errList = errors.map((e) => `- "${e.original}" → "${e.correction}" [${e.category}]`).join("\n") || "(aucune)";
	const out = await callClaude(env, {
		model: MODEL_BASE,
		system: REPORT_SYSTEM,
		user: `Texte :\n<<<\n${text}\n>>>\nErreurs confirmées :\n${errList}\n(JSON uniquement)`,
		temperature: 0.4,
		maxTokens: 1200,
	});
	return extractJson(out);
}

const EXPLAIN_SYSTEM = PLUME_PERSONA + `

L'apprenant vient de corriger une erreur et demande une explication approfondie. Donne : une explication complète mais claire (4 à 6 phrases, avec le raisonnement pas à pas), deux exemples contrastés, et une question de quiz.
Réponds UNIQUEMENT en JSON :
{"explication": "…", "exemples": [{"faux": "…", "juste": "…"}, {"faux": "…", "juste": "…"}], "quiz": {"question": "…", "options": ["…", "…", "…"], "bonne": 0}}`;

async function explainMore(env, err) {
	const out = await callClaude(env, {
		model: MODEL_BASE,
		system: EXPLAIN_SYSTEM,
		user: `Erreur : "${err.original}" → "${err.correction}". Catégorie : ${err.category}. Règle : ${err.rule || ""}. ${err.question ? "Question de l'apprenant : " + err.question : ""}\n(JSON uniquement)`,
		temperature: 0.4,
		maxTokens: 1200,
	});
	return extractJson(out);
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		if (!url.pathname.startsWith("/api/")) {
			return env.ASSETS.fetch(request);
		}
		try {
			if (url.pathname === "/api/login" && request.method === "POST") {
				const body = await request.json();
				if (typeof env.PLUME_PASSWORD !== "string" || env.PLUME_PASSWORD.length === 0) {
					return json({ error: "PLUME_PASSWORD non configuré (wrangler secret put PLUME_PASSWORD)." }, 500);
				}
				if (body.password === env.PLUME_PASSWORD) {
					return json({ token: await expectedToken(env) });
				}
				return json({ error: "Mot de passe incorrect." }, 401);
			}

			if (!(await checkAuth(request, env))) {
				return json({ error: "Non authentifié." }, 401);
			}

			if (url.pathname === "/api/health" && request.method === "GET") {
				return json({
					ok: true,
					version: "0.3.0",
					aiKey: typeof env.ANTHROPIC_API_KEY === "string" && env.ANTHROPIC_API_KEY.length > 0,
				});
			}

			if (url.pathname === "/api/detect" && request.method === "POST") {
				const body = await request.json();
				if (!body.text || typeof body.text !== "string" || body.text.trim().length < 5) {
					return json({ error: "Texte manquant ou trop court." }, 400);
				}
				if (body.text.length > 8000) {
					return json({ error: "Texte trop long (max 8000 caractères)." }, 400);
				}
				const result = await detectPipeline(env, body.text);
				return json(result);
			}

			if (url.pathname === "/api/grade" && request.method === "POST") {
				const body = await request.json();
				if (!body.text || body.text.trim().length < 20) {
					return json({ error: "Copie manquante ou trop courte." }, 400);
				}
				const result = await gradeText(env, body);
				return json(result);
			}

			if (url.pathname === "/api/dictation" && request.method === "POST") {
				const body = await request.json();
				const cats = Array.isArray(body.categories) && body.categories.length ? body.categories.slice(0, 5) : ["E-VERB", "PP-AVOIR", "HOM-GRAM"];
				const count = Math.min(Math.max(Number(body.count) || 3, 1), 6);
				const result = await makeDictation(env, cats, count);
				return json({ sentences: result });
			}

			if (url.pathname === "/api/report" && request.method === "POST") {
				const body = await request.json();
				if (!body.text || body.text.trim().length < 20) {
					return json({ error: "Texte manquant." }, 400);
				}
				const result = await makeReport(env, body.text, Array.isArray(body.errors) ? body.errors : []);
				return json(result);
			}

			if (url.pathname === "/api/explain" && request.method === "POST") {
				const body = await request.json();
				if (!body.original || !body.correction) {
					return json({ error: "Erreur à expliquer manquante." }, 400);
				}
				const result = await explainMore(env, body);
				return json(result);
			}

			if (url.pathname === "/api/chat" && request.method === "POST") {
				const body = await request.json();
				if (!Array.isArray(body.messages) || body.messages.length === 0) {
					return json({ error: "Messages manquants." }, 400);
				}
				const result = await chat(env, body.messages);
				return json(result);
			}

			if (url.pathname === "/api/elevate" && request.method === "POST") {
				const body = await request.json();
				if (!body.sentence || body.sentence.trim().length < 5) {
					return json({ error: "Phrase manquante." }, 400);
				}
				const result = await elevate(env, body.sentence);
				return json(result);
			}

			if (url.pathname === "/api/state") {
				const id = env.PLUME_DO.idFromName("primary");
				const stub = env.PLUME_DO.get(id);
				return stub.fetch(request);
			}

			return json({ error: "Route inconnue." }, 404);
		} catch (err) {
			return json({ error: String(err && err.message ? err.message : err) }, 500);
		}
	},
};

export class PlumeDO {
	constructor(state) {
		this.state = state;
	}
	async fetch(request) {
		try {
			if (request.method === "GET") {
				const stored = await this.state.storage.get("state");
				return json({ state: stored || null });
			}
			if (request.method === "PUT") {
				const body = await request.json();
				await this.state.storage.put("state", body.state);
				return json({ ok: true });
			}
			return json({ error: "Méthode non supportée." }, 405);
		} catch (err) {
			return json({ error: String(err && err.message ? err.message : err) }, 500);
		}
	}
}
