import { money } from "../../config";
import { Photo } from "../../lib/photo";
import { Icon } from "../../ui/Icon";
import { useI18n } from "../../i18n/lang";
import { useApp } from "../appContext";
import { dailyTrackIndices } from "../../lib/dailyPicks";
import type { IconName, ScreenId } from "../../config/types";

export function HomeScreen() {
	const { navigate, cart, toast, account } = useApp();
	const { t, cfg } = useI18n();
	const { home, brand, features } = cfg;
	const dailyTracks = dailyTrackIndices(3).map((i) => cfg.music.tracks[i]).filter(Boolean);
	const featured = home.featuredIds
		.map((id) => cfg.menu.products.find((p) => p.id === id))
		.filter((p): p is NonNullable<typeof p> => Boolean(p));

	const quick: { id: ScreenId; icon: IconName; on: boolean }[] = [
		{ id: "classes", icon: "class", on: features.classes },
		{ id: "catering", icon: "cake", on: features.catering },
		{ id: "gift", icon: "gift", on: features.giftCards },
		{ id: "rewards", icon: "star", on: features.rewards },
	];

	return (
		<div className="animate-fade-in">
			<div className="relative">
				<Photo src={home.heroImage} alt={brand.name} width={900} height={1100} eager className="h-[62vh] max-h-[560px] min-h-[380px] w-full" />
				<div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
				<div className="absolute inset-x-0 bottom-0 p-5">
					<p className="kicker">{home.heroKicker}</p>
					<h1 className="mt-2 text-balance font-display text-[34px] font-bold leading-[1.05] text-ink">{home.heroTitle}</h1>
					<p className="mt-2 max-w-[92%] text-sm text-muted">{home.heroSubtitle}</p>
					<div className="mt-4 flex gap-2">
						{features.order && (
							<button onClick={() => navigate("menu")} className="btn-primary flex-1">{t("common.orderNow")}</button>
						)}
						<button onClick={() => navigate("story")} className="btn-ghost">{t("common.ourStory")}</button>
					</div>
				</div>
			</div>

			<div className="screen-pad space-y-8 pt-6">
				{home.announcement && (
					<div className="flex items-center gap-3 rounded-app border border-line bg-surface px-4 py-3">
						<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold"><Icon name="clock" className="h-[18px] w-[18px]" /></span>
						<p className="text-[13px] text-ink/90">{home.announcement}</p>
					</div>
				)}

				<div className="grid grid-cols-3 gap-2">
					{home.highlights.map((h) => (
						<div key={h.title} className="card flex flex-col items-center gap-1.5 px-2 py-4 text-center">
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/12 text-gold"><Icon name={h.icon} className="h-5 w-5" /></span>
							<p className="font-display text-sm font-semibold text-ink">{h.title}</p>
							<p className="text-[11px] leading-tight text-muted">{h.text}</p>
						</div>
					))}
				</div>

				{features.order && featured.length > 0 && (
					<section>
						<div className="mb-3 flex items-end justify-between">
							<div>
								<p className="kicker">{t("home.freshToday")}</p>
								<h2 className="mt-1 font-display text-2xl font-bold text-ink">{t("home.loved")}</h2>
							</div>
							<button onClick={() => navigate("menu")} className="text-xs font-semibold text-gold">{t("common.seeAll")}</button>
						</div>
						<div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
							{featured.map((p) => (
								<div key={p.id} className="w-40 shrink-0">
									<div className="card overflow-hidden">
										<Photo src={p.image} alt={p.name} width={360} height={360} className="aspect-square w-full" />
										<div className="p-2.5">
											<h3 className="truncate font-display text-sm font-semibold text-ink">{p.name}</h3>
											<div className="mt-1.5 flex items-center justify-between">
												<span className="font-mono text-xs text-gold">{money(p.price)}</span>
												<button onClick={() => { cart.add(p.id); toast(`${p.name} · ${t("common.added")}`); }} className="flex h-7 w-7 items-center justify-center rounded-full text-[#241a10]" style={{ background: "linear-gradient(180deg,var(--gold-soft),var(--gold))" }} aria-label={`${t("common.add")} ${p.name}`}>
													<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true"><path d="M12 6v12M6 12h12" strokeLinecap="round" /></svg>
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</section>
				)}

				<section>
					<div className="grid grid-cols-2 gap-3">
						{quick.filter((q) => q.on).map((q) => (
							<button key={q.id} onClick={() => navigate(q.id)} className="card flex items-center gap-3 p-4 text-left transition-colors hover:border-gold">
								<span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/12 text-gold"><Icon name={q.icon} className="h-5 w-5" /></span>
								<span className="font-display text-[15px] font-semibold text-ink">{t(`nav.${q.id}`)}</span>
							</button>
						))}
					</div>
				</section>

				{features.music && dailyTracks.length > 0 && (
					<button onClick={() => navigate("music")} className="w-full overflow-hidden rounded-app border border-line bg-gradient-to-br from-surface to-bg-elevated p-4 text-left transition-colors hover:border-gold">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/12 text-gold"><Icon name="music" className="h-5 w-5" /></span>
								<div>
									<p className="kicker">{cfg.music.kicker}</p>
									<p className="font-display text-base font-bold text-ink">{t("music.todaysPicks")}</p>
								</div>
							</div>
							{!account.member && <Icon name="lock" className="h-4 w-4 text-muted" />}
						</div>
						<div className="mt-3 space-y-1.5">
							{dailyTracks.map((tr) => (
								<div key={tr.id} className="flex items-center gap-2 text-sm">
									<Icon name="play" className="h-3.5 w-3.5 shrink-0 text-gold" />
									<span className="truncate text-ink">{tr.title}</span>
									<span className="truncate text-xs text-muted">· {tr.artist}</span>
								</div>
							))}
						</div>
					</button>
				)}

				<button onClick={() => navigate("contact")} className="relative block w-full overflow-hidden rounded-app border border-line text-left">
					<Photo src="bakery,cafe" alt="Visit" width={800} height={400} className="h-36 w-full" />
					<div className="absolute inset-0 bg-gradient-to-r from-bg/90 to-bg/30" />
					<div className="absolute inset-0 flex flex-col justify-center p-4">
						<p className="kicker">{t("home.comeSayHi")}</p>
						<p className="mt-1 font-display text-xl font-bold text-ink">{cfg.contact.area}</p>
						<p className="text-xs text-muted">{cfg.contact.address}</p>
					</div>
				</button>
			</div>
		</div>
	);
}
