# Plume ✒

Entraîneur personnel d'écriture du français pour un locuteur « héritage », orienté TEF Canada / TCF Canada.

Plume n'est pas un correcteur : c'est un **entraîneur de perception**. Il n'écrit ni ne corrige à ta place — il t'apprend à voir tes propres fautes (échelle d'indices, auto-scan à voix haute, dictées à deux accents, modèle personnel d'erreurs) et fait monter ton écrit de B1 vers B2.

## Architecture

- `public/index.html` — application complète en un seul fichier (3 thèmes : sombre / terre / terre claire).
- `worker/index.js` — Worker Cloudflare : proxy Anthropic (aucun appel navigateur→Anthropic), pipeline de détection (3 passes + vote majoritaire + vérification adversariale), notation double passe, Durable Object SQLite pour l'état.
- `docs/BRIEF-RECOMMANDATIONS.md` — le brief de conception fondé sur la recherche.

## Déploiement

```bash
npm install
npx wrangler secret put ANTHROPIC_API_KEY   # clé API Anthropic
npx wrangler secret put PLUME_PASSWORD      # mot de passe d'accès à l'app
npx wrangler secret put OPENAI_API_KEY      # optionnel : voix TTS de qualité (dictées)
npx wrangler deploy
```

Développement local : `npx wrangler dev` (les secrets locaux vont dans `.dev.vars`).
