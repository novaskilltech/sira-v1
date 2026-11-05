# Rapport d'avancement — Sîra

**25 octobre 2026 — démonstration locale construite, testée et prolongée par un premier lot éditorial/média en revue. Publication publique non autorisée.**

## NOVA-LEAD — résultat

La démonstration est accessible sur **http://127.0.0.1:4173/** tant que le serveur local est actif. Relance : `npm run preview`. Le code, les données, les médias pilotes, les tests et les procédures sont dans le projet. Aucun service distant ni hébergement public n'a été créé.

Le CDC spécialisé prime sur le cadre SaaS générique : aucun compte, paiement, géolocalisation ou analytics. DoR = OK pour la démonstration, sans validation historique implicite. Décisions : `DECISIONS_TECHNIQUES.md`.

## Implémentation

- React/TypeScript/Vite, routes directes, FR/AR RTL, polices locales, tablette/téléphone, langue et reprise locales.
- Accueil illustré ; frise de 24 événements en 6 périodes avec filtres, sélection/aperçu et lecture ; galerie de 8 thèmes et 24 fiches.
- Hégire : 6 séquences, 6 dossiers sans marqueur, 4 repères généraux, sélection carte/liste, zoom, déplacement, recentrage, tracé volontaire, pause/rejeu et alternative statique. Aucune coordonnée GPS inventée.
- 60 fiches structurées bilingues, quatre sections DEMO, sources/statuts et liens croisés pilotes. **Ce ne sont pas 120 récits historiques approuvés.**
- Lecteur unique : lancement volontaire, pause, seek, positions FR/AR indépendantes, pause sur changement de fiche/langue et arrière-plan. Les deux signaux de 8 s ne sont pas des narrations.
- GLB à la demande : rotation, zoom, reset, fermeture du Canvas et libération des ressources ; fallback image/notice. Les **20** objets disposent maintenant d'un GLB technique distinct, strictement `DEMO / NON_VALIDE`.
- Chargements, erreurs et reprises pour manifeste/image/audio/GLB, données locales corrompues et interruption réseau. Réduction des mouvements, commandes tactiles de carte de 48×48 px.
- Schéma, intégrité, gate public, CI préparée et documentation démarrage/production/rollback. La CI distante n'a pas été exécutée, aucun dépôt distant n'étant configuré.
- Registre de production généré : 60 dossiers éditoriaux, 120 scripts de narration, 45 illustrations, 14 animations, 20 GLB et 20 fallbacks sont suivis séparément dans `editorial/`, tous à l'état `NON_VALIDE` jusqu'aux décisions externes.
- Pipeline de livraison : Sheikh Salah et Ahmed Dev Fullstack sont mandatés par le commanditaire dans les dossiers de revue. L'importeur `scripts/import-approved-editorial.ts` produit uniquement un candidat versionné dans `editorial/releases/validated/`, après contrôle exhaustif des 60 fiches, 219 assets et 20 objets ; il ne touche jamais au manifeste DEMO.

## Comptages réels

Les 11 empreintes du manifeste d'entrée sont conformes. Les CSV originaux sont conservés intacts.

| Ensemble | Quantité | État |
|---|---:|---|
| Fiches structurées | 60 : 24 CHR / 12 HEG / 24 VIE | DEMO FR/AR |
| Objets référencés | 20 | Candidats / DEMO |
| Emplacements médias | 219 | PLACEHOLDER |
| Récits/narrations définitifs | 0 / 60 — 0 / 120 | 60 dossiers FR/AR préparés, aucun texte ni narration livrée |
| GLB finaux approuvés | 0 / 20 | À produire/valider |
| Médias approuvés | 0 | Aucune approbation simulée |
| Illustrations de travail | 3 / 45 | `EN_REVUE`, non géographiques/non documentaires |
| Illustrations techniques DEMO | 45 / 45 | SVG locaux, sans êtres vivants ni assertion historique |
| Aperçus d’animation DEMO | 14 / 14 | déclenchement volontaire et alternative SVG fixe ; non documentaires |
| Fichiers DEMO techniques | 104 | 20 GLB + 20 SVG fallback + 45 SVG illustration + 14 SVG animation + 2 WAV + 2 MP3 + 1 WebP ; hors assets publiables |

