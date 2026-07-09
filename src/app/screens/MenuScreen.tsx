import { useMemo, useState } from "react";
import { useI18n } from "../../i18n/lang";
import { Icon } from "../../ui/Icon";
import { ProductCard } from "../components/ProductCard";

export function MenuScreen() {
	const { t, cfg } = useI18n();
	const { categories, products } = cfg.menu;
	const [active, setActive] = useState<string>("all");
	const [query, setQuery] = useState("");

	const tabs = [{ id: "all", label: t("menu.all") }, ...categories];
	const q = query.trim().toLowerCase();

	const visible = useMemo(
		() =>
			products.filter((p) => {
				const inCat = active === "all" || p.category === active;
				const inQuery = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
				return inCat && inQuery;
			}),
		[active, products, q],
	);

	return (
		<div className="animate-fade-in">
			<div className="px-4 pt-3">
				<p className="kicker">{t("menu.kicker")}</p>
				<h1 className="mt-1 font-display text-3xl font-bold text-ink">{t("menu.title")}</h1>
				<div className="relative mt-3">
					<Icon name="search" className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
					<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("menu.search")} className="field !ps-9" aria-label={t("menu.search")} />
				</div>
			</div>

			<div className="no-scrollbar sticky top-0 z-10 mt-3 flex gap-2 overflow-x-auto bg-bg/85 px-4 py-3 backdrop-blur-md">
				{tabs.map((tab) => (
					<button key={tab.id} onClick={() => setActive(tab.id)} className={`chip ${active === tab.id ? "chip-active" : "text-muted hover:text-ink"}`} aria-pressed={active === tab.id}>{tab.label}</button>
				))}
			</div>

			{visible.length === 0 ? (
				<p className="px-4 py-10 text-center text-sm text-muted">{t("menu.noResults")}</p>
			) : (
				<div className="screen-pad grid grid-cols-2 gap-3 pt-2">
					{visible.map((p) => (
						<ProductCard key={p.id} product={p} />
					))}
				</div>
			)}
		</div>
	);
}
