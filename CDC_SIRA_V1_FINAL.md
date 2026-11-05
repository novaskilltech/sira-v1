# SÎRA — CAHIER DES CHARGES FINAL V1.0

**Application interactive de découverte de la Sîra — livrable de transmission à un agent de développement (Codex / équipe de réalisation)**

| Métadonnée | Valeur |
|---|---|
| Version | **1.0.0 — spécification gelée pour construction** |
| Date | 25 octobre 2026 |
| Statut | **FINAL POUR DÉVELOPPEMENT** ; les médias et récits sont **à produire et valider** |
| Périmètre | V1 riche : **3 espaces, 60 fiches FR/AR, 120 narrations, 20 modèles 3D, 1 frise, 1 carte d'Hégire** |
| Niveau d'autorité | Décisions utilisateur antérieures, puis arbitrages autonomes de NOVA CDC explicitement identifiés |
| Destinataire | Agent développeur, équipe design/contenu, équipe QA |
| Produits exclus | Pas de comptes, paiement, géolocalisation, UGC, quiz, application native ni mode complet hors connexion en V1 |
| Livrables liés | `inventaire_contenus.csv`, `inventaire_objets_3d.csv`, `inventaire_medias.csv`, `backlog.csv`, `recette.csv`, `README_AGENT.md` |
| Texte intégral | Le présent fichier est la source de vérité pour le **produit à construire** |

> **Règle de lecture indispensable.** « FINAL » signifie que le périmètre, le comportement attendu, les décisions d'architecture, l'inventaire et les tests sont arrêtés pour lancer le développement **sans nouvelle sollicitation du commanditaire**. Cela **ne signifie pas** que les 60 textes historiques, les traductions, les 120 audios, les tracés géographiques, les reconstitutions et les licences existent ou sont approuvés. L'agent doit produire la structure et les flux, employer des contenus de démonstration **visiblement marqués**, organiser les validations documentaires, puis refuser de publier en mode définitif tout actif sans statut `APPROUVE`.

## 0. Résumé exécutif et instruction de réalisation

Produire une **application web tactile immersive**, bilingue **français/arabe**, pour un public familial. L'utilisateur choisit librement entre **Chronologie de la Sîra**, **Parcours de l'Hégire** et **Vie quotidienne** ; il explore cartes, frise, illustrations et objets en 3D, lit des récits structurés et lance lui-même une narration FR ou AR de **3 à 5 minutes** par fiche. **Aucun personnage ni silhouette humaine**, y compris silhouettes lointaines, ombres humaines, mains, avatars ou personnes en vidéo/image. Les contenus historiques doivent être sourcés, attribués et approuvés.

La V1 est une **web app sans connexion utilisateur**, responsive **tablette portrait d'abord**, pleinement fonctionnelle en tablette paysage et sur téléphone. L'expérience nécessite Internet ; en cas de coupure, préserver ce qui est déjà affiché et proposer une reprise. Les contenus et médias sont publiés séparément du code. La progression est locale à l'appareil.

**Mandat pour l'agent :**
1. Implémenter les écrans et états indiqués, les contrats de données, les jeux de tests et la chaîne de validation.
2. Livrer le prototype de bout en bout, puis étendre aux 60 enregistrements et 20 modèles sans dépendre de contenus historiques improvisés.
3. Si un média définitif manque, afficher une fiche de démonstration clairement étiquetée dans les environnements de test ; **ne jamais publier** ce placeholder comme contenu final.
4. Respecter les priorités **P0 intégralement** pour la V1. P1/P2 ne sont pas bloquants et ne doivent jamais faire déborder P0.
5. Mettre les choix techniques d'implémentation mineurs dans un journal ADR sans demander d'arbitrage au commanditaire, à condition de ne pas modifier le présent périmètre.

## 1. Traçabilité, décisions et niveaux de confiance

### 1.1 Décisions déjà prises par le commanditaire (source antérieure)

- Public **grand public / familles**, découverte libre, tablette prioritaire, téléphone compatible.
- Portrait tablette de référence, **paysage également utilisable**.
- Français et arabe au lancement ; récit détaillé et voix à la demande, cible **3 à 5 minutes par langue**.
- Ambiance réaliste et immersive ; **lieux, bâtiments, objets uniquement**, **zéro personnage/silhouette**.
- Usage connecté ; cartes et animations prioritaires, objets 3D manipulables.
- **Trois espaces intangibles** : chronologie, Hégire, vie quotidienne.
- Expérience V1 **riche**, priorité à **l'immersion** ; **plusieurs objets 3D par thème**.
- Validation historique **sans responsable identifié** à ce jour.

### 1.2 Arbitrages autonomes NOVA CDC — considérés comme décisions V1 de construction

| Code | Décision arrêtée | Motif / alternative écartée |
|---|---|---|
| D-01 | 60 fiches : 24 CHR, 12 HEG, 24 VIE | Expérience riche, ampleur quantifiable ; alternative 15–25 fiches écartée |
| D-02 | 20 modèles 3D distincts sur 8 thèmes VIE, avec mutualisation entre fiches | Plusieurs objets/thème ; évite 60 scènes spécifiques |
| D-03 | 120 narrations principales (une par fiche/langue), 3–5 min par fichier final | Parité bilingue vérifiable |
| D-04 | 45 illustrations originales **emplacements planifiés** (volume révisable 40–50), 14 animations scénarisées **emplacements planifiés** (volume révisable 12–16) | Qualité immersive maîtrisée ; ces sous-volumes peuvent être ajustés sans changer les 60/20/120 |
| D-05 | Web app **React + TypeScript + Vite**, médias CDN versionnés, contenus structurés statiques versionnés ; pas de serveur de comptes | Simplicité d'exploitation, correction des textes, cache et performance |
| D-06 | Cartes illustrées en **SVG/graphique interactif** ; frise native ; **Three.js/React Three Fiber/Drei** pour 3D à la demande | Éviter moteur cartographique GPS et ville 3D inutiles |
| D-07 | Identifiants d'écran `SCR-...` et identifiants de fiches séparés `CHR-xx`, `HEG-ETP-xx`, `HEG-DOS-xx`, `VIE-xx` | Corrige collision HEG-01 écran vs contenu |
| D-08 | **Aucun compte, paiement, UGC, push, suivi individuel ou géolocalisation** ; préférence et reprise stockées sur appareil | Absence de besoin, simplicité, minimisation RGPD |
| D-09 | Direction artistique « **Atlas vivant, musée contemplatif** », palette et fontes détaillées en section 12 | Consolidation du dossier DA v0.1 |
| D-10 | Cible **WCAG 2.2 AA**, zones tactiles de projet ≥ 48×48 CSS px, retour sans geste caché | Accessibilité familiale/tactile |
| D-11 | Toutes les fiches principales sont nécessaires à la publication V1 ; pas de sortie publique « riche » avec fiches provisoires | Évite publication incomplète/trompeuse |
| D-12 | Si aucune validation historique compétente n'est obtenue, **la release publique est bloquée**, mais le développement et la recette technique peuvent s'achever | L'arbitrage peut se faire sans l'utilisateur, la légitimité scientifique ne s'improvise pas |

**Niveau de confiance :** élevé pour l'architecture et la structure d'interaction ; moyen pour les budgets média et performances avant pilote ; faible sur les détails historiques, la géographie fine et les artefacts tant qu'ils ne sont pas documentés par des spécialistes.

### 1.3 Hiérarchie des documents

1. **Présent CDC V1.0** : source de vérité et priorité en cas d'écart.
2. Annexes CSV du présent paquet : registres exhaustifs de la V1.
3. Spécification HEG-01 v0.1, wireframes UX v0.1 et direction artistique v0.1 : **références de conception**, uniquement si non contradictoires.
4. Cahier des charges Sîra v0.7 : historique de cadrage.
5. Planche d'image conceptuelle HEG-01 : **inspiration non géographique ni historique**, ne fournit aucune coordonnée ou preuve.

## 2. Objectifs, cible et critères de succès

### 2.1 Problème et proposition de valeur

La Sîra est vaste et souvent diffusée sous forme de textes linéaires. Le produit met en relation **repères temporels, géographiques et matériels**, avec récits consultables à son rythme et supports tangibles partageables en famille. Il doit distinguer **faits établis, variantes documentées et illustrations pédagogiques**.

### 2.2 Profils et contextes

- **Visiteur adulte** : découvrir la chronologie, comparer des étapes, écouter et consulter les sources.
- **Adulte avec enfant** : choisir rapidement un sujet, montrer l'objet/la carte, lire ou écouter ; l'interface reste utilisable sans assistance.
- **Visiteur arabophone** : expérience native RTL et récits arabes, pas une simple traduction du menu.
- **Visiteur sans son / avec besoins d'accessibilité** : textes, gestes simples, contrastes et alternatives à la 3D.

Aucune collecte de date de naissance, d'identité religieuse, de données d'enfants, de localisation personnelle ou de comportements individualisés.

### 2.3 Objectifs mesurables (critères du produit, sans inventer de taux d'adoption)

| KPI de réalisation | Cible de réception V1 |
|---|---|
| Couverture éditoriale | 60 fiches visibles et approuvées × FR+AR = 120 textes complets |
| Couverture audio | 120 audios approuvés, durée 03:00–05:00 chacun |
| Couverture 3D | 20 modèles utilisables + fallback 2D légendé |
| Parité | 0 fonctionnalité centrale disponible seulement en FR ou AR |
| Présence de sources | 60/60 fiches avec références, statut historico-éditorial et légendes |
| Interdiction des figures humaines | 0 occurrence constatée dans médias de production |
| Parcours essentiels | 100 % des scénarios P0 automatisables et testés manuellement sur appareils de référence |
| Accessibilité | Aucune non-conformité bloquante WCAG 2.2 AA connue en livraison |
| Performance | Objectifs mesurables en section 15 sur matériel/réseau de test défini |

**Mesures d'usage public** : pas de traceurs de parcours ni d'analytics comportemental par défaut. Les indicateurs ci-dessus sont des contrôles qualité et de complétude, pas du pistage.

