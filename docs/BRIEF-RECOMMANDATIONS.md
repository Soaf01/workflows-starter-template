# Plume — Brief de recommandations

**Application d'entraînement à l'écriture du français pour un locuteur « héritage », orientée TEF Canada / TCF Canada**

*Synthèse de quatre recherches approfondies (littérature scientifique, exigences des examens, panorama des outils existants, conception de tuteurs IA) — août 2026.*

---

## 1. Résumé exécutif

Le profil de l'apprenant — 36 ans, français acquis oralement dans l'enfance, oral aisé, écrit truffé de fautes qu'il ne perçoit pas — est un profil bien documenté par la recherche : le **locuteur « héritage »** (heritage speaker). Précision importante : son oral, acquis enfant puis longtemps non pratiqué, reste marqué par un **registre enfantin/quotidien** ; son niveau global attesté par son école est **B1.5 sur les 7 sous-niveaux de B1** (il entame B1.6) — donc **fin de B1, pas encore B2**. Son niveau *à l'écrit* est vraisemblablement en dessous de ce placement global et reste à mesurer par le diagnostic initial. Il a donc **deux chantiers**, pas un :

1. **La perception et l'orthographe** (le chantier principal et le plus spécifique) : absence de **représentations orthographiques** (il écrit « à l'oreille », et ses fautes sonnent juste quand il se relit) et absence de la **couche métalinguistique explicite** que l'école donne normalement (raisonner sur la langue comme objet).
2. **L'élévation de la langue vers le B2** : le NCLC 7 exige, au-delà de la correction, la *richesse* — vocabulaire adulte et précis, phrases complexes, connecteurs, argumentation structurée, registre formel. Un texte sans fautes mais enfantin ne passe pas la barre du critère linguistique et pragmatique.

Trois conclusions structurantes :

1. **C'est entraînable, sur deux horizons distincts.** L'orthographe grammaticale française est un ensemble fermé et petit de systèmes de règles (accords, terminaisons en /E/, homophones) : gains mesurables en écriture libre en **8 à 15 semaines à 10-20 min/jour**, maîtrise d'une règle isolée (ex. -er/-é) en jours-semaines. La montée globale B1→B2 (richesse, argumentation, registre) est un chantier plus long : l'ordre de grandeur générique est de **150-200 heures guidées**, que le format très codifié des épreuves compresse — viser **4 à 6 mois à ~1 h/jour** est réaliste pour l'ensemble, plutôt que les 2-3 mois d'un profil déjà B2 à l'oral.
2. **Aucun outil existant ne fait ce qu'il lui faut.** Les correcteurs (Antidote, etc.) corrigent à sa place et créent une dépendance mesurée ; Projet Voltaire entraîne la détection mais sur des phrases toutes faites ; les plateformes TEF/TCF notent sans enseigner ; personne ne construit un **modèle personnel de ses fautes** à partir de ses propres textes ni ne l'entraîne à les **détecter lui-même**. Le créneau est vide.
3. **L'enjeu immigration est précis et l'écrit est le verrou.** NCLC 7 dans les quatre compétences = +50 points CRS + accès aux tirages Entrée express francophones (seuils ~100-150 points sous les tirages généraux). NCLC 7 partout sauf à l'écrit = zéro bonus. Cible : **TEF ≥ 310/450 ou TCF ≥ 10/20** en expression écrite.

**Recommandation d'examen (préliminaire, à confirmer par le routeur diagnostique de l'app) : TCF Canada** — pas d'épreuve « fait divers » (narration au passé qui expose exactement ses faiblesses), une première tâche facile qui engrange des points, seuil NCLC 7 à 50 % de l'échelle contre 69 % au TEF. Le niveau réel ~B1+ **renforce** ce penchant : les trois tâches du TCF sont graduées (la tâche 1 est de difficulté A2-B1, la tâche 2 B1-B2), ce qui permet à un B1+ de sécuriser des points là où le TEF impose d'emblée une lettre argumentée de 200 mots de facture B2. Le TEF reste préférable si le calendrier est serré (résultats en 1-10 jours) ou s'il préfère deux formats ultra-formulaïques.

---

## 2. Le diagnostic scientifique : pourquoi il ne « voit » pas ses fautes

Trois mécanismes convergents, tous documentés :

