import { useMemo, useState } from "react";
import { useI18n } from "../../i18n/lang";
import { ProductCard } from "../components/ProductCard";

export function MenuScreen() {
	const { t, cfg } = useI18n();
	const { categories, products } = cfg.menu;
	const [active, setActive] = useState<string>("all");

	const tabs = [{ id: "all", label: t("menu.all") }, ...categories];
	const visible = useMemo(
		() => (active === "all" ? products : products.filter((p) => p.category === active)),
		[active, products],
	);

	return (
		<div className="animate-fade-in">
			<div className="px-4 pt-3">
				<p className="kicker">{t("menu.kicker")}</p>
				<h1 className="mt-1 font-display text-3xl font-bold text-ink">{t("menu.title")}</h1>
			</div>

			<div className="no-scrollbar sticky top-0 z-10 mt-3 flex gap-2 overflow-x-auto bg-bg/85 px-4 py-3 backdrop-blur-md">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActive(tab.id)}
						className={`chip ${active === tab.id ? "chip-active" : "text-muted hover:text-ink"}`}
						aria-pressed={active === tab.id}
					>
						{tab.label}
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
