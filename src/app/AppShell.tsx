import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { config } from "../config";
import { useCart } from "../hooks/useCart";
import { useI18n } from "../i18n/lang";
import { Icon } from "../ui/Icon";
import { Sheet } from "../ui/Sheet";
import { AppContext } from "./appContext";
import { CartSheet } from "./components/CartSheet";
import type { LangCode, ScreenId } from "../config/types";

import { HomeScreen } from "./screens/HomeScreen";
import { MenuScreen } from "./screens/MenuScreen";
import { MusicScreen } from "./screens/MusicScreen";
import { StoryScreen } from "./screens/StoryScreen";
import { MoreScreen } from "./screens/MoreScreen";
import { ClassesScreen } from "./screens/ClassesScreen";
import { CateringScreen } from "./screens/CateringScreen";
import { GiftScreen } from "./screens/GiftScreen";
import { RewardsScreen } from "./screens/RewardsScreen";
import { ContactScreen } from "./screens/ContactScreen";

const SUB_OF_MORE: ScreenId[] = ["classes", "catering", "gift", "story", "contact"];
const ALL_SCREENS: ScreenId[] = ["home", "menu", "music", "story", "more", "classes", "catering", "gift", "rewards", "contact"];

function renderScreen(screen: ScreenId) {
	switch (screen) {
		case "home": return <HomeScreen />;
		case "menu": return <MenuScreen />;
		case "music": return <MusicScreen />;
		case "story": return <StoryScreen />;
		case "more": return <MoreScreen />;
		case "classes": return <ClassesScreen />;
		case "catering": return <CateringScreen />;
		case "gift": return <GiftScreen />;
		case "rewards": return <RewardsScreen />;
		case "contact": return <ContactScreen />;
	}
}

export function AppShell() {
	const cart = useCart();
	const { t, cfg, lang, dir, setLang, languages } = useI18n();
	const [screen, setScreen] = useState<ScreenId>("home");
	const [history, setHistory] = useState<ScreenId[]>([]);
	const [cartOpen, setCartOpen] = useState(false);
	const [langOpen, setLangOpen] = useState(false);
	const [toastMsg, setToastMsg] = useState<{ text: string; k: number } | null>(null);
	const mainRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const s = new URLSearchParams(window.location.search).get("screen") as ScreenId | null;
		if (s && ALL_SCREENS.includes(s)) setScreen(s);
	}, []);

	useEffect(() => {
		mainRef.current?.scrollTo({ top: 0 });
	}, [screen]);

	const navigate = useCallback((id: ScreenId) => {
		setScreen((cur) => {
			setHistory((h) => (cur === id ? h : [...h, cur]));
			return id;
		});
	}, []);

	const back = useCallback(() => {
		setHistory((h) => {
			if (h.length === 0) {
				setScreen("home");
				return h;
			}
			setScreen(h[h.length - 1]);
			return h.slice(0, -1);
		});
	}, []);

	const toast = useCallback((text: string) => setToastMsg({ text, k: Date.now() }), []);
	useEffect(() => {
		if (!toastMsg) return;
		const tm = window.setTimeout(() => setToastMsg(null), 1700);
		return () => window.clearTimeout(tm);
	}, [toastMsg]);

	const canBack = history.length > 0 || SUB_OF_MORE.includes(screen);
	const activeNav = config.nav.find((n) => n.id === screen)?.id ?? (SUB_OF_MORE.includes(screen) ? "more" : screen);
	const title = useMemo(() => (screen === "home" ? cfg.brand.shortName : t(`nav.${screen}`)), [screen, cfg, t]);

	return (
		<AppContext.Provider value={{ screen, navigate, back, canBack, openCart: () => setCartOpen(true), cart, toast }}>
			<div className="fixed inset-0 flex items-stretch justify-center bg-[#050403] sm:items-center">
				<div className="relative flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-bg sm:h-[calc(100dvh-2rem)] sm:max-h-[900px] sm:rounded-[38px] sm:border sm:border-line sm:shadow-card">
					{/* Header */}
					<header className="relative z-30 flex shrink-0 items-center justify-between gap-2 border-b border-line bg-bg/90 px-4 pb-3 pt-[max(env(safe-area-inset-top),0.9rem)] backdrop-blur-md">
						<div className="flex min-w-0 items-center gap-2">
							{canBack ? (
								<button onClick={back} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink" aria-label="Back">
									<svg viewBox="0 0 24 24" className="h-5 w-5" style={dir === "rtl" ? { transform: "scaleX(-1)" } : undefined} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
								</button>
							) : (
								<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display text-lg font-bold text-[#241a10]" style={{ background: "linear-gradient(180deg,var(--gold-soft),var(--gold))" }}>
									{cfg.brand.monogram}
								</span>
							)}
							<span className="truncate font-display text-lg font-semibold text-ink">{title}</span>
						</div>

						<div className="flex shrink-0 items-center gap-1.5">
							<button onClick={() => setLangOpen(true)} className="flex h-9 items-center gap-1 rounded-full border border-line px-2.5 text-xs font-bold text-ink" aria-label={t("more.language")}>
								<Icon name="globe" className="h-4 w-4 text-gold" />
								{lang.toUpperCase()}
							</button>
							{cfg.features.order && (
								<button onClick={() => setCartOpen(true)} className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink" aria-label={t("cart.bag")}>
									<Icon name="bag" className="h-5 w-5" />
									{cart.count > 0 && (
										<span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">{cart.count}</span>
									)}
								</button>
							)}
						</div>
					</header>

					{/* Screen */}
					<main ref={mainRef} key={screen} className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
						{renderScreen(screen)}
					</main>

					{/* Toast */}
					{toastMsg && (
						<div key={toastMsg.k} className="pointer-events-none absolute inset-x-0 bottom-24 z-40 flex justify-center px-6">
							<div className="animate-slide-up rounded-full bg-ink px-4 py-2 text-xs font-semibold text-bg shadow-card">{toastMsg.text}</div>
						</div>
					)}

					{/* Bottom nav */}
					<nav className="relative z-30 flex shrink-0 items-stretch justify-around border-t border-line bg-bg/95 px-1 pb-[max(env(safe-area-inset-bottom),0.4rem)] pt-1.5 backdrop-blur-md">
						{config.nav.map((item) => {
							const on = activeNav === item.id;
							return (
								<button key={item.id} onClick={() => navigate(item.id)} className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] font-semibold transition-colors ${on ? "text-gold" : "text-muted"}`} aria-current={on ? "page" : undefined}>
									<Icon name={item.icon} className="h-[22px] w-[22px]" strokeWidth={on ? 2.1 : 1.7} />
									{t(`nav.${item.id}`)}
								</button>
							);
						})}
					</nav>

					<CartSheet open={cartOpen} onClose={() => setCartOpen(false)} />

					<Sheet open={langOpen} onClose={() => setLangOpen(false)} title={t("more.language")}>
						<div className="grid grid-cols-1 gap-2 py-1">
							{languages.map((l) => (
								<button
									key={l.code}
									onClick={() => { setLang(l.code as LangCode); setLangOpen(false); }}
									className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-colors ${lang === l.code ? "border-gold bg-gold/10 text-gold" : "border-line text-ink"}`}
								>
									<span>{l.label}</span>
									<span className="font-mono text-xs text-muted">{l.code.toUpperCase()}</span>
								</button>
							))}
						</div>
					</Sheet>
				</div>
			</div>
		</AppContext.Provider>
	);
}