Le répertoire `public/media/demo/` pèse **1 959 083 octets**. Paysage WebP : 1536×1024, 297 990 octets. GLB : 50 716, 15 548 et 76 232 octets ; réimport GLTFLoader vérifié. Les MP3 OpenRouter de contrôle pèsent 169 728 et 190 080 octets, avec hashes et interdiction de publication dans `public/media/demo/tts-demo-openrouter-provenance.json`. Prompt exact, provenance et contrôles : `docs/MEDIAS_DEMO.md`. Licences des polices/icônes : `docs/licenses/`.

Les 14 animations restent des emplacements de production. Leurs storyboards contrôlables et alternatives fixes sont consignés dans `docs/STORYBOARDS_ANIMATIONS_EN_REVUE.md`, mais aucune séquence finale n'est produite. Les trois dossiers pilotes sourcés de départ et leurs limites sont dans `docs/PILOTES_EDITORIAUX_EN_REVUE.md`.

La recette sur appareils physiques est prête à être consignée dans `docs/RECETTE_PHYSIQUE_A_REALISER.md`. Elle ne peut pas être remplacée par les tests Chromium locaux.

## Vérifications exécutées

| Commande / contrôle | Résultat | Preuve |
|---|---|---|
| `npm run seed` | 60 / 20 / 219 importés | reports/inventory.json |
| `npm run validate` | 0 anomalie DEMO | reports/validation-demo.json |
| `npm run demo:validate` | **104 fichiers médias DEMO + 1 provenance** ; en-têtes/métadonnées GLB, fallbacks SVG, 45 illustrations, 14 animations, WAV, WebP et MP3/provenance contrôlés ; interdiction de publication intacte | reports/demo-media-validation.json |
| `npm run editorial:validate` | 0 anomalie dans les dossiers de travail éditoriaux ; aucun statut n'est promu | reports/editorial-workpacks-validation.json |
| `npm run claims:validate` | **60 fiches**, 0 claim saisi, 0 anomalie ; aucune affirmation ne peut être ajoutée sans son appareil de preuve | reports/claims-register-validation.json |
| `npm run writing:prepare` + `npm run writing:validate` | **60 dossiers bilingues**, 0 texte FR, 0 texte AR, 0 anomalie ; aucune approbation ni publication possible depuis le registre | reports/writing-register-validation.json |
| `npm run sources:prepare` + `npm run sources:validate` | **60 dossiers de capture**, 0 passage saisi, 0 anomalie ; chaque futur passage exige exemplaire, emplacement, portée et limite | reports/source-dossiers-validation.json |
| `npm run sources:index:prepare` + `npm run sources:index:validate` | **60 fiches indexées** : 30 repérages gratuits non validés, 6 à relever, 24 nécessitant des sources matérielles complémentaires ; 0 claim | reports/source-research-index-validation.json |
| `npm run narrations:prepare` + `npm run narrations:validate` | **120 pistes de production**, 0 script, 0 fichier audio, 0 anomalie ; script/révision/claims et contrôles audio requis | reports/narration-production-validation.json |
| `npm run cartography:prepare` + `npm run cartography:validate` | **12 dossiers Hégire**, 0 géométrie, 0 coordonnée, 0 anomalie ; une source narrative ne peut produire une carte précise | reports/cartography-validation.json |
| `npm run editorial:verify` | Exécute successivement les six gates de travail : claims, rédaction, passages, narrations, cartographie et cohérence globale ; inclus dans le build DEMO | package.json, reports/ |
| `npm run physical:prepare` + `npm run physical:validate` | **46 contrôles de recette**, tous `NON_EXECUTE`, 0 anomalie de registre ; aucun essai matériel n’est simulé | recette-physique.v1.json, reports/physical-recipe-validation.json |
| `npm run preflight:demo` | **8 contrôles DEMO** consolidés : manifeste, médias, registres, recette, types, lint, tests et build ; sans tentative de publication | reports/preflight-demo.json |
| `npm run typecheck` | PASS | exécuté dans le build final |
| `npm run lint` | PASS, 0 erreur/warning final | commande locale |
| `npm test` | **55 PASS**, 7 fichiers, dont contrôle binaire des 20 GLB, des 20 fallbacks, des 59 visuels DEMO, des adaptateurs TTS et des preuves de revue d’un lot public | sortie Vitest locale du 29 octobre 2026 |
| `npm run build` | PASS, build DEMO | dist/, reports/build-files.sha256.json |
| `npm run test:e2e` sur build compilé | **15 PASS**, 3,3 minutes | reports/e2e-results.json |
| `npx playwright test --grep "DEMO animation previews"` | **1 PASS** : affichage, démarrage volontaire, pause et AR | reports/e2e-results.json |
| Axe sur 6 pages × FR/AR | **0 violation automatisée détectée** | reports/accessibility.json |
| `npm audit --json` | 0 vulnérabilité connue signalée | reports/dependency-audit.json |
| Motifs courants de secrets et injections HTML, src/scripts/public | Aucun motif trouvé | recherche statique locale, pas un audit exhaustif |
| `npm run build:public` | **REFUS attendu**, 2412 contrôles non satisfaits | reports/validation-public.json |
| Vite direct en mode public | **REFUS attendu avant transformation** | reports/public-build-refused.log |
| `npm run editorial:import -- --input editorial/releases/does-not-exist.json` | **REFUS attendu**, lot introuvable ; aucune écriture dans le manifeste DEMO | sortie locale du 25 octobre 2026 |
| Contrôle des MP3 OpenRouter | en-têtes MP3 et hashes conformes à la provenance ; `DEMO_NON_VALIDE` | sortie locale du 26 octobre 2026 |
| Recherche de secrets dans le dépôt | aucun motif de clé OpenRouter trouvé | recherche locale du 26 octobre 2026 |