## 3. Périmètre V1, priorité et hors périmètre

**P0 — non négociable à la réception :** trois espaces complets, 60 fiches bilingues approuvées, 120 audios, 20 objets 3D (avec fallback), chronologie et carte interactive, lectures structurées/sources, ergonomie tactile, RTL, contrôles de mouvement, modes d'erreur, tests et sécurité.

**P1 — après réception P0 :** retour audio de 15 s, saut entre sections, mini-lecteur persistant dans les transitions, synchronisations animation/audio lorsque pédagogiquement justifiées, outils de gestion éditoriale sophistiqués, enrichissement des commandes accessibles.

**P2 — non inclus :** quiz, parcours gamifiés, mode totalement hors ligne, compte personnel, favoris synchronisés, abonnements, visite libre 3D de ville, contenus supplémentaires au-delà de 60, ambiances sonores facultatives, application native distribuée en stores, partage social.

**Règle anti-dérive :** toute idée supplémentaire est consignée `CHANGE-xx` avec bénéfice, charge estimée, impact et fonctionnalité déplacée ; aucune initiative P1/P2 ne peut retarder P0.


## 4. Architecture d'information, routes et écrans

### 4.1 Modèle de navigation

| Route logique (indicative) | ID écran | Contenu / fonctions |
|---|---|---|
| `/` | `SCR-ACC` | Choix FR/AR initial si absent, trois accès et « Reprendre » |
| `/chronologie` | `SCR-CHR-LIST` | Frise 6 périodes, 24 événements filtrables/sélectionnables |
| `/chronologie/:id` | `SCR-CHR-DETAIL` | Fiche événement, texte, sources, audio, liens |
| `/hegire` | `SCR-HEG-MAP` | Carte, repères/étapes, liste et animation du tracé |
| `/hegire/:id` | `SCR-HEG-DETAIL` | Fiche étape (`HEG-ETP`) ou dossier (`HEG-DOS`) |
| `/vie` | `SCR-VIE-LIST` | Galerie des huit thèmes et 24 fiches |
| `/vie/:id` | `SCR-VIE-DETAIL` | Fiche thème, visuels, audio et objets 3D liés |
| `/aide` | `SCR-HELP` | Gestes, accessibilité, sources, légende d'incertitude |
| `/mentions` | `SCR-LEGAL` | Informations éditeur, contact, confidentialité, crédits et licences |

Les routes sont **conceptuelles et partageables** : un chargement direct d'URL restaure la fiche et sélectionne la langue mémorisée ou FR par défaut. Le développement peut ajuster la syntaxe sans modifier l'IA ni les contenus.

### 4.2 Sept vues principales et panneaux communs

Les sept vues métier originales restent : accueil, frise, fiche chronologique, carte de l'Hégire, fiche Hégire, galerie vie quotidienne, fiche vie quotidienne. Aide, réglages, langue, sources et lecteur audio sont des **composants/panneaux transverses** ; leur rendu comme page route `aide` est autorisé sans créer un huitième espace thématique.

**Accueil :** titre, description courte, trois tuiles, choix langue explicite, reprendre dernière fiche (si identifiant valide) et lien Aide. Aucune inscription ni modal publicitaire. Entrée initiale ne lance rien.

**Frise CHR :** affichage de 6 groupes chronologiques ; navigation par périodes et par la liste ; sélectionner un événement produit un aperçu et action « Découvrir ». Dates validées en labels éditoriaux, sans fausse précision ; ne pas forcer une échelle temporelle linéaire si des dates sont incertaines. Écran utilisable sans geste de glissement (commandes suivant/précédent et liste).

**Fiche CHR :** mêmes composants narratifs que HEG et VIE ; contextualisation, récit, sources et liens croisés. Un événement lié à une étape de l'Hégire est ouvrable, mais la navigation revient au point d'origine.

**Vie quotidienne :** galerie de 8 thèmes, 3 fiches par thème, visuels réels/évocations identifiés ; objets interactifs s'ouvrent en panneau dédié, sans masquer les textes essentiels. Un modèle peut apparaître dans plusieurs fiches via le même identifiant `OBJ`.

### 4.3 État de reprise et conventions

**État minimal** (stockage local, non envoyé à un compte) : `locale`, `lastVisitedRoute`, `lastContentId`, `lastSectionId`, `audioPositionsByContentLocale`, `reducedMotionOverride?`, `updatedAt`. Stocker des clés et valeurs non sensibles ; aucune URL contenant une position personnelle.

Règles de persistance :
- Au retour depuis une fiche, restaurer **étape sélectionnée, position carte/frise et section en cours** lorsque disponibles.
- Au changement d'orientation : mêmes états et **position audio**, pas de relecture automatique.
- Au changement de langue : audio **mis en pause** ; nouvelle langue sélectionnée, section équivalente si disponible ; position audio FR et AR séparées ; jamais mapper des secondes brutes d'une langue à l'autre.
- Si contenu supprimé/invalide : retour vers son espace, message discret, sans plantage.
- Retour navigateur / retour écran explicite : cohérents, n'abandonnent pas l'utilisateur au milieu d'une animation.
- Après verrouillage/app en arrière-plan : état mémorisé, audio interrompu/pausé selon le navigateur, reprise **volontaire**.
- Une animation peut être reprise depuis son état si le moteur le permet, sinon offrir « Rejouer » clairement ; **jamais une animation essentielle bloquante**.

### 4.4 Composants partagés

`GlobalHeader`, `LanguageSwitch`, `FeatureTile`, `ChronologyTimeline`, `ImmersiveMap`, `StepList`, `ContentPreview`, `ContentArticle`, `SourceDrawer`, `AudioPlayer`, `AnimationController`, `Object3DViewer`, `MediaFallback`, `LoadingState`, `ErrorState`, `EmptyState`, `HelpPanel`, `LegalCredits`. Ce sont des **noms de composants indicatifs** pour l'équipe, pas du code imposé.

Tous les boutons ont états normal, actif, focus visible, désactivé seulement avec raison et erreur explicite ; étiquettes accessibles et navigation clavier là où le navigateur le permet.

## 5. Contrat commun d'une fiche

### 5.1 Champs visibles obligatoires

1. ID stable, espace, titre localisé, introduction et objectif de compréhension.
2. Période/lieu **si justifiés**, ou mention « emplacement / datation discutés ».
3. Récit détaillé **en sections** : Introduction, Contexte, Récit, Points à retenir (libellés adaptés au sujet), liens associés et textes de légende.
4. Références bibliographiques et notes : type (texte historique, ouvrage scientifique, étude archéologique, source de carte), auteur/édition/localisation des passages/URL si disponible, date d'examen.
5. Images et autres médias avec crédits, licence, texte alternatif, statut de reconstruction et incertitude.
6. Lecteur « Écouter » explicite, durée FR/AR propre, progression, pause/reprise/seek et transcription correspondant au récit audio.
7. Statuts de validation : historique, FR, AR, audio, droits et géographie si concerné.

**Différenciation** : une fiche Hégire peut contenir un repère/corridor ; une fiche vie quotidienne un ou plusieurs objets 3D ; aucun composant facultatif ne doit créer un champ factice.

### 5.2 Format narratif

Le script français et le script arabe **ne sont pas des traductions calculées à la volée**. Rédaction/validation linguistique séparée avec terminologie partagée, sens équivalent, durée réelle **180 à 300 s**, prononciations relues. L'aperçu et les légendes sont plus courts que le récit principal. Un récit peut différer en nombre de mots selon la langue.

Structure pédagogique recommandée : 20–30 s d'introduction, 30–60 s de contexte, 90–150 s de développement, 40–60 s de synthèse (ajuster pour total 180–300 s). **Ne pas écrire du remplissage** pour atteindre une durée ; réécrire le script si nécessaire.

### 5.3 États éditoriaux, droits et blocage publication

Pipeline pour chaque langue et média :

`BROUILLON → RELECTURE_HISTORIQUE → RELECTURE_LINGUISTIQUE → REVUE_DROITS → APPROUVE → PUBLIE`, avec `REJETE` ou `A_REPRENDRE` possibles. Pour l'audio : `SCRIPT_APPROUVE → AUDIO_PRODUIT → PRONONCIATION_APPROUVEE`. Pour carte/objet : `SOURCE_DOCUMENTEE → CHOIX_INTERPRETATIFS_DECRITS → VALIDATION_HISTORIQUE → ASSET_APPROUVE`.

Publication **interdite** tant qu'un champ obligatoire n'est pas approuvé. L'agent peut publier une préversion interne `DEMO` comportant filigrane « CONTENU DE DÉMONSTRATION — NON VALIDÉ ». Un script IA, une image générée ou le présent CDC **ne valent jamais approbation historienne**.

### 5.4 Croisements et sources

Une fiche peut référencer plusieurs fiches via `relatedContentIds[]`; les liens circulaires sont autorisés si sens pédagogique. Un lien cassé est détecté par validation du registre. Les références historiques utilisées par plusieurs fiches sont centralisées ; les reconstitutions peuvent être marquées « évocation », « hypothèse documentaire », « source directe documentée » sans confondre la qualité du **support** avec la certitude de chaque **affirmation**.

## 6. Spécification de HEG-01 — carte de l'Hégire

L'écran métier `SCR-HEG-MAP` reprend le fonctionnement des anciens dossiers SPEC-HEG-01 / UX-HEG-01.

### 6.1 Zones d'écran et comportement

- **A — En-tête :** Retour, titre « Parcours de l'Hégire », sélecteur FR/AR, Aide.
- **B — Carte :** relief illustratif et couches de repères, corridor ou tracé indicatif, état « sélectionné », titre/étiquettes et légende.
- **C — Commandes :** `+`, `−`, `Recentrer`, `Voir le parcours`, puis `Pause`, `Rejouer`.
- **D — Aperçu :** titre de l'étape, 1–2 phrases d'introduction, incertitude et `Découvrir`.
- **E — Liste de 6 séquences :** toujours consultable indépendamment de la carte.
- **F — Liste de 6 dossiers :** accessible sans point géographique forcé.
- **G — Fiche SCR-HEG-DETAIL :** récit, image optionnelle, références, bouton audio, retour à la carte.

