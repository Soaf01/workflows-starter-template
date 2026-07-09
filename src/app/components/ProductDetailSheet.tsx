import { useEffect, useState } from "react";
import { money } from "../../config";
import { Photo } from "../../lib/photo";
import { Sheet } from "../../ui/Sheet";
import { Stepper } from "../../ui/Stepper";
import { Icon } from "../../ui/Icon";
import { useI18n } from "../../i18n/lang";
import { useApp } from "../appContext";

export function ProductDetailSheet({
	productId,
	onClose,
}: {
	productId: string | null;
	onClose: () => void;
}) {
	const { t, cfg } = useI18n();
	const { cart, fav, toast } = useApp();
	const [qty, setQty] = useState(1);
	const [note, setNote] = useState("");
	const p = productId ? cfg.menu.products.find((x) => x.id === productId) : null;

	useEffect(() => {
		if (productId) {
			setQty(1);
			setNote("");
		}
	}, [productId]);

	const add = () => {
		if (!p) return;
		cart.add(p.id, qty);
		toast(`${p.name} · ${t("common.added")}`);
		onClose();
	};

	return (
		<Sheet
			open={!!p}
			onClose={onClose}
			footer={
				p ? (
					<button onClick={add} className="btn-primary w-full">
						{t("common.add")} · {money(p.price * qty)}
					</button>
				) : null
			}
		>
			{p && (
				<div className="py-1">
					<Photo src={p.image} alt={p.name} width={720} height={540} eager className="mb-4 aspect-[4/3] w-full rounded-2xl" rounded="rounded-2xl" />
					<div className="flex items-start justify-between gap-3">
						<div>
							<h2 className="font-display text-2xl font-bold text-ink">{p.name}</h2>
							{p.popular && <span className="mt-1 inline-block text-xs font-semibold text-gold">★ {t("common.popular")}</span>}
						</div>
						<button onClick={() => fav.toggle(p.id)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line" aria-label="Favourite" aria-pressed={fav.has(p.id)}>
							<Icon name="heart" className={`h-5 w-5 ${fav.has(p.id) ? "fill-accent text-accent" : "text-muted"}`} />
						</button>
					</div>
					<p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
					<div className="mt-4 flex items-center justify-between">
						<span className="font-mono text-lg font-semibold text-gold">{money(p.price)}</span>
						<Stepper value={qty} onDec={() => setQty((q) => Math.max(1, q - 1))} onInc={() => setQty((q) => Math.min(20, q + 1))} />
					</div>
					<textarea className="field mt-4 resize-none" rows={2} placeholder={t("cart.notes")} value={note} onChange={(e) => setNote(e.target.value)} />
				</div>
			)}
		</Sheet>
	);
}
