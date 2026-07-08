import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { config } from "./config";

function hexToRgb(hex: string): string | null {
	const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
	if (!m) return null;
	const n = parseInt(m[1], 16);
	return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** Apply the active client's theme (CSS variables) + document metadata. */
function applyClientTheme() {
	const root = document.documentElement;
	const t = config.theme;

	// Colours: set the full value plus an RGB-channel twin (for opacity utils).
	const colors: [string, string][] = [
		["--bg", t.bg],
		["--bg-elevated", t.bgElevated],
		["--surface", t.surface],
		["--surface-alt", t.surfaceAlt],
		["--text", t.text],
		["--text-muted", t.textMuted],
		["--gold", t.gold],
		["--gold-soft", t.goldSoft],
		["--accent", t.accent],
	];
	for (const [name, value] of colors) {
		root.style.setProperty(name, value);
		const rgb = hexToRgb(value);
		if (rgb) root.style.setProperty(`${name}-rgb`, rgb);
	}

	const others: Record<string, string> = {
		"--line": t.line,
		"--radius": t.radius,
		"--font-display": t.fontDisplay,
		"--font-body": t.fontBody,
		"--font-mono": t.fontMono,
	};
	for (const [k, v] of Object.entries(others)) root.style.setProperty(k, v);

	document.title = `${config.brand.name} — ${config.brand.tagline}`;
	document
		.querySelector('meta[name="theme-color"]')
		?.setAttribute("content", t.bg);

	if (t.fontsHref && !document.getElementById("client-fonts")) {
		const link = document.createElement("link");
		link.id = "client-fonts";
		link.rel = "stylesheet";
		link.href = t.fontsHref;
		document.head.appendChild(link);
	}
}

applyClientTheme();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);

// Fade out the pre-hydration splash.
const splash = document.getElementById("app-splash");
if (splash) {
	requestAnimationFrame(() => {
		splash.style.opacity = "0";
		window.setTimeout(() => splash.remove(), 500);
	});
}

// Service worker for offline support (production only).
if ("serviceWorker" in navigator && import.meta.env.PROD) {
	window.addEventListener("load", () => {
		navigator.serviceWorker.register("/sw.js").catch(() => {
			/* progressive enhancement */
		});
	});
}