1. **Représentations orthographiques absentes** (Perfetti, *Lexical Quality Hypothesis*) : sans exposition massive à l'écrit, les mots ne sont stockés qu'en phonologie. Une faute phonologiquement plausible (*il a manger*) ne déclenche aucun signal de discordance à la relecture — il n'y a rien dans sa mémoire à quoi la comparer.
2. **Stratégie d'écriture « à l'oreille »** : les corpus de fautes de locuteurs héritage montrent des erreurs massivement homophones (accents, terminaisons muettes, ses/ces, a/à). Le français, avec ~56 % de mots à finale muette et sa morphologie grammaticale silencieuse, est le pire cas possible pour cette stratégie.
3. **Lecture prédictive de son propre texte** : tout scripteur relit ce qu'il a *voulu* écrire, pas ce qui est écrit. Mais attention à la parade choisie : une recherche dédiée (voir la passe d'auto-scan, §5) montre que ce qui casse la prédiction est de changer **la tâche et le canal** — articulation à voix haute, lenteur imposée phrase par phrase, vérification procédurale, délai d'un jour — et non l'**apparence visuelle** du texte : la « défamiliarisation » par changement de police est du folklore d'éditeur jamais validé, et la preuve expérimentale la plus proche (police disfluente) est *négative* — elle dégrade la détection des coquilles (Cushing & Bodner 2022). Pire : même en fixant l'erreur des yeux, on la rate (Staub 2018 : ~46 % de détection d'un « the » doublé fixé directement) — l'échec est post-visuel, pas perceptif. Seule l'**augmentation de la taille de police** a un début de preuve favorable.

S'y ajoute le résultat clé de Fayol : même les adultes instruits qui *connaissent* les règles d'accord les ratent sous charge cognitive (pendant qu'ils composent). L'objectif n'est donc pas seulement d'apprendre des règles, mais d'**automatiser des routines de vérification** (tests de substitution, chaînes d'accord) jusqu'à ce qu'elles tournent presque gratuitement.

---

## 3. Les méthodes validées retenues

| Méthode | Preuve | Ce qu'on en prend |
|---|---|---|
| **Boucle DWCF** (Hartshorn/Evans) : écriture quotidienne 10 min → feedback codé complet → registre personnel d'erreurs → réviser jusqu'à zéro faute | Forte (réplications sur 13-15 semaines, gains sur textes *nouveaux*) | Le squelette de la session quotidienne |
| **Correction directe + explication de la règle** (van Beuningen n=268 ; Shintani & Ellis) | Forte | La correction finale donne toujours la forme juste + la règle nommée — il ne peut pas générer une forme qu'il n'a jamais stockée |
| **Feedback ciblé (focused)** : 1-2 familles d'erreurs par cycle, en rotation | Forte (méta-analyses) | Cycles de 1-2 semaines par famille (accords pluriels → -er/-é → participes…) |
| **Dictée zéro faute / phrase dictée du jour** (Nadeau & Fisher, Québec, 900+ élèves) : doute institutionnalisé + raisonnement grammatical verbalisé avant révélation | Forte-modérée (~3× le progrès normal, transfert en production libre) | Un mode « dictée zéro faute solo » adapté à un adulte + IA |
| **Entraînement de la détection** (hypothèse du *noticing* de Schmidt ; échelles d'indices des tuteurs intelligents) | Modérée-forte | L'échelle d'indices : il cherche ses fautes *avant* toute révélation |
| **Répétition espacée + rappel actif sur son corpus personnel d'erreurs** (Cepeda, Bird ; effet de test sur l'orthographe adulte) | Forte (composants) | Chaque faute réelle devient un item de révision programmée, en production (jamais en QCM de reconnaissance) |
| **Pédagogie socratique encodée dans le prompt** (LearnLM : les LLM standard minimisent la friction, ce qui contredit la pédagogie) | Modérée-forte | Politique explicite de non-révélation de la réponse avant tentative |

Et le contre-modèle, tout aussi documenté : **la correction automatique immédiate améliore le texte, pas l'apprenant** (études Grammarly/Criterion : clics d'acceptation sans apprentissage ; effet de dépendance : performance qui *chute* quand on retire l'outil). À l'examen, il sera seul. L'application ne corrige donc jamais d'emblée.

---

## 4. L'enjeu examen : TEF Canada vs TCF Canada

**Seuils NCLC 7 en expression écrite** : TEF ≥ 310/450 (~69 %) · TCF ≥ 10/20 (50 %). Double correction humaine, critères en trois familles : pragmatique (respect de la tâche, cohérence, connecteurs), linguistique (grammaire, orthographe, lexique), sociolinguistique (registre). Les correcteurs pénalisent surtout les erreurs **systématiques** (accords, terminaisons verbales) et le non-respect de la consigne — le registre oral qui « bave » à l'écrit (*du coup*, ne dropped, tutoiement) coûte cher.

**Formats d'épreuve (60 min chacune)** :
- **TEF** : A. continuation d'un fait divers (≥80 mots, narration au passé, registre journalistique) + B. lettre d'opinion argumentée (≥200 mots).
- **TCF** : 1. message court (60-120 mots, ~A2-B1) + 2. article/récit + opinion (120-150 mots) + 3. comparaison de deux documents puis prise de position (120-180 mots).

**Lecture pour son profil** : le fait divers du TEF concentre exactement ses faiblesses (concordance des temps, accords du passé). Le TCF offre une tâche 1 quasi gratuite et un seuil plus bas sur l'échelle. **Penchant TCF**, mais la décision finale doit venir des données : l'application fait passer **un examen blanc de chaque format** et compare les pertes de points par critère (routeur diagnostique — personne ne l'automatise aujourd'hui).

⚠️ À vérifier avant de coder en dur : les bornes exactes des tables IRCC (canada.ca) ; le volet francophone de l'OINP Ontario est fermé depuis mai 2026 — la voie fiable est fédérale (catégorie francophone d'Entrée express, confirmée 2025-2026).

