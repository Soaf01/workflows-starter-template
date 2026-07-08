/**
 * Regenerates the app icon set from a single source design.
 *   node scripts/generate-icons.mjs   (or: npm run icons)
 *
 * A brand-neutral gold "wheat ear" mark on a dark tile — swap the colours or
 * the mark to match a client. Writes public/favicon.svg + PNG PWA icons.
 * Requires `sharp` (dev-only). No external images.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const GOLD = "#d9b26a";
const GOLD_SOFT = "#eccd84";
const GOLD_DEEP = "#b6893f";

const defs = `
	<defs>
		<radialGradient id="tile" cx="42%" cy="34%" r="80%">
			<stop offset="0%" stop-color="#2a1f16" />
			<stop offset="60%" stop-color="#15100b" />
			<stop offset="100%" stop-color="#0c0906" />
		</radialGradient>
		<linearGradient id="grain" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="${GOLD_SOFT}" />
			<stop offset="100%" stop-color="${GOLD_DEEP}" />
		</linearGradient>
	</defs>`;

function wheat() {
	let g = `<path d="M256 452 L256 176" stroke="${GOLD}" stroke-width="11" stroke-linecap="round" fill="none"/>`;
	// base leaves
	g += `<path d="M256 368 C224 364 206 380 196 402 C230 402 250 392 256 374 Z" fill="${GOLD_DEEP}"/>`;
	g += `<path d="M256 368 C288 364 306 380 316 402 C282 402 262 392 256 374 Z" fill="${GOLD_DEEP}"/>`;
	// grains up both sides
	const levels = [
		[304, 27],
		[280, 26],
		[256, 25],
		[232, 23],
		[210, 21],
		[190, 19],
	];
	for (const [y, r] of levels) {
		g += `<ellipse cx="236" cy="${y - 8}" rx="11" ry="${r}" transform="rotate(-34 236 ${y - 8})" fill="url(#grain)"/>`;
		g += `<ellipse cx="276" cy="${y - 8}" rx="11" ry="${r}" transform="rotate(34 276 ${y - 8})" fill="url(#grain)"/>`;
	}
	// crowning grain
	g += `<ellipse cx="256" cy="160" rx="12" ry="30" fill="url(#grain)"/>`;
	return g;
}

const mark = wheat();

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Bakehouse">${defs}
	<rect width="512" height="512" rx="116" fill="url(#tile)" />
	<rect x="30" y="30" width="452" height="452" rx="92" fill="none" stroke="${GOLD}" stroke-opacity="0.35" stroke-width="4" />
	${mark}
</svg>`;

const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${defs}
	<rect width="512" height="512" fill="url(#tile)" />
	<g transform="translate(256 256) scale(0.78) translate(-256 -256)">${mark}</g>
</svg>`;

const root = process.cwd();
const publicDir = path.join(root, "public");
const iconsDir = path.join(publicDir, "icons");
await mkdir(iconsDir, { recursive: true });

const render = (svg, size) =>
	sharp(Buffer.from(svg), { density: 512 }).resize(size, size).png().toBuffer();

await writeFile(path.join(publicDir, "favicon.svg"), `${faviconSvg}\n`);
await writeFile(path.join(iconsDir, "icon-192.png"), await render(faviconSvg, 192));
await writeFile(path.join(iconsDir, "icon-512.png"), await render(faviconSvg, 512));
await writeFile(path.join(iconsDir, "icon-maskable-512.png"), await render(maskableSvg, 512));
await writeFile(path.join(iconsDir, "apple-touch-icon.png"), await render(maskableSvg, 180));

console.log("✓ Wrote favicon.svg + 4 PNG icons to public/");
