# Pépites Engine — Flux B (design XXe sous-identifié)

Moteur personnel qui balaie les petites annonces, détecte le design du XXe siècle
non identifié par le vendeur, envoie une alerte Telegram quotidienne (max 3
candidats), et génère l'annonce de revente au clic « Acheté ».

Implémente la spec « Moteur Pépites — Spec Flux B » (document Claude) :
entonnoir à étages — ingestion → pré-filtre texte gratuit → triage vision
(Claude Haiku 4.5) → identification (Claude Opus 5.5 + base de références) →
comps (prix réalisés) → scoring → alerte Telegram → boucle humaine → brouillon
de revente.

## Démarrage

```bash
cd pepites-engine
npm install
npm run build
npm run dry-run       # pipeline complet sur fixtures, zéro appel réseau
```

Le dry-run doit afficher 2 alertes (fixtures 1 et 2) et écarter l'annonce
« Eames » (designer cité = déjà au prix) et l'IKEA (mot-clé exclu).

## Variables d'environnement

| Variable | Rôle | Obligatoire |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Vision + rédaction (SDK Anthropic) | Oui (hors dry-run) |
| `APIFY_TOKEN` | Scraping géré Leboncoin | Oui pour l'ingestion réelle |
| `APIFY_ACTOR_LEBONCOIN_FR` | Id de l'acteur Apify choisi (ex. `user~leboncoin-scraper`) | Oui pour l'ingestion réelle |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Alertes + boutons | Non (sinon sortie console) |
| `SOLDCOMPS_URL` / `SOLDCOMPS_KEY` | Comps eBay vendus | Non (sans eux : alerte « vérifier la cote à la main ») |

## Fonctionnement

- `npm run run` — un passage complet (à mettre en cron toutes les 1-2 h).
- `npm run feedback` — lit les clics Telegram (Acheté / Vu-rejeté / Faux positif),
  les enregistre dans `data/state.json` (jeu de calibration), et au clic
  « Acheté » génère et envoie le brouillon de revente (Étage 5).
- Plafonds durs d'appels vision/jour dans `src/config.ts` (`CAPS`) — protection
  anti-dérive de coût. Seuils d'alerte dans `THRESHOLDS`.
- Base de références : `refs/designers.json` — à enrichir, c'est elle qui fait
  l'œil de l'expert.

## Multi-pays

Ajouter une entrée dans `SOURCES` (`src/config.ts`) : pays, langue, mots-clés
traduits, `requireShippable: true` à l'étranger (contrainte logistique). La
vision et le scoring sont inchangés.

## À vérifier / TODO assumés

- **Forme exacte de l'output de l'acteur Apify choisi** : le mapping
  `src/ingest.ts` couvre les champs usuels, à ajuster après le premier run réel.
- **API SoldComps** : chemin et champs à confirmer à l'inscription
  (`src/comps.ts` lit l'URL dans l'env pour ne rien figer de non vérifié).
- **eBay Sell API** (publication automatique de la revente) : non implémentée
  en v1 — enrôlement développeur eBay requis ; la v1 livre un brouillon prêt à
  coller.
- **Légal** : scraping contraire aux CGU Leboncoin (risque réaliste : blocage) ;
  revente habituelle = activité commerciale à déclarer (voir spec, Étage 5).

## Notes techniques

- Le code Opus 5.5 active le fallback serveur par défaut
  (`fallbacks: "default"`) : si un classifieur de sécurité refuse une analyse
  d'image, la requête est rejouée automatiquement sur un modèle de repli.
- L'achat n'est jamais automatisé : le moteur alerte, l'humain décide.
