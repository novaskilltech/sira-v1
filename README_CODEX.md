# Sîra — Dossier final prêt pour Codex

**CDC V1.0 (25 octobre 2026)** — le cahier des charges produit est inchangé ; seul le dossier de transmission a été adapté de Anti-Gravity à **Codex**.

## Démarrage

1. Créer ou ouvrir un espace de travail pour Codex.
2. Extraire **tout** le ZIP à la racine du projet.
3. Fournir à Codex la consigne de `PROMPT_CODEX_DEMARRAGE.md` (ou lui demander de lire ce fichier).
4. Dans les environnements reconnaissant `AGENTS.md`, Codex suivra également automatiquement les règles de ce fichier.
5. Connecter ensuite les services réellement disponibles : Blender local/MCP pour 3D, un TTS autorisé pour FR/AR, outil d'illustration, hébergement/CDN. Les intégrations peuvent nécessiter installations, autorisations et abonnements supplémentaires.

## Inventaire du package

- `CDC_SIRA_V1_FINAL.md` — source de vérité pour la construction.
- `CDC_SIRA_V1_FINAL.pdf` — même contenu, lecture/partage.
- `AGENTS.md` — consignes générales reconnues par Codex.
- `PROMPT_CODEX_DEMARRAGE.md` — demande prête à coller.
- `PIPELINE_MEDIAS_CODEX.md` — 3D, images, narrations, qualité, permissions.
- `inventaire_contenus.csv` — 60 fiches.
- `inventaire_objets_3d.csv` — 20 objets.
- `inventaire_medias.csv` — 219 emplacements de médias.
- `backlog.csv` — 39 tâches priorisées.
- `recette.csv` — 46 tests.
- `MANIFEST_SHA256.txt` — empreintes de contrôle.

## Limite fondamentale

Le dossier est **prêt pour le développement** mais ne contient pas les textes historiques complets approuvés, les 120 voix finales ni les 20 modèles 3D. Codex peut orchestrer leur production avec les outils connectés ; les approbations historiques, linguistiques et juridiques restent indépendantes et ne peuvent pas être supposées acquises. La publication doit être bloquée tant que ces contrôles ne sont pas satisfaits.

**Il n'est pas nécessaire de demander de nouveaux choix de cadrage produit à l'utilisateur.**
