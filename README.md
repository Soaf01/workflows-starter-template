# Bakehouse — white-label mobile PWA

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/workflows-starter-template)

<!-- dash-content-start -->

An installable, offline-capable **smartphone app** for a bakery / café / small
food brand — built so you can spin up a new client's app by editing **one
config file**. The whole UI (brand, colours, fonts, menu, classes, catering,
gift cards, rewards, story, contact, music) renders from a single
`ClientConfig`.

Ships with a complete fictional demo brand — **"Aurelia Bakehouse"** — whose
name, prices, address, copy and photos are all placeholders.

Built with **React 19 + Vite + Tailwind** on **Cloudflare Workers**.

<!-- dash-content-end -->

## What's inside

Multi-screen, phone-format app with a bottom tab bar:

- **Home** — hero, highlights, featured items, quick links
- **Menu** — categorised, filterable ordering with a bag, checkout
  (pickup/delivery) **and an "Order on WhatsApp" hand-off**
- **Music** — a live, procedurally-generated ambience engine (no audio files,
  nothing copyrighted)
- **Classes**, **Catering**, **Gift cards**, **Rewards**, **Story**, **Contact**
- Installable **PWA**: manifest, maskable icons, offline service worker
  (app shell + fonts + photos cached)

## White-label: launch a new client

1. Copy `src/config/clients/aurelia.ts` → `src/config/clients/<name>.ts`.
2. Change the brand, colours, contact, menu, photos, feature toggles.
3. Register it in `src/config/index.ts` and build with `VITE_CLIENT=<name>`.

No component edits needed — colours become CSS variables, content drives every
screen, and feature flags show/hide whole sections.

### Photos

Each `image` in a config is either a **URL / path** (use your own or AI photos
in `/public/img/…`) **or keywords** (e.g. `"butter,croissant"`), which resolve
to a royalty-free stock photo with an automatic fallback so images are never
broken. See `src/lib/photo.tsx`.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm test
npm run icons    # regenerate favicon + PNG icons
```

## Deploy

See **DEPLOY.md**. In short: `npx wrangler login && npm run deploy`, or push —
the included GitHub Action deploys to Cloudflare on every push once you add a
`CLOUDFLARE_API_TOKEN` secret.

## Project structure

```
src/
  config/          ← the white-label heart: schema + per-client content
    clients/       ← one file per client (aurelia = demo)
  app/
    AppShell.tsx   ← phone frame, header, bottom nav, router
    screens/       ← Home, Menu, Music, Classes, Catering, Gift, Rewards, …
    components/    ← ProductCard, CartSheet
  audio/           ← procedural music engine (Web Audio)
  lib/photo.tsx    ← image resolution + fallback
  ui/              ← Icon, Sheet, Stepper
worker/index.ts    ← serves static assets + demo /api/order
```