Le navigateur vérifie les 60 fiches dans les deux langues (120 ouvertures), aperçu/filtres, retour/reprise, carte, audio, rotation de viewport, pannes, 3D et commandes tactiles. Captures : `reports/screenshots/`.

## Préparation des sources historiques

Le 28 octobre 2026, le registre `editorial/registre-corpus.v1.json` a été ajouté pour les deux titres choisis par le commanditaire. Il contient des notices bibliographiques candidates, **trois copies ou notices réellement consultées** et **deux pistes de passage** pour `HEG-ETP-03`, mais zéro passage enregistré comme validé et zéro approbation historique. Le dossier `editorial/recoupement-heg-etp-03.v1.json` sépare la convergence de repérage des détails qui doivent rester exclus. Le registre `editorial/registre-claims.v1.json` couvre les 60 fiches et exige, pour chaque future affirmation, des passages localisés, leur nature, leur portée, leurs limites, la comparaison des deux titres et une décision humaine. Le validateur éditorial contrôle désormais qu'un passage ne puisse pas être ajouté sans exemplaire identifié, qu'une décision humaine ne puisse pas exister sans passage localisé et que ce registre ne puisse jamais activer la publication. Les deux décisions de recherche sont explicitement `CONSERVER_COMME_PISTE_NON_PUBLIABLE`. L'import public exige aussi un relecteur identifiable et des preuves locales d'identité et de décision sous `editorial/evidence/`. Cette préparation ne constitue pas une validation de Sheikh Salah.

Le 29 octobre 2026, le rôle Sheikh Salah a produit l’avis de lecture `docs/AVIS_IA_NON_VALIDANT_HEG_ETP_03_SOURCES.md`. Il qualifie les deux relevés du pilote, isole les éléments à exclure et liste les vérifications à demander. Son statut est expressément `AVIS_IA_NON_VALIDANT` : il ne constitue ni une décision humaine, ni une approbation historique ou religieuse, et ne change aucun gate.

