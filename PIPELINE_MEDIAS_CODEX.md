# PIPELINE MÉDIAS — Codex / Sîra V1.0

**Statut :** instructions d'intégration proposées. Les prestataires et outils tiers ci-dessous ne sont ni installés ni autorisés par ce package. Codex doit utiliser ce qui est effectivement accessible et conforme aux licences.

## 1. Principe de livraison

Les objectifs du CDC sont **60 fiches, 120 narrations, 20 modèles 3D**, et des emplacements de **45 illustrations, 14 animations, 20 images fallback**. Tout fichier doit avoir un ID de registre, une langue le cas échéant, une version, une provenance, des droits de réutilisation et des validations tracées. Le CDC reste prioritaire sur les détails d'intégration.

### Statuts obligatoires

- `PLACEHOLDER` : référence ou emplacement, fichier final absent.
- `DEMO` : actif temporaire non publiable.
- `PRODUIT_NON_VERIFIE` : fichier créé, mais vérifications manquantes.
- `EN_REVUE` : vérification historico-linguistique / technique / droits en cours.
- `APPROUVE` : toutes les approbations externes requises documentées.

Seuls les actifs `APPROUVE` sont autorisés en publication publique. Aucun automatisme ne doit auto-attribuer `APPROUVE` au seul motif qu'un contenu a été généré par une IA.

## 2. Création 3D

### Outil recommandé

**Blender en local**. Codex peut :
- piloter des procédures de création, UV, matériaux, rendu et export via Python Blender si exécution locale autorisée ;
- utiliser un **serveur MCP Blender communautaire**, après vérification de sa sécurité et de sa compatibilité ; exemple documenté : BlendRelay MCP (`https://github.com/shefq/blendrelay-mcp`). Ce choix n'est pas une approbation de sécurité ou de qualité du fournisseur ;
- exporter les objets optimisés `glTF / GLB` et leurs `PNG/WebP` de secours, vérifier leur import dans le visualiseur web.

**Préconditions :** Blender installé, connexion MCP disponible dans le contexte Codex choisi (CLI/desktop), ressources GPU/CPU suffisantes et éventuels comptes/licences. Les plugins ne créent pas automatiquement les 20 modèles sans scénario, calcul, références et revue. Préférer des objets pédagogiques limités à des formes documentables, sans figures humaines.

### Pour chaque objet OBJ-001..OBJ-020

1. Étudier la fiche d'objet et établir les références documentaires ; signaler toute datation discutable.
2. Générer un premier objet 3D non validé, garder la source éditable `.blend`.
3. Créer matériaux, UV, niveaux de détail raisonnables ; exporter un GLB optimisé et une image de fallback.
4. Vérifier **tactilité, rotation, zoom, recentrage, chargement, fonctionnement sur tablette de référence** et fallback si WebGL échoue.
5. Conserver capture de rendu, taille/complexité et résultats de contrôle ; soumettre à relecture historique, artistique et des droits.
6. Remplir le registre de provenance et le statut de publication.

## 3. Production audio FR/AR

### Technologie

Codex peut connecter un **service TTS externe** via API/outil approuvé ou brancher un logiciel vocal. La génération audio n'est pas une faculté intrinsèque de « coder » et peut engendrer des frais distincts. Concevoir un adaptateur de fournisseur remplaçable (voix, langue, consignes, coût, format, durée, erreurs, retry).

**Attention maintenance (25/10/2026) :** d'après la documentation OpenAI, plusieurs anciens modèles TTS ont une **date annoncée de fin au 06/01/2027** ; ne pas les graver dans l'architecture. Vérifier le catalogue et les conditions actuelles **au moment de l'intégration**. Voir : `https://developers.openai.com/api/docs/guides/text-to-speech`.

### Pour chaque fiche × langue

1. Script FR ou AR sourcé et validé par les responsables documentaires et linguistiques.
2. Synthèse vocale de test ; vérifier la prononciation des noms arabes et le débit naturel.
3. Export audio final (codec web compatible) et mesure automatique de la durée réelle : **03:00–05:00** pour chaque narration principale.
4. Contrôle à l'écoute par relecteur compétent ; repères temporels FR et AR **indépendants**.
5. Renseigner ID, langue, script version, fournisseur, voix, durée, version, droits et statut. Prévoir l'information nécessaire sur l'usage de voix de synthèse.
6. Le lecteur de l'application autorise texte sans audio, pause, recherche temporelle, une seule lecture et lancement volontaire.

Aucun fournisseur TTS n'est présumé performant en arabe ; un extrait doit être évalué par un locuteur compétent.

## 4. Illustrations, cartes et animations

- Générer les illustrations de paysages, bâtiments et objets seulement ; **aucun personnage/silhouette, main, ombre humaine ni avatar**. Inspecter chaque image après génération, même si le prompt l'interdit.
- Indiquer `ILLUSTRATION_PEDAGOGIQUE / RECONSTITUTION_PROPOSEE / DOCUMENTE` selon la preuve disponible ; ne jamais présenter une image générée comme une photographie authentique d'époque.
- Cartes : tracés documentés, approximatifs ou contestés clairement différenciés ; **pas de coordonnées inventées**.
- Animations : 14 emplacements proposés ; progression activée sur ordre de l'utilisateur, pause, reprise ou alternative statique pour les personnes sensibles au mouvement.
- Garder les textes séparés des images et les variantes linguistiques dans la couche de contenus.

## 5. Connecteurs et sécurité

- La compatibilité des plugins dépend de la **surface Codex utilisée**, de la machine et des comptes. Certains MCP Blender requièrent une session locale Blender en cours.
- Les outils tiers communautaires ont accès à des fichiers et parfois à l'exécution de commandes : vérifier leur origine, version, périmètre et mode d'authentification avant ajout.
- Ne pas exposer de clés API dans le code client React ; garder toute facturation et synthèse côté pipeline de production/serveur sécurisé.
- Les licences et attributions sont vérifiées par actif. Aucun plugin n'accorde de droits par défaut sur des références externes.
- Tester un objet, un script FR et un script AR avant la production en lot.

## 6. Choix de la surface Codex

Pour piloter directement Blender local et créer des fichiers médias, privilégier **Codex CLI ou Codex desktop relié à l'environnement local adéquat**. Le Codex cloud peut construire et tester du code, mais la disponibilité du Blender local/GPU et des autorisations réseau doit être vérifiée ; ne pas présumer qu'un connecteur existe déjà.

## 7. Gate de sortie

Le rapport final sépare clairement :
- `BUILD_TECHNIQUE_OK` — app prête à être testée avec placeholders DEMO.
- `MEDIA_PRODUITS` — fichiers réellement générés (avec totaux mesurés).
- `MEDIA_APPROUVES` — actifs validés, avec preuves.
- `PUBLICATION_OK` — **uniquement** après approbations documentaires/historiques, linguistiques, droits, accessibilité et QA complètes.

Une version technique aboutie **ne vaut pas publication validée**.
