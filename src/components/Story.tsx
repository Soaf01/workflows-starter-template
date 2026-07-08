import { ValueIcon, Bee } from "./Decor";
import { Reveal } from "./Reveal";
import { site } from "../data/site";

export function Story() {
	return (
		<section
			id="histoire"
			className="section-pad relative overflow-hidden bg-gradient-to-b from-cream-200/70 via-cream-100 to-cream-100 dark:from-cocoa-950 dark:via-cocoa-900 dark:to-cocoa-900"
		>
			<div className="pointer-events-none absolute right-6 top-10 h-40 w-40 rounded-full bg-honey-300/30 blur-3xl dark:bg-honey-700/20" aria-hidden="true" />

			<div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
				<Reveal>
					<p className="eyebrow">Notre histoire</p>
					<h2 className="mt-3 text-balance font-serif text-3xl font-semibold text-cocoa-800 dark:text-cream-50 sm:text-4xl">
						{site.story.heading}
					</h2>
					<div className="mt-5 space-y-4 text-cocoa-600 dark:text-cream-200/75">
						{site.story.paragraphs.map((p, i) => (
							<p key={i} className="leading-relaxed">
								{p}
							</p>
						))}
					</div>
					<div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm text-cocoa-600 shadow-soft dark:bg-white/5 dark:text-cream-200/70">
						<Bee className="h-6 w-9 text-honey-700 dark:text-honey-300" />
						Décor 100% imaginaire — à personnaliser librement.
					</div>
				</Reveal>

				<div className="grid gap-4 sm:grid-cols-1">
					{site.values.map((v, i) => (
						<Reveal key={v.title} delay={i * 110}>
							<div className="card flex items-start gap-4 p-5 shadow-soft transition-transform duration-300 hover:translate-x-1">
								<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-honey-500/15 text-honey-700 dark:bg-honey-400/15 dark:text-honey-300">
									<ValueIcon name={v.icon} className="h-6 w-6" />
								</span>
								<div>
									<h3 className="font-serif text-lg font-semibold text-cocoa-800 dark:text-cream-100">
										{v.title}
									</h3>
									<p className="mt-1 text-sm leading-relaxed text-cocoa-600 dark:text-cream-200/70">
										{v.body}
									</p>
								</div>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
