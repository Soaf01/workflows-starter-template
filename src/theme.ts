import { config } from "./config";
import type { ThemeColors } from "./config/types";

function hexToRgb(hex: string): string | null {
	const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
	if (!m) return null;
	const n = parseInt(m[1], 16);
	return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

const THEME_KEY = `${config.slug}-theme`;

/** Apply a theme's colours as CSS variables (full value + RGB-channel twin). */
export function applyThemeColors(c: ThemeColors) {
	const root = document.documentElement;
	const colors: [string, string][] = [
		["--bg", c.bg],
		["--bg-elevated", c.bgElevated],
		["--surface", c.surface],
		["--surface-alt", c.surfaceAlt],
		["--text", c.text],
		["--text-muted", c.textMuted],
		["--gold", c.gold],
		["--gold-soft", c.goldSoft],
		["--accent", c.accent],
	];
	for (const [name, value] of colors) {
		root.style.setProperty(name, value);
		const rgb = hexToRgb(value);
		if (rgb) root.style.setProperty(`${name}-rgb`, rgb);
	}
	root.style.setProperty("--line", c.line);
	root.style.setProperty("--radius", c.radius);
	root.dataset.mode = c.mode;
	root.style.colorScheme = c.mode;
	document.querySelector('meta[name="theme-color"]')?.setAttribute("content", c.bg);
}

let fontsInjected = false;
export function applyFonts() {
	const root = document.documentElement;
	root.style.setProperty("--font-display", config.fonts.display);
	root.style.setProperty("--font-body", config.fonts.body);
	root.style.setProperty("--font-mono", config.fonts.mono);
	if (config.fonts.href && !fontsInjected) {
		fontsInjected = true;
		const link = document.createElement("link");
		link.id = "client-fonts";
		link.rel = "stylesheet";
		link.href = config.fonts.href;
		document.head.appendChild(link);
	}
}

export function getInitialThemeId(): string {
	try {
		const saved = localStorage.getItem(THEME_KEY);
		if (saved && config.themes.some((t) => t.id === saved)) return saved;
	} catch {
		/* ignore */
	}
	return config.defaultThemeId;
}

export function persistThemeId(id: string) {
	try {
		localStorage.setItem(THEME_KEY, id);
	} catch {
		/* ignore */
	}
}

/** Applied once, synchronously, before React renders (from main.tsx). */
export function bootstrapTheme() {
	applyFonts();
	const id = getInitialThemeId();
	const theme = config.themes.find((t) => t.id === id) ?? config.themes[0];
	applyThemeColors(theme.colors);
	document.title = `${config.brand.name} — ${config.brand.tagline}`;
}
