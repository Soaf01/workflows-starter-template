import { config } from "../../config";
import { Icon } from "../../ui/Icon";

// Demo balance — a real app would read this from the member's account.
const DEMO_POINTS = 85;

export function RewardsScreen() {
	const { rewards } = config;
	const next = rewards.tiers.find((t) => t.threshold > DEMO_POINTS) ?? rewards.tiers[rewards.tiers.length - 1];
	const pct = Math.min(100, Math.round((DEMO_POINTS / next.threshold) * 100));

	return (
		<div className="screen-pad animate-fade-in pt-4">
			<p className="kicker">{rewards.kicker}</p>
			<h1 className="mt-1 font-display text-3xl text-ink">{rewards.title}</h1>
			<p className="mt-2 text-sm text-muted">{rewards.intro}</p>

			{/* Balance */}
			<div className="mt-5 overflow-hidden rounded-app border border-line bg-gradient-to-br from-surface to-bg-elevated p-5">
				<div className="flex items-end justify-between">
					<div>
						<p className="text-xs uppercase tracking-widest text-muted">Your {rewards.pointsName}</p>
						<p className="font-display text-4xl text-gold">{DEMO_POINTS}</p>
					</div>
					<span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
						<Icon name="star" className="h-6 w-6" />
					</span>
				</div>
				<div className="mt-4">
					<div className="h-2 w-full overflow-hidden rounded-full bg-black/30">
						<div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,var(--gold-soft),var(--gold))" }} />
					</div>
					<p className="mt-1.5 text-xs text-muted">
						{next.threshold - DEMO_POINTS} more to <span className="text-ink">{next.reward}</span>
					</p>
				</div>
			</div>

			{/* Tiers */}
			<p className="mt-6 kicker">Redeem</p>
			<div className="mt-3 space-y-2">
				{rewards.tiers.map((t) => {
					const reached = DEMO_POINTS >= t.threshold;
					return (
						<div key={t.threshold} className={`flex items-center justify-between rounded-2xl border p-3.5 ${reached ? "border-gold/40 bg-gold/5" : "border-line"}`}>
							<div className="flex items-center gap-3">
								<span className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs ${reached ? "bg-gold text-[#241a10]" : "bg-black/30 text-muted"}`}>
									{t.threshold}
								</span>
								<span className="text-sm text-ink">{t.reward}</span>
							</div>
							{reached && <span className="text-xs font-semibold text-gold">Ready</span>}
						</div>
					);
				})}
			</div>

			{/* Perks */}
			<p className="mt-6 kicker">Member perks</p>
			<div className="mt-3 space-y-2">
				{rewards.perks.map((p) => (
					<div key={p.text} className="flex items-center gap-3 rounded-2xl border border-line p-3">
						<span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/12 text-gold"><Icon name={p.icon} className="h-4.5 w-4.5" /></span>
						<span className="text-sm text-ink">{p.text}</span>
					</div>
				))}
			</div>

			<button className="btn-primary mt-6 w-full">Join {rewards.title}</button>
			<p className="mt-2 text-center text-[11px] text-muted">Loyalty is a demonstration in this template.</p>
		</div>
	);
}
