# AGENTS.md — Projet Sîra (Codex)

## Mission

Construire **l'application Sîra V1.0** conformément au fichier `CDC_SIRA_V1_FINAL.md` (source de vérité), avec un fonctionnement tactile tablette portrait prioritaire, adaptation paysage et téléphone, français/arabe RTL, trois espaces (Chronologie, Hégire, Vie quotidienne) et une direction immersive. L'utilisateur a choisi **Codex**, pas Anti-Gravity. Avancer de manière autonome sur les décisions d'implémentation sans réouvrir les arbitrages déjà documentés.

## Ordre des sources

1. `CDC_SIRA_V1_FINAL.md` — prioritaire si conflit.
2. `inventaire_contenus.csv`, `inventaire_objets_3d.csv`, `inventaire_medias.csv`.
3. `backlog.csv` et `recette.csv`.
4. `PIPELINE_MEDIAS_CODEX.md` — procédures médias et contrôles, subordonnées au CDC.
5. `PROMPT_CODEX_DEMARRAGE.md` — procédure de démarrage.
6. Références SPEC/UX/DA antérieures, si fournies, uniquement à titre d'illustration compatible.

## Exigences de résultat

- 60 fiches : 24 CHR, 12 HEG, 24 VIE. Deux langues : FR et AR.
- 120 narrations **définitives attendues** (3–5 min chacune); 20 objets 3D distincts avec fallback 2D ; 45 illustrations et 14 animations sont des **emplacements prévisionnels**.
- Interface sans personnages, silhouettes, avatars, mains, ombres humaines ni scènes humaines ; même interdiction pour les assets générés et modèles.
- Pas d'inscription, paiement, géolocalisation personnelle ni pisteur de visiteurs. Connexion pendant l'utilisation.
- Architecture de référence React + TypeScript + Vite, cartes illustrées interactives, audio volontaire, React Three Fiber/Three.js pour visualiser des GLB.
- Respecter les critères `recette.csv`, l'accessibilité et les erreurs de réseau/médias.

## Règle stricte sur les contenus historiques

Le CDC est final **pour construire**, PAS pour considérer les contenus comme authentifiés. Aucun récit historique complet, aucun modèle GLB définitif et aucune narration définitive ne sont livrés avec ce pack.

- Utiliser des placeholders et fichiers de test marqués `DEMO` / `NON_VALIDE` dans les environnements de développement.
- Ne pas inventer de citation, localisation précise, preuve d'authenticité, consentement, licence ou signature d'expert.
- Mettre en place un pipeline d'états (`BROUILLON`, `EN_REVUE`, `APPROUVE`, `REFUSE` ou équivalent) et un **gate de publication** : sans références et approbations historiques, linguistiques, audio et droits, un actif ne peut pas être exposé comme « final » en production.
- Une recherche IA et l'autocontrôle du modèle ne valent pas une validation par un spécialiste indépendant. Documenter les points à faire vérifier plutôt que prétendre les avoir approuvés.
- Ne jamais publier une reconstitution supposée fidèle lorsque sa documentation manque.

## Exécution autonome

1. Vérifier les fichiers d'entrée et les dimensions (lignes CSV / liens / IDs), consigner les incohérences.
2. Implémenter **P0 avant P1/P2**, suivre les dépendances de `backlog.csv`.
3. Construire un prototype complet avec fixtures DEMO et tests ; étendre à l'inventaire.
4. Ajouter puis tester les branchements médias disponibles ; si service, plugin, licence, autorisation ou GPU manque, **développer un adaptateur et utiliser des placeholders** sans fausse déclaration de production.
5. Ne jamais exposer une clé API dans le client Web, les logs ou le dépôt. Toute dépense ou accès tiers est soumis aux permissions réellement disponibles.
6. Exécuter build, contrôles statiques, tests et contrôles accessibilité lorsque possible ; reporter honnêtement ceux qui nécessitent un appareil réel ou un service extérieur.
7. Écrire `RAPPORT_AVANCEMENT.md` avec modifications, commandes/test effectifs, résultats, blocages et état des actifs.
8. Pour la release, distinguer `BUILD_TECHNIQUE_OK` et `PUBLICATION_HISTORIQUE_OK` ; le premier ne garantit pas le second.

## Quand utiliser des outils externes

- **Blender local / MCP Blender vérifié** pour création et export GLB ; source `.blend` et captures d'inspection conservées.
- **Service TTS actuel** avec accès autorisé pour produire des fichiers audio, revus en FR et AR avant publication. Éviter de verrouiller le produit à des modèles dépréciés.
- **Génération d'images** compatible avec les règles de représentation, avec provenance et licence renseignées.
- N'installer aucun MCP tiers inconnu ou à permissions excessives automatiquement ; examiner code/éditeur, portée des accès et commandes d'exécution. Une intégration locale nécessite Blender et le service MCP opérationnels.
