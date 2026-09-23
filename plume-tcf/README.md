# Plume-TCF ✒

Version dédiée du même entraîneur d'écriture pour un locuteur « héritage », restreinte **exclusivement au TCF Canada** (aucun contenu TEF : sujets de session, examens blancs, notation et textes d'interface sont tous TCF uniquement).

C'est une base de code sœur de `Plume` (le dossier racine, TEF + TCF avec routeur), pas une simple variante d'affichage : le déploiement, le mot de passe et les données (Durable Object) sont entièrement séparés.

Plume n'est pas un correcteur : c'est un **entraîneur de perception**. Il n'écrit ni ne corrige à ta place — il t'apprend à voir tes propres fautes (échelle d'indices, auto-scan à voix haute, dictées à deux accents avec vitesse réglable vers l'objectif 1,0×, modèle personnel d'erreurs) et fait monter ton écrit de B1 vers B2.

## Architecture

- `public/index.html` — application complète en un seul fichier (3 thèmes : sombre / terre / terre claire).
- `worker/index.js` — Worker Cloudflare : proxy Anthropic (aucun appel navigateur→Anthropic), pipeline de détection (3 passes + vote majoritaire + vérification adversariale), notation double passe sur la grille TCF Canada, Durable Object SQLite pour l'état.

## Différences avec Plume (racine)

- Aucun sujet, examen blanc ni score TEF nulle part (fichiers, prompts IA, interface).
- Pas de routeur TEF vs TCF : l'examen visé est fixé à « TCF Canada ».
- Déploiement Cloudflare Worker séparé (`plume-tcf`), donc mot de passe et données indépendants de `plume`.

## Déploiement

```bash
npm install
npx wrangler secret put ANTHROPIC_API_KEY   # clé API Anthropic
npx wrangler secret put PLUME_PASSWORD      # mot de passe d'accès à l'app
npx wrangler secret put OPENAI_API_KEY      # optionnel : voix TTS de qualité (dictées)
npx wrangler deploy
```

Développement local : `npx wrangler dev` (les secrets locaux vont dans `.dev.vars`).