### 6.2 Interactions P0 exhaustives

| Action | Résultat |
|---|---|
| Toucher un marqueur **ou** une étape dans la liste | Sélection et même aperçu ; état visuel + nom annoncé à l'accessibilité |
| Toucher `Découvrir` | Ouvrir `HEG-ETP-xx` en conservant le contexte cartographique |
| Toucher un dossier | Ouvrir `HEG-DOS-xx` sans créer de localisation fictive |
| Pan/déplacement | Déplacer la carte si geste pris en charge, avec zones de geste claires |
| Pincement | Zoom avec bornes ; bouton `+`/`−` toujours présent |
| `Recentrer` | Restaurer emprise et orientation initiales |
| `Voir le parcours` | Déclencher le tracé **uniquement à la demande** |
| `Pause / Rejouer` | Suspendre ou relancer sans perdre les légendes |
| Rotation appareil | Préserver étape, niveau de zoom, section et état audio |
| Changer langue | RTL texte/interface, géographie inchangée, audio mis en pause |
| Erreur de carte | Montrer les 6 étapes + dossiers, textes et option réessayer |
| Erreur d'audio | Message + texte du récit accessible |
| Réduction mouvements | Tracé explicatif statique ou progression par étapes sans déplacement cinématique |

Aucun tooltip nécessitant un survol ; tout geste multi-doigts a une alternative par commande simple. Le mouvement de carte ne fait pas défiler involontairement la fiche ; la touche retour quitte le panneau avant de quitter l'espace.

### 6.3 Séquences cartographiques et incertitudes

Les **six séquences** sont `HEG-ETP-01..06`. `HEG-ETP-02` représente un **épisode**, pas un point de sortie localisé avec certitude ; `HEG-ETP-04` représente un **trajet/corridor explicatif** et non une polyligne GPS historique. La grotte de Thawr `HEG-ETP-03`, Qubâ' et Médine réclament sources cartographiques et précisions de repérage.

**Langage de certitude :**
- **Repère général** : point ou zone avec légende « repère général », documentation de l'incertitude.
- **Localisation estimée / discutée** : halo/zone hachurée, mention explicite, pas de coordonnées précises inventées.
- **Trajet indicatif** : pointillés + légende permanente « tracé indicatif, non historique au mètre ».
- **Source non approuvée** : **ne pas afficher comme fait** en production ; substituer explication textuelle neutre.

Aucune trajectoire moderne de guidage, vitesse, distance ou durée de déplacement n'est inférée. Carte géographiquement lisible, mais l'art n'est pas une preuve.

### 6.4 Storyboard pilote de Thawr — neuf états

| ID | Écran / scène | Déclencheur | Résultat et garde-fous |
|---|---|---|---|
| SB-00 | Carte d'ensemble | ouverture | carte, listes, légende ; rien n'est lancé |
| SB-01 | Sélection Thawr | toucher repère ou liste | aperçu et identification de l'étape |
| SB-02 | Repérage | action facultative « situer » | focus léger, incertitude visible |
| SB-03 | Transition immersive | ouverture fiche | évocation minérale légendée **non historique** |
| SB-04 | Texte | fiche ouverte | 4 sections + sources + statut |
| SB-05 | Audio | « Écouter » | narrateur FR ou AR ; aucune lecture automatique |
| SB-06 | Tracé | « Voir le parcours » dans la carte | animation explicative contrôlable |
| SB-07 | Retour | bouton retour | sélection/restauration de carte |
| SB-08 | Incident | échec réseau/media | état d'erreur et fallback texte/liste |

**Pilote ne peut valider l'histoire :** aucune image ne prétend être l'intérieur documenté de la grotte en l'an 622, ni le « vrai trajet GPS ».

### 6.5 Adaptation portrait / paysage / téléphone

- **Tablette portrait :** en-tête → grande carte → commandes → aperçu → liste étapes → dossiers, défilement vertical lisible.
- **Tablette paysage :** carte dominante et panneau latéral de contexte/fiche ; les deux défilent ou se manipulent séparément.
- **Téléphone portrait :** carte et fiche successives ; commandes sous ou sur carte mais toujours accessibles ; lecteur audio visible dans fiche.
- **Téléphone paysage :** disposition en une colonne ou split seulement si chaque panneau demeure utilisable ; pas de boutons rognés.
- **RTL arabe :** menus, titres et panneaux directionnels adaptés ; **carte/positions/tracé/gestes de zoom non miroités** ; les icônes directionnelles s'inversent seulement si elles représentent une navigation logique.

### 6.6 Critères HEG P0

HEG-AC-01 ouverture sans son, HEG-AC-02 sélection identique carte/liste, HEG-AC-03 dossiers sans marqueur, HEG-AC-04 fiche complète, HEG-AC-05 animation à la demande contrôlée, HEG-AC-06 légende d'incertitude, HEG-AC-07 lecteur fonctionnel, HEG-AC-08 aucun auto-audio, HEG-AC-09 rotation conserve progression, HEG-AC-10 RTL correct sans miroir géographique, HEG-AC-11 zoom alternatif, HEG-AC-12 accès sans audio/animation, HEG-AC-13 gestion des échecs, HEG-AC-14 réduction mouvements, HEG-AC-15 validateur publication, HEG-AC-16 aucun élément essentiel inaccessible en portrait/paysage. Les tests complets sont consignés dans `recette.csv`.


## 7. Spécification de la Chronologie CHR

### 7.1 Navigation et sémantique

La frise rassemble **24 fiches en 6 périodes**. La liste et le classement éditorial (voir annexe) sont la source du tri. Chaque période affiche son intitulé, le nombre d'événements et un court résumé validé. L'utilisateur peut sélectionner directement une période, choisir une fiche, passer à la période suivante/précédente ou revenir à l'accueil. Les entrées de frise et la liste textuelle sont équivalentes.

**Décision :** ne pas déduire automatiquement des dates précises ou des espacements métriques à partir des titres ; la frise est **thématique/ordonnée** par défaut. Si une date est renseignée et approuvée, l'afficher avec précision documentée (`année`, `intervalle`, `période estimée`), jamais un jour exact non sourcé.

### 7.2 Comportements

- Départ sur vue d'ensemble, aucune narration ni animation automatique.
- Toucher événement → aperçu ; bouton `Lire et écouter` → `SCR-CHR-DETAIL`.
- Changement orientation/langue conserve période et événement sélectionnés.
- Possibilité de filtrer par période ; aucune recherche plein texte exigée en P0.
- Fiche : récit sections, références, illustrations/animations si pertinentes, lecteur partagé, contexte et liens vers Hégire.
- Frise accessible au clavier (tabulation et activation) et par commandes visibles ; pas de dépendance au drag.
- États erreur : registre absent/mal formé → message de chargement, bouton réessayer et retour accueil ; média manquant → texte accessible.

### 7.3 Conditions de réception CHR

24 IDs `CHR-01..24`, 6 groupes de 4, toutes les fiches ouvrables, ordre stable FR/AR, liens internes non cassés, pas de dates artificiellement précises, audio FR/AR séparés, affichage correct sur appareils de référence.

## 8. Spécification de la Vie quotidienne VIE et des 20 objets 3D

### 8.1 Galerie et fiches

8 catégories : habitat, alimentation, eau et stockage, vêtements et textiles, artisanat, commerce et mesures, voyage et équipements, écriture et transmission. Chaque catégorie comprend **3 fiches** (`VIE-01..24`) et **2 ou 3 objets 3D candidats**. Sélection thème → affichage cartes/fiches, puis découverte d'une fiche ; un ou plusieurs objets associés peuvent apparaître selon lien documenté. **Aucun modèle n'est présenté comme relique personnelle du Prophète ﷺ** sans preuve spécifique et validation, y compris son étiquette.

Une fiche contient visuels légendés, contexte, description de l'usage et incertitudes historiques, avec accès explicite à un objet lié si disponible. L'app ne doit pas représenter mains, porteurs, artisans, vendeurs ou silhouettes ; les fonctions sont expliquées par objets isolés, schémas abstraits et texte.

### 8.2 Visualiseur 3D commun

| Fonction | Règle P0 |
|---|---|
| Chargement | **À la demande** seulement ; vignette/texte visibles avant le modèle |
| Rotation | Glisser à un doigt dans le visualiseur ; limites d'angle pour éviter perte de l'objet |
| Zoom | Pincement **et** boutons `+`/`−` ; bornes ; vue initiale accessible |
| Recentrage | `Réinitialiser` retrouve angle et zoom initiaux |
| Points d'intérêt | Si disponibles, bouton/liste explicitant l'élément ciblé sans nécessiter précision gestuelle |
| Narration | Facultative, sur la fiche à la demande, pas déclenchée par rotation de l'objet |
| Fallback | Image 2D légendée et texte en cas d'absence WebGL, chargement trop long, erreur ou désactivation |
| Accessibilité | Toutes les **informations** du 3D sont disponibles en texte et images, les commandes sont étiquetées |
| Mémoire | Libérer ressources GPU à la fermeture et restaurer une image de couverture |
| Historiographie | Notice « reconstitution pédagogique », sources et hypothèses d'apparence |

**Performances :** prioriser modèles GLB/glTF compressés, textures adaptées, système de niveau de détail si nécessaire. Une zone 3D n'occupe pas systématiquement tout l'écran ; le récit garde sa priorité. Il est interdit de forcer l'ouverture du modèle pour accéder à la suite.

### 8.3 Acceptation 3D

Les 20 IDs `OBJ-001..OBJ-020` figurent dans le manifeste, se chargent sur tablette de référence, rotation/zoom/réinitialisation fonctionnent, aucun modèle n'a d'humain ou d'animal, aucun objet n'est déformé/rogné à l'ouverture, fallback 2D disponible, le récit est consultable lorsque le rendu WebGL échoue.

**Attention à « selle de bât » :** représenter l'**objet seul**, **sans animal**. Tous les objets sont des **hypothèses de design à vérifier** : aucun intitulé ne prouve l'usage exact ni une attribution au VIIe siècle.

