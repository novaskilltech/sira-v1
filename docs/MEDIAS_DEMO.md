# Médias de démonstration Sîra

Tous les fichiers de `public/media/demo/` sont **DEMO / NON_VALIDE**. Ils servent à vérifier le chargement, les commandes, les erreurs et les performances. Aucun n'est une reconstruction historique authentifiée ou un média définitif. Aucune approbation historique, linguistique, audio ou de droits n'est enregistrée pour ces fixtures.

## Fichiers et provenance

| Fichiers | Nature | Provenance et limites |
| --- | --- | --- |
| `OBJ-001.glb` à `OBJ-020.glb` | Volumes géométriques distincts correspondant aux catégories du catalogue | `OBJ-001`, `OBJ-002` et `OBJ-007` viennent de `scripts/demo-media.mjs` ; les 17 autres de `scripts/technical-3d-fixtures.mjs`, avec Three.js et GLTFExporter. Primitives sans référence documentaire ; tests techniques uniquement. Ce ne sont pas des modèles Blender définitifs et aucune source `.blend` n'est prétendue disponible. |
| `OBJ-001.svg` à `OBJ-020.svg` | Images de secours symboliques | Tracés SVG du même script, marqués DEMO en français et arabe. Ils ne remplacent pas les rendus documentaires des futurs modèles approuvés. |
| `signal-fr.wav`, `signal-ar.wav` | Signaux techniques distincts de 8 secondes | PCM mono 16 bits / 22 050 Hz, impulsions sinusoïdales à faible amplitude, sans voix et sans récit. Les noms identifient les pistes de test FR/AR ; aucun contenu linguistique n'est présent. Ces fichiers ne comptent pas parmi les 120 narrations définitives de 180 à 300 secondes. |
| `atlas-valley.webp` | Illustration décorative DEMO | Image générée dans cette session, fichier source local `exec-5ed695d6-8c17-4f63-9a5d-ce6b60f809c2.png`. Conversion WebP 1 920 px maximum. Paysage conceptuel sans valeur topographique ou archéologique. Ne doit pas documenter un lieu ni servir de tracé géographique validé. Conditions de réutilisation et validation à documenter avant publication. |
| `illustrations/IMG-*.svg` | 45 illustrations techniques DEMO | Générées localement par `scripts/build-demo-visual-fixtures.mjs`, une par emplacement de l’inventaire. Motifs géométriques sans personne, silhouette, main, ombre humaine ni animal ; chaque fichier annonce explicitement `DEMO · NON VALIDÉ`. Ils vérifient les emplacements et le rendu, pas le sujet historique. |
| `animations/ANI-*.svg` | 14 alternatives fixes pour aperçus d’animation DEMO | Générées par le même script. L’interface fournit une marque de mouvement déclenchée volontairement, avec pause et désactivation par préférence de mouvements réduits. Ces SVG restent des alternatives fixes et ne sont pas des séquences documentaires. |

La provenance technique n'est pas une licence approuvée. Aucun crédit de photographe, spécialiste, narrateur ou institution n'est inventé. Les trois GLB contiennent des métadonnées `status: DEMO`, `historicalStatus: NON_VALIDE`, `publicationAllowed: false` ; le mode public doit les exclure avec l'ensemble du dossier DEMO.

### Prompt exact de l'illustration générée

Outil utilisé dans cette session : `image_gen`, option `transparent_background: false`. Statut : **GÉNÉRÉ — NON APPROUVÉ / DEMO**. Source originale : `C:\Users\P C\.codex\generated_images\01a1706f-d5a9-7cc3-8714-5029260a7c56\exec-5ed695d6-8c17-4f63-9a5d-ce6b60f809c2.png`.

