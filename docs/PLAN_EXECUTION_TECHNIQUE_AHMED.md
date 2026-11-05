# Plan d'exécution technique — Ahmed Dev Fullstack

**État d'audit : 25 octobre 2026.** Ce document ordonne les travaux que le responsable technique peut exécuter et les preuves qu'il doit obtenir. Il ne confère aucune approbation historique, religieuse, linguistique, de droits ou humaine.

## Décision de départ

La démo locale est techniquement exploitable pour la production et la recette automatisée. La publication publique est volontairement refusée : `reports/validation-public.json` recense **2 412** conditions insatisfaites, principalement parce que les 60 fiches, 120 audios et 219 emplacements médias sont encore sans contenu, source localisée, droit ou décision humaine liée à une révision.

| Domaine | État réel | Preuve existante | Prochain résultat technique attendu |
|---|---|---|---|
| Application | Démo React/TS/Vite fonctionnelle | 46 tests unitaires ; 15 parcours Playwright réussis | Conserver le socle pendant l'intégration par lots |
| Registre public | Schéma et gate en place ; manifeste uniquement `demo` | `src/schema.ts`, `scripts/validate.ts` | Générer et valider un manifeste `public` à partir de données approuvées |
| Dossiers éditoriaux | 60 fiches et 120 narrations préparées, toutes `NON_VALIDE` | `editorial/*.v1.json`, `scripts/import-approved-editorial.ts` | Remplir et figer un lot de preuves réellement approuvé |
| Illustrations / animations | 3 brouillons `EN_REVUE`, 14 storyboards ; aucun média final | `public/media/drafts/`, `docs/STORYBOARDS_ANIMATIONS_EN_REVUE.md` | Intégrer seulement les fichiers approuvés et leurs alternatives fixes |
| 3D | 20 GLB techniques distincts, non documentaires | `public/media/demo/OBJ-*.glb` | Contrôler les GLB finals, fallbacks, poids, source éditable et appareil |
| Cartographie | Interface et garde-fous présents ; carte schématique | `src/pages/Hegira.tsx`, `src/components/Artwork.tsx` | Consommer une couche cartographique sourcée, avec incertitudes visibles |
| Exploitation | Documentation et modèle d'en-têtes présents ; aucun hébergeur configuré | `docs/EXPLOITATION.md`, `public/_headers` | Déployer seulement après gate et vérifier HTTPS, réécriture SPA, Range et logs |
| Appareils physiques | Non exécuté | `docs/RECETTE_PHYSIQUE_A_REALISER.md` | Archiver des essais sur appareils réels et corriger les anomalies |

`BUILD_TECHNIQUE_OK` ne peut être affirmé que pour la démo locale actuelle. `PUBLICATION_HISTORIQUE_OK` et `PUBLICATION_OK` sont tous deux **KO**.

## Règles d'exploitation du pipeline

1. Une révision éditoriale ne devient jamais publique par simple changement de statut. Chaque décision doit préciser `targetId`, `targetRevision`, `dimension`, `reviewerId`, `reviewerRole`, date et lien vers la preuve.
2. Ne jamais relancer `npm run seed` ou `npm run editorial:prepare` sur des registres enrichis sans sauvegarde : ces commandes régénèrent les gabarits à partir des inventaires gelés et remplacent les fichiers de travail.
3. Aucun secret de TTS, d'hébergement ou de service tiers ne va dans `src/`, dans le manifeste, les rapports ou Git. Le point d'intégration TTS prévu est serveur/build dans `scripts/media-provider.ts`.
4. Une erreur de validation est un blocage à corriger dans les données ou les fichiers. Elle ne doit jamais être neutralisée par une exception, un statut fictif ou une approbation simulée.
5. Toutes les commandes de publication restent exécutées sur une copie versionnée des contenus et médias du lot, avec les preuves archivées à côté.

## Phase 1 — Mettre en place l'import contrôlé du contenu validé

**Responsable : Ahmed. Dépendance externe : dossiers réellement complétés et décisions recevables.**

