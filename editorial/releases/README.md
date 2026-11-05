# Lots de publication

Un lot contient la version complète des 60 fiches, 219 assets, 20 objets, références et informations d’exploitation. Il n’est traité que s’il vient d’un dossier de preuves réelles.

```powershell
npm run editorial:import -- --input editorial/releases/<lot>.json
```

Le fichier JSON doit contenir `version`, `operator`, `references`, `contents`, `assets` et `objects`. `contents` doit fournir exactement une mise à jour par ID de fiche, `assets` une par ID d’asset et `objects` une par ID d’objet : le script refuse les doublons, omissions et IDs inconnus. La version est un identifiant de fichier sûr (`v1.0.0`, par exemple).

Chaque entrée reprise dans le lot doit porter la révision réellement examinée, les références localisées et les décisions recevables. Conserver les preuves à côté du lot dans `editorial/evidence/`; ne jamais placer une clé ou un contrat sensible dans ces fichiers. Le format des décisions est décrit dans `editorial/evidence/README.md`.

L’import ne modifie jamais `public/content/manifest.v1.json`. Il génère un candidat seulement si le contrat public complet est valide. Ensuite, Ahmed peut comparer ce candidat, archiver ses preuves et le promouvoir selon la procédure de publication.
