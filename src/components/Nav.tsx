import { useEffect, useState } from "react";
import { Logo } from "./Decor";
import { site } from "../data/site";
import type { CartApi } from "../hooks/useCart";

const LINKS = [
	{ href: "#accueil", label: "Accueil" },
	{ href: "#carte", label: "La carte" },
	{ href: "#histoire", label: "Histoire" },
	{ href: "#galerie", label: "Galerie" },
	{ href: "#contact", label: "Contact" },
];

interface InstallApi {
	canInstall: boolean;
	promptInstall: () => void | Promise<void>;
}

export function Nav({
	cart,
	onOpenCart,
	install,
}: {
	cart: CartApi;
	onOpenCart: () => void;
	install: InstallApi;
}) {
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header
			className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
				scrolled
					? "border-b border-cocoa-900/10 bg-cream-100/85 backdrop-blur-md dark:border-white/10 dark:bg-cocoa-900/80"
					: "bg-transparent"
			}`}
		>
			<nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
				<a href="#accueil" className="flex items-center gap-2.5" aria-label={site.name}>
					<Logo className="h-9 w-9 rounded-xl shadow-soft" />
					<span className="flex flex-col leading-none">
						<span className="font-serif text-lg font-semibold text-cocoa-800 dark:text-cream-100">
							{site.name}
						</span>
						<span className="text-[10px] uppercase tracking-[0.22em] text-honey-700 dark:text-honey-300">
							{site.tagline}
						</span>
					</span>
				</a>

				<div className="hidden items-center gap-1 md:flex">
					{LINKS.map((l) => (
						<a
							key={l.href}
							href={l.href}
							className="rounded-full px-3 py-2 text-sm font-medium text-cocoa-700 transition-colors hover:bg-cream-200/70 hover:text-cocoa-900 dark:text-cream-200/80 dark:hover:bg-white/10 dark:hover:text-cream-50"
						>
							{l.label}
						</a>
					))}
				</div>

				<div className="flex items-center gap-2">
					{install.canInstall && (
						<button
							onClick={() => install.promptInstall()}
							className="btn-ghost hidden !px-3 !py-2 text-xs sm:inline-flex"
						>
							<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
								<path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							Installer
						</button>
					)}

					<button
						onClick={onOpenCart}
						className="btn-ghost relative !px-3 !py-2"
						aria-label={`Panier, ${cart.count} article${cart.count > 1 ? "s" : ""}`}
					>
						<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
							<path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
							<path d="M9 8a3 3 0 0 1 6 0" strokeLinecap="round" />
						</svg>
						{cart.count > 0 && (
							<span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-berry-500 px-1 text-[11px] font-bold text-white">
								{cart.count}
							</span>
						)}
					</button>

					<button
						onClick={() => setMenuOpen((o) => !o)}
						className="btn-ghost !px-2.5 !py-2 md:hidden"
						aria-label="Menu"
						aria-expanded={menuOpen}
					>
						<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
							{menuOpen ? (
								<path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
							) : (
								<path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
							)}
						</svg>
					</button>
				</div>
			</nav>

			{/* Mobile sheet */}
			<div
				className={`overflow-hidden border-t border-cocoa-900/10 bg-cream-100/95 backdrop-blur-md transition-[max-height,opacity] duration-300 dark:border-white/10 dark:bg-cocoa-900/95 md:hidden ${
					menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="flex flex-col px-4 py-2">
					{LINKS.map((l) => (
						<a
							key={l.href}
							href={l.href}
							onClick={() => setMenuOpen(false)}
							className="rounded-xl px-3 py-3 text-sm font-medium text-cocoa-700 hover:bg-cream-200 dark:text-cream-200 dark:hover:bg-white/10"
						>
							{l.label}
						</a>
					))}
					{install.canInstall && (
						<button
							onClick={() => {
								install.promptInstall();
								setMenuOpen(false);
							}}
							className="mt-1 rounded-xl px-3 py-3 text-left text-sm font-semibold text-honey-700 hover:bg-cream-200 dark:text-honey-300 dark:hover:bg-white/10"
						>
							Installer l'application
						</button>
					)}
				</div>
			</div>
		</header>
	);
}
