# Deploying Maison Miellune

The app is a static PWA served by a small Cloudflare Worker. Pick whichever
route is easiest — each one gives you a public link.

## A. Get a link in ~1 minute (local, recommended)

```bash
npm install
npx wrangler login      # opens a browser to authorise your Cloudflare account
npm run deploy          # builds + deploys
```

Wrangler prints the live URL, e.g.
`https://maison-miellune-pwa.<your-subdomain>.workers.dev`.

## B. Automatic deploys on every push (GitHub Actions)

A workflow is already included at `.github/workflows/deploy.yml`. One-time setup:

1. Create a Cloudflare API token with the **"Edit Cloudflare Workers"** template
   (My Profile → API Tokens).
2. In this GitHub repo: **Settings → Secrets and variables → Actions → New secret**
   - `CLOUDFLARE_API_TOKEN` = your token
   - `CLOUDFLARE_ACCOUNT_ID` = your account id (optional)
3. Push (or run the workflow manually). The deployed URL appears in the job log.

## C. Cloudflare Pages (a `*.pages.dev` link, like a classic static host)

The client build is fully static, so you can also host it on Pages:

- Connect this repo in the Cloudflare dashboard (**Workers & Pages → Create → Pages**)
- Build command: `npm run build`
- Build output directory: `dist/client`

> On Pages there is no `/api/order` worker, but the checkout still works — the
> cart falls back to a locally generated demo reference when the API is absent.
