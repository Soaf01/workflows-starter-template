import { useState } from "react";
import { Reveal } from "./Reveal";
import { site } from "../data/site";

function Awning({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 320 60" className={className} preserveAspectRatio="none" aria-hidden="true">
			<rect width="320" height="18" fill="#c64b6e" />
			{Array.from({ length: 8 }).map((_, i) => (
				<rect key={i} x={i * 40} width="20" height="18" fill="#fbf6ec" opacity="0.85" />
			))}
			{Array.from({ length: 8 }).map((_, i) => (
				<path key={i} d={`M${i * 40} 18 h40 l-20 24 z`} fill={i % 2 ? "#fbf6ec" : "#c64b6e"} />
			))}
		</svg>
	);
}

export function Contact({ onOpenCart }: { onOpenCart: () => void }) {
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [sent, setSent] = useState(false);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !message.trim()) return;
		setSent(true);
		setName("");
		setMessage("");
		window.setTimeout(() => setSent(false), 4000);
	};

	return (
		<section
			id="contact"
			className="section-pad relative overflow-hidden bg-gradient-to-b from-cream-100 to-cream-200/60 dark:from-cocoa-900 dark:to-cocoa-950"
		>
			<div className="mx-auto max-w-6xl">
				<Reveal className="mx-auto max-w-2xl text-center">
					<p className="eyebrow justify-center">Nous trouver</p>
					<h2 className="mt-3 text-balance font-serif text-3xl font-semibold text-cocoa-800 dark:text-cream-50 sm:text-4xl">
						Poussez la porte de l'atelier
					</h2>
					<p className="mt-3 text-cocoa-600 dark:text-cream-200/70">
						Horaires, adresse et contact ci-dessous sont fictifs : remplacez-les par
						les vôtres pour donner vie à votre maison.
					</p>
				</Reveal>

				<div className="mt-10 grid gap-6 lg:grid-cols-2">
					{/* Hours & coordinates */}
					<Reveal>
						<div className="card overflow-hidden shadow-soft">
							<Awning className="h-9 w-full" />
							<div className="p-6">
								<h3 className="font-serif text-xl font-semibold text-cocoa-800 dark:text-cream-100">
									Horaires
								</h3>
								<ul className="mt-3 divide-y divide-cocoa-900/10 dark:divide-white/10">
									{site.hours.map((h) => (
										<li key={h.day} className="flex items-center justify-between py-2.5 text-sm">
											<span className="font-medium text-cocoa-700 dark:text-cream-200/80">
												{h.day}
											</span>
											<span
												className={
													h.value === "Fermé"
														? "text-berry-500"
														: "text-cocoa-600 dark:text-cream-200/70"
												}
											>
												{h.value}
											</span>
										</li>
									))}
								</ul>

								<div className="mt-5 space-y-2 text-sm text-cocoa-600 dark:text-cream-200/70">
									<p className="flex items-center gap-2">
										<svg viewBox="0 0 24 24" className="h-4 w-4 text-honey-600" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
											<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" strokeLinejoin="round" />
											<circle cx="12" cy="10" r="2.2" />
										</svg>
										{site.contact.address} · {site.contact.city}
									</p>
									<p className="flex items-center gap-2">
										<svg viewBox="0 0 24 24" className="h-4 w-4 text-honey-600" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
											<path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" strokeLinejoin="round" />
										</svg>
										{site.contact.phone}
									</p>
									<p className="flex items-center gap-2">
										<svg viewBox="0 0 24 24" className="h-4 w-4 text-honey-600" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
											<rect x="3" y="5" width="18" height="14" rx="2" />
											<path d="M4 7l8 6 8-6" />
										</svg>
										{site.contact.email}
									</p>
									<p className="pt-1 text-xs italic text-cocoa-500/80 dark:text-cream-200/50">
										{site.contact.note}
									</p>
								</div>
							</div>
						</div>
					</Reveal>

					{/* Message + order CTA */}
					<Reveal delay={120}>
						<div className="card flex h-full flex-col p-6 shadow-soft">
							<h3 className="font-serif text-xl font-semibold text-cocoa-800 dark:text-cream-100">
								Écrire un petit mot
							</h3>
							<form onSubmit={submit} className="mt-3 flex flex-1 flex-col gap-3">
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Votre nom"
									className="rounded-2xl border border-cocoa-900/15 bg-white/70 px-4 py-3 text-sm text-cocoa-800 outline-none transition-colors placeholder:text-cocoa-400 focus:border-honey-500 dark:border-white/10 dark:bg-white/5 dark:text-cream-100"
									aria-label="Votre nom"
								/>
								<textarea
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder="Une envie, une occasion, un mot doux…"
									rows={4}
									className="flex-1 resize-none rounded-2xl border border-cocoa-900/15 bg-white/70 px-4 py-3 text-sm text-cocoa-800 outline-none transition-colors placeholder:text-cocoa-400 focus:border-honey-500 dark:border-white/10 dark:bg-white/5 dark:text-cream-100"
									aria-label="Votre message"
								/>
								<div className="flex flex-wrap items-center gap-3">
									<button type="submit" className="btn-primary">
										Envoyer le mot
									</button>
									<button type="button" onClick={onOpenCart} className="btn-ghost">
										Voir mon panier
									</button>
									{sent && (
										<span className="text-sm font-medium text-sage-500">
											Merci ! (message de démonstration)
										</span>
									)}
								</div>
							</form>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