Le projet possède deux formats : les dossiers `editorial/*.v1.json`, conçus comme file de production, et `public/content/manifest.v1.json`, consommé par l'application et le gate. L'importeur `scripts/import-approved-editorial.ts` est en place : il accepte seulement un lot sous `editorial/releases/`, exige une mise à jour unique de chacune des 60 fiches, 219 assets et 20 objets, refuse une version non sûre, puis produit un candidat versionné sans modifier le manifeste DEMO. Le gate de schéma et le gate public s'exécutent avant toute sortie.

| Action | Entrée nécessaire | Exécution Ahmed | Critère de sortie | Preuve attendue |
|---|---|---|---|---|
| Figer le lot | Copie des 3 pilotes puis des lots suivants, avec révision | Créer un dossier de lot daté, checksum des JSON et des médias | Le lot peut être rejoué sans dépendre du brouillon courant | Manifeste de lot, SHA-256, journal d'import |
| Valider les workpacks | Fiches/narrations/assets remplis sans statut fictif | Étendre ou exécuter `npm run editorial:validate` | Toute référence, décision ou fichier absent provoque une erreur claire | Rapport `reports/editorial-<lot>.json` |
| Mapper vers le manifeste | Textes FR/AR, médias, références et décisions réelles | Exécuter `npm run editorial:import -- --input editorial/releases/<lot>.json` ; le script conserve les IDs, refuse les doublons/omissions et complète `referenceIds`/`approvalRecords` | Aucun `DEMO`, URL de brouillon ni champ inventé dans la sortie publique | `editorial/releases/validated/manifest.<version>.json` validé |
| Vérifier une révision | Décision de Sheikh Salah et autres rôles requis | Refuser une décision qui ne correspond pas exactement à la révision publiée ou dont la dernière décision est `REFUSE` | Modification du texte, de l'audio ou du média invalide l'approbation précédente | Test unitaire de régression et rapport d'import |
| Prévisualiser sans publier | Manifeste de lot validé mais non encore mis en ligne | Construire un canal interne séparé ou servir localement le manifeste de lot | Les relecteurs consultent exactement les fichiers qui seraient publiés | URL/environnement interne, hash et captures de revue |

Le script devra accepter uniquement des preuves référencées ; il ne doit pas décider de leur valeur. L'identité et la compétence du relecteur sont contrôlées par l'exploitant, pas déduites par l'application.

## Phase 2 — Chaîne audio et textes

**Dépendances humaines : revue historique de Sheikh Salah, revue FR, revue AR native, droits et prononciation.**

1. Pour chaque fiche pilote, saisir séparément le texte FR et le texte AR, leur `revision`, les références localisées et les décisions liées à cette révision.
2. Ahmed exécute l'import en mode simulation et vérifie que les deux scripts sont attachés aux bons IDs audio.
3. Après les trois approbations de script requises, configurer un fournisseur TTS autorisé hors client Web via l'interface `TtsProvider`. Le fournisseur réel et les clés ne sont pas choisis ni configurés dans le dépôt à ce stade.
4. Mesurer le fichier généré. WAV est mesurable par le validateur existant ; MP3/OGG/M4A exigent `ffprobe` disponible dans le PATH du pipeline. Refuser une piste hors 180–300 s, de mauvaise langue, de mauvaise révision ou sans métadonnées de fournisseur.
5. Après l'écoute humaine et la décision de prononciation, copier l'audio sous un chemin versionné `/media/...`, enregistrer taille, SHA-256, MIME, durée mesurée, licence, crédit, références et approbations.
6. Vérifier dans Chromium que l'audio reste volontaire, unique, stoppé à la navigation/changement de langue et récupérable en cas d'échec. Les signaux de 8 s de `public/media/demo/` ne constituent jamais une narration.

**Sortie du lot audio :** 2 pistes par fiche, chacune avec script correspondant, durée binaire mesurée, hash, droits, décisions et parcours de panne réussi.  
**Preuves :** rapport du validateur, fichier de mesure, procès-verbal d'écoute, résultats `npm test` et `npm run test:e2e`.

