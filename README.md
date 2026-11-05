# Sîra — atlas de démonstration

Application React/TypeScript/Vite FR/AR, tablette et téléphone. **Version DEMO : aucun récit ni média historique final n'est approuvé. Pas de publication publique.**

## Démarrer

Node.js 22.12+ requis. Dans ce dossier :

```sh
npm ci
npm run dev
```

Ouvrir http://127.0.0.1:5173. Les liens directs `/chronologie/CHR-01`, `/hegire/HEG-ETP-03`, `/vie/VIE-01` fonctionnent. Tous les contenus structurés se trouvent dans `public/content/manifest.v1.json`, séparés des écrans.

```sh
npm run validate
npm run typecheck
npm run lint
npm test
npm run build
npm run preflight:demo
npx playwright install chromium
npm run test:e2e
npm run preview
```

Sur Windows dans un bac à sable restreint, les outils qui créent des processus peuvent nécessiter l'autorisation d'exécution. Les versions exactes sont verrouillées dans package-lock.json. `npm run seed` **régénère les fixtures DEMO depuis les CSV** et écrase le manifeste ; ne pas l'utiliser sur un corpus éditorial enrichi sans sauvegarde. `npm run demo:media` régénère les GLB/SVG/WAV de test ; le WebP fourni est déjà inclus.

## Utilisation

- Accueil : trois espaces, choix FR/AR et reprise locale.
- Chronologie : 6 périodes et 24 fiches ; filtres et navigation clavier.
- Hégire : 6 séquences, 6 dossiers, sélection carte/liste, déplacement, zoom, recentrage et tracé volontaire. Schéma sans coordonnées, pas de trajet GPS prétendument historique.
- Vie quotidienne : 8 thèmes, 24 fiches, 20 IDs d'objets. Trois GLB pilotes sont manipulables ; les autres objets ont un fallback marqué DEMO.
- Fiches : sections, sources/statut, narration absente explicite. « Tester le son » joue un signal technique de 8 s, **pas une narration**. Aucun autoplay ; changement de fiche/langue et arrière-plan mettent en pause.
- Aide : réduction de mouvement, confidentialité, effacement des préférences locales.

## Organisation

`src/pages` : espaces et fiches. `src/components` : lecteurs et contrôles partagés. `src/schema.ts` : schéma/gate. `scripts` : import et validation/pipeline médias. `tests` : unitaires et navigateur. `reports` : preuves de recette. `docs` : limites et production.

## Publication et sécurité

`npm run build` crée une **démo locale** dans dist. Ce dossier ne doit pas être rendu public. `npm run build:public` et toute compilation Vite sans mode demo exécutent le gate de publication, actuellement en échec attendu. Lire docs/PUBLICATION_GATE.md et docs/EXPLOITATION.md avant intégration du corpus.

Pas de compte, paiement, géolocalisation, analytics ni appel TTS côté client. Polices servies localement. Aucun secret nécessaire à la démonstration. Les clés de futurs fournisseurs restent uniquement dans le pipeline de production.

Le rapport `RAPPORT_AVANCEMENT.md` distingue tests automatisés, mesures locales, validations éditoriales et essais physiques non réalisés.

`npm run preflight:demo` exécute les validations de la démo, les registres éditoriaux, les contrôles statiques, les tests et le build. Il écrit `reports/preflight-demo.json`. Il ne tente pas de publication : `build:public` doit rester refusé tant qu'un lot de preuves indépendant n'est pas disponible.
