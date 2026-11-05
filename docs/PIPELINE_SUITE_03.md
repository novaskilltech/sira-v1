# Trois chantiers de production suivants

## 1. Relevé des passages

`editorial/dossiers-sources.v1.json` fournit une fiche de capture par carte. Chaque passage doit rester lié à un exemplaire réellement identifié, à son emplacement, à sa portée et à sa limite. Un relevé est une preuve de travail, pas une approbation historique.

## 2. Production audio

`editorial/production-narrations.v1.json` relie les 120 pistes aux versions de rédaction et aux claims. Avant tout fichier audio, le script doit avoir une révision et ses claims ; après production, le fichier devra enregistrer format, hash, durée réellement mesurée, fournisseur/modèle/voix et les cinq revues requises. Une voix IA ne devient jamais une narration finale par changement de statut.

## 3. Cartographie documentée

`editorial/cartographie.v1.json` couvre les 12 dossiers Hégire. Il commence sans coordonnées, géométrie ni tracé. Toute donnée spatiale future exige une source, une légende d’incertitude et une revue cartographique distincte ; une source narrative seule ne suffit pas à inférer route, distance, altitude ou vitesse.

Les trois registres sont des entrées de production non publiables. Les commandes `sources:validate`, `narrations:validate` et `cartography:validate` produisent chacune un rapport dans `reports/`.

`npm run editorial:verify` exécute, sans raccourci, les six contrôles de travail : claims, rédaction bilingue, passages, narrations, cartographie et cohérence éditoriale. Il est inclus dans `npm run build`, afin qu’un build de démonstration ne contourne pas ces garde-fous.