## Phase 3 — Illustrations et animations

**Dépendances humaines : direction artistique, revue historique si l'image porte une assertion, droits, revue visuelle.**

| Action | Contrôle technique Ahmed | Sortie admissible |
|---|---|---|
| Illustration | Vérifier dimensions, poids, type MIME, hash, alt FR/AR, légende, crédit, licence, absence de chemins `drafts`/`demo` | WebP ou PNG versionné dans `/media/`, référencé par l'actif approuvé |
| Conformité de représentation | Mettre en revue visuelle explicite : aucune personne, silhouette, avatar, main, ombre humaine ou animal | Décision `visual` liée à la révision, sans remplacement automatique par IA |
| Animation | Conserver déclenchement volontaire, pause/reprise et alternative fixe ; définir le format (vidéo ou JSON) avant intégration | Extension du schéma, du validateur et des tests avant tout actif final |
| Performances | Mesurer poids, LCP/chargement différé et comportement reduced motion | Budget documenté par type de média et capture de recette |

Le contrat public actuel autorise les images, GLB et audio, mais pas encore un format final d'animation. Ahmed doit d'abord choisir et documenter le format retenu, étendre `safeMediaUrl`, les contrôles MIME/taille, le build et les tests de fallback. Aucune des 14 animations ne doit être ajoutée au manifeste avant cette évolution.

## Phase 4 — Modèles 3D et fallbacks

**Dépendances humaines : documentation matérielle, droits, revue visuelle et essai sur appareil.**

1. Pour chaque objet : collecter les références, les limites d'interprétation, le fichier source éditable (`.blend` ou équivalent), le GLB final et l'image fallback.
2. Ahmed vérifie le binaire GLB, le MIME `model/gltf-binary`, le hash, la taille, le confinement dans `public/media/` et la liaison objet → GLB → fallback. Le validateur vérifie déjà l'en-tête GLB.
3. Ajouter des contrôles automatisés de budget (taille, triangles/textures si l'outil d'inspection est disponible) et un test de rendu/fallback sur échec WebGL.
4. Faire la recette physique des 20 objets : chargement à la demande, rotation/zoom/recentrage accessibles, fermeture du Canvas, absence de fuite apparente, FPS acceptable et fallback réel.

Les 20 fichiers de `public/media/demo/` prouvent le fonctionnement de l'interface seulement. Ils ne remplacent ni le modèle source, ni la documentation, ni la validation de l'objet final.

## Phase 5 — Cartographie documentée

**Dépendances humaines : décision historique/religieuse de Sheikh Salah lorsque pertinente et spécialiste cartographique.**

La carte actuelle est une évocation contrôlée : pas de coordonnées GPS, quatre repères généraux, six séquences et six dossiers sans marqueur. Ahmed doit conserver ces protections.

| Étape | Travail technique | Preuve de sortie |
|---|---|---|
| Contrat de couche | Définir un fichier versionné de couches avec ID, type (`general_marker`, `illustrative_corridor`, `area`), références et incertitude FR/AR | Schéma validé et fichier de lot |
| Garde-fou géographique | Refuser les dossiers `not_mappable` avec pin ; refuser les couches sans `sourceIds` ; ne jamais transformer une géométrie illustrative en GPS | Tests unitaires et rapport de validation |
| Rendu | Consommer la couche en laissant la géographie elle-même LTR quand le texte est AR/RTL | Capture FR/AR, test de zoom/pan/commandes alternatives |
| Révision | Afficher la légende et les limites associées à la même révision que le contenu | Source/couche/révision visibles dans le dossier de lot |

## Phase 6 — Préparer la publication publique

**Prérequis absolu : toutes les phases précédentes sont terminées pour les 60 fiches et 219 médias.**

