import { config, money, productById } from "../../config";
import { Photo } from "../../lib/photo";
import { Icon } from "../../ui/Icon";
import { useApp } from "../appContext";
import type { ScreenId } from "../../config/types";

export function HomeScreen() {
	const { navigate, cart, toast } = useApp();
	const { home, brand, features } = config;
	const featured = home.featuredIds
		.map((id) => productById(id))
		.filter((p): p is NonNullable<typeof p> => Boolean(p));

	const quick: { id: ScreenId; label: string; icon: Parameters<typeof Icon>[0]["name"]; on: boolean }[] = [
		{ id: "classes", label: "Classes", icon: "class", on: features.classes },
		{ id: "catering", label: "Catering", icon: "cake", on: features.catering },
		{ id: "gift", label: "Gift cards", icon: "gift", on: features.giftCards },
		{ id: "rewards", label: "Rewards", icon: "star", on: features.rewards },
	];

	return (
		<div className="animate-fade-in">
			{/* Hero */}
			<div className="relative">
				<Photo src={home.heroImage} alt={brand.name} width={900} height={1100} eager className="h-[62vh] max-h-[560px] min-h-[380px] w-full" />
				<div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
				<div className="absolute inset-x-0 bottom-0 p-5">
					<p className="kicker">{home.heroKicker}</p>
					<h1 className="mt-2 text-balance font-display text-[34px] leading-[1.05] text-ink">
						{home.heroTitle}
					</h1>
					<p className="mt-2 max-w-[92%] text-sm text-muted">{home.heroSubtitle}</p>
					<div className="mt-4 flex gap-2">
						{features.order && (
							<button onClick={() => navigate("menu")} className="btn-primary flex-1">
								Order now
							</button>
						)}
						<button onClick={() => navigate("story")} className="btn-ghost">
							Our story
						</button>
					</div>
				</div>
			</div>

			<div className="screen-pad space-y-8 pt-6">
				{/* Announcement */}
				{home.announcement && (
					<div className="flex items-center gap-3 rounded-app border border-line bg-surface px-4 py-3">
						<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/12 text-gold">
							<Icon name="clock" className="h-4.5 w-4.5" />
						</span>
						<p className="text-[13px] text-ink/90">{home.announcement}</p>
					</div>
				)}

				{/* Highlights */}
				<div className="grid grid-cols-3 gap-2">
					{home.highlights.map((h) => (
						<div key={h.title} className="card flex flex-col items-center gap-1.5 px-2 py-4 text-center">
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/12 text-gold">
								<Icon name={h.icon} className="h-5 w-5" />
							</span>
							<p className="font-display text-sm text-ink">{h.title}</p>
							<p className="text-[11px] leading-tight text-muted">{h.text}</p>
						</div>
					))}
				</div>

				{/* Featured */}
				{features.order && featured.length > 0 && (
					<section>
						<div className="mb-3 flex items-end justify-between">
							<div>
								<p className="kicker">Fresh today</p>
								<h2 className="mt-1 font-display text-2xl text-ink">Loved by regulars</h2>
							</div>
							<button onClick={() => navigate("menu")} className="text-xs font-semibold text-gold">
								See all →
							</button>
						</div>
						<div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
							{featured.map((p) => (
								<div key={p.id} className="w-40 shrink-0">
									<div className="card overflow-hidden">
										<Photo src={p.image} alt={p.name} width={360} height={360} className="aspect-square w-full" />
										<div className="p-2.5">
											<h3 className="truncate font-display text-sm text-ink">{p.name}</h3>
											<div className="mt-1.5 flex items-center justify-between">
												<span className="font-mono text-xs text-gold">{money(p.price)}</span>
												<button
													onClick={() => {
														cart.add(p.id);
														toast(`${p.name} added`);
													}}
													className="flex h-7 w-7 items-center justify-center rounded-full text-[#241a10]"
													style={{ background: "linear-gradient(180deg,var(--gold-soft),var(--gold))" }}
													aria-label={`Add ${p.name}`}
												>
													<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
														<path d="M12 6v12M6 12h12" strokeLinecap="round" />
													</svg>
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</section>
				)}

				{/* Quick actions */}
				<section>
					<div className="grid grid-cols-2 gap-3">
						{quick
							.filter((q) => q.on)
							.map((q) => (
								<button
									key={q.id}
									onClick={() => navigate(q.id)}
									className="card flex items-center gap-3 p-4 text-left transition-colors hover:border-gold/40"
								>
									<span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/12 text-gold">
										<Icon name={q.icon} className="h-5 w-5" />
									</span>
									<span className="font-display text-[15px] text-ink">{q.label}</span>
								</button>
							))}
					</div>
				</section>

				{/* Visit */}
				<button
					onClick={() => navigate("contact")}
					className="relative block w-full overflow-hidden rounded-app border border-line text-left"
				>
					<Photo src="bakery,storefront,interior" alt="Visit us" width={800} height={400} className="h-36 w-full" />
					<div className="absolute inset-0 bg-gradient-to-r from-bg/90 to-bg/30" />
					<div className="absolute inset-0 flex flex-col justify-center p-4">
						<p className="kicker">Come say hi</p>
						<p className="mt-1 font-display text-xl text-ink">{config.contact.area}</p>
						<p className="text-xs text-muted">{config.contact.address}</p>
					</div>
				</button>
			</div>
		</div>
	);
}
