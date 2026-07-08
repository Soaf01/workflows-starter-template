# Maison Miellune — Patisserie PWA (generic template)

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/workflows-starter-template)

<!-- dash-content-start -->

A generic, brand-free **Progressive Web App** for an artisan patisserie —
fast, installable, and fully offline-capable. Everything is self-contained:
hand-drawn **SVG artwork** (no photos), a **procedural "world-music" engine**
built on the Web Audio API (no audio files), a shopping cart with a demo
checkout, and a complete responsive, accessible, light/dark UI.

Built with **React 19 + Vite + Tailwind CSS** on **Cloudflare Workers**
(static assets served by the Worker, with a tiny demo `/api/order` endpoint).

> **Maison Miellune** is a fictitious brand coined for this template
> (_miel_ = honey, _lune_ = moon). The name, copy, prices, hours and address
> are all invented placeholders — swap them for your own.

<!-- dash-content-end -->

## Features

- 📱 **Installable PWA** — web manifest, maskable icons, service worker with
  offline app-shell + stale-while-revalidate runtime caching.
- 🎨 **Original SVG illustrations** — 16 recognisable treats, a brand mark, and
  decorative icons; crisp at any size, no image downloads.
- 🎵 **Procedural world music** — six regional ambiences (pentatonic, hijaz,
  hirajoshi, phrygian…) generated live with oscillators; nothing copyrighted.
- 🛒 **Cart + demo checkout** — persisted in `localStorage`, works even offline
  thanks to a local reference fallback.
- 🌗 **Light/dark, responsive, reduced-motion aware, keyboard accessible.**

## Getting Started

```bash
npm install      # install dependencies
npm run dev      # local dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # build then preview
npm run deploy   # build + deploy to Cloudflare Workers
npm test         # run the test suite (Vitest + Workers pool)
npm run icons    # regenerate favicon + PNG icons from the source design
```

## Make it yours

| To change…            | Edit…                                                  |
| --------------------- | ------------------------------------------------------ |
| Brand, story, hours   | `src/data/site.ts`                                     |
| Menu items & prices   | `src/data/menu.ts`                                     |
| Colours & fonts       | `tailwind.config.js`                                   |
| Treat artwork         | `src/components/Illustrations.tsx`                     |
| Music ambiences       | `src/audio/worldMusic.ts`                              |
| App icons             | `scripts/generate-icons.mjs` → `npm run icons`         |
| Order backend         | `worker/index.ts` (`/api/order` is a stub)             |

## Project structure

```
index.html                 PWA meta, splash, manifest link
public/
  manifest.webmanifest     installable app manifest
  sw.js                    offline service worker
  favicon.svg + icons/     brand icon set (generated)
src/
  App.tsx                  page composition
  data/                    site + menu content (all generic)
  audio/worldMusic.ts      Web Audio ambience engine
  components/              Nav, Hero, Menu, Gallery, Story, Contact, Cart, …
  hooks/                   cart, install prompt, music, scroll-reveal
worker/index.ts            serves static assets + demo /api/order
```

## Learn More

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers)
- [Static assets on Workers](https://developers.cloudflare.com/workers/static-assets/)
- [Progressive Web Apps (MDN)](https://developer.mozilla.org/docs/Web/Progressive_web_apps)
