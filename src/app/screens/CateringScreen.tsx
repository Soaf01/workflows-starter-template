import { useState } from "react";
import { money } from "../../config";
import { Photo } from "../../lib/photo";
import { useI18n } from "../../i18n/lang";

export function CateringScreen() {
	const { t, cfg } = useI18n();
	const { catering } = cfg;
	const [sent, setSent] = useState(false);
	const [form, setForm] = useState({ name: "", email: "", date: "", guests: "", message: "" });
	const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
		setForm((f) => ({ ...f, [k]: e.target.value }));

	return (
		<div className="screen-pad animate-fade-in pt-4">
			<p className="kicker">{catering.kicker}</p>
			<h1 className="mt-1 font-display text-3xl font-bold text-ink">{catering.title}</h1>
			<p className="mt-2 text-sm text-muted">{catering.intro}</p>

			<div className="mt-5 space-y-4">
				{catering.packages.map((p) => (
					<article key={p.id} className="card overflow-hidden">
						<div className="relative">
							<Photo src={p.image} alt={p.name} width={800} height={420} className="h-40 w-full" />
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
							<div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
								<div>
									<h3 className="font-display text-xl font-bold text-ink">{p.name}</h3>
									<p className="text-xs text-muted">{t("catering.serves", { n: p.serves })}</p>
								</div>
								<span className="rounded-full bg-black/50 px-3 py-1 font-mono text-sm text-gold backdrop-blur-sm">{t("catering.from")} {money(p.price)}</span>
							</div>
						</div>
						<ul className="grid grid-cols-1 gap-1.5 p-4">
							{p.items.map((it) => (
								<li key={it} className="flex items-center gap-2 text-sm text-muted"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{it}</li>
							))}
						</ul>
					</article>
				))}
			</div>

			<div className="card mt-6 p-4">
				<h2 className="font-display text-xl font-bold text-ink">{t("catering.requestQuote")}</h2>
				{sent ? (
					<div className="mt-3 flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-3 text-sm text-ink"><span className="text-gold">✓</span>{t("catering.thanks")}</div>
				) : (
					<div className="mt-3 space-y-3">
						<input className="field" placeholder={t("common.name")} value={form.name} onChange={set("name")} />
						<input className="field" placeholder={t("common.email")} inputMode="email" value={form.email} onChange={set("email")} />
						<div className="grid grid-cols-2 gap-3">
							<input className="field" placeholder={t("catering.date")} value={form.date} onChange={set("date")} />
							<input className="field" placeholder={t("catering.guests")} inputMode="numeric" value={form.guests} onChange={set("guests")} />
						</div>
						<textarea className="field resize-none" rows={3} placeholder={t("catering.eventMsg")} value={form.message} onChange={set("message")} />
						<button onClick={() => form.name && form.email && setSent(true)} disabled={!form.name || !form.email} className="btn-primary w-full">{t("catering.sendRequest")}</button>
					</div>
				)}
			</div>
		</div>
	);
}
