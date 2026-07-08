/*
 * Maison Miellune — service worker
 *
 * A small, dependency-free offline strategy that works regardless of Vite's
 * hashed asset names:
 *   - App shell (/, index, manifest, icons) is pre-cached on install.
 *   - Navigations use network-first, falling back to the cached shell offline.
 *   - Same-origin static assets (JS/CSS/img/font/audio) use stale-while-revalidate.
 *   - /api/* is always network-only (never cached).
 *
 * Bump CACHE_VERSION whenever the shell list changes to retire old caches.
 */

const CACHE_VERSION = "miellune-v1";
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const SHELL_ASSETS = [
	"/",
	"/index.html",
	"/manifest.webmanifest",
	"/favicon.svg",
	"/icons/icon-192.png",
	"/icons/icon-512.png",
	"/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(SHELL_CACHE)
			.then((cache) => cache.addAll(SHELL_ASSETS))
			.catch(() => undefined)
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => !key.startsWith(CACHE_VERSION))
						.map((key) => caches.delete(key)),
				),
			)
			.then(() => self.clients.claim()),
	);
});

function isStaticAsset(request) {
	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return false;
	return /\.(?:js|mjs|css|png|jpg|jpeg|svg|webp|gif|ico|woff2?|ttf|otf|mp3|ogg|wav|json|webmanifest)$/i.test(
		url.pathname,
	);
}

self.addEventListener("fetch", (event) => {
	const { request } = event;
	if (request.method !== "GET") return;

	const url = new URL(request.url);

	// Never cache the demo API.
	if (url.pathname.startsWith("/api/")) return;

	// Navigations: network-first with offline fallback to the app shell.
	if (request.mode === "navigate") {
		event.respondWith(
			fetch(request)
				.then((response) => {
					const copy = response.clone();
					caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
					return response;
				})
				.catch(async () => {
					const cached = await caches.match(request);
					return (
						cached ||
						(await caches.match("/index.html")) ||
						(await caches.match("/")) ||
						new Response("Hors ligne", {
							status: 503,
							headers: { "Content-Type": "text/plain; charset=utf-8" },
						})
					);
				}),
		);
		return;
	}

	// Static assets: stale-while-revalidate.
	if (isStaticAsset(request)) {
		event.respondWith(
			caches.match(request).then((cached) => {
				const network = fetch(request)
					.then((response) => {
						if (response && response.status === 200) {
							const copy = response.clone();
							caches
								.open(RUNTIME_CACHE)
								.then((cache) => cache.put(request, copy));
						}
						return response;
					})
					.catch(() => cached);
				return cached || network;
			}),
		);
	}
});

// Allow the page to trigger an immediate update.
self.addEventListener("message", (event) => {
	if (event.data === "SKIP_WAITING") self.skipWaiting();
});
