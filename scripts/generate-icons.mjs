/**
 * Regenerates the brand icon set from a single source design.
 *
 *   node scripts/generate-icons.mjs   (or: npm run icons)
 *
 * Writes public/favicon.svg plus the PNG PWA icons under public/icons/.
 * Requires `sharp` (dev-only). Everything is drawn here — no external images.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const root = process.cwd();
const publicDir = path.join(root, "public");
const iconsDir = path.join(publicDir, "icons");
await mkdir(iconsDir, { recursive: true });

// Shared, centred artwork: a crescent moon cradling a honey drop + sparkles.
const defs = `
	<defs>
		<radialGradient id="honey" cx="38%" cy="30%" r="82%">
			<stop offset="0%" stop-color="#f7d081" />
			<stop offset="55%" stop-color="#eaa945" />
			<stop offset="100%" stop-color="#cf8422" />
		</radialGradient>
		<linearGradient id="drop" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0%" stop-color="#fbe9b8" />
			<stop offset="45%" stop-color="#f0b64e" />
			<stop offset="100%" stop-color="#d98a26" />
		</linearGradient>
	</defs>`;

const content = `
	<path fill-rule="evenodd" fill="#fff6e6"
		d="M116,252 a140,140 0 1,0 280,0 a140,140 0 1,0 -280,0 Z
		   M190,230 a126,126 0 1,1 252,0 a126,126 0 1,1 -252,0 Z" />
	<path d="M280,150 C280,150 340,232 340,280 a58,58 0 1,1 -116,0 C224,232 280,150 280,150 Z"
		fill="url(#drop)" stroke="#b9741d" stroke-width="5" />
	<ellipse cx="264" cy="280" rx="13" ry="20" fill="#fff3d4" opacity="0.7" />
	<path d="M162 158 l7 18 18 7 -18 7 -7 18 -7 -18 -18 -7 18 -7 z" fill="#fff7e6" opacity="0.9" />
	<circle cx="360" cy="152" r="8" fill="#fff7e6" opacity="0.85" />`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Maison Miellune">${defs}
	<rect width="512" height="512" rx="116" fill="url(#honey)" />
	<rect width="512" height="512" rx="116" fill="#000" opacity="0.04" />
	${content}
</svg>`;

// Maskable / apple: full-bleed square so platform cropping never bites content.
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${defs}
	<rect width="512" height="512" fill="url(#honey)" />
	<g transform="translate(256 256) scale(0.82) translate(-256 -256)">${content}</g>
</svg>`;

async function render(svg, size) {
	return sharp(Buffer.from(svg), { density: 512 })
		.resize(size, size)
		.png()
		.toBuffer();
}

await writeFile(path.join(publicDir, "favicon.svg"), `${faviconSvg}\n`);

await writeFile(path.join(iconsDir, "icon-192.png"), await render(faviconSvg, 192));
await writeFile(path.join(iconsDir, "icon-512.png"), await render(faviconSvg, 512));
await writeFile(
	path.join(iconsDir, "icon-maskable-512.png"),
	await render(maskableSvg, 512),
);
await writeFile(
	path.join(iconsDir, "apple-touch-icon.png"),
	await render(maskableSvg, 180),
);

console.log("✓ Wrote favicon.svg + 4 PNG icons to public/");
