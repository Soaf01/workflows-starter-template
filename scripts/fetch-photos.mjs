/**
 * Downloads the photos listed in photo-sources.json into public/img/<key>.jpg.
 * Runs on a network-enabled machine (CI or a dev box), never in the sandbox.
 *   node scripts/fetch-photos.mjs
 * Missing downloads are skipped — <Photo/> falls back to a stock photo, so a
 * failed fetch never breaks the UI.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sources = JSON.parse(
	await readFile(path.join(root, "scripts/photo-sources.json"), "utf8"),
);
const outDir = path.join(root, "public/img");
await mkdir(outDir, { recursive: true });

const cache = new Map();
let ok = 0;
let fail = 0;

for (const [key, url] of Object.entries(sources)) {
	if (key.startsWith("_")) continue;
	try {
		let buf = cache.get(url);
		if (!buf) {
			const res = await fetch(url, {
				redirect: "follow",
				headers: { "User-Agent": "Mozilla/5.0 (compatible; aurelia-bot)" },
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			buf = Buffer.from(await res.arrayBuffer());
			if (buf.length < 1000) throw new Error(`too small (${buf.length}b)`);
			cache.set(url, buf);
		}
		await writeFile(path.join(outDir, `${key}.jpg`), buf);
		console.log(`OK    ${key}  ${(buf.length / 1024) | 0}kb`);
		ok++;
	} catch (e) {
		console.log(`FAIL  ${key}  ${url}  — ${e.message}`);
		fail++;
	}
}

console.log(`\nDone: ${ok} ok, ${fail} failed`);
