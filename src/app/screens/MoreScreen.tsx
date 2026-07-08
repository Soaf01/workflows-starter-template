import { config } from "../../config";
import { Icon } from "../../ui/Icon";
import { useApp } from "../appContext";
import { usePwaInstall } from "../../hooks/usePwaInstall";
import type { IconName, ScreenId } from "../../config/types";

export function MoreScreen() {
	const { navigate } = useApp();
	const install = usePwaInstall();
	const { features, brand } = config;

	const links: { id: ScreenId; label: string; icon: IconName; on: boolean }[] = [
		{ id: "classes", label: "Classes & workshops", icon: "class", on: features.classes },
		{ id: "catering", label: "Catering & platters", icon: "cake", on: features.catering },
		{ id: "gift", label: "Gift cards", icon: "gift", on: features.giftCards },
		{ id: "rewards", label: "Rewards", icon: "star", on: features.rewards },
		{ id: "story", label: "Our story", icon: "book", on: true },
		{ id: "contact", label: "Visit & contact", icon: "pin", on: true },
	];

	return (
		<div className="screen-pad animate-fade-in pt-4">
			<p className="kicker">Explore</p>
			<h1 className="mt-1 font-display text-3xl text-ink">More from {brand.shortName}</h1>

			<div className="mt-5 space-y-2">
				{links.filter((l) => l.on).map((l) => (
					<button
						key={l.id}
						onClick={() => navigate(l.id)}
						className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-left transition-colors hover:border-gold/40"
					>
						<span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/12 text-gold"><Icon name={l.icon} className="h-5 w-5" /></span>
						<span className="flex-1 font-display text-[15px] text-ink">{l.label}</span>
						<svg viewBox="0 0 24 24" className="h-5 w-5 text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
					</button>
				))}
			</div>

			{install.canInstall && (
				<button onClick={() => install.promptInstall()} className="btn-primary mt-5 w-full">
					<Icon name="sparkles" className="h-4 w-4" />
					Install this app
				</button>
			)}
			{install.installed && (
				<p className="mt-5 rounded-2xl border border-gold/30 bg-gold/5 p-3 text-center text-sm text-gold">✓ App installed</p>
			)}

			<div className="mt-6 rounded-app border border-line bg-surface p-4 text-center text-xs text-muted">
				<p className="font-display text-sm text-ink">{brand.name}</p>
				<p className="mt-1">A white-label demo — brand, prices, photos and copy are fictional and fully configurable.</p>
			</div>
		</div>
	);
}