```text
Use case: stylized-concept. Asset type: landscape hero for a French/Arabic educational atlas demo called Sîra. Create a wide contemplative panoramic illustration of an entirely uninhabited arid Arabian-inspired valley, layered warm sandstone and muted olive-gray mountains, soft sand, sparse low shrubs, dawn diffuse natural light, subtle paper grain, sophisticated museum atlas painterly rendering. Horizon upper third, flowing valley bottom and distant rock ridges. Restrained colors ivory #FAF7F0, sand #E4D6BD, ochre #A66C2D, deep desaturated teal shadows #123A43. This is imaginary conceptual scenery, not a historically authenticated place. NO people, NO silhouettes, NO human shadows, NO hands, NO statues, NO buildings, NO animals, NO text, NO letters, NO route lines, NO map pins, NO logos. Landscape 1536x1024 or wider. Calm and premium educational visual, natural realistic geology rendered as painterly illustration.
```

## Régénération locale

Exécuter `npm run demo:media` pour les GLB, SVG et WAV, puis `npm run demo:visuals` pour les 45 illustrations et 14 alternatives d’animation. L'image existante est conservée si aucune entrée n'est fournie. Pour convertir l'image source, définir `SIRA_DEMO_IMAGE` sur le chemin local du PNG puis exécuter la même commande ; `sharp` doit être installé. Aucun fichier distant n'est téléchargé.

Le générateur vérifie l'en-tête GLB 2, la taille annoncée et les métadonnées DEMO après écriture. Chaque modèle est centré à l'origine et sa dimension maximale vaut 2 unités. La géométrie ne contient ni personnage, ni main, ni silhouette humaine, ni animal. Les fichiers sont inférieurs au budget individuel de 8 Mo prévu pour les modèles ; le WebP est limité à 1,5 Mo. Les mesures de fluidité et le rendu WebGL restent à tester sur appareils physiques.

## Adaptateur de narration

`scripts/media-provider.ts` définit un fournisseur remplaçable sans clé, modèle imposé ou requête externe. `produceNarration` refuse tout script DEMO, incomplet, refusé ou dépourvu de références et preuves de revue historique, linguistique et droits à la révision courante **avant tout appel fournisseur**. Le fournisseur par défaut répond `PROVIDER_UNAVAILABLE` lorsque le script est recevable.

La future intégration doit vérifier le catalogue et les conditions actuels du fournisseur autorisé, garder les secrets côté serveur, mesurer la durée réelle du fichier, contrôler la prononciation avec un réviseur FR/AR, contrôler les droits de la voix et enregistrer les approbations indépendantes. Une sortie fournisseur reste `EN_REVUE`, même si le script était approuvé. Le contrôle de durée fourni par l'interface ne remplace pas une analyse du fichier réel ni le gate de publication global.

Le type `TtsProvider` permet d'injecter un double de test sans clé et de vérifier que les scripts refusés ne provoquent aucun appel. Aucun service payant n'est sollicité dans ce lot.

## Adaptateur OpenAI prêt pour les scripts approuvés

`scripts/openai-tts-provider.ts` appelle l’API Audio Speech uniquement côté pipeline avec `OPENAI_API_KEY`. Il impose le format WAV, mesure sa durée dans le binaire et refuse un script non approuvé, absent de références, hors révision ou supérieur à 4 096 caractères. La sortie est toujours `EN_REVUE` : écoute FR/AR, prononciation, droits et validation de durée restent requis avant import public. L’interface affiche explicitement qu’une narration TTS est une voix générée par IA.

`npm run demo:voices` est séparé du pipeline de production : il produit uniquement deux sons de contrôle courts, sans récit historique, sous `public/media/demo/tts-demo-*.wav`, accompagnés de leur hash et de leur durée. Ils restent hors manifeste et portent `DEMO_NON_VALIDE` ; ils ne sont jamais comptés parmi les 120 narrations.

Lorsque l’API n’est pas disponible, `npm run demo:voices:local` tente de produire les mêmes contrôles techniques avec les voix Windows présentes localement (`Microsoft Hortense` pour le français et `Microsoft Naayf` pour l’arabe). Le script s’arrête sans écrire de fichier si l’hôte interdit la synthèse. Ce secours ne sert qu’au lecteur et ne remplace pas une revue de qualité, de prononciation, de droits ou une voix de production.

