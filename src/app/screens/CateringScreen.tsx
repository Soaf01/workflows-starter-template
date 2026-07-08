import { useState } from "react";
import { config, money } from "../../config";
import { Photo } from "../../lib/photo";

export function CateringScreen() {
	const { catering } = config;
	const [sent, setSent] = useState(false);
	const [form, setForm] = useState({ name: "", email: "", date: "", guests: "", message: "" });
	const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
		setForm((f) => ({ ...f, [k]: e.target.value }));

	return (
		<div className="screen-pad animate-fade-in pt-4">
			<p className="kicker">{catering.kicker}</p>
			<h1 className="mt-1 font-display text-3xl text-ink">{catering.title}</h1>
			<p className="mt-2 text-sm text-muted">{catering.intro}</p>

			<div className="mt-5 space-y-4">
				{catering.packages.map((p) => (
					<article key={p.id} className="card overflow-hidden">
						<div className="relative">
							<Photo src={p.image} alt={p.name} width={800} height={420} className="h-40 w-full" />
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
							<div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
								<div>
									<h3 className="font-display text-xl text-ink">{p.name}</h3>
									<p className="text-xs text-muted">Serves {p.serves}</p>
								</div>
								<span className="rounded-full bg-black/50 px-3 py-1 font-mono text-sm text-gold backdrop-blur-sm">from {money(p.price)}</span>
							</div>
						</div>
						<ul className="grid grid-cols-1 gap-1.5 p-4">
							{p.items.map((it) => (
								<li key={it} className="flex items-center gap-2 text-sm text-muted">
									<span className="h-1.5 w-1.5 rounded-full bg-gold" />
									{it}
								</li>
							))}
						</ul>
					</article>
				))}
			</div>

			{/* Request form */}
			<div className="card mt-6 p-4">
				<h2 className="font-display text-xl text-ink">Request a quote</h2>
				{sent ? (
					<div className="mt-3 flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-3 text-sm text-ink">
						<span className="text-gold">✓</span>
						Thanks! Your demo request is in — we'll be in touch.
					</div>
				) : (
					<div className="mt-3 space-y-3">
						<input className="field" placeholder="Your name" value={form.name} onChange={set("name")} />
						<input className="field" placeholder="Email" inputMode="email" value={form.email} onChange={set("email")} />
						<div className="grid grid-cols-2 gap-3">
							<input className="field" placeholder="Date" value={form.date} onChange={set("date")} />
							<input className="field" placeholder="Guests" inputMode="numeric" value={form.guests} onChange={set("guests")} />
						</div>
						<textarea className="field resize-none" rows={3} placeholder="Tell us about your event…" value={form.message} onChange={set("message")} />
						<button
							onClick={() => form.name && form.email && setSent(true)}
							disabled={!form.name || !form.email}
							className="btn-primary w-full"
						>
							Send request
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
