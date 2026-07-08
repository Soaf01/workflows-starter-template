import { useMemo, useState } from "react";
import { TreatArt } from "./Illustrations";
import { Reveal } from "./Reveal";
import { menu } from "../data/menu";
import { categories, site } from "../data/site";
import type { CartApi } from "../hooks/useCart";
import type { CategoryId, Treat, TreatTag } from "../types";

const TAG_META: Record<TreatTag, { label: string; cls: string }> = {
	populaire: {
		label: "Populaire",
		cls: "bg-honey-200/70 text-honey-800 dark:bg-honey-700/30 dark:text-honey-200",
	},
	nouveau: {
		label: "Nouveau",
		cls: "bg-sage-300/50 text-sage-500 dark:bg-sage-500/25 dark:text-sage-300",
	},
	vegan: {
		label: "Vegan",
		cls: "bg-sage-300/50 text-sage-500 dark:bg-sage-500/25 dark:text-sage-300",
	},
	"sans-gluten": {
		label: "Sans gluten",
		cls: "border border-berry-400/40 text-berry-500 dark:text-berry-300",
	},
	signature: {
		label: "Signature",
		cls: "bg-berry-500/90 text-white",
	},
};

function priceLabel(v: number) {
	return `${v.toFixed(2).replace(".", ",")} ${site.currency}`;
}

function TreatCard({
	treat,
	onAdd,
	delay,
}: {
	treat: Treat;
	onAdd: (id: string) => void;
	delay: number;
}) {
	const [added, setAdded] = useState(false);

	const handleAdd = () => {
		onAdd(treat.id);
		setAdded(true);
		window.setTimeout(() => setAdded(false), 1100);
	};

	return (
		<Reveal delay={delay} className="h-full">
			<article className="card group relative flex h-full flex-col overflow-hidden shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
				<div className="relative flex items-center justify-center bg-gradient-to-b from-cream-200/50 to-transparent p-4 dark:from-white/[0.03]">
					<TreatArt
						art={treat.illustration}
						className="h-36 w-36 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3"
					/>
					{treat.tags.length > 0 && (
						<div className="absolute left-3 top-3 flex flex-col items-start gap-1">
							{treat.tags.slice(0, 2).map((t) => (
								<span
									key={t}
									className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TAG_META[t].cls}`}
								>
									{TAG_META[t].label}
								</span>
							))}
						</div>
					)}
				</div>

				<div className="flex flex-1 flex-col p-5 pt-3">
					<div className="flex items-start justify-between gap-3">
						<h3 className="font-serif text-lg font-semibold leading-snug text-cocoa-800 dark:text-cream-100">
							{treat.name}
						</h3>
						<span className="shrink-0 font-serif text-lg font-semibold text-honey-600 dark:text-honey-300">
							{priceLabel(treat.price)}
						</span>
					</div>

					<p className="mt-1 flex items-center gap-1 text-xs font-medium text-honey-700/80 dark:text-honey-300/70">
						<svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
							<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" strokeLinejoin="round" />
							<circle cx="12" cy="10" r="2.2" />
						</svg>
						{treat.origin}
					</p>

					<p className="mt-2 flex-1 text-sm leading-relaxed text-cocoa-600 dark:text-cream-200/70">
						{treat.description}
					</p>

					<button
						onClick={handleAdd}
						className={`btn mt-4 w-full ${
							added
								? "bg-sage-500 text-white"
								: "bg-cocoa-800 text-cream-100 hover:bg-cocoa-700 dark:bg-honey-500 dark:text-cocoa-900 dark:hover:bg-honey-400"
						}`}
						aria-label={`Ajouter ${treat.name} au panier`}
					>
						{added ? (
							<>
								<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
									<path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								Ajouté
							</>
						) : (
							<>
								<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
									<path d="M12 6v12M6 12h12" strokeLinecap="round" />
								</svg>
								Ajouter
							</>
						)}
					</button>
				</div>
			</article>
		</Reveal>
	);
}

export function Menu({ cart }: { cart: CartApi }) {
	const [filter, setFilter] = useState<CategoryId | "all">("all");

	const visible = useMemo(
		() => (filter === "all" ? menu : menu.filter((t) => t.category === filter)),
		[filter],
	);

	const tabs: { id: CategoryId | "all"; label: string }[] = [
		{ id: "all", label: "Tout" },
		...categories.map((c) => ({ id: c.id, label: c.label })),
	];

	return (
		<section id="carte" className="section-pad relative">
			<div className="mx-auto max-w-6xl">
				<Reveal className="mx-auto max-w-2xl text-center">
					<p className="eyebrow justify-center">La carte</p>
					<h2 className="mt-3 text-balance font-serif text-3xl font-semibold text-cocoa-800 dark:text-cream-50 sm:text-4xl">
						Un tour du monde en douceurs
					</h2>
					<p className="mt-3 text-cocoa-600 dark:text-cream-200/70">
						Seize gourmandises, quatre familles, autant de destinations imaginaires.
						Composez votre panier et laissez la musique choisir l'escale.
					</p>
				</Reveal>

				<div className="no-scrollbar mt-8 flex snap-x gap-2 overflow-x-auto pb-2 sm:justify-center">
					{tabs.map((t) => (
						<button
							key={t.id}
							onClick={() => setFilter(t.id)}
							className={`snap-start whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-all ${
								filter === t.id
									? "bg-honey-500 text-cocoa-900 shadow-soft"
									: "bg-white/60 text-cocoa-700 hover:bg-white dark:bg-white/5 dark:text-cream-200 dark:hover:bg-white/10"
							}`}
							aria-pressed={filter === t.id}
						>
							{t.label}
						</button>
					))}
				</div>

				<div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{visible.map((treat, i) => (
						<TreatCard
							key={treat.id}
							treat={treat}
							onAdd={cart.add}
							delay={(i % 3) * 90}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
