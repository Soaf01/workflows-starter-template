import { Logo } from "./Decor";
import { site } from "../data/site";

interface InstallApi {
	canInstall: boolean;
	installed: boolean;
	promptInstall: () => void | Promise<void>;
}

const LINKS = [
	{ href: "#accueil", label: "Accueil" },
	{ href: "#carte", label: "La carte" },
	{ href: "#histoire", label: "Histoire" },
	{ href: "#galerie", label: "Galerie" },
	{ href: "#contact", label: "Contact" },
];

export function Footer({ install }: { install: InstallApi }) {
	return (
		<footer className="relative overflow-hidden bg-cocoa-900 text-cream-200 dark:bg-cocoa-950">
			<div className="paper-texture pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden="true" />
			<div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8">
				<div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
					<div>
						<div className="flex items-center gap-3">
							<Logo className="h-11 w-11 rounded-xl" />
							<div>
								<p className="font-serif text-xl font-semibold text-cream-50">
									{site.name}
								</p>
								<p className="text-xs uppercase tracking-[0.22em] text-honey-300">
									{site.tagline}
								</p>
							</div>
						</div>
						<p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-200/70">
							{site.intro}
						</p>
					</div>

					<nav aria-label="Pied de page">
						<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-honey-300">
							Explorer
						</h3>
						<ul className="mt-3 space-y-2">
							{LINKS.map((l) => (
								<li key={l.href}>
									<a
										href={l.href}
										className="text-sm text-cream-200/75 transition-colors hover:text-honey-300"
									>
										{l.label}
									</a>
								</li>
							))}
						</ul>
					</nav>

					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-honey-300">
							Application
						</h3>
						<p className="mt-3 text-sm text-cream-200/70">
							Installez la maison sur votre écran d'accueil : rapide, hors-ligne,
							sans magasin d'applications.
						</p>
						{install.installed ? (
							<span className="mt-3 inline-flex items-center gap-2 rounded-full bg-sage-500/20 px-3 py-1.5 text-xs font-semibold text-sage-300">
								<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
									<path d="M5 12l5 5 9-11" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								Installée
							</span>
						) : install.canInstall ? (
							<button
								onClick={() => install.promptInstall()}
								className="mt-3 inline-flex items-center gap-2 rounded-full bg-honey-500 px-4 py-2 text-sm font-semibold text-cocoa-900 transition-colors hover:bg-honey-400"
							>
								<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
									<path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								Installer l'app
							</button>
						) : (
							<div className="mt-3 flex flex-wrap gap-2">
								{["Hors-ligne", "Installable", "Léger"].map((b) => (
									<span
										key={b}
										className="rounded-full border border-white/15 px-3 py-1 text-xs text-cream-200/70"
									>
										{b}
									</span>
								))}
							</div>
						)}
					</div>
				</div>

				<div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-cream-200/50 sm:flex-row sm:text-left">
					<p>
						© {site.name} — modèle générique de démonstration. Marque, textes et
						images entièrement fictifs.
					</p>
					<p>Fait main, sans photo ni son extérieur.</p>
				</div>
			</div>
		</footer>
	);
}
