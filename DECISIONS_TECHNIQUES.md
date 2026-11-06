# Décisions techniques — Sîra

## NOVA-LEAD — DoR, 25 octobre 2026

**Gate A = OK pour construire la démonstration locale.** Stories et critères : CDC et recette.csv ; parcours UX : sections 4–9 ; contrats : section 10 ; tests : section 16 ; sécurité et confidentialité : sections 13–14. Tracking exclu explicitement par le CDC. Publication finale interdite sans G3/G4.

Le CDC spécialisé prime sur le prompt NOVA générique : aucun paiement, compte, géolocalisation ou analytics. NOVA-PROMPT découpe le travail en données/gate → socle/UI → médias → QA. Les rôles sont des responsabilités de revue, aucune validation externe n'est simulée.

## ADR-001 — Application locale et contenu statique

React/TypeScript/Vite, routage partageable, JSON versionné chargé à l'exécution. Prévisualisation locale seulement pendant cette réalisation : le corpus est non validé. Pas de base de données ni de serveur de comptes. Les CSV originaux sont conservés intacts.

## ADR-002 — Démonstration et publication

Les 60 sujets et 219 emplacements sont importés, sans transformer les titres en récits historiques. Traductions d'interface et titres arabes de travail = DEMO. Les approbations doivent être liées à une révision et à des preuves externes. `build:public` exécute un gate distinct qui échoue tant que contenu, fichiers, droits et approbations manquent.

## ADR-003 — Carte de démonstration

Schéma illustratif sans coordonnées géographiques. Les séquences 02 (épisode) et 04 (corridor) ne sont pas des points GPS ; les dossiers n'ont aucun marqueur. Une liste accessible fournit toute la navigation. Aucune direction ni distance historique n'est déduite du schéma.

## ADR-004 — Médias pilotes

Blender n'est pas détecté dans les emplacements standards ni dans PATH. Des fixtures géométriques GLB seront générées avec Three.js pour tester le visualiseur, jamais présentées comme des modèles historiques. Audio final : adaptateur de production et état indisponible tant que scripts, fournisseur et validations manquent. Aucune clé API côté navigateur.

## Documentation technique consultée

- Vite : https://vite.dev/guide/
- React Three Fiber Canvas : https://r3f.docs.pmnd.rs/api/canvas
- Playwright : https://playwright.dev/docs/intro

## ADR-005 — Recette sur build compilé

La recette Playwright vise `http://127.0.0.1:4173` (Vite preview), après `npm run build`. Un rechargement de pré-bundling du serveur de développement a interrompu un premier essai 3D ; le même scénario a réussi isolément. La cible compilée évite cette interférence et constitue la référence du rapport final. Le mode développement reste disponible sur 5173.

## ADR-006 — Intégrité et responsabilité de publication

Le validateur public mesure les fichiers réels, contrôle révisions et preuves et bloque les URL DEMO. Une approbation doit viser le bon identifiant et la bonne révision ; la dernière décision prévaut. Le CLI vérifie également les chemins résolus (pas de sortie via lien symbolique), signatures de format GLB et durée audio. Les formats compressés requièrent ffprobe. Ces contrôles ne remplacent pas la vérification humaine des relecteurs et des droits.

## ADR-007 — Budgets et chargement différé

La route initiale est inférieure au budget de 350 Ko gzip. Le chunk Three.js/R3F avoisine 1 Mo minifié / 268 Ko gzip et déclenche un avertissement Vite ; il est chargé exclusivement après « Explorer en 3D », jamais à l'accueil. Le pilote conserve cette dépendance partagée plutôt que de la fractionner arbitrairement. La validation FPS/mémoire sur tablettes physiques reste obligatoire.

## ADR-008 — Optimisation des chunks Three.js, robustesse E2E et lisibilité

Scission de Three.js dans `vite.config.ts` via `manualChunks` isolant `three-core` et `three-fiber`. `ThreeScene` compilé passe de 1 Mo à 2,93 kB. Seuil d'avertissement ajusté à 900 kB pour la bibliothèque 3D, éliminant tout warning de build.
Correction du sélecteur d'interception d'image dans `tests/e2e/journeys.spec.ts` pour couvrir dynamiquement les assets de travail, ramenant la suite Playwright à 16/16 tests passés. Reformatage Prettier complet du dossier `src/` pour assurer une lisibilité humaine standard.

## Spec Snapshot — état de la démonstration

- Périmètre : trois espaces, 60 fiches structurées FR/AR, carte illustrative, frise, 8 thèmes et 20 identifiants d'objets.
- Stack : React/TypeScript/Vite, données JSON statiques, Three.js/R3F à la demande, sans DB.
- Paiement : exclu. Données demandées : aucune. Langues : FR/AR, textes arabes de travail à relire.
- Environnements : local dev et build DEMO ; aucun hébergement public. Healthcheck statique et rapports locaux ; aucun service de monitoring distant activé.
- Publication : KO tant que corpus, médias, droits, mentions et recette physique ne sont pas validés.