1. Remplacer les références codées en dur vers `/media/demo/`, `/media/drafts/`, `MapArt` et `ObjectArt` dans les écrans par des données issues du manifeste public. Les décorations de démo ne doivent pas passer dans le bundle public.
2. Compléter l'opérateur réel dans le manifeste : nom, contact, hôte et confirmation de la politique de confidentialité. Ahmed ne les invente pas.
3. Installer `ffprobe` dans l'environnement CI/release si des narrations compressées sont employées ; consigner sa version et le résultat de mesure.
4. Exécuter, dans cet ordre : `npm run editorial:validate`, `npm run validate:public`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build:public`, puis la suite E2E contre le bundle public.
5. Vérifier que le bundle ne contient pas `media/demo`, des brouillons, des chemins non référencés ou des secrets. Produire hashes de build, rapport de validation et liste des fichiers distribués.
6. Obtenir une décision de l'exploitant pour la version complète. Cette décision est externe au build et ne peut être simulée par Ahmed.

## Phase 7 — Hébergement et recette physique

**Aucun déploiement public ne part avant le gate et la recette physique.**

| Vérification | Exécution | Preuve attendue |
|---|---|---|
| Hébergement HTTPS | Configurer réécriture SPA vers `index.html`; servir `/content/` et `/media/` comme fichiers ; retourner 404 aux fichiers inexistants | URL de préproduction, relevé `curl`/navigateur et configuration versionnée |
| En-têtes | Transposer et tester CSP, `nosniff`, referrer policy, permissions policy, frame protection et cache du modèle `public/_headers` | En-têtes de réponse enregistrés sur préproduction |
| Audio | Vérifier les requêtes `Range`, reprise, erreur fichier et absence de lecture automatique | HAR/captures et fiche de recette |
| Vie privée | Contrôler l'absence de trackers, cookies d'identification et géolocalisation personnelle ; limiter les logs selon la politique validée | Rapport réseau et configuration de logs |
| iPad/iPhone | Safari portrait/paysage, VoiceOver, 200 %, audio, carte, 20 GLB | Fiches de recette datées, appareil/OS/navigateur et anomalies |
| Android | Chrome, TalkBack, reduced motion, réseau réduit, fallback média/3D | Fiches de recette datées, appareil/OS/navigateur et anomalies |
| Reprise | Publication atomique code + manifeste + médias, conservation de deux versions, rollback testé | Procès-verbal de rollback et hash de chaque version |

## Ordre de travail recommandé

1. **Employer l'importeur contrôlé** sans toucher au manifeste DEMO actuel ; son contrat est dans `editorial/releases/README.md`.
2. **Piloter CHR-01, HEG-ETP-03 et VIE-01** dès réception de leurs décisions documentées ; valider toute la chaîne contenu → média → manifest → prévisualisation.
3. **Industrialiser par lots de trois à six fiches** : import, validation, build interne, revue, corrections. Ne pas attendre les 60 fiches pour découvrir un défaut technique.
4. **Étendre les contrôles médias et cartographiques** dès que les formats finals sont choisis.
5. **Passer le corpus complet au gate public**, puis seulement préparer l'hébergement et exécuter la recette physique.

## Commandes de contrôle actuelles

```powershell
npm run editorial:validate
npm run validate
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
```

La commande de publication `npm run build:public` doit aujourd'hui échouer. Son succès ne sera attendu qu'après intégration de l'ensemble des données, fichiers, preuves et paramètres réels ci-dessus.

## Journal de fin attendu par lot

Ahmed archive, sans données secrètes, un rapport contenant : version du manifeste, IDs intégrés, hashes, résultats des commandes, versions Node/outils, incompatibilités détectées, décisions externes référencées, médias/fallbacks contrôlés, résultats appareils réels et décision de mise en ligne de l'exploitant. Une phrase de synthèse doit toujours séparer :

- `BUILD_TECHNIQUE_OK` : contrôles techniques passés pour une version identifiée ;
- `PUBLICATION_HISTORIQUE_OK` : corpus et validations externes réellement reçus ;
- `PUBLICATION_OK` : décision finale de l'exploitant après les deux précédentes.