## Adaptateur OpenRouter

`scripts/openrouter-tts-provider.ts` utilise `POST /api/v1/audio/speech` avec `OPENROUTER_API_KEY`, `OPENROUTER_TTS_MODEL`, une voix et une sortie WAV. Le modèle et la voix ne sont pas figés : ils doivent être relevés dans le catalogue OpenRouter au moment de la production, avec compatibilité WAV et qualité FR/AR vérifiée. Comme l’adaptateur OpenAI, il ne reçoit qu’un script ayant passé le gate et retourne systématiquement `EN_REVUE`.

`npm run demo:voices:openrouter` produit deux échantillons courts, non historiques et hors manifeste. Au 26 octobre 2026, son choix technique par défaut est `x-ai/grok-voice-tts-1.0` avec la voix `ara`. Le fournisseur a confirmé `mp3` ou `pcm` pour ce modèle ; ces fichiers MP3 ne sont donc jamais employés pour la validation de durée ou la publication. Ce n’est pas une décision de qualité éditoriale : l’écoute FR/AR décide ultérieurement des voix définitives.

Le 26 octobre 2026, les deux fichiers `tts-demo-fr-openrouter.mp3` et `tts-demo-ar-openrouter.mp3` ont été générés avec ce profil. Leurs hashes SHA-256, le modèle, la voix et l'interdiction de publication sont consignés dans `public/media/demo/tts-demo-openrouter-provenance.json`. Ils sont exclusivement des contrôles sonores techniques `DEMO_NON_VALIDE` : ils ne portent aucun récit historique, ne sont pas liés au manifeste et ne peuvent pas devenir une narration finale par changement de statut.

## Vérifications effectuées le 25 octobre 2026

- `node scripts/demo-media.mjs` : génération des 3 GLB initiaux, 20 SVG et 2 WAV ; conversion du PNG local avec `SIRA_DEMO_IMAGE` et sharp.
- `node scripts/technical-3d-fixtures.mjs` : génération des 17 GLB techniques complémentaires. Les 20 fichiers ont un en-tête GLB 2 cohérent avec leur taille déclarée ; les trois modèles initiaux sont aussi réimportés par GLTFLoader, centrés à l'origine et limités à 2 unités.
- Tailles : GLB 50 716 / 15 548 / 76 232 octets ; chaque WAV 352 844 octets ; WebP 297 990 octets, 1 536 × 1 024 px. Total des 26 fichiers : 1 168 236 octets.
- Contrôle WAV : RIFF/PCM valide, durée calculée depuis les octets exactement 8 s, pic 2 457 sur 32 767 (environ 7,5 %).
- Contrôle SVG : 20 fichiers présents, chacun avec labels DEMO français et arabe.
- `npm run demo:visuals` : 45 illustrations et 14 alternatives d’animation présentes, référencées dans le manifeste DEMO avec hash, taille et MIME ; la suite de tests contrôle les 59 fichiers et leurs mentions de non-validation.
- Tests du contrat TTS via Node et double local : 7 scripts incomplets/refusés bloqués avant appel ; sortie approuvable conservée EN_REVUE ; fournisseur absent bloqué ; 5 sorties incohérentes rejetées ; signal d'annulation empêche l'appel.
- Typage isolé `tsc --ignoreConfig --noEmit --target ES2022 --module ESNext --moduleResolution Bundler --skipLibCheck scripts/media-provider.ts` : réussi.
- `eslint scripts/demo-media.mjs scripts/media-provider.ts` : réussi, aucune erreur ni avertissement.
- Inspection de l'image source : paysage conceptuel sans figure humaine visible. Cette inspection technique n'est pas une validation historique ni une certification de droits.

Les contrôles sur tablettes physiques, les véritables 120 narrations, les 20 modèles documentaires définitifs et les revues indépendantes restent à réaliser.
