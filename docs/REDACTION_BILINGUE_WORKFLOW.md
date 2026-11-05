# Rédaction bilingue — flux de travail

`editorial/redaction-bilingue.v1.json` prépare un texte français et une rédaction arabe distincte pour chacune des 60 fiches. Il ne contient aucun récit historique à sa création.

## Ordre obligatoire pour une fiche

1. Ajouter des `claimId` documentés dans `registre-claims.v1.json` après le relevé des passages et la décision historique humaine.
2. Rédiger la version française en rattachant chaque affirmation aux `claimId` concernés, avec une révision propre.
3. Rédiger la version arabe séparément. Elle ne peut pas être une traduction automatique promue comme relecture native.
4. Conserver explicitement les variantes, limites et degrés de certitude dans chaque langue.
5. Obtenir une relecture humaine FR et une relecture humaine AR, chacune liée à la révision examinée.
6. Préparer ensuite les deux scripts de narration, sans les confondre avec le résumé de fiche ; la durée audio est mesurée après synthèse ou enregistrement.

## États et interdictions

Le registre commence à `BROUILLON_SANS_TEXTE` et chaque langue à `BROUILLON`. `npm run writing:validate` refuse un texte sans révision ni claim, et refuse toute approbation dans le registre de travail. Les décisions et preuves recevables sont portées dans le lot de release avec le registre de relecteurs et les fichiers sous `editorial/evidence/`.

Les objectifs de 500 à 650 mots français et de 180 à 300 secondes sont des repères de production. Ils ne remplacent ni le contrôle de durée réel ni les validations historique, linguistique, audio et droits.
