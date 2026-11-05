# Preuves de revue

Créer un fichier ou une entrée par décision, sans effacer les preuves antérieures.

| Champ | Exemple de forme |
|---|---|
| `targetId` | `CHR-01`, `AUD-CHR-01-FR`, `GLB-OBJ-001` |
| `targetRevision` | `chr-01-fr-r01` |
| `dimension` | `history`, `fr`, `ar`, `rights`, `geography`, `audio`, `pronunciation`, `visual` |
| `decision` | `APPROUVE` ou `REFUSE` |
| `reviewerId` | Identifiant réel de la personne responsable |
| `timestamp` | ISO 8601 |
| `evidenceLink` | Passage, rapport, contrat, capture ou enregistrement localisable |

## Registre de relecteurs exigé pour un lot public

Un lot destiné à `npm run editorial:import` doit désormais contenir un tableau `reviewerRegistry`. Chaque entrée doit fournir un `reviewerId` distinct du nom de rôle, le `reviewerRole` et un `identityEvidenceLink` vers une preuve locale sous `editorial/evidence/`.

Chaque `evidenceLink` d'approbation doit également pointer vers un fichier local existant sous ce dossier. Le script refuse les liens externes seuls, un identifiant réduit à `SHEIKH_SALAH` ou `AHMED_FULLSTACK`, une identité absente du registre, un rôle divergent et une preuve introuvable. Cette vérification conserve les éléments d'audit : elle ne vérifie pas la compétence ni ne remplace la revue humaine.

Une entrée sans identité réelle, révision, date et preuve est insuffisante pour le manifeste public.