## 9. Lecteur audio et moteur d'animation

### 9.1 Lecteur audio P0

Une seule instance de lecture dans toute l'application. Chaque fiche a deux pistes principales `fr`, `ar`, **180–300 secondes mesurées sur le fichier définitif**, et un texte correspondant. Contrôles : lire, pause, reprise, seek/progression, durée totale, temps courant, gestion indisponibilité, et texte de transcription/récit. La lecture commence **uniquement** par un toucher explicite de l'utilisateur.

**Table de transitions audio :**

| Événement | État imposé |
|---|---|
| Ouvrir une fiche | `idle` ou `paused` ; aucun play |
| Appuyer Écouter | `loading → playing` ou `error`, suite à geste volontaire |
| Appuyer pause | `paused`, temps mémorisé |
| Chercher un passage | curseur et audio repositionnés sans déclenchement automatique si en pause |
| Nouvelle narration demandée | ancienne piste arrêtée immédiatement, nouvelle uniquement après son « Écouter » |
| Changer fiche | piste courante mise en pause, position conservée pour sa fiche/langue |
| Changer langue | piste mise en pause, section équivalente ; nouvelle langue jamais autoplay |
| Rotation | conserver état et temps ; ne pas recréer un flux audible |
| Verrouillage / perte focus | respecter politique OS ; au retour proposer « Reprendre » sans auto-relecture |
| Erreur réseau/décodage | état erreur, réessayer et lecture du texte disponibles |

Chaque piste dispose de repères **par section**, indépendants des secondes en autre langue. Les audios d'aide/étiquettes courts ne comptent pas dans les 120 récits principaux.

### 9.2 Audio P1 et synchronisation

Retour de 15 secondes, saut direct aux sections et sous-titrage/texte synchronisé à des sections si réellement utile. Si une animation est couplée à l'audio, spécifier une table de repères **par langue** ; en pause, conserver la cohérence entre média et état visuel. Par défaut **audio et animations sont indépendants**. Pas de mélange de deux narrations, et absence de bande sonore automatique.

### 9.3 Animations de l'interface et séquences scénarisées

**Enveloppe de production : 14 animations scénarisées**, réparties à titre opérationnel : `ANI-001..005` frise et contextes CHR, `ANI-006..009` repérage/tracé/étapes Hégire, `ANI-010..014` objets/procédés VIE. Cela désigne des **scénarios d'animation réutilisables**, pas 14 vidéos obligatoires ; toute séquence doit avoir `purpose`, `trigger`, `duration`, `pause`, `replay`, `reducedMotionVariant`, `historyStatus`. Les transitions UI standard ne sont pas comptées dans ce lot.

Règles : lancement explicite pour animations explicatives importantes, `Pause`, `Rejouer`, sortie immédiate, aucun mur d'animation bloquant, variante statique expliquant le même fait, respect du réglage « réduire les mouvements ». Les transitions de changement d'état (suggestion DA) durent **180–320 ms** hors réduction des mouvements, sans parallax ou flashes distrayants. Le tracé de l'Hégire porte toujours sa légende d'incertitude.

## 10. Contrats de données et chaîne éditoriale

### 10.1 Entités minimales (sans imposer de stockage serveur)

**`ContentEntry` :**
- `id` (unique, immuable), `space`, `kind`, `group`, `order`, `relations[]`.
- `localized.fr/ar`: `title`, `intro`, `learningObjective`, `sections[{sectionId,heading,body}]`, `summary`, `altTexts`, `captions`, `audioScript`.
- `chronology`: `periodLabel`, `precision`, `dateStatus` (optionnel).
- `geography`: `representationKind`, `geometryId?`, `confidence`, `uncertaintyLabel`, `sources[]` (optionnel).
- `mediaRefs[]`, `objectIds[]`, `animationIds[]`, `audioRefs.fr/ar`.
- `referenceIds[]`, `historicalApproval`, `linguisticApproval.fr/ar`, `legalApproval`, `published`, `revision`, `updatedAt`.

**`MediaAsset` :** `assetId`, `kind` (`image`, `audio`, `3d`, `animation`, `map`), `url`, `hash`, `mimeType`, `size`, `width/height` ou `duration`, `locale?`, `alt`, `caption`, `credit`, `license`, `source`, `status`, `fallbackAssetId?`.

**`HistoricalReference` :** `referenceId`, `type`, `bibliographicCitation`, `locator`, `url?`, `checkedAt`, `reviewerId`, `notes`, `contentIds[]`, `useConstraints`.

**`ApprovalRecord` :** `targetId`, `targetRevision`, `dimension` (histoire, langue, géo, audio, droits), `reviewerRole`, `decision`, `timestamp`, `evidenceLink`, `comments`. Validation par identité professionnelle/journal interne : **pas d'interface admin publique V1**.

**`GeographicRepresentation` :** `geoId`, `kind` (`general_marker`, `area`, `illustrative_corridor`, `not_mappable`), `shape`, `precision`, `uncertaintyDescription.fr/ar`, `sourceIds[]`, `verifiedRevision`. **Le système n'exige jamais de coordonnées si `not_mappable`**.

### 10.2 Contrat et validation des médias

Chaque contenu référencé par un média doit respecter :
- URL de média résolue ; version/empreinte permettant purge cache ; `alt` et crédit lorsque pertinent.
- Sous-titres, descriptions et explications indépendants du visuel.
- Images localisées par **calques de texte** ; aucun texte FR/AR essentiel incrusté.
- Audio : champs `durationSeconds`, `scriptVersion`, `sectionCuePoints`, `pronunciationApproval`.
- 3D : référence à image de remplacement, miniature, contraintes visuelles et sources.
- Incompatibilité de révision entre script et audio = échec automatique de validation.
- Référence approuvée n'autorise pas à déclarer toutes les interprétations certaines : chaque allégation critique doit pouvoir être liée à une note.

### 10.3 Validation automatique avant build/publication

L'agent doit mettre en place des contrôles déterministes : 60 IDs uniques, aucun trou de numérotation, **24/12/24**, 2 langues/fiche, 120 pistes d'une durée mesurée 180–300 s, 20 modèles/20 fallbacks, références exigées, champs non vides, fichiers présents, liens internes existants, licences renseignées, zéro média `DÉMO` ou `NON_VALIDE` en release publique et état `APPROUVE` de toutes les dimensions obligatoires. Les contrôles sont bloquants en canal public, mais peuvent être non bloquants sur environnement de développement.

### 10.4 Organisation des assets et publication

Les contenus publiés sont **versionnés et séparés du code** (JSON/Markdown validés dans un référentiel, chargés statiquement depuis CDN). Aucune dépendance à une génération IA en ligne en usage visiteur. Les médias définitifs vivent sur un hébergement/CDN configuré avec CORS, cache, compression et politique de licence. La modification des récits passe par PR ou procédure éditoriale contrôlée puis publication atomique du nouveau manifeste ; pas de CMS en V1.

Les fichiers inventaire fournis sont **des seeds de travail**. Le champ `A_RECHERCHER` n'est pas une validation documentaire. L'équipe peut créer des contenus de démonstration pour développer l'écran ; elle doit ensuite intégrer les contenus et enregistrements approuvés à partir du registre.

### 10.5 Inventaire des médias, 219 emplacements réservés

Le CSV `inventaire_medias.csv` relie chaque identifiant à un contenu et à un statut de production : **120 audios** (`AUD-<FICHE>-FR/AR`), **45 illustrations originales** (`IMG-*`), **14 animations** (`ANI-001..014`), **20 modèles** (`GLB-OBJ-*`) et **20 rendus de remplacement 2D** (`FALLBACK-OBJ-*`). Les 20 rendus fallback 3D sont **en plus** des 45 illustrations éditoriales. Les 45 illustrations sont réparties en 24 illustrations CHR, 9 Hégire (6 séquences et 3 dossiers), 8 couvertures VIE et 4 détails VIE. Les scénarios de 14 animations sont associés à des fiches précises dans le registre. **Aucun de ces 219 médias binaires n'est livré par le présent paquet** ; leurs IDs et usages sont planifiés.

Les colonnes `image_refs`, `animation_refs`, `audio_fr_id` et `audio_ar_id` du CSV des fiches sont la référence pour la liaison. Les assets référencés par plusieurs fiches sont **chargés une fois**, le fichier ne doit pas être dupliqué pour chaque lien. Toute variante linguistique dans un média conserve son ID propre et sa revue linguistique.



## 11. Internationalisation et ergonomie tactile

### 11.1 Bilinguisme et RTL

- Interface et contenus FR/AR complets ; choix de langue depuis accueil et barre supérieure.
- Locale par défaut : langue stockée, sinon **français** ; le visiteur peut immédiatement choisir l'arabe.
- Appliquer `lang`, `dir` et alignements RTL aux textes, titres, pagination logique, panneaux et ordre de lecture. **Ne pas retourner la géographie**, la texture de relief, les volumes 3D, ou les sens physiques représentés.
- Traduire boutons, erreurs, légendes, attributs d'accessibilité, métadonnées de source et informations d'incertitude. Conserver titres propres/translittérations approuvés dans lexique partagé.
- Aucune traduction automatique en production, aucun texte clé inclus directement dans une image.
- Script arabe : césures naturelles, taille augmentable, diacritiques justes, ponctuation/nombres bidirectionnels testés ; n'écraser jamais la police arabe pour faire rentrer un libellé.

### 11.2 Gestes, interfaces et orientation

- **Cible tactile minimale interne : 48 × 48 pixels CSS** et espacement permettant un contact adulte/enfant ; retour, pause, fermeture et recentrage toujours visibles.
- Éléments essentiels actionnables par **toucher simple** ; pas de hover, long-press, secret gesture ou glissement obligatoire.
- Pincement toujours doublé de boutons de zoom sur cartes/objets ; contrôle de valeur et reset.
- Reprise de sélection/audio sur changement orientation ; préserver l'état sans redemander la langue.
- Orientation portrait prioritaire tablette, paysage utilisable ; téléphone portrait/paysage sans élément masqué.
- Offrir texte plein format, contraste suffisant, focus visible, réduction des animations et alternatives statiques à chaque animation apportant du sens.
- Préférences système : zoom texte / lecteur d'écran / contraste / reduced motion respectées.

