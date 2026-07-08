import { money } from "../../config";
import { Photo } from "../../lib/photo";
import { useI18n } from "../../i18n/lang";
import { useApp } from "../appContext";
import type { Product } from "../../config/types";

export function ProductCard({ product }: { product: Product }) {
	const { cart, toast } = useApp();
	const { t } = useI18n();

	const add = () => {
		cart.add(product.id);
		toast(`${product.name} · ${t("common.added")}`);
	};

	return (
		<article className="card group flex flex-col overflow-hidden">
			<div className="relative">
				<Photo src={product.image} alt={product.name} width={480} height={360} className="aspect-[4/3] w-full" />
				{product.popular && (
					<span className="absolute start-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold backdrop-blur-sm">
						{t("common.popular")}
					</span>
				)}
				{product.tags?.[0] && (
					<span className="absolute end-2 top-2 rounded-full border border-line bg-black/45 px-2 py-0.5 text-[10px] font-semibold text-ink backdrop-blur-sm">
						{product.tags[0]}
					</span>
				)}
			</div>
			<div className="flex flex-1 flex-col p-3">
				<h3 className="font-display text-[15px] font-semibold leading-tight text-ink">{product.name}</h3>
				<p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-muted">{product.description}</p>
				<div className="mt-3 flex items-center justify-between">
					<span className="font-mono text-sm font-semibold text-gold">{money(product.price)}</span>
					<button
						onClick={add}
						className="flex items-center gap-1 rounded-full border border-line bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-gold hover:text-gold active:scale-95"
						aria-label={`${t("common.add")} ${product.name}`}
					>
						<svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M12 6v12M6 12h12" strokeLinecap="round" /></svg>
						{t("common.add")}
					</button>
				</div>
			</div>
		</article>
	);
}
