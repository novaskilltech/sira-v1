# Registre de recette physique

`recette-physique.v1.json` est la copie exécutable des critères de `recette.csv`. Il commence avec toutes les vérifications à `NON_EXECUTE` et ne remplace jamais un appareil réel par Chromium local.

Pour chaque contrôle réalisé, l’équipe QA renseigne l’horodatage, l’appareil exact, l’OS, le navigateur ou la technologie d’assistance, le testeur identifiable, les chemins de preuves et les notes. Un état `PASS`, `FAIL` ou `BLOQUE` sans ces éléments est refusé par `npm run physical:validate`.

Le registre ne peut pas autoriser la publication. La réception mobile, VoiceOver, TalkBack, le texte à 200 %, les gestes, les performances GLB et les scénarios réseau restent donc explicitement en attente jusqu’à exécution réelle.
