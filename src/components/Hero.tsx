import { TreatArt } from "./Illustrations";
import { Bee, Sparkle } from "./Decor";
import { site } from "../data/site";

const FLOATERS = [
	{ art: "croissant", cls: "left-2 top-6 h-28 w-28 animate-float", delay: "0s" },
	{ art: "macaron", cls: "right-4 top-0 h-32 w-32 animate-float-slow", delay: "0.4s" },
	{ art: "tarte", cls: "left-10 bottom-4 h-28 w-28 animate-float-slow", delay: "0.9s" },
	{ art: "cupcake", cls: "right-8 bottom-8 h-32 w-32 animate-float", delay: "0.2s" },
] as const;

export function Hero({ onCompose }: { onCompose: () => void }) {
	return (
		<section
			id="accueil"
			className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-cream-100 pt-28 dark:from-cocoa-900 dark:via-cocoa-950 dark:to-cocoa-900"
		>
			<div className="paper-texture pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
			<div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-honey-300/40 blur-3xl dark:bg-honey-700/20" aria-hidden="true" />
			<div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-berry-300/30 blur-3xl dark:bg-berry-600/15" aria-hidden="true" />

			<div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 sm:px-8 lg:grid-cols-2 lg:pb-28">
				<div className="animate-fade-up">
					<p className="eyebrow">
						<Sparkle className="h-3.5 w-3.5" />
						{site.established} · Modèle générique
					</p>
					<h1 className="mt-4 text-balance font-serif text-4xl font-semibold leading-[1.05] text-cocoa-800 dark:text-cream-50 sm:text-5xl lg:text-6xl">
						Des douceurs qui{" "}
						<span className="text-gradient-honey">voyagent</span>, une bouchée à la fois.
					</h1>
					<p className="mt-5 max-w-md text-balance text-base leading-relaxed text-cocoa-600 dark:text-cream-200/75 sm:text-lg">
						{site.intro}
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-3">
						<a href="#carte" className="btn-primary text-base">
							Voir la carte
							<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
								<path d="M5 12h14m0 0l-5-5m5 5l-5 5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</a>
						<button onClick={onCompose} className="btn-ghost text-base">
							Composer un panier
						</button>
					</div>

					<dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
						{[
							["16", "douceurs à la carte"],
							["6", "ambiances du monde"],
							["100%", "hors-ligne, installable"],
						].map(([n, l]) => (
							<div key={l}>
								<dt className="font-serif text-2xl font-semibold text-honey-600 dark:text-honey-300">
									{n}
								</dt>
								<dd className="text-xs text-cocoa-600/80 dark:text-cream-200/60">{l}</dd>
							</div>
						))}
					</dl>
				</div>

				{/* Floating treat scene */}
				<div className="relative mx-auto h-80 w-full max-w-md sm:h-96">
					<div className="absolute inset-6 rounded-[3rem] bg-gradient-to-br from-white/70 to-cream-200/40 shadow-card ring-1 ring-cocoa-900/5 backdrop-blur-sm dark:from-white/5 dark:to-white/[0.02] dark:ring-white/10" />
					{FLOATERS.map((f) => (
						<div
							key={f.art}
							className={`absolute drop-shadow-[0_18px_20px_rgba(74,53,39,0.22)] ${f.cls}`}
							style={{ animationDelay: f.delay }}
						>
							<TreatArt art={f.art} />
						</div>
					))}
					<Bee className="absolute right-2 top-16 h-9 w-14 animate-float text-honey-700 dark:text-honey-300" />
					<Sparkle className="absolute left-1/2 top-4 h-5 w-5 text-honey-400" />
					<Sparkle className="absolute bottom-6 left-4 h-4 w-4 text-berry-400" />
				</div>
			</div>

			{/* scroll cue */}
			<a
				href="#carte"
				className="relative mx-auto mb-8 flex w-fit flex-col items-center gap-1 text-cocoa-500 dark:text-cream-200/50"
				aria-label="Faire défiler vers la carte"
			>
				<span className="text-[11px] uppercase tracking-[0.2em]">Découvrir</span>
				<svg viewBox="0 0 24 24" className="h-5 w-5 animate-float" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
					<path d="M12 5v14m0 0l-5-5m5 5l5-5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</a>
		</section>
	);
}
