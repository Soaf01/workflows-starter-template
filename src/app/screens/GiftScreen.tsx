import { useState } from "react";
import { money } from "../../config";
import { Photo } from "../../lib/photo";
import { useI18n } from "../../i18n/lang";

export function GiftScreen() {
	const { t, cfg } = useI18n();
	const { giftCards, brand } = cfg;
	const [amount, setAmount] = useState(giftCards.denominations[1] ?? giftCards.denominations[0]);
	const [to, setTo] = useState("");
	const [msg, setMsg] = useState("");
	const [sent, setSent] = useState(false);

	return (
		<div className="screen-pad animate-fade-in pt-4">
			<p className="kicker">{giftCards.kicker}</p>
			<h1 className="mt-1 font-display text-3xl font-bold text-ink">{giftCards.title}</h1>
			<p className="mt-2 text-sm text-muted">{giftCards.intro}</p>

			<div className="relative mt-5 overflow-hidden rounded-app border border-line">
				<Photo src={giftCards.image} alt="Gift card" width={800} height={480} className="h-48 w-full" />
				<div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/30 to-black/70" />
				<div className="absolute inset-0 flex flex-col justify-between p-5">
					<div className="flex items-center justify-between">
						<span className="font-display text-lg font-bold text-ink">{brand.name}</span>
						<span className="font-mono text-xs uppercase tracking-widest text-gold">{giftCards.kicker}</span>
					</div>
					<div>
						<p className="font-mono text-4xl font-semibold text-ink">{money(amount)}</p>
						<p className="text-xs text-muted">{brand.tagline}</p>
					</div>
				</div>
			</div>

			{sent ? (
				<div className="card mt-6 flex flex-col items-center gap-2 p-6 text-center">
					<span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "linear-gradient(180deg,var(--gold-soft),var(--gold))" }}>
						<svg viewBox="0 0 24 24" className="h-7 w-7 text-[#241a10]" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true"><path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" /></svg>
					</span>
					<h2 className="font-display text-xl font-bold text-ink">{t("gift.onWay")}</h2>
					<p className="text-sm text-muted">{t("gift.demoTo", { amount: money(amount), who: to || t("gift.recipientFallback") })}</p>
					<button onClick={() => setSent(false)} className="btn-ghost mt-2">{t("gift.sendAnother")}</button>
				</div>
			) : (
				<div className="mt-6 space-y-4">
					<div>
						<p className="mb-2 text-sm font-semibold text-ink">{t("gift.amount")}</p>
						<div className="grid grid-cols-4 gap-2">
							{giftCards.denominations.map((d) => (
								<button key={d} onClick={() => setAmount(d)} className={`rounded-2xl border py-3 text-sm font-semibold transition-colors ${amount === d ? "border-transparent text-[#241a10]" : "border-line text-muted"}`} style={amount === d ? { background: "linear-gradient(180deg,var(--gold-soft),var(--gold))" } : undefined}>{money(d)}</button>
							))}
						</div>
					</div>
					<input className="field" placeholder={t("gift.recipient")} inputMode="email" value={to} onChange={(e) => setTo(e.target.value)} />
					<textarea className="field resize-none" rows={2} placeholder={t("gift.message")} value={msg} onChange={(e) => setMsg(e.target.value)} />
					<button onClick={() => setSent(true)} className="btn-primary w-full">{t("gift.send")} · {money(amount)}</button>
					<p className="text-center text-[11px] text-muted">{giftCards.note}</p>
				</div>
			)}
		</div>
	);
}
