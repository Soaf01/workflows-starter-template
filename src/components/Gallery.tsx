import { TreatArt } from "./Illustrations";
import { Reveal } from "./Reveal";
import { menu } from "../data/menu";
import type { Treat } from "../types";

function Row({
	items,
	reverse,
}: {
	items: Treat[];
	reverse?: boolean;
}) {
	const track = [...items, ...items];
	return (
		<div className="marquee-group relative flex overflow-hidden py-2">
			<div
				className={`flex w-max gap-4 pr-4 ${
					reverse ? "animate-marquee-rev" : "animate-marquee"
				}`}
			>
				{track.map((t, i) => (
					<figure
						key={`${t.id}-${i}`}
						className="w-40 shrink-0 rounded-3xl border border-cocoa-900/10 bg-white/60 p-3 text-center shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]"
						aria-hidden={i >= items.length}
					>
						<TreatArt art={t.illustration} className="mx-auto h-28 w-28" />
						<figcaption className="mt-1 truncate font-serif text-sm font-semibold text-cocoa-800 dark:text-cream-100">
							{t.name}
						</figcaption>
						<p className="truncate text-[11px] text-honey-700/80 dark:text-honey-300/70">
							{t.origin}
						</p>
					</figure>
				))}
			</div>
		</div>
	);
}

export function Gallery() {
	const half = Math.ceil(menu.length / 2);
	return (
		<section id="galerie" className="relative overflow-hidden py-20 md:py-24">
			<Reveal className="mx-auto mb-10 max-w-2xl px-5 text-center">
				<p className="eyebrow justify-center">La vitrine</p>
				<h2 className="mt-3 text-balance font-serif text-3xl font-semibold text-cocoa-800 dark:text-cream-50 sm:text-4xl">
					Faites le tour de la vitrine
				</h2>
				<p className="mt-3 text-cocoa-600 dark:text-cream-200/70">
					Chaque douceur est un dessin original, léger et net à toutes les tailles —
					aucune photo, aucun poids superflu.
				</p>
			</Reveal>

			<div
				className="space-y-3 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
			>
				<Row items={menu.slice(0, half)} />
				<Row items={menu.slice(half)} reverse />
			</div>
		</section>
	);
}
