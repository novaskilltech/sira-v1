# Registre des affirmations — 60 fiches

`editorial/registre-claims.v1.json` couvre les 60 fiches du produit. Il est volontairement vide de récits et d'affirmations : son objectif est de recevoir des claims unitaires, pas de convertir une liste d'événements en récit non vérifié.

Chaque claim futur doit lier une révision FR et AR à un ou plusieurs passages localisés dans un exemplaire identifié. Il doit dire ce que le passage établit, ce qu'il ne permet pas de conclure, la comparaison entre Ibn Hishām et *Ar-Raḥīq al-Makhtūm*, et la décision humaine associée.

Les champs de comparaison peuvent constater une concordance, divergence, absence ou non-applicabilité. Une absence de passage ne doit jamais être comblée par une scène, une date, une topographie, un dialogue ou une reconstitution.

Lancer `node scripts/validate-claims-register.mjs` vérifie la couverture des 60 fiches et bloque les claims incomplets ou les décisions préremplies. Ce contrôle ne valide aucun contenu historique.
