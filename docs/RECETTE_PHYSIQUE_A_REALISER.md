# Recette physique à réaliser avant publication

Ce protocole ne peut pas être exécuté par une simulation de navigateur. Chaque ligne doit recevoir un appareil réel, version d'OS/navigateur, date, opérateur, résultat et preuve vidéo ou capture.

| Lot | Appareils minimum | Vérifications |
|---|---|---|
| Tablette Apple | iPad Safari, portrait et paysage | Touches de 48 px, lecture volontaire, verrouillage/reprise, 20 GLB, zoom/pan de carte, VoiceOver, texte à 200 %. |
| Téléphone Apple | iPhone Safari, portrait/paysage | Navigation, RTL, mise en pause audio à la rotation/langue, fallback 3D, absence de débordement. |
| Tablette Android | Chrome Android | Touch, zoom à deux doigts et boutons alternatifs, reduced motion, TalkBack, 20 GLB. |
| Téléphone Android | Chrome Android | Réseau ralenti/hors ligne, pannes image/audio/GLB, reprise, RTL, contrôle de taille. |
| Réseau | Wi-Fi réaliste + débit limité | LCP, INP, CLS, chargement différé 3D, poids des médias finals. |

## Feuille de résultat par essai

```text
ID recette :
Appareil / modèle :
OS / navigateur :
Orientation :
Langue : FR | AR
Fiche ou écran :
Média ou modèle testé :
Résultat : PASS | ÉCHEC | BLOQUÉ
Preuve : chemin de capture / vidéo / rapport
Anomalie et reproduction :
Opérateur et date :
```

## Bloquants de publication

- Un audio démarre seul, se superpose, ou ne s'arrête pas au changement de langue ou d'écran.
- Une action essentielle nécessite un geste sans commande accessible équivalente.
- La carte affiche une géographie non documentée comme certaine ou inverse son repérage en RTL.
- Un 3D final chute, échoue sans fallback, ou contient une personne, silhouette, main, ombre humaine ou animal.
- Une illustration, animation, source, droit, narration ou approbation ne correspond pas à la révision publiée.
- VoiceOver/TalkBack ou le texte à 200 % empêchent l'accès à un contenu ou à un contrôle.