---

## 5. Le concept : « Plume »

**Thèse produit : Plume n'est pas un correcteur, c'est un entraîneur de perception.** Tout est conçu pour forcer son attention sur la forme au moment de propriété maximale (son propre texte qu'il vient d'écrire), révéler le minimum d'information nécessaire, et enregistrer *combien d'aide il a fallu* comme signal de maîtrise.

### L'examen d'entrée et le curriculum adaptatif

Avant toute chose, l'application mesure son vrai niveau *à l'écrit* (le placement B1.5 de son école mesure surtout la compétence globale, tirée par l'oral) et construit le curriculum à partir de là. ~45-60 minutes, sécable en deux séances, cinq épreuves complémentaires — chacune mesure une chose différente :

1. **Production libre courte** (message type TCF tâche 1, 60-120 mots, ~10 min) : ses fautes en écriture spontanée à niveau facile — la base du modèle d'erreurs.
2. **Production argumentée courte** (opinion, 100-120 mots, ~15 min) : son plafond — argumentation, registre, complexité des phrases.
3. **Dictée calibrée** (5-6 phrases concentrant les pièges du français : -er/-é, accords du groupe nominal, a/à, ses/ces, participe passé) : sépare « ne connaît pas la forme » de « connaît mais n'applique pas », et objective l'écriture « à l'oreille ».
4. **Chasse à l'erreur calibrée** (2 paragraphes contenant un nombre connu de fautes plantées, typiques de son profil) : mesure directe de son **taux de détection de départ** — la métrique reine — indépendamment de ses propres textes.
5. **Micro-test de métalangage** (5 questions : identifier le sujet, le COD, le participe…) : décide si l'onboarding métalangage est nécessaire, et à quelle profondeur.

**Sortie de l'examen d'entrée** : niveau CECR écrit estimé (comparé au placement B1.5), premier remplissage du modèle personnel d'erreurs (probabilité de maîtrise par catégorie), taux d'auto-détection de départ, et un **curriculum généré** : ordre des cycles ciblés (familles de fautes classées par fréquence × rentabilité à l'examen), rythme des sessions, jalons d'examens blancs toutes les 2-3 semaines, le tout planifié à rebours depuis la date d'examen visée. Le curriculum n'est pas figé : chaque session met à jour le modèle, et le plan se réordonne en continu.

### La session quotidienne (~20-30 min)

1. **Échauffement (3 min)** — 3-5 phrases « chasse à l'erreur » générées à partir de *ses* fautes passées, dans les catégories que le modèle d'oubli dit « à réviser ». Une phrase sur cinq est sans faute (entraîne la précision du jugement).
2. **Écriture (10-15 min)** — un sujet au format exact TEF ou TCF, ou ancré dans sa vie (« résume par écrit ta conversation d'hier »). **Éditeur totalement silencieux** : pas de soulignés, pas de compteur de fautes, pas d'autocorrect (comme à l'examen : clavier + accents, chrono, compteur de mots).
3. **Auto-scan (3-4 min)** — avant toute révélation, une passe de relecture conçue sur les seules techniques expérimentalement validées :
   - **Lecture à voix haute, phrase par phrase** : une seule phrase affichée à la fois (empêche le survol ; le temps passé et le nombre de fixations sont les meilleurs prédicteurs de détection), qu'il lit à voix haute — la seule technique qui améliore la détection des deux classes d'erreurs, coquilles *et* fautes grammaticales (Cushing & Bodner 2022 ; Pilotti 2004 : le feedback auditif est l'ingrédient actif).
   - **Passe procédurale « chaînes d'accord »** : l'app surligne chaque verbe/participe, il désigne le sujet ou l'auxiliaire et vérifie la terminaison — le seul remède démontré pour les fautes homophones du français (visuellement plausibles, inaudibles), qui échappent à toute astuce perceptive (Largy & Dédéyan).
   - **Option** : police agrandie pour la relecture (seul changement de présentation avec un début de preuve). **Exclu** : police « bizarre »/disfluente (preuve directe négative), lecture à rebours (inférieure pour les erreurs contextuelles), promesse d'un effet du changement de police (folklore non validé).
   - **Relecture différée** : ses textes de la veille reviennent en auto-scan le lendemain — l'effet du délai est démontré à l'échelle du jour, pas des minutes (Pilotti 2012 : 10 vs 40 min sans différence ; Chanquoy 2001 : révision différée plus profonde). S'intègre naturellement à la répétition espacée.
   → Le tout mesure et entraîne son **taux d'auto-détection**, la métrique reine.
4. **Échelle d'indices** — l'IA a déjà détecté en silence ; pour chaque faute confirmée, révélation par paliers, chaque palier débloqué par une tentative :
   - Palier 0 : « Ce paragraphe contient 3 erreurs. » (localisation retenue)
   - Palier 1 : la zone exacte soulignée (sans catégorie)
   - Palier 2 : la catégorie nommée (« accord du participe passé avec avoir »)
   - Palier 3 : question socratique / rappel de règle (« Où est le COD ? Est-il placé avant le verbe ? »)
   - Palier 4 : correction directe + explication (toujours montrée à la fin — la retenir pour toujours n'est pas le but)
   - Le palier de départ dépend de sa maîtrise estimée de la catégorie : catégories presque acquises → palier 0 ; angles morts chroniques → palier 1-2 (sinon frustration, pas de zone proximale).
   - Si le texte a 25 fautes : on n'échelonne que les 6-8 des 2-3 catégories du cycle en cours ; le reste est corrigé directement dans une « copie propre » finale (feedback ciblé > exhaustif).
5. **Consolidation (2 min)** — il **retape entièrement** chaque phrase corrigée (rappel actif, jamais de clic-accepter), et la session se clôt par un récap d'une ligne par catégorie.

### Les modes complémentaires

- **Dictée zéro faute solo** (adaptation Nadeau & Fisher) : l'app dicte une phrase (exploite son oreille native) ; il écrit ; *avant* la correction : « De quels mots doutes-tu ? Pourquoi cette terminaison ? » ; puis candidats orthographiques concurrents à départager en argumentant ; puis révélation + règle. L'ingrédient actif est le **raisonnement verbalisé** et le **doute institutionnalisé** — ne jamais sauter à la réponse. **Toute dictée (y compris celle de l'examen d'entrée) est proposée en deux accents au choix : français de France et québécois** — les épreuves « Canada » des deux examens utilisent des contenus francophones canadiens, et alterner les accents renforce le mappage son→orthographe au lieu de le lier à une seule prononciation.
- **Drills de routines de vérification** : tests de substitution chronométrés (*vendre* pour -er/-é, *avait* pour a/à, *était* pour est/et), flèches de chaînes d'accord — jusqu'à automatisation sous charge.
- **Réparation de registre** : « réécris cette phrase orale en registre formel » (son risque n° 1 à l'examen après les accords).
- **Élévation vers le B2 (le deuxième chantier)** : après la correction des fautes, une passe distincte de la session propose des **montées en gamme** — « ta phrase est correcte mais de niveau B1 ; voici comment un candidat B2 l'écrirait » : vocabulaire plus précis (remplacer les mots passe-partout *chose, faire, bien, très*), subordination (« parce que » → « dans la mesure où », relatives, participiales), connecteurs argumentatifs, nominalisations. Chaque montée en gamme adoptée entre dans le corpus de révision espacée au même titre qu'une faute corrigée. Squelettes d'argumentation (thèse → 2-3 arguments + exemples → concession → conclusion) enseignés et exigés progressivement. La correction des fautes et l'élévation restent **visuellement séparées** : une erreur n'est pas un choix de niveau, et inversement.
- **Examens blancs complets** (60 min, conditions réelles) + **routeur TEF vs TCF** : après un blanc de chaque format, comparaison des pertes par critère → recommandation d'examen chiffrée.
- **Onboarding métalangage (10 min)** : sujet, COD, participe, groupe nominal — sans ce vocabulaire, le feedback métalinguistique est illisible pour un locuteur héritage jamais scolarisé en français.

### Le modèle personnel d'erreurs (le cœur des données)

- **Taxonomie française fixe ~30 catégories** (ACC-SV, ACC-GN, PP-AVOIR, /E/, HOM-a/à, HOM-ses/ces, CONJ, ACCENTS, REGISTRE, ANGLICISMES…), avec feuilles pour les items lexicaux récurrents.
- **Maîtrise par catégorie** (type Bayesian Knowledge Tracing) : chaque *occasion* dans ses textes est une observation — l'usage correct compte comme succès (sinon le modèle ne voit que des échecs). Crédit partiel selon le palier : auto-détecté > palier 0 > … > capitulation au palier 4.
- **Courbe d'oubli par catégorie** (type half-life regression simplifiée) : programme les échauffements ; intervalles croissants (1 j → 3 j → 1 sem → 3 sem → 2 mois) ; une catégorie n'est « retirée » qu'après plusieurs usages corrects rapides **en écriture libre**, pas seulement en drill.
- **Distinction registre/erreur** : les traits de l'oral ne sont pas pathologisés — ils sont catégorisés « choix de registre à adapter », pas « faute » (recommandation spécifique de la littérature heritage).

### Le tableau de bord (motivation d'adulte, pas de gamification infantile)

1. **Taux d'auto-détection** (% des fautes trouvées avant l'IA) — la métrique-titre : c'est littéralement la compétence que l'app existe pour construire.
2. **Fautes /100 mots en texte nouveau** (courbe de tendance) — la métrique que la recherche valide.
3. **Barres de maîtrise par catégorie**, mappées sur les critères officiels de l'examen.
3bis. **Indicateur de richesse** (le deuxième chantier) : diversité lexicale, part de phrases complexes, densité de connecteurs — suivi de la montée B1→B2 sur le critère linguistique/pragmatique.
4. **Estimation NCLC** (TEF /450 et TCF /20, seuils 310 et 10 affichés, clairement étiquetée *estimation*) + compte à rebours vers l'examen transformé en plan de sessions.
5. Une seule streak sobre (« écrit aujourd'hui »). Pas de points, pas de badges.

### L'écosystème (spécifique à sa situation)

Toute l'interaction pédagogique est portée par l'IA : Plume est le tuteur, le correcteur, l'examinateur blanc et le coach. Deux éléments de son quotidien nourrissent le dispositif sans en être des canaux :

- **La conversation quotidienne avec son père** : sujets d'écriture dérivés (« développe par écrit l'argument que tu as défendu hier ») — le pont oral→écrit est exactement son chantier ; le père peut glisser à l'oral les structures travaillées à l'écrit cette semaine-là.
- **Son habitude des outils IA** : un atout d'adoption, et un argument à lui donner franchement — Plume utilise l'IA *à l'envers* des correcteurs, parce qu'à l'examen l'IA ne sera pas là.

(Sa formation passée à l'Alliance française reste un acquis — l'app en hérite via le test de positionnement initial — mais aucune fonctionnalité ne dépend d'un professeur humain.)

---

## 6. Le moteur IA (ingénierie de la détection)

1. **Passe A (haut rappel)** : détection LLM, sortie JSON stricte `{début, fin, original, catégorie, règle, correction, confiance}` contre la taxonomie fixe ; tout span dont `original` ne correspond pas octet par octet au texte est rejeté (filtre anti-hallucination bon marché).
2. **Vote majoritaire** : 3 passes de détection (ou 3 variantes de prompt) ; seuls les edits majoritaires survivent (réduction prouvée de la sur-correction).
3. **Passe B (vérificateur)** : justifier chaque signalement par la règle nommée + confirmer que l'édit minimal ne change ni sens ni style ; l'injustifiable est abandonné ou rétrogradé en « à discuter » (séparé visuellement des erreurs).
4. **Politique de précision > rappel** : un faux signalement qui l'envoie chasser une faute inexistante est pédagogiquement toxique.
5. **Jeu d'évaluation privé** : aucun benchmark or de correction grammaticale française n'existe (MultiGEC-2025 : 12 langues, pas le français) → constituer 100-200 phrases issues de *ses* textes, vérifiées humainement, et tester le pipeline à chaque changement de prompt/modèle.
6. **Prompt tuteur type LearnLM** : politique explicite de révélation (« ne jamais donner la correction avant une tentative au palier courant ou un “montre-moi” explicite ; journaliser les capitulations »).
7. **Notation des examens blancs** : deux passes LLM indépendantes + réconciliation (miroir de la double correction humaine officielle), rendue par famille de critères (pragmatique / linguistique / sociolinguistique), en bandes NCLC.

---

## 7. Architecture technique

Le dépôt actuel (starter Cloudflare) fournit exactement la bonne base :

- **Frontend** : React 19 + Vite + Tailwind — éditeur d'écriture silencieux (textarea contrôlé, chrono, compteur de mots, saisie des accents), écrans de session, tableau de bord.
- **Backend** : Cloudflare Worker — endpoints de session ; appels à l'**API Claude** (`claude-sonnet-5` pour la détection/vote — rapide et économique en 3 passes ; `claude-fable-5` ou `claude-opus-5` pour le dialogue socratique et la notation des examens blancs).
- **Durable Objects / SQLite storage** : le modèle personnel d'erreurs (corpus de fautes, maîtrise par catégorie, planification espacée), l'historique des textes, les stats.
- **Workflows Cloudflare** (déjà dans le starter) : orchestration de la pipeline de détection multi-passes (A → vote → B) et de la notation différée des examens blancs.
- **TTS** (dictées et relecture audio de ses textes) : Web Speech API dans le navigateur pour commencer (gratuit), avec sélection de voix **fr-FR (France) et fr-CA (Québec)** pour toutes les dictées ; si les voix natives du navigateur sont insuffisantes, passer à une API TTS de qualité (ex. ElevenLabs, Google Cloud TTS) qui offre les deux variantes. Avertissement UX : l'audio ne révèle pas la morphologie muette.
- **Auth** : un seul utilisateur au départ — un simple token/lien privé suffit pour le MVP.

---

## 8. Feuille de route proposée

**MVP (objectif : utilisable par lui en ~1-2 semaines de dev)**
0. **Examen d'entrée** (§5, version complète dès le MVP : deux productions + dictée calibrée + chasse à l'erreur + micro-test de métalangage) → niveau CECR écrit, premier modèle d'erreurs, taux de détection de départ, et génération du premier curriculum. Toutes les hypothèses de niveau du présent brief sont à recaler sur ce résultat.
1. Éditeur silencieux + banque de sujets (5 formats d'épreuve + sujets « vie quotidienne/conversation »), avec sujets gradués (démarrer aux formats courts type TCF tâche 1-2, monter vers l'argumentatif).
2. Pipeline de détection (passe A + validation de spans + passe B ; le vote majoritaire peut suivre).
3. Auto-scan + échelle d'indices complète + consolidation par re-frappe.
4. Taxonomie d'erreurs + persistance du corpus personnel (Durable Object).
5. Tableau de bord minimal : taux d'auto-détection + fautes/100 mots + barres par catégorie.

**V1.1 (semaines 3-4)**
6. Échauffements générés depuis son corpus + planification espacée.
7. Dictée zéro faute solo + drills de substitution.
8. Examens blancs notés + routeur TEF vs TCF.
9. Bilan de progression exportable (PDF/HTML) — pour lui-même : profil de fautes, courbes, estimation NCLC datée.

**V2 (après le choix d'examen)**
10. Mode préparation intensive du format choisi ; banque de connecteurs et formules de lettre formelle ; réparation de registre systématique.
11. (Plus tard, comme convenu : module expression orale.)

**Attentes honnêtes à afficher dans l'app** : règles étroites → jours-semaines ; taux d'erreur global en texte libre → un trimestre à 10-20 min/jour, 5+ jours/semaine ; montée globale B1→B2 (richesse + argumentation + registre) → **4 à 6 mois à ~1 h/jour**. Jamais une grosse session hebdomadaire : la distribution bat la concentration (preuve forte).

---

## 9. Risques et limites

- **Aucun protocole intégré de ce type n'a été testé en RCT** : chaque composant est fondé individuellement (méta-analyses pour DWCF, feedback ciblé, espacement ; quasi-expérimental fort pour la dictée zéro faute), mais leur combinaison est une synthèse de conception. Mitigation : les deux métriques (auto-détection, fautes/100 mots en texte nouveau) diront vite si ça marche.
- **Précision de la correction française par LLM non auditée publiquement** → le jeu d'évaluation privé (point 6.5) est non négociable.
- **Friction pédagogique attendue** : la recherche montre que les apprenants *préfèrent* qu'on leur donne la réponse et perçoivent le socratique comme moins efficace — alors qu'il apprend plus. Lui expliquer le « pourquoi » du design, et autoriser un « montre-moi » par erreur (journalisé).
- **Règles d'immigration mouvantes** : dater et disclaimer toute affirmation NCLC/CRS ; ne jamais promettre « N fautes = N points » (aucun barème officiel n'existe).
- **Écart probable entre niveau global et niveau écrit** : le placement B1.5 de son école mesure surtout la compétence globale (orale) ; typique du profil héritage, son écrit est sans doute un ou deux crans en dessous. Le diagnostic initial de l'app mesure spécifiquement l'écrit et recale la part relative des deux chantiers (perception/orthographe vs élévation B2) et l'horizon de préparation. Sa progression de cours (B1.6 entamé) fournit un repère externe à recouper trimestriellement.

---

## 10. Sources principales

*Science de l'apprentissage* : Montrul (2012) sur les locuteurs héritage ; Perfetti (2007) Lexical Quality Hypothesis ; Kang & Han (2015, méta-analyse WCF, g=0.54) ; van Beuningen et al. (2012, n=268, correction directe) ; Shintani & Ellis (2013/2014, feedback métalinguistique) ; Bitchener & Knoch (2010, rétention 10 mois) ; Hartshorn et al. (2010, DWCF) ; Nadeau & Fisher (2014, dictée zéro faute, rapport FRQSC) ; Fayol & Brissaud (2020, Frontiers) sur la morphologie muette ; Cepeda et al. (2008) sur l'espacement ; Beaudrie (2017) intervention orthographique heritage.

*Conception tuteur IA* : LearnLM (arXiv 2412.16429) ; scaffolding socratique (arXiv 2607.03303) ; GECToR/Grammarly (tagging de spans) ; vote majoritaire anti-surcorrection (arXiv 2605.13624) ; études Criterion/ETS sur l'uptake superficiel ; Duolingo half-life regression (Settles & Meeder, ACL 2016).

*Relecture et détection de ses propres fautes* : Daneman & Stainton (1993) ; Burgoyne et al. (2022, le « déficit du texte propre » ne se réplique pas ; temps et fixations prédisent la détection) ; Cushing & Bodner (2022, voix haute efficace, police disfluente contre-productive) ; Pilotti et al. (2004, 2009, 2012) ; Staub (2018, l'échec de détection est post-visuel) ; Riefer (1991, lecture à rebours inefficace) ; Xie et al. (2018, méta-analyse : la disfluence perceptive n'améliore pas l'apprentissage) ; Taylor et al. (2020, Sans Forgetica inefficace) ; Largy, Fayol & Lemaire (1996) et Largy & Dédéyan (routines procédurales de vérification d'accord) ; Chanquoy (2001, révision différée) ; revues Cambridge Assessment (effets de présentation faibles/nuls, sauf taille de police).

*Examens* : Le français des affaires (méthodes officielles sections A/B) ; France Éducation International ; tables d'équivalence NCLC (IRCC — à revérifier sur canada.ca) ; Alliance française Toronto (centre TEF/TCF) ; consensus des écoles de préparation (Francofeels, ATF Montréal, CECFQ, PrepMyFrench).

*Outils existants* : Antidote, MerciApp, BonPatron, Projet Voltaire, Frantastique, PrepMyFuture, GlobalExam, LangCorrect, TalkPal — analyse des lacunes en §1 et §5.
