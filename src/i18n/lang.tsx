import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { config } from "../config";
import type { ClientConfig, LangCode } from "../config/types";
import { translate } from "./strings";

const LANG_KEY = `${config.slug}-lang`;

function isObj(v: unknown): v is Record<string, unknown> {
	return v !== null && typeof v === "object" && !Array.isArray(v);
}

/** Deep-merge translation overrides onto the base config (arrays by index). */
function deepMerge<T>(base: T, over: unknown): T {
	if (over === undefined) return base;
	if (Array.isArray(base) && Array.isArray(over)) {
		return base.map((el, i) =>
			i < over.length ? deepMerge(el, over[i]) : el,
		) as unknown as T;
	}
	if (isObj(base) && isObj(over)) {
		const out: Record<string, unknown> = { ...base };
		for (const k of Object.keys(over)) {
			out[k] = k in base ? deepMerge((base as Record<string, unknown>)[k], over[k]) : over[k];
		}
		return out as T;
	}
	return over as T;
}

function localize(lang: LangCode): ClientConfig {
	const over = config.translations?.[lang];
	return over ? deepMerge(config, over) : config;
}

function getInitialLang(): LangCode {
	try {
		const saved = localStorage.getItem(LANG_KEY) as LangCode | null;
		if (saved && config.languages.some((l) => l.code === saved)) return saved;
	} catch {
		/* ignore */
	}
	return config.defaultLanguage;
}

interface I18nCtx {
	lang: LangCode;
	dir: "ltr" | "rtl";
	setLang: (l: LangCode) => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
	cfg: ClientConfig;
	languages: ClientConfig["languages"];
}

const LangContext = createContext<I18nCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
	const [lang, setLangState] = useState<LangCode>(getInitialLang());
	const dir: "ltr" | "rtl" = config.languages.find((l) => l.code === lang)?.rtl ? "rtl" : "ltr";

	useEffect(() => {
		document.documentElement.lang = lang;
		document.documentElement.dir = dir;
		try {
			localStorage.setItem(LANG_KEY, lang);
		} catch {
			/* ignore */
		}
	}, [lang, dir]);

	const cfg = useMemo(() => localize(lang), [lang]);
	const t = useCallback(
		(key: string, vars?: Record<string, string | number>) => translate(lang, key, vars),
		[lang],
	);

	return (
		<LangContext.Provider value={{ lang, dir, setLang: setLangState, t, cfg, languages: config.languages }}>
			{children}
		</LangContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nCtx {
	const ctx = useContext(LangContext);
	if (!ctx) throw new Error("useI18n must be used within LangProvider");
	return ctx;
}