### 11.3 Écran et dimensions de conception

**Viewports de recette illustratifs, non résolution matérielle :** tablette portrait 834×1194, tablette paysage 1194×834, téléphone 390×844 (CSS px). Tester aussi largeur 320 CSS px, grandes tailles de texte à 200 %, rotation et zone sûre du navigateur. Ne pas fixer une mise en page à ces seules dimensions ; utiliser des seuils guidés par le contenu et des états sans recouvrement.

### 11.4 Accessibilité contractuelle

Objectif **WCAG 2.2 niveau AA** sur les parcours centraux. Contraste de texte ≥4,5:1 (grand texte ≥3:1), icônes/états UI non textuels essentiels ≥3:1, ordre focus et annonces accessibles, contrôle du focus des panneaux, boutons 48×48 CSS px (plus strict que le minimum WCAG 2.2 AA), redimensionnement du texte 200 %, alternative au pincement et mouvement réduit. Les animations d'interaction non essentielles peuvent être désactivées même si ce contrôle correspond à un renforcement au-delà du niveau AA. Aucune information portée par couleur seule.

**Tests manuels obligatoires :** VoiceOver sur Safari iPad/iPhone ; TalkBack sur Chrome Android ; navigation clavier au moins sur les contrôles web ; tests FR et AR. Les cartes complexes sont doublées d'une liste sémantique navigable ; les informations 3D restent lisibles sans rendu.

## 12. Direction artistique définitive de construction

### 12.1 Vision et interdictions

Concept « **Atlas vivant, musée contemplatif** » : sensation d'atlas documentaire immersif, relief topographique feutré, atmosphère désertique et minérale, espaces de lecture clairs. Qualité du récit et de la représentation avant spectacle. **Interdits absolus :** humains, silhouettes, mains, mannequins, ombres humaines, avatars, figures religieuses, animaux dans la scène des objets, cinématique qui simulerait une preuve historique ; pas de fausse reconstitution assurée « comme en 622 ».

Aucune illustration générée ne peut être diffusée sans revue historique ET juridique/licence. Chaque panorama inventé est étiqueté **« Évocation pédagogique — détails hypothétiques »**.

### 12.2 Palette graphique — tokens gelés pour build

| Usage | Token | HEX | Notes |
|---|---|---|---|
| Fond lecture | ivoire | `#FAF7F0` | grandes surfaces |
| Surface secondaire | sable | `#F2E9DB` | panneaux |
| Surface carte | relief | `#E4D6BD` | sous fonds et contours |
| Texte principal | encre roche | `#203331` | texte général |
| En-tête | bleu minéral | `#123A43` | chrome |
| Bouton principal | vert profond | `#235A55` | actions |
| Accent repère graphique | ocre | `#A66C2D` | **pas de petit texte** |
| Accent texte lisible | ocre sombre | `#84541C` | libellés |
| Incertitude / explication | terre cuite | `#99583A` | compléter par motif + texte |
| Texte secondaire | schiste | `#546661` | métadonnées |
| Bordure | pierre | `#B9AC96` | décoration non exclusive |
| Surface éclaircie | blanc | `#FFFFFF` | cartes superposées |

Les tests de contraste doivent être rejoués sur tous les couples finaux d'éléments, y compris fond photographique/texte et états désactivés. Un masque opaque est requis sous un texte posé sur image.

### 12.3 Typographies

- Français : **IBM Plex Sans**, 400/500/600.
- Arabe : **IBM Plex Sans Arabic**, 400/500/600.
- Si une police n'est pas légalement utilisable ou échoue en tests natifs, conserver les métriques et la hiérarchie avec une police libre équivalente ; **pas de licence de police supposée**.
- Tablette : titre écran 28–32 px FR / 30–34 px AR ; corps 17–19 px FR / 19–21 px AR ; boutons ≥16 px FR / 17–18 px AR.
- Téléphone : titres 22–26 px FR / 24–28 px AR ; corps ≥17 px FR / ≥19 px AR. Interlignage proposé 1,55–1,65 FR, 1,65–1,85 AR.
- **Ne pas forcer des retours de ligne identiques FR/AR** ; dimensionner au contenu et aux lecteurs.

### 12.4 Cartographie, rendu et textures

Matières : pierre patinée, relief aride, sable mat, roche ocre-gris ; éclairage naturel doux matin/fin de journée sans soleil mystique ou halo sacralisé. Ne pas faire ressembler une reconstitution au reportage photographique d'une époque : créditer sa nature. Carte en couches : relief illustratif, itinéraire en pointillés, corridor hachuré, repères nommés, légende permanente.

Photographie moderne possible **uniquement** avec date, lieu, crédit et indication « photographie contemporaine ». Une vue inventée de Thawr ne doit pas prétendre documenter son intérieur ou une configuration du VIIe siècle. Pour les objets 3D, rendu neutre, matière documentaire ; rotation sans mains/acteurs.

### 12.5 Maquettes de référence à réaliser et livrer

- `HF-01` : tablette portrait, carte avec Thawr sélectionnée + aperçu et listes.
- `HF-02` : tablette paysage, carte et fiche côte à côte.
- `HF-03` : téléphone portrait, carte.
- `HF-04` : téléphone portrait, fiche/lecteur.
- Pour chaque : variantes **FR et AR**, état chargé, chargement, erreur réseau/audio, reduced-motion et sources/incertitudes.

Les maquettes sources (Figma ou format équivalent) sont à **produire** par le développement/design : les dossiers précédents contiennent des spécifications de composition et une planche conceptuelle, **pas des maquettes vectorielles livrées comme écrans finaux**.

## 13. Architecture technique arrêtée

### 13.1 Type et découpage

**Application web SPA ou application client routée**, responsive, hébergée en HTTPS : React + TypeScript + Vite, animation UI Motion lorsque nécessaire, Three.js/React Three Fiber/Drei **chargés seulement sur les fiches 3D**, SVG/canvas léger pour carte, frise en composants accessibles.

Aucun serveur applicatif avec compte obligatoire. Le **backend V1 se limite** à un hébergement statique, CDN assets et éventuellement service de build/CI ; contenu approuvé empaqueté/versionné et distribué statiquement. L'agent peut utiliser une fonction serveur technique (ex. génération/sitemap) seulement si aucun service utilisateur supplémentaire n'est imposé.

**Justification :** lecture publique, médias préproduits, aucune personnalisation multi-appareil ; le choix réduit les risques de confidentialité et de disponibilité. Le code ne doit pas contenir les textes définitifs en dur.

### 13.2 Packages/modules logiques

`app-shell`, `routing`, `i18n`, `content-registry`, `narration`, `media`, `chronology`, `hegira-map`, `daily-life`, `viewer-3d`, `accessibility`, `error-handling`, `legal`, `tests`. L'agent définit l'organisation des dossiers dans une ADR technique ; les frontières de responsabilité restent nécessaires.

### 13.3 Chargement et reprise

Chargement différé **par espace et média**, format d'image adaptatif (AVIF/WebP si compatibles + fallback), prévisualisations légères, GLB/glTF compressés ; audio servi comme fichier préproduit permettant seek/range requests. Ne pas charger 20 modèles et 120 pistes à l'accueil. Ne pas bloquer un récit à cause d'un objet 3D. Réponses HTTP cacheables et invalidation par noms fingerprint/manifest versionné ; comportement correct avec CDN indisponible et erreur réseau.

**PWA / service worker :** non exigé et ne doit pas transformer l'application en offline complet. Un cache technique standard est possible ; l'app continue d'exiger une connexion pour une consultation complète. Les écrans déjà affichés peuvent rester visibles lors d'une interruption.

### 13.4 Sécurité d'architecture

HTTPS uniquement, CSP adaptée aux médias/fonts/script, dépendances verrouillées et auditées, contrôle de typage/validation de schéma des contenus, interdiction HTML non nettoyé et URL non approuvées dans le registre, absence de secrets dans le bundle, en-têtes de sécurité compatibles avec le CDN, pas d'API admin exposée. Les contrôles de publication des assets approuvés sont gérés en CI avec permissions de dépôt minimales.

