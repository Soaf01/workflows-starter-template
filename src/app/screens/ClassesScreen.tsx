import { useState } from "react";
import { config, money } from "../../config";
import { Photo } from "../../lib/photo";
import { Icon } from "../../ui/Icon";
import { Sheet } from "../../ui/Sheet";
import type { ClassItem } from "../../config/types";

export function ClassesScreen() {
	const { classes } = config;
	const [selected, setSelected] = useState<ClassItem | null>(null);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [booked, setBooked] = useState(false);

	const close = () => {
		setSelected(null);
		window.setTimeout(() => {
			setBooked(false);
			setName("");
			setEmail("");
		}, 300);
	};

	return (
		<div className="screen-pad animate-fade-in pt-4">
			<p className="kicker">{classes.kicker}</p>
			<h1 className="mt-1 font-display text-3xl text-ink">{classes.title}</h1>
			<p className="mt-2 text-sm text-muted">{classes.intro}</p>

			<div className="mt-5 space-y-4">
				{classes.items.map((c) => (
					<article key={c.id} className="card overflow-hidden">
						<Photo src={c.image} alt={c.title} width={800} height={400} className="h-40 w-full" />
						<div className="p-4">
							<div className="flex items-start justify-between gap-2">
								<h3 className="font-display text-lg text-ink">{c.title}</h3>
								<span className="font-mono text-sm text-gold">{money(c.price)}</span>
							</div>
							<p className="mt-1 text-sm text-muted">{c.description}</p>
							<div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted">
								<span className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1"><Icon name="clock" className="h-3.5 w-3.5" />{c.date}</span>
								<span className="rounded-full border border-line px-2.5 py-1">{c.duration}</span>
								<span className="rounded-full border border-line px-2.5 py-1">{c.level}</span>
								<span className="rounded-full border border-line px-2.5 py-1">{c.spots} spots</span>
							</div>
							<button onClick={() => setSelected(c)} className="btn-primary mt-4 w-full">Book a seat</button>
						</div>
					</article>
				))}
			</div>

			<Sheet
				open={!!selected}
				onClose={close}
				title={booked ? undefined : selected ? "Book a seat" : undefined}
				footer={
					booked ? null : (
						<button
							onClick={() => name && email && setBooked(true)}
							disabled={!name || !email}
							className="btn-primary w-full"
						>
							Confirm booking
						</button>
					)
				}
			>
				{booked ? (
					<div className="flex flex-col items-center gap-3 py-8 text-center">
						<span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "linear-gradient(180deg,var(--gold-soft),var(--gold))" }}>
							<svg viewBox="0 0 24 24" className="h-7 w-7 text-[#241a10]" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true"><path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" /></svg>
						</span>
						<h2 className="font-display text-xl text-ink">Seat reserved</h2>
						<p className="text-sm text-muted">{selected?.title} · {selected?.date}</p>
						<p className="text-xs text-muted">Demo booking — we'll “email” {email}.</p>
						<button onClick={close} className="btn-ghost mt-2">Close</button>
					</div>
				) : (
					<div className="space-y-3 py-1">
						{selected && (
							<div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
								<Photo src={selected.image} alt={selected.title} width={120} height={120} className="h-14 w-14 rounded-xl" rounded="rounded-xl" />
								<div>
									<p className="font-display text-ink">{selected.title}</p>
									<p className="text-xs text-muted">{selected.date} · {money(selected.price)}</p>
								</div>
							</div>
						)}
						<input className="field" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
						<input className="field" placeholder="Email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} />
						<p className="text-[11px] text-muted">This is a demonstration — no payment is taken.</p>
					</div>
				)}
			</Sheet>
		</div>
	);
}
