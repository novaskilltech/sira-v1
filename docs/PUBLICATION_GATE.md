# Gate de publication

`npm run build` produit uniquement une démo locale. `npm run build:public` est bloqué par les contrôles de publication. Même un appel direct `vite build` (sans mode demo) exécute le validateur public avant compilation.

Contrôles : 60 IDs uniques et continus, répartition 24/12/24, deux langues, sections, 120 pistes liées à leurs fiches/langues, 45 illustrations, 14 animations, 20 modèles et 20 fallbacks, références existantes, dossier non géolocalisé, droits, taille, hash SHA-256, MIME et format compatibles. Les approbations sont liées à un targetId, une dimension et une révision ; la décision la plus récente prime. Les révisions linguistiques sont contrôlées séparément des révisions globales. Les chemins DEMO sont interdits.

En plus du manifeste, un lot d’import public doit apporter un `reviewerRegistry` : chaque décision doit désigner un identifiant de personne distinct d’un nom de rôle, avec une preuve d’identité locale et une preuve de décision locale sous `editorial/evidence/`. L’import refuse une preuve absente, un lien externe seul, un relecteur absent du registre ou un rôle qui ne correspond pas. Ce contrôle rend la piste d’audit obligatoire ; il ne transforme jamais un persona ou une preuve de fichier en compétence historique attestée.

Le contrôle sur disque vérifie présence réelle, confinement au répertoire public, empreinte, taille et en-tête GLB. Les SVG actifs sont refusés. Les durées WAV sont mesurées à partir des octets ; les formats compressés exigent `ffprobe` disponible dans PATH. Une durée déclarée dans le JSON ne suffit pas.

Le bundle public n'embarque que le manifeste et les fichiers référencés après validation, sans copier public/media/demo. Il reste nécessaire de remplacer les composants d'illustration de démonstration par les médias finaux lors de l'intégration du corpus. Le gate vérifie la cohérence documentaire ; il ne certifie pas l'identité ni la compétence d'un relecteur. Les preuves doivent être revues par l'exploitant. Aucun registre de test n'est une preuve d'approbation.

Les médias scénarisés finaux peuvent nécessiter une extension explicite du contrat (formats vidéo ou JSON) et des tests adaptés : les formats actuellement autorisés sont SVG/images, GLB et audio. Rien ne doit être publié en contournant ce contrôle.
