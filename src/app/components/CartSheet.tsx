import { useEffect, useState } from "react";
import { config, money, productById } from "../../config";
import { Photo } from "../../lib/photo";
import { Sheet } from "../../ui/Sheet";
import { Stepper } from "../../ui/Stepper";
import { useApp } from "../appContext";
import type { OrderResult } from "../../types";

function localReference() {
	const a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
	let s = "";
	for (let i = 0; i < 6; i++) s += a[Math.floor(Math.random() * a.length)];
	return `${config.brand.monogram}${config.slug.slice(0, 1).toUpperCase()}-${s}`;
}

const WA_GREEN = "#25d366";

export function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
	const { cart } = useApp();
	const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
	const [result, setResult] = useState<OrderResult | null>(null);
	const [sending, setSending] = useState(false);

	// checkout fields
	const [mode, setMode] = useState<"pickup" | "delivery">("pickup");
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [time, setTime] = useState("As soon as possible");
	const [notes, setNotes] = useState("");

	useEffect(() => {
		if (!open) {
			const t = window.setTimeout(() => {
				setStep("cart");
				setResult(null);
				setSending(false);
			}, 300);
			return () => window.clearTimeout(t);
		}
	}, [open]);

	const lines = cart.lines
		.map((l) => ({ l, p: productById(l.id) }))
		.filter((x): x is { l: typeof x.l; p: NonNullable<typeof x.p> } => Boolean(x.p));

	const orderText = () => {
		const items = lines
			.map(({ l, p }) => `• ${l.quantity}× ${p.name} — ${money(p.price * l.quantity)}`)
			.join("\n");
		return (
			`Hello ${config.brand.name}! I'd like to order:\n${items}\n\n` +
			`Total: ${money(cart.total)}\n` +
			`${mode === "pickup" ? "Pickup" : "Delivery"}${mode === "delivery" && address ? ` to ${address}` : ""}\n` +
			`When: ${time}\n` +
			(name ? `Name: ${name}\n` : "") +
			(phone ? `Phone: ${phone}\n` : "") +
			(notes ? `Notes: ${notes}` : "")
		);
	};

	const orderOnWhatsApp = () => {
		const url = `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(orderText())}`;
		window.open(url, "_blank", "noopener");
	};

	const placeOrder = async () => {
		setSending(true);
		const payload = {
			items: lines.map(({ l, p }) => ({ id: p.id, name: p.name, quantity: l.quantity, price: p.price })),
			total: cart.total,
			mode,
			name,
			phone,
		};
		let data: OrderResult;
		try {
			const res = await fetch("/api/order", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error("bad");
			data = (await res.json()) as OrderResult;
		} catch {
			data = {
				ok: true,
				reference: localReference(),
				itemCount: cart.count,
				total: cart.total,
				message: "Demo order confirmed offline.",
			};
		}
		setResult(data);
		setStep("done");
		setSending(false);
		cart.clear();
	};

	// ── content per step ─────────────────────────────────────────────
	let title = "Your bag";
	let body: React.ReactNode;
	let footer: React.ReactNode = null;

	if (step === "done" && result) {
		title = "";
		body = (
			<div className="flex flex-col items-center gap-3 py-8 text-center">
				<span className="flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "linear-gradient(180deg,var(--gold-soft),var(--gold))" }}>
					<svg viewBox="0 0 24 24" className="h-8 w-8 text-[#241a10]" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
						<path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</span>
				<h2 className="font-display text-2xl text-ink">Thank you!</h2>
				<p className="text-sm text-muted">Your demo order is confirmed. Reference:</p>
				<p className="rounded-full bg-gold/12 px-4 py-1.5 font-mono text-lg font-bold tracking-wider text-gold">
					{result.reference}
				</p>
				<p className="text-xs text-muted">{result.message}</p>
				<button onClick={onClose} className="btn-primary mt-2">Done</button>
			</div>
		);
	} else if (lines.length === 0) {
		body = (
			<div className="flex flex-col items-center gap-3 py-10 text-center">
				<span className="flex h-16 w-16 items-center justify-center rounded-full border border-line text-gold">
					<svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
						<path d="M6 8h12l-1 12H7L6 8zM9 8a3 3 0 0 1 6 0" strokeLinejoin="round" />
					</svg>
				</span>
				<p className="text-muted">Your bag is empty.</p>
				<button onClick={onClose} className="btn-ghost">Browse the menu</button>
			</div>
		);
	} else if (step === "cart") {
		body = (
			<div className="space-y-3 py-1">
				{lines.map(({ l, p }) => (
					<div key={p.id} className="flex gap-3 rounded-2xl border border-line bg-surface p-2.5">
						<Photo src={p.image} alt={p.name} width={160} height={160} className="h-16 w-16 shrink-0 rounded-xl" rounded="rounded-xl" />
						<div className="min-w-0 flex-1">
							<div className="flex items-start justify-between gap-2">
								<h3 className="truncate font-display text-[15px] text-ink">{p.name}</h3>
								<button onClick={() => cart.remove(p.id)} className="text-muted hover:text-accent" aria-label={`Remove ${p.name}`}>
									<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
										<path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
									</svg>
								</button>
							</div>
							<div className="mt-1.5 flex items-center justify-between">
								<Stepper size="sm" value={l.quantity} onDec={() => cart.setQty(p.id, l.quantity - 1)} onInc={() => cart.setQty(p.id, l.quantity + 1)} />
								<span className="font-mono text-sm font-semibold text-gold">{money(p.price * l.quantity)}</span>
							</div>
						</div>
					</div>
				))}
			</div>
		);
		footer = (
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<span className="text-sm text-muted">Subtotal</span>
					<span className="font-display text-xl text-ink">{money(cart.total)}</span>
				</div>
				<div className="flex gap-2">
					<button onClick={() => setStep("checkout")} className="btn-primary flex-1">Checkout</button>
					<button
						onClick={orderOnWhatsApp}
						className="btn text-white"
						style={{ background: WA_GREEN }}
						aria-label="Order on WhatsApp"
					>
						<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
							<path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm5.5 14c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .2-3.2-.7-2.7-1.1-4.4-3.9-4.5-4.1-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2 1.3 2.3 1.1l.6-.7c.2-.3.4-.2.7-.1l1.8.9c.2.1.4.2.5.3 0 .2 0 .8-.2 1.3z" />
						</svg>
						WhatsApp
					</button>
				</div>
			</div>
		);
	} else {
		// checkout
		title = "Checkout";
		body = (
			<div className="space-y-4 py-1">
				<div className="grid grid-cols-2 gap-2">
					{(["pickup", "delivery"] as const).map((m) => (
						<button
							key={m}
							onClick={() => setMode(m)}
							className={`rounded-2xl border px-3 py-3 text-sm font-semibold capitalize transition-colors ${
								mode === m ? "border-gold bg-gold/10 text-gold" : "border-line text-muted"
							}`}
						>
							{m}
						</button>
					))}
				</div>
				<input className="field" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
				<input className="field" placeholder="Phone" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
				{mode === "delivery" && (
					<input className="field" placeholder="Delivery address" value={address} onChange={(e) => setAddress(e.target.value)} />
				)}
				<select className="field appearance-none" value={time} onChange={(e) => setTime(e.target.value)}>
					<option>As soon as possible</option>
					<option>In 1 hour</option>
					<option>This afternoon</option>
					<option>Tomorrow morning</option>
				</select>
				<textarea className="field resize-none" rows={2} placeholder="Notes (allergies, message…)" value={notes} onChange={(e) => setNotes(e.target.value)} />
				<p className="text-[11px] text-muted">Payment is not real — this is a demonstration checkout.</p>
			</div>
		);
		footer = (
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<span className="text-sm text-muted">Total</span>
					<span className="font-display text-xl text-ink">{money(cart.total)}</span>
				</div>
				<button onClick={placeOrder} disabled={sending} className="btn-primary w-full">
					{sending ? "Placing…" : "Place order"}
				</button>
				<button onClick={() => setStep("cart")} className="w-full text-center text-xs font-medium text-muted hover:text-ink">
					← Back to bag
				</button>
			</div>
		);
	}

	return (
		<Sheet open={open} onClose={onClose} title={title || undefined} footer={footer}>
			{body}
		</Sheet>
	);
}
