import { useState } from "react";
import { money } from "../../config";
import { Photo } from "../../lib/photo";
import { Icon } from "../../ui/Icon";
import { useI18n } from "../../i18n/lang";
import { useApp } from "../appContext";

export function AccountScreen() {
	const { t, cfg } = useI18n();
	const { account, fav, orders, openProduct, navigate } = useApp();
	const [name, setName] = useState("");

	const favProducts = fav.ids
		.map((id) => cfg.menu.products.find((p) => p.id === id))
		.filter((p): p is NonNullable<typeof p> => Boolean(p));

	return (
		<div className="screen-pad animate-fade-in pt-4">
			<p className="kicker">{t("account.kicker")}</p>
			<h1 className="mt-1 font-display text-3xl font-bold text-ink">
				{account.member ? t("account.hello", { name: account.name }) : t("account.title")}
			</h1>

			{account.member ? (
				<div className="mt-5 overflow-hidden rounded-app border border-line bg-gradient-to-br from-surface to-bg-elevated p-5">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-xs uppercase tracking-widest text-muted">{cfg.rewards.title}</p>
							<p className="font-display text-2xl font-bold text-gold">{account.name}</p>
						</div>
						<span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold"><Icon name="user" className="h-6 w-6" /></span>
					</div>
					<div className="mt-4 flex gap-2">
						<button onClick={() => navigate("rewards")} className="btn-primary flex-1 !py-2 text-xs">{t("nav.rewards")}</button>
						<button onClick={account.signOut} className="btn-ghost !py-2 text-xs"><Icon name="logout" className="h-4 w-4" />{t("account.signOut")}</button>
					</div>
				</div>
			) : (
				<div className="mt-5 card p-5">
					<p className="text-sm text-muted">{t("account.pitch")}</p>
					<input className="field mt-3" placeholder={t("common.name")} value={name} onChange={(e) => setName(e.target.value)} />
					<button onClick={() => account.signIn(name)} className="btn-primary mt-3 w-full">{t("account.signIn")}</button>
					<p className="mt-2 text-center text-[11px] text-muted">{t("account.demoNote")}</p>
				</div>
			)}

			{/* Favourites */}
			<div className="mt-7 flex items-center justify-between">
				<p className="kicker">{t("account.favourites")}</p>
				<span className="text-xs text-muted">{favProducts.length}</span>
			</div>
			{favProducts.length === 0 ? (
				<p className="mt-2 rounded-2xl border border-line p-4 text-sm text-muted">{t("account.noFavourites")}</p>
			) : (
				<div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
					{favProducts.map((p) => (
						<button key={p.id} onClick={() => openProduct(p.id)} className="w-32 shrink-0 text-left">
							<Photo src={p.image} alt={p.name} width={280} height={280} className="aspect-square w-full rounded-2xl" rounded="rounded-2xl" />
							<p className="mt-1.5 truncate text-xs font-semibold text-ink">{p.name}</p>
							<p className="font-mono text-[11px] text-gold">{money(p.price)}</p>
						</button>
					))}
				</div>
			)}

			{/* Order history */}
			<p className="mt-7 kicker">{t("account.orders")}</p>
			{orders.list.length === 0 ? (
				<p className="mt-2 rounded-2xl border border-line p-4 text-sm text-muted">{t("account.noOrders")}</p>
			) : (
				<div className="mt-3 space-y-2">
					{orders.list.map((o) => (
						<div key={o.ref} className="rounded-2xl border border-line p-3.5">
							<div className="flex items-center justify-between">
								<span className="font-mono text-sm font-semibold text-gold">{o.ref}</span>
								<span className="font-mono text-sm text-ink">{money(o.total)}</span>
							</div>
							<div className="mt-1 flex items-center justify-between text-xs text-muted">
								<span className="truncate">{o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}</span>
								<span className="ms-2 shrink-0 rounded-full bg-gold/12 px-2 py-0.5 text-gold">{o.status}</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
