/*
 * White-label bakehouse PWA — service worker.
 *
 *   - App shell (/, index, manifest, icons) pre-cached on install.
 *   - Navigations: network-first, offline fallback to the cached shell.
 *   - Same-origin assets: stale-while-revalidate.
 *   - Google Fonts + remote photos: cache-first (so the app works offline
 *     after the first visit).
 *   - /api/* : network-only.
 */

const CACHE_VERSION = "bakehouse-v2";
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const REMOTE_CACHE = `${CACHE_VERSION}-remote`;

const SHELL_ASSETS = [
	"/",
	"/index.html",
	"/manifest.webmanifest",
	"/favicon.svg",
	"/icons/icon-192.png",
	"/icons/icon-512.png",
	"/icons/apple-touch-icon.png",
];

const REMOTE_HOSTS = [
	"fonts.googleapis.com",
	"fonts.gstatic.com",
	"loremflickr.com",
	"picsum.photos",
	"images.unsplash.com",
	"images.pexels.com",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(SHELL_CACHE)
			.then((c) => c.addAll(SHELL_ASSETS))
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
					keys.filter((k) => !k.startsWith(CACHE_VERSION)).map((k) => caches.delete(k)),
				),
			)
			.then(() => self.clients.claim()),
	);
});

function sameOriginAsset(url) {
	return (
		url.origin === self.location.origin &&
		/\.(?:js|mjs|css|png|jpg|jpeg|svg|webp|gif|ico|woff2?|ttf|otf|mp3|ogg|wav|json|webmanifest)$/i.test(
			url.pathname,
		)
	);
}

function cacheFirst(request, cacheName) {
	return caches.open(cacheName).then((cache) =>
		cache.match(request).then(
			(hit) =>
				hit ||
				fetch(request)
					.then((res) => {
						if (res && (res.ok || res.type === "opaque")) cache.put(request, res.clone());
						return res;
					})
					.catch(() => hit),
		),
	);
}

self.addEventListener("fetch", (event) => {
	const { request } = event;
	if (request.method !== "GET") return;
	const url = new URL(request.url);

	if (url.pathname.startsWith("/api/")) return;

	if (REMOTE_HOSTS.includes(url.hostname)) {
		event.respondWith(cacheFirst(request, REMOTE_CACHE));
		return;
	}

	if (request.mode === "navigate") {
		event.respondWith(
			fetch(request)
				.then((res) => {
					const copy = res.clone();
					caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
					return res;
				})
				.catch(async () => {
					return (
						(await caches.match(request)) ||
						(await caches.match("/index.html")) ||
						(await caches.match("/")) ||
						new Response("Offline", { status: 503 })
					);
				}),
		);
		return;
	}

	if (sameOriginAsset(url)) {
		event.respondWith(
			caches.match(request).then((cached) => {
				const network = fetch(request)
					.then((res) => {
						if (res && res.status === 200) {
							const copy = res.clone();
							caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
						}
						return res;
					})
					.catch(() => cached);
				return cached || network;
			}),
		);
	}
});

self.addEventListener("message", (event) => {
	if (event.data === "SKIP_WAITING") self.skipWaiting();
});
