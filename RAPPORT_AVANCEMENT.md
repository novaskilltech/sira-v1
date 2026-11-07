# Rapport d'avancement — Sîra V1.0

**7 novembre 2026 — Catalogue complet (60 fiches bilingues FR/AR, 120 narrations audio MP3, 20 modèles 3D GLB multi-matériaux, 45 illustrations originales, 14 aperçus d'animation et cartographie interactive de l'Hégire enrichie) intégré et vérifié en mode DEMO / BROUILLON_IA_NON_VALIDE. Publication publique soumise au comité scientifique indépendant.**

## NOVA-LEAD — Résultat global

L'application est opérationnelle sur **http://127.0.0.1:4173/** (`npm run preview`) et synchronisée sur le dépôt GitHub (`https://github.com/novaskilltech/sira-v1.git`, branche `main`).

Conformément au `CDC_SIRA_V1_FINAL.md`, l'application ne comporte aucun compte utilisateur, paiement, géolocalisation personnelle ni traceur tiers. La gouvernance documentaire stricte distingue **`BUILD_TECHNIQUE_OK = OUI`** et **`PUBLICATION_HISTORIQUE_OK = NON`** tant que la validation scientifique, linguistique et juridique finale n'a pas été signée par les experts mandatés.

---

## Implémentation réalisée (100 % du périmètre V1.0 en mode DEMO / Brouillon IA)

1. **Architecture & Expérience Bilingue FR/AR (RTL/LTR)** :
   - React 19 / TypeScript / Vite, routes directes vers les 3 espaces (*Chronologie*, *Hégire*, *Vie quotidienne*) et les 60 fiches, bascule instantanée Français (LTR) / Arabe (RTL) avec polices locales (`IBM Plex Sans` & `IBM Plex Sans Arabic`), persistance locale de la langue et de la reprise de lecture.
2. **60 Fiches Éditoriales Bilingues (480 sections FR & AR)** :
   - Rédaction intégrale des 15 lots éditoriaux (`docs/LOT_01` à `docs/LOT_15_REDACTION_BROUILLON_IA.md`) couvrant les **24 fiches Chronologie (`CHR-01` à `CHR-24`)**, les **12 fiches Hégire (`HEG-ETP-01` à `06` et `HEG-DOS-07` à `12`)** et les **24 fiches Vie quotidienne (`VIE-01` à `VIE-24`)**.
   - Synchronisation complète dans `public/content/manifest.v1.json` via `scripts/sync-manifest-all-texts.mjs` : chaque fiche affiche ses 4 sections structurées (*Introduction / تمهيد*, *Le contexte / السياق التاريخي*, *Le récit / السرد الموضوعي*, *À retenir / خلاصة مرجعية*) ainsi que son chapô introductif bilingue.
3. **120 Narrations Audio MP3 (60 FR + 60 AR)** :
   - Génération complète des 120 pistes audio MP3 dans `public/media/drafts/` (lots 1 à 15) et raccordement intégral dans `src/components/AudioPlayer.tsx`.
   - Lecteur audio unique à déclenchement volontaire, mémorisation indépendante de la position FR et AR, pause automatique au changement de fiche, de langue ou de mise en arrière-plan.
4. **20 Objets Archéologiques 3D GLB (`OBJ-001` à `OBJ-020`)** :
   - Modélisation procédurale haute définition multi-matériaux PBR (`scripts/generate-rich-3d-models.mjs`) dans `public/media/demo/OBJ-001.glb` à `OBJ-020.glb` : terre cuite tournée, bois d'acacia et d'olivier, fer forgé, bronze patiné, basalte volcanique, cuir tanné, fibres de palmier tressées, calame de roseau.
   - Centrage normalisé à `(0,0,0)` (`extent = 2.0`), chargement à la demande via React Three Fiber (`ThreeScene.tsx`), rotation/zoom/reset, libération explicite de la mémoire GPU à la fermeture, fallback 2D SVG et métadonnées `DEMO / NON_VALIDE`.
5. **45 Illustrations Originales (`IMG-*`) & 14 Aperçus d'Animation (`ANI-*`)** :
   - Génération de 59 compositions vectorielles thématiques multicouches sur mesure (`scripts/build-demo-visual-fixtures.mjs`, `npm run demo:visuals`) respectant l'aniconisme strict (aucune figure humaine, silhouette, visage, main, ombre humaine ni animal).
   - Empreintes SHA-256 et tailles d'octets synchronisées dans `public/content/manifest.v1.json` et contrôlées par `npm run demo:validate`.
