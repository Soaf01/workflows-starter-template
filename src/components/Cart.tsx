import { useEffect, useRef, useState } from "react";
import { TreatArt } from "./Illustrations";
import { treatById } from "../data/menu";
import { site } from "../data/site";
import type { CartApi } from "../hooks/useCart";
import type { OrderResult } from "../types";

const money = (v: number) => `${v.toFixed(2).replace(".", ",")} ${site.currency}`;

/** Local, offline-safe reference so the demo checkout always resolves. */
function localReference() {
	const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
	let out = "";
	for (let i = 0; i < 6; i++) {
		out += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	return `MM-${out}`;
}

function Stepper({
	value,
	onDec,
	onInc,
}: {
	value: number;
	onDec: () => void;
	onInc: () => void;
}) {
	return (
		<div className="inline-flex items-center rounded-full border border-cocoa-900/15 dark:border-white/15">
			<button
				onClick={onDec}
				className="flex h-7 w-7 items-center justify-center rounded-full text-cocoa-700 hover:bg-cream-200 dark:text-cream-200 dark:hover:bg-white/10"
				aria-label="Retirer un"
			>
				<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
					<path d="M6 12h12" strokeLinecap="round" />
				</svg>
			</button>
			<span className="w-7 text-center text-sm font-semibold tabular-nums text-cocoa-800 dark:text-cream-100">
				{value}
			</span>
			<button
				onClick={onInc}
				className="flex h-7 w-7 items-center justify-center rounded-full text-cocoa-700 hover:bg-cream-200 dark:text-cream-200 dark:hover:bg-white/10"
				aria-label="Ajouter un"
			>
				<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
					<path d="M12 6v12M6 12h12" strokeLinecap="round" />
				</svg>
			</button>
		</div>
	);
}

export function Cart({
	open,
	onClose,
	cart,
}: {
	open: boolean;
	onClose: () => void;
	cart: CartApi;
}) {
	const [phase, setPhase] = useState<"idle" | "sending" | "done">("idle");
	const [result, setResult] = useState<OrderResult | null>(null);
	const closeRef = useRef<HTMLButtonElement | null>(null);

	// Body scroll lock + Esc to close + focus management.
	useEffect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		const t = window.setTimeout(() => closeRef.current?.focus(), 60);
		return () => {
			document.body.style.overflow = prev;
			window.removeEventListener("keydown", onKey);
			window.clearTimeout(t);
		};
	}, [open, onClose]);

	// Reset the confirmation screen once the drawer is closed.
	useEffect(() => {
		if (!open) {
			const t = window.setTimeout(() => {
				setPhase("idle");
				setResult(null);
			}, 300);
			return () => window.clearTimeout(t);
		}
	}, [open]);

	const lines = cart.lines
		.map((l) => ({ line: l, treat: treatById(l.id) }))
		.filter((x): x is { line: typeof x.line; treat: NonNullable<typeof x.treat> } =>
			Boolean(x.treat),
		);

	async function checkout() {
		setPhase("sending");
		const payload = {
			items: lines.map(({ line, treat }) => ({
				id: treat.id,
				name: treat.name,
				quantity: line.quantity,
				price: treat.price,
			})),
			total: cart.total,
		};
		let data: OrderResult;
		try {
			const res = await fetch("/api/order", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error("bad status");
			data = (await res.json()) as OrderResult;
		} catch {
			data = {
				ok: true,
				reference: localReference(),
				itemCount: cart.count,
				total: cart.total,
				message: "Commande de démonstration (générée hors ligne).",
			};
		}
		setResult(data);
		setPhase("done");
		cart.clear();
	}

	return (
		<div
			className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
			aria-hidden={!open}
		>
			{/* backdrop */}
			<div
				onClick={onClose}
				className={`absolute inset-0 bg-cocoa-950/40 backdrop-blur-sm transition-opacity duration-300 ${
					open ? "opacity-100" : "opacity-0"
				}`}
			/>

			{/* panel */}
			<aside
				role="dialog"
				aria-modal="true"
				aria-label="Votre panier"
				className={`absolute right-0 top-0 flex h-full w-[min(26rem,100vw)] flex-col bg-cream-100 shadow-card transition-transform duration-300 ease-out dark:bg-cocoa-900 ${
					open ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<header className="flex items-center justify-between border-b border-cocoa-900/10 px-5 py-4 dark:border-white/10">
					<div>
						<h2 className="font-serif text-xl font-semibold text-cocoa-800 dark:text-cream-100">
							Votre panier
						</h2>
						<p className="text-xs text-cocoa-500 dark:text-cream-200/60">
							{cart.count > 0
								? `${cart.count} douceur${cart.count > 1 ? "s" : ""}`
								: "Encore vide"}
						</p>
					</div>
					<button
						ref={closeRef}
						onClick={onClose}
						className="btn-ghost !px-2.5 !py-2"
						aria-label="Fermer le panier"
					>
						<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
							<path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
						</svg>
					</button>
				</header>

				{/* Confirmation */}
				{phase === "done" && result ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
						<span className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-500 text-white">
							<svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
								<path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</span>
						<h3 className="font-serif text-2xl font-semibold text-cocoa-800 dark:text-cream-100">
							Merci !
						</h3>
						<p className="text-sm text-cocoa-600 dark:text-cream-200/70">
							Votre commande de démonstration est enregistrée sous la référence
						</p>
						<p className="rounded-full bg-honey-500/15 px-4 py-1.5 font-mono text-lg font-bold tracking-wider text-honey-700 dark:text-honey-300">
							{result.reference}
						</p>
						<p className="text-xs text-cocoa-500 dark:text-cream-200/50">
							{result.message}
						</p>
						<button onClick={onClose} className="btn-primary mt-2">
							Fermer
						</button>
					</div>
				) : lines.length === 0 ? (
					/* Empty state */
					<div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
						<TreatArt art="macaron" className="h-32 w-32 opacity-90" />
						<p className="text-cocoa-600 dark:text-cream-200/70">
							Votre panier attend ses premières douceurs.
						</p>
						<a href="#carte" onClick={onClose} className="btn-primary">
							Parcourir la carte
						</a>
					</div>
				) : (
					<>
						<div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
							{lines.map(({ line, treat }) => (
								<div
									key={treat.id}
									className="flex items-center gap-3 rounded-2xl border border-cocoa-900/10 bg-white/60 p-2.5 dark:border-white/10 dark:bg-white/[0.04]"
								>
									<TreatArt art={treat.illustration} className="h-16 w-16 shrink-0" />
									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between gap-2">
											<h3 className="truncate font-serif text-sm font-semibold text-cocoa-800 dark:text-cream-100">
												{treat.name}
											</h3>
											<button
												onClick={() => cart.remove(treat.id)}
												className="text-cocoa-400 hover:text-berry-500"
												aria-label={`Retirer ${treat.name}`}
											>
												<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
													<path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
												</svg>
											</button>
										</div>
										<p className="text-xs text-honey-700/80 dark:text-honey-300/70">
											{money(treat.price)}
										</p>
										<div className="mt-1.5 flex items-center justify-between">
											<Stepper
												value={line.quantity}
												onDec={() => cart.setQty(treat.id, line.quantity - 1)}
												onInc={() => cart.setQty(treat.id, line.quantity + 1)}
											/>
											<span className="font-serif text-sm font-semibold text-cocoa-800 dark:text-cream-100">
												{money(treat.price * line.quantity)}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>

						<footer className="border-t border-cocoa-900/10 px-5 py-4 dark:border-white/10">
							<div className="flex items-center justify-between">
								<span className="text-sm text-cocoa-600 dark:text-cream-200/70">
									Sous-total
								</span>
								<span className="font-serif text-xl font-semibold text-cocoa-800 dark:text-cream-100">
									{money(cart.total)}
								</span>
							</div>
							<p className="mt-1 text-[11px] text-cocoa-500 dark:text-cream-200/50">
								Paiement non réel — cette commande est une démonstration.
							</p>
							<button
								onClick={checkout}
								disabled={phase === "sending"}
								className="btn-primary mt-3 w-full"
							>
								{phase === "sending" ? (
									<>
										<svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
											<path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
										</svg>
										Envoi…
									</>
								) : (
									<>Passer commande</>
								)}
							</button>
							<button
								onClick={() => cart.clear()}
								className="mt-2 w-full text-center text-xs font-medium text-cocoa-500 hover:text-berry-500 dark:text-cream-200/50"
							>
								Vider le panier
							</button>
						</footer>
					</>
				)}
			</aside>
		</div>
	);
}