**Pas d'auth utilisateur** ; les mesures d'auth/anti-bruteforce/RBAC s'appliquent seulement aux outils internes de publication s'ils sont ajoutés ultérieurement, **pas comme dépendance artificielle à la lecture publique**. Référence de contrôle : OWASP ASVS stable 5.0.0 (chapitres applicables à l'application et aux pipelines).

## 14. Confidentialité, RGPD, droits et exploitation

### 14.1 Données et politique de suivi

Données personnelles demandées à l'utilisateur : **aucune**. Stockage local : langue, dernier écran, section, positions de narration et préférence motion. L'hébergeur peut collecter IP/horodatage technique en journaux ; limiter accès, durée et finalités, prévoir information et purge selon contrat. Pas de mesure comportementale nominative, pas de cookies marketing ni de SDK publicitaire.

**Décision V1 : aucun outil d'analytics tiers et aucun traceur non essentiel.** Si de la mesure d'audience est ajoutée plus tard, documenter sa finalité, sa base et sa configuration au regard des règles CNIL ; l'exemption de consentement n'est **pas automatique**. Pour un contrôle qualité initial, utiliser métriques techniques serveur anonymisées/agrégées sans identifiant visiteur.

### 14.2 Cadre légal et droits d'auteur

- Informer sur éditeur, contact, crédits, confidentialité et modalités de correction.
- Documenter la licence/utilisation de **chaque** texte emprunté, image, carte, police, modèle 3D, voix et bande sonore.
- Ne pas reproduire des traductions contemporaines de textes historiques, grandes citations, photographies ou musiques sans droits vérifiés ; les références bibliographiques seules ne constituent pas permission de copie.
- Pour la voix synthétique enregistrée : vérifier la licence de production/diffusion, qualité FR/AR et restrictions de fournisseur ; ne pas prétendre qu'une voix est une voix historique.
- Public familial : aucune inscription mineure, publicité comportementale ni traitement de données enfant à concevoir.
- Les choix finaux de politique de confidentialité et mentions légales nécessitent les coordonnées réelles de l'éditeur/hébergeur, à renseigner dans les variables d'exploitation et **non à inventer**.

### 14.3 Processus des corrections

Chaque fiche donne accès à ses références et aux crédits. La page Aide/Mentions présente un **contact éditorial** d'exploitation, renseigné au déploiement. Une demande de correction déclenche une issue interne `EDITORIAL_CORRECTION` avec version et revalidation des langues/médias concernés ; un changement factuel dans la narration invalide son audio jusqu'à relecture et nouvelle approbation.

### 14.4 Observabilité et support

Monitoring de disponibilité (endpoint statique / synthétique), échecs de chargement CDN, erreurs JavaScript **sans URL personnelle ni texte privé**, alertes d'intégrité du manifeste, contrôle automatisé de liens et média. Pas d'observation de parcours individuel. Procédure d'incident : rollback de manifeste, invalidation CDN, affichage fallback, journal des changements.


## 15. Qualité de service, performances et compatibilité

### 15.1 Parc d'essai et support

Support logiciel **minimum de construction** : Safari sur iPadOS/iOS 17 et versions ultérieures prises en charge ; Chrome Android 12 et versions ultérieures ; tester **la version stable courante et l'avant-dernière** à la date de développement. Le navigateur réel et ses performances priment sur le nom du système. Les parcours textuels doivent fonctionner sans WebGL ; seules les manipulations 3D peuvent alors afficher le fallback.

**Matériel de référence à mettre à disposition du projet sans demander au commanditaire :**
- tablette iPad de gamme standard, 2022 ou ultérieure, Safari ;
- tablette Android grand public de milieu de gamme, ≥ 4 Go RAM, Chrome ;
- téléphone iPhone de gamme standard, 2020 ou ultérieur, Safari ;
- téléphone Android milieu de gamme, ≥ 4 Go RAM, Chrome ;
- test supplémentaire téléphone compact et écran avec texte agrandi.

Ces références sont des **profils de recette**, pas des garanties de compatibilité avec tous les appareils existants. Si le parc disponible n'est pas identique, l'agent consigne modèle, OS, RAM, navigateur et écarts avant réception.

### 15.2 Scénarios réseau

- **Wi-Fi de référence** : débit descendant stable 20 Mbit/s, RTT ≈50 ms.
- **Réseau mobile dégradé** : 8 Mbit/s, RTT ≈100 ms, perte de réseau simulée.
- **Hors ligne** : écran déjà affiché conservé si navigateur le permet, message « Connexion interrompue », réessayer ; consultation complète **non** attendue.

### 15.3 Budgets et seuils (cibles de projet à instrumenter)

| Indicateur | Cible P0 | Mesure |
|---|---|---|
| Chargement route initiale | **LCP ≤ 2,5 s sur profil Wi-Fi** après premier chargement non caché sur référence | navigateur / test instrumenté ; médiane 5 essais |
| Réactivité | **INP ≤ 200 ms** lorsque mesurable, ou test d'interaction équivalent pour prototype | labo + surveillance qualité |
| Stabilité | **CLS ≤ 0,1** | audit navigateur |
| Média d'accueil | budget **≤ 1,5 Mo** pour images nécessaires à l'accueil initial (hors code/typos) | réseau devtools |
| JavaScript route initiale | objectif **≤ 350 Ko compressé** avant chargement de carte/3D | analyse bundle |
| Image individuelle | objectif **≤ 1,5 Mo** pour rendu standard tablette, avec variantes de résolution | analyse asset |
| Objet 3D individuel | objectif **≤ 8 Mo GLB compressé** ; >8 Mo justifié explicitement | mesure de poids + qualité |
| Manipulation 3D | ≥ **30 images/s médianes** pendant interaction représentative 30 s, sur tablettes de référence | instrumentation FPS |
| Chargement 3D | **≤ 5 s** sur réseau Wi-Fi de référence pour modèle ≤8 Mo ; état visuel/fallback avant | test chronométré |
| Audio | lecture après geste sans superposition ; si ressource indisponible, feedback et texte | test manuel |
| Erreur | zéro écran blanc et zéro commande inactive sans réponse lors de coupure | test de panne |

Ces **cibles sont des critères d'ingénierie décidés pour la V1**, et non des mesures déjà réalisées. Si une cible n'est pas atteinte, simplifier textures, scènes, effets ou rendu plutôt que supprimer la lisibilité et l'exigence de contenu. Un écart exceptionnel se consigne avec preuve de test et correction ou fallback équivalent. Les objectifs de Web Vitals doivent être contextualisés selon instrumentation réelle et pas confondus avec une garantie arbitraire sur toute connexion.

### 15.4 Pannes et dégradations contrôlées

| Incident | Comportement attendu |
|---|---|
| Manifest introuvable | état d'erreur global avec « Réessayer » ; aucune page blanche |
| Image illisible | place-holder neutre, alt/légende et texte |
| Modèle GLB absent/WebGL non disponible | image de remplacement, texte, indication claire |
| Audio absent | récit complet et bouton réessayer |
| Carte indisponible | liste des étapes et dossiers exploitables |
| Transition orientation pendant audio | écran stable, pas de lecture double |
| Corruption de préférences locales | purge ciblée / valeurs par défaut ; ouverture de l'accueil |
| Donnée FR présente mais AR manquante | **build public refusé**, en interne placeholder de démo visible |
| Coupure lors du tracé | animation locale disponible si déjà chargée ; sinon message + version statique |

## 16. Assurance qualité et stratégie de tests

### 16.1 Tests automatisés

- Schémas et intégrité des 60 contenus/20 objets/120 audios, présence des sources, droits, approbations et résolutions des liens.
- Unitaires : navigation/état des fiches, choix FR/AR et RTL, lecteur audio unique, changement d'orientation, mappage sections, classe d'incertitude, fallback, persistence.
- Composants : état chargé/erreur/disabled, touch target et intitulés accessibles.
- End-to-end : accueil → CHR, accueil → HEG (séquence + dossier), accueil → VIE (objet + fallback) dans les 2 langues ; rotation et retour ; panne réseau/media.
- CI : typage, lint, audit dépendances, tests, build, contrôles des actifs et licences ; **interdire** déploiement production si contenus `NON_VALIDÉ` ou `DEMO`.

### 16.2 Recette manuelle

Les essais sur **appareils physiques** comprennent : portrait/paysage, grande police, usage avec un enfant accompagné, gestes de carte vs défilement, lecteur audio après verrouillage, langage AR/RTL, VoiceOver/TalkBack, lecteur sans son, connexion instable, comportement WebGL dégradé et 3D après retour/sortie. Échantillonner les fiches de tous les thèmes et faire une **revue systématique des 60/120/20 actifs** pour la couverture.

### 16.3 Définition of Done (DoD) d'une fonctionnalité

Une tâche n'est terminée que si son comportement est conforme au CDC, ses états chargement/erreur/absence de média sont décrits et testés, FR/AR et RTL pris en charge, navigation tactile et lecteur d'écran non bloqués, tests automatisés pertinents verts, performances surveillées, documentation d'exploitation actualisée et absence de texte « de démonstration » non étiqueté.

### 16.4 Critères d'acceptation globaux (liste de référence)

| ID | Critère P0 et preuve |
|---|---|
| AC-001 | L'application ouvre l'accueil FR/AR sans compte, inscription ou publicité |
| AC-002 | Les trois espaces sont accessibles, sans ordre imposé |
| AC-003 | La chronologie expose 6 périodes, 24 événements et toutes leurs fiches |
| AC-004 | La carte Hégire présente 6 séquences + 6 dossiers, sans marqueur inventé |
| AC-005 | La galerie Vie quotidienne comporte 8 thèmes × 3 fiches |
| AC-006 | Toutes les 60 fiches ont 2 langues et textes complets approuvés |
| AC-007 | Chaque fiche fournit ses références, légendes et statut de représentation |
| AC-008 | 120 audios approuvés respectent 180–300 s par langue |
| AC-009 | Aucun son ne démarre à l'ouverture ou après une interruption/changement langue |
| AC-010 | Une seule narration peut jouer à la fois |
| AC-011 | L'audio se met en pause/reprend/cherche un passage et affiche les temps |
| AC-012 | Le changement FR↔AR conserve section et arrête le son, sans synchronisation brute des secondes |
| AC-013 | Le changement orientation conserve fiche, sélection, lecture et position audio |
| AC-014 | Les textes sont lisibles sans son ni animations |
| AC-015 | 20 GLB approuvés sont manipulables et ont un fallback image+texte |
| AC-016 | Rendu 3D n'empêche pas l'accès au texte lorsqu'il échoue |
| AC-017 | La carte autorise sélection liste/repère, zoom boutons et recentrage |
| AC-018 | Le tracé est manuel, pausé/rejoué et explicitement indicatif |
| AC-019 | Les étapes incertaines ne sont jamais affichées comme coordonnées certaines |
| AC-020 | Aucune silhouette/personnage humain dans tout média |
| AC-021 | Le RTL fonctionne sans miroir géographique ni 3D |
| AC-022 | Aucune commande tactile essentielle inférieure à 48×48 CSS px |
| AC-023 | Focus visible, alt/sources, clavier/lecteur d'écran et réduction mouvements fonctionnels |
| AC-024 | Les échecs réseau/carte/audio/3D affichent une reprise et un fallback |
| AC-025 | L'application satisfait les seuils de performance sur les appareils/profils de test |
| AC-026 | Les mentions, crédits/licences et contact éditeur sont renseignés |
| AC-027 | La build prod refuse les médias/fiche sans approbations exigées |
| AC-028 | Les traces personnelles/traceurs tiers non nécessaires ne sont pas présents |
| AC-029 | Audit sécurité basique effectué, pas de secrets ni injections dans les contenus |
| AC-030 | Livraison : code, instructions build/deploy, jeu de tests, assets validés et registre des décisions |

Le fichier `recette.csv` donne le protocole concret pour chaque critère avec environnement, méthode et preuve attendue.

## 17. Backlog P0/P1/P2 et séquencement d'exécution

### 17.1 Découpage P0 recommandé

| Epic | Description | Dépendances | Sortie observable |
|---|---|---|---|
| E01 | Socle application, routing, état local, i18n FR/AR | aucune | accueil + navigation bilingue |
| E02 | Design system, accessibilité, responsive | E01 | composants et 4 compositions HEG testées |
| E03 | Registre éditorial, schémas, références, bloqueur publication | E01 | chargement de contenus versionnés et validateur |
| E04 | Fiches communes et lecteur audio | E02,E03 | fiche FR/AR complète en démo |
| E05 | Frise chronologique | E02,E03,E04 | 24 entrées et navigation |
| E06 | Hégire carte + légende d'incertitude + storyboard Thawr | E02,E03,E04 | HEG complet y compris dossiers |
| E07 | Galerie VIE + visualiseur GLB | E02,E03,E04 | 8 thèmes, manipulations et fallback |
| E08 | Production/validation des 60 fiches, 120 narrations, 45 visuels cible, 14 animations cible, 20 objets | E03 + contrôle documentaire | média pack prêt publication |
| E09 | Tests, sécurité, performances, appareil réel, RGPD et mentions | E01..08 | rapport de recette et build publique conforme |
| E10 | Packaging, CI/CD, documentation et release | E09 | application HTTPS et dossier d'exploitation |

**Règle de dépendance :** l'agent peut construire E01–E07 avec **fixtures DEMO** sans inventer de faits ; E08 correspond à un flux de production et de validation humain nécessaire, distinct de la construction logicielle. Les contenus définitifs ne sont pas fournis dans ce paquet. L'agent ne doit **pas annoncer E08 terminé** sur la base de l'inventaire seul.

### 17.2 Gate progressifs sans consultation du commanditaire

- **G0 — démarrage :** CDC V1.0 reçu, inventaire CSV parsable, accès dépôt et infrastructure technique. Choix d'outillage mineurs consignés en ADR.
- **G1 — prototype fonctionnel :** 1 CHR, 1 HEG/Thawr, 1 VIE et 2–3 modèles **de démonstration identifiés**, FR/AR, lecteurs et erreurs, tests sur vrai matériel. On peut franchir G1 techniquement sans les approbations historiques finales.
- **G2 — architecture/UX :** 7 vues, responsive, 2 langues, tests audio/3D/carte, performances des assets démo, règles de validation automatisées.
- **G3 — corpus complet :** 60 scripts et fiches **approuvés** par historien et réviseurs, 120 audios, 20 modèles et visuels finalisés/licenciés ; **impossible à franchir honnêtement sans ces livrables**.
- **G4 — recette et release :** conformité au tableau de critères, tests appareils, sécurité/mentions, zéro placeholder, publication contrôlée.
- Si une compétence historique externe manque : affecter le rôle dans le plan de recrutement/prestation et **laisser G3/G4 en échec**, plutôt que demander de fausses validations à l'utilisateur.

### 17.3 RACI de réalisation (rôles, pas de personnes inventées)

| Livrable | Responsable production | Approbateur métier |
|---|---|---|
| Webapp, CI, intégrations | Agent développeur / lead technique | Responsable recette technique |
| UX/DA et ergonomie FR/AR | Design UX/UI | Responsable UX/accessibilité |
| Corpus Sîra, carte, controverses | Rédaction/recherche documentaire | **Expert historique compétent — à recruter/désigner** |
| Texte français | Rédacteur FR | Réviseur FR |
| Texte arabe | Rédacteur AR | Réviseur AR natif |
| Audio/prononciation | Production audio | Réviseurs linguistiques + validation éditoriale |
| Contrats de droits et mentions | Production / exploitation | Juriste ou responsable habilité |
| Test de réception | QA | Lead QA |
| Autorisation de publication | Responsable de publication désigné par l'exploitant | Sur preuve G3/G4, sans inventer de signature |

**Décision d'exploitation** : aucune personne fictive, signature simulée ni « validation automatique de l'historien » par IA.

## 18. Risques et mitigations — registre final

| ID | Risque | Niveau | Prévention / seuil de blocage |
|---|---|---|---|
| R01 | Contenu historiquement inexact ou source insuffisante | **Critique** | références vérifiables par fiche, expert historique ; G3 bloqué |
| R02 | Itinéraire présenté comme géographie certaine | **Critique** | types `illustrative_corridor`, légendes, revue de chaque couche |
| R03 | Production de 120 audios et traduction sous-estimée | Élevé | lot pilote, dictionnaire de prononciation, automation de contrôle durée/version |
| R04 | 20 modèles 3D trop lourds | Élevé | budgets GLB, LOD, à la demande, fallback et tests appareils |
| R05 | Droits de médias/voix/polices non établis | **Critique** | registre licence ; `APPROUVE` obligatoire |
| R06 | Design conceptuel interprété comme archive historique | **Critique** | légendes explicites, séparation sources/évocations |
| R07 | Arabe RTL et diacritiques dégradés | Élevé | tests natifs, revue AR par professionnel |
| R08 | Interactions tactiles empêchent lecture/zoom | Élevé | commande simple alternative, pilotage gestes sur appareils |
| R09 | Réseau/CDN non disponible | Moyen/Élevé | états explicites et fallback ; CDN versionné |
| R10 | Gestion de la progression audio devient incohérente | Moyen | machine d'état unique, tests rotation/langue/fiche |
| R11 | Nouveaux modules non décidés diluent la V1 | Moyen | backlog gelé, P1/P2 séparés |
| R12 | L'agent substitue des données inventées aux ressources absentes | **Critique** | fixtures DEMO, contrôle bloquant `approved`, audit G3 |

## 19. Budget de périmètre, hypothèses et limites assumées

Le présent document **ne contient pas de devis**, calendrier calendaire, noms de prestataires ni budget chiffré, car aucune tarification ni capacité d'équipe vérifiée n'a été fournie. Inventer des montants comme s'ils étaient approuvés rendrait le CDC trompeur. **Décision finale de cadrage :** conduire le projet par gates de preuve plutôt que s'engager sur un délai artificiel.

Ordre de grandeur technique **non financier** :
- 60 récits × 2 langues = 120 scripts et 120 audios de 3–5 minutes (**6 à 10 heures audio cumulées**).
- 20 GLB distincts avec illustrations 2D et notices.
- 40–50 illustrations originales (cible 45) et 12–16 animations (cible 14).
- 1 frise, 1 carte principale, 7 vues métier et plusieurs composants partagés.
- Les coûts dominants seront probablement **validation historique, traduction/relecture, production visuelle et audio**, puis intégration/QA.

Hypothèses et protocole de validation :
- H01 (moyenne) : SVG/illustration suffit à la carte immersive → comparer prototype sur iPad/Android à objectifs UX.
- H02 (moyenne) : 20 GLB tiennent les budgets → deux modèles faciles + un complexe en pilote, profiler.
- H03 (faible) : les 12 sujets Hégire se documentent sans précision géographique abusive → recherche et revue spécialiste.
- H04 (moyenne) : IBM Plex Sans Arabic est lisible à l'écran retenu → tests utilisateurs et relecteur natif.
- H05 (faible) : les 45 visuels et 14 séquences suffisent à l'immersion → pilote et évaluation qualitative.
- H06 (élevée) : les préférences locales suffisent sans compte → preuve fonctionnelle des parcours définis.
- H07 (faible) : un expert historique compétent sera mobilisé → prévoir prestation avant G3.
- H08 (moyenne) : objectifs de vitesse sur références testables → mesures et optimisations G2.

## 20. Instruction de handoff Codex — exécution sans nouvelle clarification produit

L'agent destinataire reçoit **un cahier des charges de produit**, pas un corpus publié. Son instruction prioritaire :

1. Lire ce document dans son intégralité et parser les CSV.
2. Créer les routes, composants, design tokens, machine d'état et contrats de données définis.
3. Charger les 60 titres/IDs et 20 IDs d'objets ; ne jamais transformer un titre en faux récit documenté.
4. Créer des **fixtures DEMO** FR/AR clairement signalées pour les scénarios de test, sans les inclure en release publique ; la maquette conceptuelle ne vaut pas carte historique.
5. Implémenter les 30 tests globaux et les tests spécifiques HEG/CHR/VIE ; automatiser le blocage éditorial.
6. Tester sur appareils physiques, corriger performance et accessibilité.
7. Produire une liste séparée des contenus/assets réellement manquants, avec responsables et preuves attendues. **Ne pas inventer d'approbations**, licences, coordonnées, citations, voix enregistrées ou textes définitifs.
8. Publier seulement après G3/G4 et inclure dans le rapport de livraison : version, commit, résultats tests, appareils, taille bundle/médias, complétude 60/120/20, références, droits, incidents connus, procédure de rollback.

**Définition de la livraison attendue par le développeur :** URL HTTPS de production, dépôt complet, procédures `install/build/test/deploy`, variables d'exploitation documentées, manifestes signés/versionnés, assets juridiquement et historiquement approuvés, rapport QA, absence de blocage critique et possibilité d'exploiter/corriger le contenu sans toucher au code des écrans.

**Blocage transparent :** le développement peut être réalisé à partir du présent CDC ; une application historiquement complète ne peut être certifiée comme livrée sans production documentaire et revue compétente. Aucun besoin de redemander au commanditaire d'arbitrer l'UX, la liste de contenus, la technique ou le scope déjà fixés ici.


## Annexe A — Inventaire éditorial exhaustif et gelé (60 fiches)

Chaque ligne est un **sujet de production arrêté**, **pas** un texte historique vérifié. Le registre machine et les validations restent les sources d'approbation.

### A.1 Chronologie — 24 fiches

| ID contenu | Période | Sujet de fiche |
|---|---|---|
| `CHR-01` | Contexte mecquois | La Mecque : cadre géographique et social |
| `CHR-02` | Contexte mecquois | Naissance et enfance |
| `CHR-03` | Contexte mecquois | Jeunesse et activités |
| `CHR-04` | Contexte mecquois | Vie familiale avant la Révélation |
| `CHR-05` | Débuts de la Révélation | Premières révélations |
| `CHR-06` | Débuts de la Révélation | Premiers adhérents au message |
| `CHR-07` | Débuts de la Révélation | Prédication publique |
| `CHR-08` | Débuts de la Révélation | Oppositions et premières épreuves |
| `CHR-09` | Avant l'Hégire | Départs vers l'Abyssinie |
| `CHR-10` | Avant l'Hégire | Boycott et difficultés à La Mecque |
| `CHR-11` | Avant l'Hégire | Année de tristesse et épisode de Taïf |
| `CHR-12` | Avant l'Hégire | Rencontres de Yathrib et engagements d'al-‘Aqaba |
| `CHR-13` | Installation à Médine | Départ pour l'Hégire |
| `CHR-14` | Installation à Médine | Arrivée à Qubâ' et Médine |
| `CHR-15` | Installation à Médine | Mosquée et vie communautaire |
| `CHR-16` | Installation à Médine | Organisation sociale et accords à Médine |
| `CHR-17` | Épreuves médinoises | Badr |
| `CHR-18` | Épreuves médinoises | Uhud |
| `CHR-19` | Épreuves médinoises | Épisode du Fossé |
| `CHR-20` | Épreuves médinoises | Accord d'al-Hudaybiyya |
| `CHR-21` | Dernières années | Entrée à La Mecque |
| `CHR-22` | Dernières années | Relations et délégations |
| `CHR-23` | Dernières années | Pèlerinage d'adieu |
| `CHR-24` | Dernières années | Derniers jours et décès |

### A.2 Hégire — 12 fiches

| ID contenu | Type | Sujet | Convention géographique |
|---|---|---|---|
| `HEG-ETP-01` | sequence | La Mecque : contexte du départ | repère général |
| `HEG-ETP-02` | sequence | Le départ de La Mecque | épisode; point de sortie non supposé exact |
| `HEG-ETP-03` | sequence | La grotte de Thawr | site à documenter |
| `HEG-ETP-04` | sequence | Itinéraire vers Yathrib | corridor incertain; aucune trace GPS supposée |
| `HEG-ETP-05` | sequence | Arrivée à Qubâ' | repère à documenter |
| `HEG-ETP-06` | sequence | Arrivée et installation à Médine | repère général |
| `HEG-DOS-07` | dossier | Pourquoi l'Hégire ? | sans repère |
| `HEG-DOS-08` | dossier | Préparation et organisation du voyage | sans repère |
| `HEG-DOS-09` | dossier | Conditions et paysages du trajet | sans repère |
| `HEG-DOS-10` | dossier | Variantes et incertitudes de l'itinéraire | sans repère |
| `HEG-DOS-11` | dossier | Compagnonnage et entraide | sans représentation humaine |
| `HEG-DOS-12` | dossier | Portée et conséquences de l'Hégire | sans repère |

### A.3 Vie quotidienne — 24 fiches

| ID contenu | Thème | Sujet | Objets mutualisables du thème |
|---|---|---|---|
| `VIE-01` | Habitat | Espaces domestiques | OBJ-001;OBJ-002;OBJ-003 |
| `VIE-02` | Habitat | Matériaux et construction | OBJ-001;OBJ-002;OBJ-003 |
| `VIE-03` | Habitat | Éclairage et rangement | OBJ-001;OBJ-002;OBJ-003 |
| `VIE-04` | Alimentation | Denrées et usages | OBJ-004;OBJ-005 |
| `VIE-05` | Alimentation | Préparation des repas | OBJ-004;OBJ-005 |
| `VIE-06` | Alimentation | Conservation des aliments | OBJ-004;OBJ-005 |
| `VIE-07` | Eau et stockage | Approvisionnement en eau | OBJ-006;OBJ-007 |
| `VIE-08` | Eau et stockage | Transport de l'eau | OBJ-006;OBJ-007 |
| `VIE-09` | Eau et stockage | Stockage domestique | OBJ-006;OBJ-007 |
| `VIE-10` | Vêtements et textiles | Fibres et matières | OBJ-008;OBJ-009;OBJ-010 |
| `VIE-11` | Vêtements et textiles | Confection et entretien | OBJ-008;OBJ-009;OBJ-010 |
| `VIE-12` | Vêtements et textiles | Chaussures et accessoires | OBJ-008;OBJ-009;OBJ-010 |
| `VIE-13` | Artisanat | Poterie et récipients | OBJ-011;OBJ-012;OBJ-013 |
| `VIE-14` | Artisanat | Tissage et fabrication | OBJ-011;OBJ-012;OBJ-013 |
| `VIE-15` | Artisanat | Travail du cuir | OBJ-011;OBJ-012;OBJ-013 |
| `VIE-16` | Commerce et mesures | Échanges et marchés | OBJ-014;OBJ-015 |
| `VIE-17` | Commerce et mesures | Poids et mesures | OBJ-014;OBJ-015 |
| `VIE-18` | Commerce et mesures | Circulation des produits | OBJ-014;OBJ-015 |
| `VIE-19` | Voyage et équipements | Préparatifs matériels | OBJ-016;OBJ-017;OBJ-018 |
| `VIE-20` | Voyage et équipements | Transport des effets | OBJ-016;OBJ-017;OBJ-018 |
| `VIE-21` | Voyage et équipements | Orientation et provisions | OBJ-016;OBJ-017;OBJ-018 |
| `VIE-22` | Écriture et transmission | Supports d'écriture | OBJ-019;OBJ-020 |
| `VIE-23` | Écriture et transmission | Outils et matériaux | OBJ-019;OBJ-020 |
| `VIE-24` | Écriture et transmission | Usages de la transmission écrite | OBJ-019;OBJ-020 |

### A.4 Modèles 3D V1 — 20 assets distincts

| ID modèle | Thème | Reconstitution candidate | Condition de publication |
|---|---|---|---|
| `OBJ-001` | Habitat | Lampe | Validation historique + droits + fallback |
| `OBJ-002` | Habitat | Coffre | Validation historique + droits + fallback |
| `OBJ-003` | Habitat | Loquet de porte | Validation historique + droits + fallback |
| `OBJ-004` | Alimentation | Meule manuelle | Validation historique + droits + fallback |
| `OBJ-005` | Alimentation | Récipient de cuisson | Validation historique + droits + fallback |
| `OBJ-006` | Eau et stockage | Outre | Validation historique + droits + fallback |
| `OBJ-007` | Eau et stockage | Jarre | Validation historique + droits + fallback |
| `OBJ-008` | Vêtements et textiles | Sandale | Validation historique + droits + fallback |
| `OBJ-009` | Vêtements et textiles | Fuseau | Validation historique + droits + fallback |
| `OBJ-010` | Vêtements et textiles | Peigne | Validation historique + droits + fallback |
| `OBJ-011` | Artisanat | Outil de poterie | Validation historique + droits + fallback |
| `OBJ-012` | Artisanat | Navette de tissage | Validation historique + droits + fallback |
| `OBJ-013` | Artisanat | Alêne | Validation historique + droits + fallback |
| `OBJ-014` | Commerce et mesures | Balance | Validation historique + droits + fallback |
| `OBJ-015` | Commerce et mesures | Poids de mesure | Validation historique + droits + fallback |
| `OBJ-016` | Voyage et équipements | Sac de voyage | Validation historique + droits + fallback |
| `OBJ-017` | Voyage et équipements | Selle de bât (sans animal) | Validation historique + droits + fallback |
| `OBJ-018` | Voyage et équipements | Coffret de transport | Validation historique + droits + fallback |
| `OBJ-019` | Écriture et transmission | Encrier | Validation historique + droits + fallback |
| `OBJ-020` | Écriture et transmission | Tablette d'écriture | Validation historique + droits + fallback |

### A.5 Statut initial des contenus fournis dans ce paquet

À la date de rédaction, l'**inventaire** est livré, **aucun des 60 récits historiques complets / 120 narrations / 20 GLB finals** n'est déclaré produit, licencié ou validé. Les validations en CSV portent `NON`. Les 60 titres structurent le chantier de production ; l'agent doit faire apparaître cette distinction dans ses comptes rendus.

## Annexe B — Références normatives et d'ingénierie (documentation de cadrage)

- W3C, **WCAG 2.2** : https://www.w3.org/TR/WCAG22/ — cible AA, contraste, focus, redimensionnement, cibles tactiles.
- W3C, **Animation from Interactions** : https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions — bonnes pratiques de motion réduit ; critère AAA pour interaction.
- OWASP, **ASVS stable 5.0.0** : https://asvs.owasp.org/ — contrôles applicables aux sites et à la chaîne de publication.
- CNIL, **Guide RGPD du développeur** : https://www.cnil.fr/fr/guide-rgpd-du-developpeur — privacy by design.
- CNIL, **mesure d'audience et exemption sous conditions** : https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience — pas de traceurs dans la V1.
- MDN, **autoplay des médias** : https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/autoplay — privilégier déclenchement volontaire.

**Portée :** ces références ne constituent ni une expertise juridique sur l'éditeur, ni une bibliographie historique certifiant des récits. Ces deux validations restent indépendantes.

## Annexe C — Change log, décisions finales et clôture

| Version | Changement | État |
|---|---|---|
| 0.6 | Cadrage initial, 3 espaces, français/arabe, audio à la demande, 3D limitée | Historique |
| 0.7 | V1 riche, 60 fiches proposées, 20 objets 3D, volumes éditoriaux | Historique |
| SPEC/UX/DA 0.1 | Carte Hégire, Thawr, wireframes, direction artistique | Références intégrées |
| **1.0.0** | **Décisions autonomes, inventaires gelés, règles métiers, données, conformité, backlog et recette** | **Final pour développement** |

**Clôture NOVA CDC :** aucun arbitrage de périmètre ou d'interface n'est à soumettre de nouveau. Toute constatation documentée d'impossibilité réglementaire ou d'erreur historique est traitée comme **blocage de publication / anomalie de contenu**, pas comme une autorisation de la masquer. L'agent de développement peut commencer avec les annexes jointes et le présent document.
