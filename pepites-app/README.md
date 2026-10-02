# Pépites Manager — app de gestion (single-file + Worker KV)

App web unique (`public/index.html`, standard SoafAii : single-file, tri-thème
dark/earth/light, protégée par mot de passe, module Health) + Worker API
(`worker.js`, stockage KV) qui remplace Telegram comme canal d'alerte et de
décision du moteur `pepites-engine`.

## Flux

1. Le moteur pousse chaque candidat : `POST /api/candidates` (Bearer `ENGINE_TOKEN`).
2. L'app affiche la file ; tu cliques Acheté / Vu-rejeté / Faux positif.
3. Au clic « Acheté », l'onglet Brouillons propose la génération de l'annonce
   de revente — via le proxy IA maison (`studio-brain.soaf01.workers.dev/ai`,
   jamais d'appel Anthropic direct depuis le navigateur).
4. `npm run feedback` côté moteur relit les décisions (`GET /api/decisions`),
   alimente le jeu de calibration local et pose les brouillons manquants.

Telegram reste disponible en parallèle (les deux canaux coexistent) mais
n'est plus obligatoire.

## Déploiement

```bash
cd pepites-app
npx wrangler kv namespace create PEPITES_KV   # coller l'id dans wrangler.jsonc
npx wrangler deploy
npx wrangler secret put APP_KEY               # mot de passe de l'app
npx wrangler secret put ENGINE_TOKEN          # jeton pour le moteur
```

Côté moteur (`pepites-engine`), ajouter :

```
PEPITES_API_URL=https://pepites-api.<ton-sous-domaine>.workers.dev
ENGINE_TOKEN=<le même jeton>
```

## À vérifier (assumé)

- Le format exact attendu par `studio-brain.soaf01.workers.dev/ai` — l'app
  envoie un corps Anthropic standard `{model, max_tokens, messages}` et lit
  `content[].text` ; l'URL et le modèle sont modifiables dans Réglages si le
  proxy attend autre chose.