6. **Cartographie Interactive de l'Hégire & 12 Notices Géographiques (`src/pages/Hegira.tsx`)** :
   - Carte interactive SVG enrichie avec les régions topographiques bilingues (*Mer Rouge*, *Plaine côtière de la Tihâma*, *Massifs volcaniques du Hedjaz*), le tracé de l'axe caravanier intérieur traditionnel en pointillés sépia comparé au corridor littoral de l'Hégire, 4 jalons intermédiaires indicatifs (*‘Usfân*, *Qadîd*, *Al-Juhfa*, *Wâdî al-‘Aqîq*), les 4 repères généraux interactifs (*La Mecque*, *Thawr*, *Qubâ’*, *Médine*) et une échelle indicative.
   - 12 notices méthodologiques et géographiques détaillées FR/AR (`geography.uncertainty`) injectées via `scripts/enrich-hegira-geography.mjs` pour chacune des 6 étapes et 6 dossiers de l'Hégire.

---

## Comptages réels vérifiés

| Ensemble | Quantité | État dans l'application | Statut de gouvernance |
|---|---:|---|---|
| **Fiches structurées bilingues (FR + AR)** | **60 / 60** (480 sections) | Injectées dans `public/content/manifest.v1.json` | `BROUILLON_IA_NON_VALIDE` (`DEMO`) |
| **Narrations audio MP3 (FR + AR)** | **120 / 120** (60 FR + 60 AR) | Générées dans `public/media/drafts/` et câblées dans `AudioPlayer.tsx` | `BROUILLON_IA_NON_VALIDE` |
| **Modèles 3D archéologiques GLB** | **20 / 20** (`OBJ-001`..`020`) | Maillages PBR réalistes dans `public/media/demo/` + 20 fallbacks SVG | `DEMO / NON_VALIDE` |
| **Illustrations originales SVG** | **45 / 45** (`IMG-*`) | Compositions thématiques multicouches dans `public/media/demo/illustrations/` | `DEMO / NON_VALIDE` |
| **Aperçus d'animation SVG** | **14 / 14** (`ANI-*`) | Séquences vectorielles animées à déclenchement volontaire dans `public/media/demo/animations/` | `DEMO / NON_VALIDE` |
| **Cartographie & dossiers Hégire** | **12 / 12** (`6 ETP` + `6 DOS`) | Carte topographique interactive + 12 notices d'incertitude géographique FR/AR | `DEMO / BROUILLON_SANS_GEOMETRIE` |
| **Approbations scientifiques simulées** | **0** | Aucune signature d'expert inventée ; `PUBLICATION_HISTORIQUE_OK = NON` | Gate public verrouillé |

---

## Vérifications automatisées exécutées (7 novembre 2026)

| Commande / Contrôle | Résultat | Détail / Preuve |
|---|---|---|
| `npm run validate` | **PASS (0 anomalie)** | 60 fiches, 219 emplacements médias, 20 objets 3D validés (`reports/validation-demo.json`) |
| `npm run demo:validate` | **PASS (104 médias DEMO + 1 provenance)** | Vérification SHA-256, octets, bornes 3D GLB, aniconisme SVG et gate de non-publication (`reports/demo-media-validation.json`) |
| `npm run editorial:verify` | **PASS (0 anomalie)** | 6 gates éditoriaux vérifiés (`claims`, `writing`, `sources`, `sources:index`, `narrations`, `cartography`, `editorial`) |
| `npm run typecheck` | **PASS (0 erreur)** | Vérification stricte TypeScript (`tsc --noEmit`) |
| `npm run lint` | **PASS (0 erreur, 0 warning)** | Analyse statique ESLint sur l'ensemble du dépôt |
| `npm test` | **PASS (55 / 55 tests)** | 7 suites Vitest : schémas, stockage, audio, 3D GLB/visuels, adaptateurs TTS, preuves d'import |
| `npm run build` | **PASS** | Build de production Vite compilé dans `dist/` |
| `npm run test:e2e` | **PASS (16 / 16 tests E2E)** | Playwright Chromium (2,3 min) : ouverture des 60 fiches en FR et AR (120 vues), carte Hégire, audio, 3D GLB, résilience hors-ligne/erreurs, 5 viewports responsives FR/AR et audit accessibilité Axe (0 violation) (`reports/e2e-results.json`) |

---

## Gates de livraison

- **`BUILD_TECHNIQUE_OK` : OUI** (100 % des fonctionnalités, textes de travail, narrations audio, modèles 3D, illustrations, animations, cartographie interactive et tests unitaires/E2E opérationnels).
- **`PUBLICATION_HISTORIQUE_OK` : NON** (bloqué intentionnellement par les gates `editorial/` et `validate:public` jusqu'à la relecture humaine et la signature formelle des dossiers par l'historien-référent et le réviseur linguistique).