Le même jour, à la demande du commanditaire, la recherche bibliographique a ajouté une hypothèse d’édition **Bulak/Bulaq 1259 AH** pour Ibn Hishām : la graphie demandée « Bulrich » n’a pas été retrouvée telle quelle. La notice TDV signale Bulak comme première impression, mais aucun exemplaire Bulak n’a été consulté ; elle reste donc une notice candidate. Pour *Ar-Raḥīq al-Makhtūm*, la notice Waqfeya décrit une édition Dar-us-Salam 1416 AH/1996 de 503 pages, tandis que le PDF déjà consulté compte 452 pages : leur identité n’est pas présumée. Un troisième repérage, `CHR01-AR-RAHEEQ-001`, localise un passage de travail pour CHR-01 aux pages PDF 24–27 de ce PDF, sans ajouter de claim ni de récit. Dossier : `docs/RELEVE_PILOTE_CHR01_BULAK_AR_RAHEEQ.md`.

Les repérages gratuits ont ensuite été étendus sans crédit Firecrawl : `docs/REPERAGE_SOURCES_CHR02_CHR08_NON_PUBLIABLE.md`, `docs/REPERAGE_CHR09_CHR16_SOURCES_GRATUITES.md` et `docs/RELEVE_PILOTE_CHR17_24_HEG01_06.md` couvrent CHR‑02 à CHR‑24 et HEG‑ETP‑01 à 06. L’index machine `editorial/index-reperages-sources.v1.json` rend l’état des 60 fiches contrôlable : 30 repérages non validés, 6 dossiers Hégire encore à relever, 24 fiches de vie quotidienne exigeant un corpus matériel propre. Les deux ouvrages de sîra ne sont jamais considérés suffisants pour reconstituer un objet, un usage, une carte ou une localisation précise.

## Préparation de la rédaction FR/AR

Le 29 octobre 2026, `editorial/redaction-bilingue.v1.json` a préparé les **60 dossiers de rédaction**, chacun avec une version française et une rédaction arabe native distincte. Les 120 champs de texte sont volontairement vides : les sources n’autorisent pas encore la livraison d’un récit historique complet. Le flux documenté dans `docs/REDACTION_BILINGUE_WORKFLOW.md` impose les claims sourcés, une révision par langue, les relectures humaines FR et AR, puis la préparation séparée des deux scripts audio. Le validateur bloque un texte sans révision ni liens de claims, toute approbation dans ce registre, et toute capacité de publication. Les briefs structurés des 60 fiches ont été ajoutés dans `docs/BRIEFS_REDACTION_60.md` : chacun porte l’état de sa recherche source et ses quatre sections futures, sans rédaction historique anticipée.

## Trois chantiers suivants préparés

Le 29 octobre 2026, trois registres de production supplémentaires ont été créés et validés sans fabriquer de contenu historique :

- `editorial/dossiers-sources.v1.json` : 60 captures de passage à compléter, avec exemplaire, emplacement, portée et limite obligatoires ;
- `editorial/production-narrations.v1.json` : 120 pistes liées aux révisions et claims, avec contrôle futur de durée, hash, fournisseur, voix et cinq relectures ;
- `editorial/cartographie.v1.json` : 12 dossiers Hégire délibérément sans tracé, coordonnées ni géométrie tant qu’une source cartographique et une revue distincte ne sont pas disponibles.

Le détail opératoire est dans `docs/PIPELINE_SUITE_03.md`. Ces registres sont des entrées de travail `BROUILLON` et ne peuvent pas être utilisés comme lot de publication.

## Recette physique et livraison interne

Le registre `recette-physique.v1.json` a été généré le 29 octobre 2026 depuis les 46 critères de `recette.csv`. Les 46 contrôles sont explicitement `NON_EXECUTE` : appareil, OS, navigateur ou technologie d’assistance, testeur et preuves restent à renseigner lors de l’essai réel. `docs/RECETTE_PHYSIQUE_REGISTRE.md` explique le format et le validateur refuse toute recette prétendue exécutée sans ces éléments.

