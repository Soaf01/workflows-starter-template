import { Icon } from "../../ui/Icon";
import { useI18n } from "../../i18n/lang";

const DEMO_POINTS = 85;

export function RewardsScreen() {
	const { t, cfg } = useI18n();
	const { rewards } = cfg;
	const next = rewards.tiers.find((tier) => tier.threshold > DEMO_POINTS) ?? rewards.tiers[rewards.tiers.length - 1];
	const pct = Math.min(100, Math.round((DEMO_POINTS / next.threshold) * 100));

	return (
		<div className="screen-pad animate-fade-in pt-4">
			<p className="kicker">{rewards.kicker}</p>
			<h1 className="mt-1 font-display text-3xl font-bold text-ink">{rewards.title}</h1>
			<p className="mt-2 text-sm text-muted">{rewards.intro}</p>

			<div className="mt-5 overflow-hidden rounded-app border border-line bg-gradient-to-br from-surface to-bg-elevated p-5">
				<div className="flex items-end justify-between">
					<div>
						<p className="text-xs uppercase tracking-widest text-muted">{t("rewards.your", { points: rewards.pointsName })}</p>
						<p className="font-display text-4xl font-bold text-gold">{DEMO_POINTS}</p>
					</div>
					<span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold"><Icon name="star" className="h-6 w-6" /></span>
				</div>
				<div className="mt-4">
					<div className="h-2 w-full overflow-hidden rounded-full bg-black/30">
						<div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,var(--gold-soft),var(--gold))" }} />
					</div>
					<p className="mt-1.5 text-xs text-muted">{t("rewards.moreTo", { n: next.threshold - DEMO_POINTS })} <span className="text-ink">{next.reward}</span></p>
				</div>
			</div>

			<p className="mt-6 kicker">{t("rewards.redeem")}</p>
			<div className="mt-3 space-y-2">
				{rewards.tiers.map((tier) => {
					const reached = DEMO_POINTS >= tier.threshold;
					return (
						<div key={tier.threshold} className={`flex items-center justify-between rounded-2xl border p-3.5 ${reached ? "border-gold/40 bg-gold/5" : "border-line"}`}>
							<div className="flex items-center gap-3">
								<span className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs ${reached ? "bg-gold text-[#241a10]" : "bg-black/30 text-muted"}`}>{tier.threshold}</span>
								<span className="text-sm text-ink">{tier.reward}</span>
							</div>
							{reached && <span className="text-xs font-semibold text-gold">{t("rewards.ready")}</span>}
						</div>
					);
				})}
			</div>

			<p className="mt-6 kicker">{t("rewards.perks")}</p>
			<div className="mt-3 space-y-2">
				{rewards.perks.map((p) => (
					<div key={p.text} className="flex items-center gap-3 rounded-2xl border border-line p-3">
						<span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/12 text-gold"><Icon name={p.icon} className="h-[18px] w-[18px]" /></span>
						<span className="text-sm text-ink">{p.text}</span>
					</div>
				))}
			</div>

			<button className="btn-primary mt-6 w-full">{t("rewards.join", { title: rewards.title })}</button>
			<p className="mt-2 text-center text-[11px] text-muted">{t("rewards.demo")}</p>
		</div>
	);
}
