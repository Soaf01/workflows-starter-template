import { useMemo, useState } from "react";
import { config } from "../../config";
import { ProductCard } from "../components/ProductCard";

export function MenuScreen() {
	const { categories, products } = config.menu;
	const [active, setActive] = useState<string>("all");

	const tabs = [{ id: "all", label: "All" }, ...categories];
	const visible = useMemo(
		() => (active === "all" ? products : products.filter((p) => p.category === active)),
		[active, products],
	);

	return (
		<div className="animate-fade-in">
			<div className="px-4 pt-3">
				<p className="kicker">The counter</p>
				<h1 className="mt-1 font-display text-3xl text-ink">Today's menu</h1>
			</div>

			{/* Category chips */}
			<div className="no-scrollbar sticky top-0 z-10 mt-3 flex gap-2 overflow-x-auto bg-bg/85 px-4 py-3 backdrop-blur-md">
				{tabs.map((t) => (
					<button
						key={t.id}
						onClick={() => setActive(t.id)}
						className={`chip ${active === t.id ? "chip-active" : "text-muted hover:text-ink"}`}
						aria-pressed={active === t.id}
					>
						{t.label}
					</button>
				))}
			</div>

			<div className="screen-pad grid grid-cols-2 gap-3 pt-2">
				{visible.map((p) => (
					<ProductCard key={p.id} product={p} />
				))}
			</div>
		</div>
	);
}