La commande `npm run preflight:demo` orchestre les huit contrôles de remise interne et produit `reports/preflight-demo.json`. Elle est reprise par `.github/workflows/ci.yml`. Elle ne déclenche pas de build public ; le refus de publication DEMO reste une vérification distincte et obligatoire.

Viewports FR/AR : **834×1194, 1194×834, 390×844, 844×390, 320×740**. Aucun débordement horizontal constaté. Chromium de test sous Windows : **aucun iPad/Android physique n'a été testé**.

## Performance finale

`node scripts/measure.mjs` : cinq chargements à cache HTTP froid, viewport 834×1194, réseau simulé 20 Mbit/s et RTT 50 ms, Chromium local Windows.

- LCP : 864, 908, 936, 804, 780 ms ; **médiane 864 ms**.
- CLS maximal : **0,000059**.
- JavaScript initial : **122 037 octets gzip** mesurés (budget 350 Ko).
- Image principale : **297 990 octets** (budget 1,5 Mo).
- Chunk 3D : environ 1 Mo minifié / 268 Ko gzip, uniquement à la demande. Avertissement Vite documenté, pas chargé à l'accueil.
- INP terrain et FPS/mémoire sur tablette : **non mesurés**.

Ce profil local ne certifie pas les appareils de référence. Mesures : `reports/performance.json`.

## Incidents et limites

Position de fin d'audio corrigée et couverte par régression. Workers Vitest Windows : exécution autorisée et pool threads configuré. Un pré-bundling Vite interrompait un premier essai 3D ; le scénario et la suite complète sont verts sur le build compilé. Les erreurs de typage/lint rencontrées ont été corrigées avant validation finale.

Le 26 octobre 2026, l’adaptateur OpenAI TTS a atteint le service mais a reçu `429` avant toute génération : aucun échantillon OpenAI ni narration n’a été écrit. Le secours Windows détecte les voix FR/AR mais l’hôte interdit leur synthèse ; le script s’arrête désormais sans écrire de fichier partiel. Les contrôles techniques de l’adaptateur OpenAI restent couverts par 51 tests locaux, mais une capacité TTS avec quota disponible demeure nécessaire pour produire des voix réelles.

Le même jour, OpenRouter a renvoyé 36 modèles TTS lors de la consultation de catalogue. Un premier essai a été refusé avec `401` (clé expirée), puis une clé active a permis de générer deux contrôles sonores MP3 non historiques, hors manifeste. Les fichiers restent `DEMO_NON_VALIDE`, sans durée de publication mesurée, sans écoute FR/AR ni approbation de droits : ils ne comptent pas parmi les 120 narrations et ne lèvent aucun gate.

Restent : saisie sourcée des claims, rédaction et relecture française/arabe natives des 60 récits, 120 scripts et narrations révisés, médias/droits finaux, cartographie documentée, intégration approuvée des illustrations/animations, coordonnées réelles de l'exploitant, tests physiques/VoiceOver/TalkBack/grande police, hébergement HTTPS et vérification réelle des en-têtes. `_headers` est une configuration à appliquer ; Vite preview n'est pas un hébergeur de production.

## Gates et backlog

- **BUILD_TECHNIQUE_OK : OK pour cette démonstration locale.**
- **G1/G2 : prototype et essais automatisés OK ; réception physique incomplète.**
- **G3 : KO — corpus, médias finaux et approbations externes absents.**
- **G4 / PUBLICATION_HISTORIQUE_OK / PUBLICATION_OK : KO. Aucune publication réalisée.**

Suivi des 39 tâches : `reports/backlog-progress.csv`, avec tâches DEMO, partielles ou bloquées séparées. P1/P2 non développés. Livrables et preuves de validation : `docs/PRODUCTION_RESTANTE.md`. Aucune personne, licence finale ou signature d'expert n'a été inventée.
