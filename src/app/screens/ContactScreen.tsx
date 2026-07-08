import { config } from "../../config";
import { Photo } from "../../lib/photo";
import { Icon } from "../../ui/Icon";

export function ContactScreen() {
	const { contact, brand } = config;
	const actions = [
		{ icon: "phone" as const, label: "Call", href: `tel:${contact.phone.replace(/[^+\d]/g, "")}` },
		{ icon: "whatsapp" as const, label: "WhatsApp", href: `https://wa.me/${contact.whatsapp}` },
		{ icon: "instagram" as const, label: "Instagram", href: `https://instagram.com/${contact.instagram.replace(/^@/, "")}` },
		{ icon: "pin" as const, label: "Map", href: `https://maps.google.com/?q=${encodeURIComponent(contact.mapQuery)}` },
	];

	return (
		<div className="animate-fade-in">
			<div className="relative">
				<Photo src="bakery,shopfront,cafe" alt={brand.name} width={800} height={420} eager className="h-44 w-full" />
				<div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
				<div className="absolute inset-x-0 bottom-0 p-5">
					<p className="kicker">Visit</p>
					<h1 className="mt-1 font-display text-3xl text-ink">{brand.name}</h1>
				</div>
			</div>

			<div className="screen-pad space-y-5 pt-5">
				<div className="grid grid-cols-4 gap-2">
					{actions.map((a) => (
						<a
							key={a.label}
							href={a.href}
							target="_blank"
							rel="noopener noreferrer"
							className="flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-surface py-3 text-[11px] font-semibold text-muted transition-colors hover:border-gold/40 hover:text-gold"
						>
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/12 text-gold"><Icon name={a.icon} className="h-5 w-5" /></span>
							{a.label}
						</a>
					))}
				</div>

				<div className="card p-4">
					<h2 className="font-display text-lg text-ink">Opening hours</h2>
					<ul className="mt-2 divide-y divide-line">
						{contact.hours.map((h) => (
							<li key={h.day} className="flex items-center justify-between py-2.5 text-sm">
								<span className="text-muted">{h.day}</span>
								<span className={h.value === "Closed" ? "text-accent" : "text-ink"}>{h.value}</span>
							</li>
						))}
					</ul>
				</div>

				<div className="card space-y-2 p-4 text-sm text-muted">
					<p className="flex items-center gap-2"><Icon name="pin" className="h-4 w-4 text-gold" />{contact.address} · {contact.area}</p>
					<p className="flex items-center gap-2"><Icon name="phone" className="h-4 w-4 text-gold" />{contact.phone}</p>
					<p className="flex items-center gap-2"><Icon name="user" className="h-4 w-4 text-gold" />{contact.email}</p>
					<p className="pt-1 text-[11px] italic text-muted/80">{contact.note}</p>
				</div>
			</div>
		</div>
	);
}
