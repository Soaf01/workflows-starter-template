import { Icon } from "../../ui/Icon";
import { useApp } from "../appContext";
import { usePwaInstall } from "../../hooks/usePwaInstall";
import { useTheme } from "../../hooks/useTheme";
import { useI18n } from "../../i18n/lang";
import type { IconName, LangCode, ScreenId } from "../../config/types";

export function MoreScreen() {
	const { navigate } = useApp();
	const { t, cfg, lang, setLang, languages } = useI18n();
	const { themeId, setTheme, themes } = useTheme();
	const install = usePwaInstall();
	const { features, brand } = cfg;

	const links: { id: ScreenId; icon: IconName; on: boolean }[] = [
		{ id: "classes", icon: "class", on: features.classes },
		{ id: "catering", icon: "cake", on: features.catering },
		{ id: "gift", icon: "gift", on: features.giftCards },
		{ id: "rewards", icon: "star", on: features.rewards },
		{ id: "story", icon: "book", on: true },
		{ id: "contact", icon: "pin", on: true },
	];

	return (
		<div className="screen-pad animate-fade-in pt-4">
			<p className="kicker">{t("more.explore")}</p>
			<h1 className="mt-1 font-display text-3xl font-bold text-ink">{t("more.moreFrom", { name: brand.shortName })}</h1>

			<div className="mt-5 space-y-2">
				{links.filter((l) => l.on).map((l) => (
					<button key={l.id} onClick={() => navigate(l.id)} className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-left transition-colors hover:border-gold">
						<span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/12 text-gold"><Icon name={l.icon} className="h-5 w-5" /></span>
						<span className="flex-1 font-display text-[15px] font-semibold text-ink">{t(`nav.${l.id}`)}</span>
						<svg viewBox="0 0 24 24" className="h-5 w-5 text-muted rtl:-scale-x-100" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
					</button>
				))}
			</div>

			{/* Settings */}
			<p className="mt-7 kicker">{t("more.settings")}</p>
			<div className="mt-3 space-y-4">
				<div className="card p-4">
					<div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink"><Icon name="palette" className="h-4 w-4 text-gold" />{t("more.theme")}</div>
					<div className="grid grid-cols-2 gap-2">
						{themes.map((th) => (
							<button key={th.id} onClick={() => setTheme(th.id)} className={`flex items-center gap-2 rounded-2xl border p-2.5 text-left transition-colors ${themeId === th.id ? "border-gold" : "border-line"}`}>
								<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line" style={{ background: th.colors.bg }}>
									<span className="h-3.5 w-3.5 rounded-full" style={{ background: th.colors.gold }} />
								</span>
								<span className="truncate text-xs font-semibold text-ink">{th.label}</span>
							</button>
						))}
					</div>
				</div>

				<div className="card p-4">
					<div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink"><Icon name="globe" className="h-4 w-4 text-gold" />{t("more.language")}</div>
					<div className="grid grid-cols-3 gap-2">
						{languages.map((l) => (
							<button key={l.code} onClick={() => setLang(l.code as LangCode)} className={`rounded-2xl border py-2.5 text-xs font-semibold transition-colors ${lang === l.code ? "border-gold text-gold" : "border-line text-muted"}`}>{l.label}</button>
						))}
					</div>
				</div>
			</div>

			{install.canInstall && (
				<button onClick={() => install.promptInstall()} className="btn-primary mt-5 w-full"><Icon name="sparkles" className="h-4 w-4" />{t("more.install")}</button>
			)}
			{install.installed && (
				<p className="mt-5 rounded-2xl border border-gold/30 bg-gold/5 p-3 text-center text-sm text-gold">✓ {t("more.installed")}</p>
			)}

			<div className="mt-6 rounded-app border border-line bg-surface p-4 text-center text-xs text-muted">
				<p className="font-display text-sm font-bold text-ink">{brand.name}</p>
				<p className="mt-1">{t("more.about")}</p>
			</div>
		</div>
	);
}
