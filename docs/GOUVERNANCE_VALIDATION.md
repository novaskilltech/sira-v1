# Gouvernance de validation

## Rôles désignés

| Rôle | Périmètre | Décision attendue |
|---|---|---|
| Sheikh Salah | Sciences religieuses et biographie prophétique | Revue des sources, qualification des récits et décision historique par révision. |
| Ahmed Dev Fullstack | Technique | Intégration, validation du manifeste, build, tests, accessibilité automatisée, préparation de la recette et release technique. |

La délégation de Sheikh Salah est mandatée par le commanditaire. Les trois pilotes `CHR-01`, `HEG-ETP-03` et `VIE-01` sont ses premiers dossiers de revue ; les autres fiches lui sont assignées pour la dimension historique.

## Limites de rôle

Sheikh Salah ne valide pas automatiquement les droits, les licences, les performances 3D, la prononciation audio ou les traductions FR/AR, sauf compétence et preuve explicites pour ces dimensions. Ahmed ne valide pas le contenu religieux/historique ni les droits à lui seul.

Les dimensions encore à affecter sont : relecture française, relecture arabe native, droits/licences, audio/prononciation, cartographie, revue visuelle des médias, QA sur appareils physiques et responsabilité légale d’exploitation.

## Format d'une décision recevable

Une décision est attachée à un actif et à une révision précise. Elle contient :

```text
reviewerId : identité ou identifiant réel du relecteur
reviewerRole : SHEIKH_SALAH | AHMED_FULLSTACK | autre rôle qualifié
targetId : ID de fiche ou de média
targetRevision : révision examinée
dimension : history | fr | ar | rights | geography | audio | pronunciation | visual
decision : APPROUVE | REFUSE
timestamp : date et heure
evidenceLink : passage, rapport, contrat, capture ou enregistrement correspondant
```

Un rôle, un pseudo ou un persona sans identité et preuve ne passe pas le gate public. Cette règle évite de présenter une validation IA comme une expertise indépendante.
