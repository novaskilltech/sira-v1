# Production et validations restantes

Les responsables ci-dessous sont des rôles à affecter, pas des personnes fictives. Aucun message ni demande de prestation n'a été envoyé.

| Lot | À livrer | Responsable | Preuve avant publication |
|---|---|---|---|
| Histoire | 60 récits sourcés, variantes et incertitudes | Rédaction + spécialiste indépendant | Références avec passages, revue datée par révision |
| Français/arabe | 120 textes complets et lexique | Réviseur FR et réviseur AR natif | Approbation par langue/révision, contrôle terminologique |
| Audio | 120 narrations finales de 180–300 s | Production TTS + relecteurs | Script approuvé, durée mesurée, écoute, prononciation, licence |
| 3D | 20 GLB documentés et images fallback finales | Production 3D + spécialiste | Sources, choix interprétatifs, revue humaine, poids/FPS sur appareil |
| Images | 45 illustrations finales | Direction artistique + droits/histoire | Provenance/licences, absence humaine, légendes et alt |
| Animation | 14 séquences scénarisées finales | Conception pédagogique + production | But, déclenchement, pause/reprise, alternative statique, revue |
| Cartographie | Couches documentées et niveaux de certitude | Recherche + spécialiste cartographique | Sources, validation de géométrie et de chaque repère ; aucun GPS inventé |
| Exploitation | Éditeur, contact, hébergement HTTPS et politique de logs | Exploitant + responsable habilité | Coordonnées réelles, mentions validées, configuration testée |
| Recette | iPad/iPhone/Safari, Android/Chrome, VoiceOver/TalkBack | QA avec appareils physiques | Modèles/OS/versions, rotation/verrouillage, gestes, texte 200 %, FPS |

## Prochain ordre de travail

1. Choisir trois fiches pilotes déjà présentes : CHR-01, HEG-ETP-03 et VIE-01.
2. Établir les dossiers documentaires et obtenir la revue indépendante avant production vocale.
3. Produire un script FR et AR pilotes et évaluer la prononciation ; connecter un fournisseur TTS autorisé via `scripts/media-provider.ts`.
4. Remplacer les vingt modèles géométriques techniques par des objets documentés (Blender ou outil autorisé), avec sources éditables et fallbacks.
5. Intégrer les actifs approuvés dans le manifeste, remplacer les visuels de démonstration dans les écrans et étendre par lots.
6. Recette physique et publication seulement après levée de toutes les anomalies G3/G4.

## Ce qui existe réellement

Les 219 entrées du manifeste sont des **emplacements**, tous `PLACEHOLDER`. Les 104 fichiers médias du dossier `public/media/demo` sont séparés de ces cibles : 1 paysage conceptuel, 20 GLB géométriques, 20 schémas SVG de fallback, 45 illustrations SVG, 14 aperçus d’animation SVG, 2 signaux WAV sans voix et 2 contrôles sonores MP3 `DEMO_NON_VALIDE`. Le fichier de provenance des MP3 est compté séparément. Ils sont utilisables pour la recette technique, non comme patrimoine ou narration authentifiés. `npm run demo:validate` contrôle les quantités, les hashes de ces MP3 et l'absence de tout lien vers eux dans le manifeste. Les trois illustrations de travail sont dans `public/media/drafts`, hors du manifeste et `EN_REVUE`. Aucun média `APPROUVE`, aucune narration finale et aucune signature d'expert n'ont été créés.
