# Audit Scientifique, Historique, Hadith et Fiqh Malékite — Application Sîra V1.0

**Date de l'audit** : 7 novembre 2026  
**Périmètre audité** :  
- 60 fiches éditoriales bilingues (FR/AR) réparties en 15 lots (`docs/PILOTES_EDITORIAUX_EN_REVUE.md`, `docs/LOT_02_REDACTION_BROUILLON_IA.md` à `docs/LOT_15_REDACTION_BROUILLON_IA.md`) et leurs scripts de narration (`scripts/generate-pilot-narrations.mjs`, `scripts/generate-lot-02-narrations.mjs` à `scripts/generate-lot-14-narrations.mjs`).
- Manifeste de contenu embarqué (`public/content/manifest.v1.json`, 60 fiches, 20 objets 3D, 120 pistes audio).
- Interface applicative et mentions méthodologiques (`src/i18n.ts`, `src/pages/Information.tsx`, `src/pages/Chronology.tsx`, `src/pages/Hegira.tsx`, `src/pages/Article.tsx`).

---

## 1. Cadre de référence et méthodologie d'audit

### 1.1. Référentiel dogmatique et jurisprudentiel
1. **Croyance (*‘Aqîda*)** : Islam sunnite (*Ahl as-Sunna wa al-Jamâ‘a*), fondé sur le Coran et la Sunna authentique selon la compréhension des pieux prédécesseurs (*Salaf as-Sâlih*).
2. **Jurisprudence (*Fiqh*)** :
   - **Référentiel de départ** : L'**école malékite (*madhhab mâlikî*)** à travers ses sources de référence reconnues : l'imam Mâlik ibn Anas (*al-Muwaṭṭa'*), Saḥnûn (*al-Mudawwana al-Kubrâ*), Ibn Abî Zayd al-Qayrawânî (*al-Risâla*), Ibn ‘Abd al-Barr (*al-Kâfî fî Fiqh Ahl al-Madîna*), al-Qâḍî ‘Iyâḍ, Ibn Rushd (*Bidâyat al-Mujtahid*) et Khalîl ibn Isḥâq (*al-Mukhtaṣar*), en distinguant l'avis retenu (*al-mashhûr* / *al-mu‘tamad*) des autres positions rapportées au sein de l'école.
   - **Recours à l'avis prépondérant (*al-qawl ar-râjih* — القول الراجح)** : Lorsqu'un avis extérieur à l'avis *mashhûr* malékite est mentionné au regard des preuves rapportées par des savants qualifiés et identifiés, la notice respecte cinq exigences : (1) présentation fidèle de l'avis malékite de référence, (2) identification de l'avis alternatif, des savants qui le privilégient et de leurs références, (3) exposé des preuves et conditions d'application, (4) mention des divergences significatives, et (5) attribution explicite du jugement de prépondérance ou mention *« arbitrage à faire valider par un spécialiste »* sans jamais substituer un arbitrage algorithmique à celui d'un spécialiste humain.
3. **Distinction entre méthodologie du Fiqh et méthode historique** :
   - Les règles de préférence juridique ne sont pas projetées sur les questions historiques : la répétition d'un récit chez de nombreux chroniqueurs ne suffit pas à établir son authenticité (*ṣiḥḥa*).
   - Chaque fait ou récit est qualifié selon son degré d'établissement : **établi** (*thâbit* dans le Coran ou les *Ṣaḥīḥayn* / recueils canoniques avec chaîne authentique), **discuté** (*mukhtalaf fîh* entre plusieurs variantes chronologiques ou topographiques), **faible selon une autorité identifiée** (*ḍa‘îf* ou *mursal* / *mu‘ḍal* selon les spécialistes du hadith comme al-Bukhârî, Muslim, al-Bayhaqî, Ibn ‘Abd al-Barr, al-Suhaylî, al-Dhahabî, Ibn al-Qayyim, Ibn Kathîr, Ibn Ḥajar), ou **non vérifié / nécessitant une validation spécialisée**.

---

## 2. Registre détaillé des constats et corrections

### Constat 01 — Jurisprudence du tannage des peaux (*Dibâgh*) et distinction *Mudhakkât* / *Mayta* dans l'école malékite (`VIE-15`)

- **Fichiers et contenus concernés** :
  - `docs/LOT_12_REDACTION_BROUILLON_IA.md` (Section 3, `VIE-15 — Travail du cuir / صناعة الجلود`)
  - `scripts/generate-lot-12-narrations.mjs` (`VIE-15`, FR & AR)
  - `public/content/manifest.v1.json` (`VIE-15`, `localized.fr` et `localized.ar`)
- **Problème et conséquence** :
  - Le texte initial citait le hadith *« Toute peau tannée est purifiée »* (*« أَيُّمَا إِهَابٍ دُبِغَ فَقَدْ طَهُرَ »*) en en déduisant sans réserve l'autorisation d'exploiter intégralement toutes les dépouilles d'animaux pour confectionner vêtements, coussins et outres.
  - **Conséquence** : Cette formulation générale contredit l'avis retenu (*al-mashhûr*) de l'école malékite de référence et présente comme unanime une question classique de divergence juridique portant sur la peau de la bête morte sans abattage rituel (*jild al-mayta*).
- **Correction appliquée** :
  - Réécriture bilingue (FR/AR) de la section juridique de `VIE-15` selon le protocole en 5 points :
    1. **Position malékite de référence (*al-mashhûr*)** : La peau d'un animal licite abattu rituellement (*mudhakkât*) est pure en tout usage. En revanche, selon l'avis *mashhûr* chez Mâlik (*al-Muwaṭṭa'*), Ibn Abî Zayd (*al-Risâla*) et Khalîl (*al-Mukhtaṣar*), la peau d'une bête morte sans abattage rituel (*mayta*) ne devient pas rituellement pure (*ṭâhir*) par le tannage pour accomplir la prière dessus ou conserver des corps gras/liquides humides, mais son utilisation est permise par dispense (*rukhṣa*) pour les denrées sèches (*al-yâbisât*) et l'eau (*al-mâ'*).
    2. **Avis alternatif et preuves** : Mention de l'avis d'Ibn Wahb (au sein de l'école malékite) ainsi que des écoles chaféite et hanafite, considéré comme prépondérant par plusieurs commentateurs du hadith (dont al-Nawawî et al-Shawkânî) sur la base de la généralité du hadith d'Ibn ‘Abbâs (*Ṣaḥīḥ Muslim*, 366 : *« أَيُّمَا إِهَابٍ دُبِغَ فَقَدْ طَهُرَ »*) et du hadith de Maymûna (*Ṣaḥīḥ al-Bukhārī*, 1492 ; *Ṣaḥīḥ Muslim*, 363), qui purifie par le tannage toute peau de *mayta* (à l'exception du porc et du chien).
    3. **Objections et conciliation** : Mention de la conciliation opérée par les malékites avec le hadith épistolaire de ‘Abd Allâh ibn ‘Ukaym (*« أَنْ لَا تَنْتَفِعُوا مِنَ الْمَيْتَةِ بِإِهَابٍ وَلَا عَصَبٍ »*, Abû Dâwûd 4127, al-Tirmidhî 1729), en interprétant *al-ihâb* comme la peau non tannée ou en restreignant l'usage après tannage aux matières sèches et à l'eau.
    4. **Clôture réglementaire** : Ajout explicite de la mention : *« Arbitrage à faire valider par un spécialiste / ترجيح يحتاج إلى اعتماد مختص »*.
- **Sources consultées** :
  - Mâlik ibn Anas, *al-Muwaṭṭa'*, Kitâb al-Ṣayd, Bâb Jild al-Mayta.
  - Ibn Abî Zayd al-Qayrawânî, *al-Risâla*, Bâb fî Ṭahârat al-Mâ' wa al-Thawb wa al-Buq‘a.
  - Khalîl ibn Isḥâq, *al-Mukhtaṣar*, Fassl fî al-Ṭahâra (*« وَلَا يَطْهُرُ جِلْدُ مَيْتَةٍ بِدِبَاغٍ... وَاسْتُعْمِلَ فِي يَابِسٍ وَمَاءٍ »*).
  - Ibn Rushd al-Ḥafîd, *Bidâyat al-Mujtahid wa Nihâyat al-Muqtaṣid*, Kitâb al-Ṭahâra, Bâb al-Najâsât.
  - Muslim ibn al-Ḥajjâj, *Ṣaḥīḥ Muslim*, Kitâb al-Ḥayḍ, n° 363–366.
  - Abû Dâwûd, *Sunan*, Kitâb al-Libâs, n° 4127.
- **Divergences pertinentes** :
  - Divergence classique entre le *mashhûr* malékite (dispense restreinte à l'eau et aux matières sèches), la variante malékite d'Ibn Wahb / écoles chaféite et hanafite (purification complète sauf porc/chien), et l'avis hanbalite célèbre (s'appuyant sur le hadith d'Ibn ‘Ukaym).
- **Statut** : `corrigé` (dans les sources et le manifeste, avec mention *arbitrage à faire valider par un spécialiste*).

---

### Constat 02 — Surveillance du marché de Médine (*Suq al-Madîna*), attribution à al-Shifâ' bint ‘Abd Allâh et règles malékites sur l'accaparement (*Iḥtikâr*) (`VIE-16`)

- **Fichiers et contenus concernés** :
  - `docs/LOT_13_REDACTION_BROUILLON_IA.md` (Section 3, `VIE-16 — Échanges et marchés / التبادل والأسواق`)
  - `scripts/generate-lot-13-narrations.mjs` (`VIE-16`, FR & AR)
  - `public/content/manifest.v1.json` (`VIE-16`, `localized.fr` et `localized.ar`)
- **Problème et conséquence** :
  - Le texte initial affirmait que le Prophète ﷺ avait instauré l'institution nommée *Ḥisba* et confié la surveillance du marché à al-Shifâ' bint ‘Abd Allâh et Samrâ' bint Nuhayk.
  - **Conséquence** : Confusion chronologique entre l'inspection exercée par le Prophète ﷺ lui-même (*Ṣaḥīḥ Muslim*, 102) et la délégation rapportée sous le califat de ‘Umar ibn al-Khaṭṭâb رضي الله عنه concernant al-Shifâ' bint ‘Abd Allâh, ainsi qu'un anachronisme terminologique sur le titre administratif de *Ḥisba* et une absence de précision sur le périmètre malékite de l'*iḥtikâr*.
- **Correction appliquée** :
  - Distinction explicite entre : (a) l'inspection directe du marché par le Prophète ﷺ (hadith du tas de grain mouillé dans *Ṣaḥīḥ Muslim*, 102 : *« مَنْ غَشَّ فَلَيْسَ مِنِّي »*), (b) son passage auprès de Samrâ' bint Nuhayk (*al-Mu‘jam al-Kabîr* d'al-Ṭabarânî), et (c) la délégation rapportée par Ibn ‘Abd al-Barr et Ibn Ḥajar sous le califat de ‘Umar ibn al-Khaṭṭâb رضي الله عنه en faveur d'al-Shifâ' bint ‘Abd Allâh, qui préfigura l'institution ultérieure de la *ḥisba*.
  - Précision du cadre malékite de référence (*al-Muwaṭṭa'*, *al-Risâla*) prohibant l'accaparement spéculatif (*al-iḥtikâr*) des denrées alimentaires (*al-aqwât*) et de toute marchandise dont la rétention nuit au marché, ainsi que *talaqqî al-rukbân* (interception des caravanes avant leur arrivée au marché).
- **Sources consultées** :
  - Muslim ibn al-Ḥajjâj, *Ṣaḥīḥ Muslim*, Kitâb al-Îmân, n° 102.
  - Ibn Mâjah, *Sunan*, Kitâb al-Tijârât, n° 2233 (sur la franchise fiscale du marché de Médine).
  - Mâlik ibn Anas, *al-Muwaṭṭa'*, Kitâb al-Buyû‘, Bâb al-Ḥukra wa al-Talaqqî.
  - Ibn ‘Abd al-Barr, *al-Istî‘âb fî Ma‘rifat al-Aṣḥâb*, notice d'al-Shifâ' bint ‘Abd Allâh.
  - Ibn Ḥajar al-‘Asqalânî, *al-Iṣâba fî Tamyîz al-Ṣaḥâba*, notice d'al-Shifâ' bint ‘Abd Allâh et de Samrâ' bint Nuhayk.
- **Divergences pertinentes** :
  - En fiqh, l'école malékite étend l'interdiction de l'*iḥtikâr* au-delà des seules denrées de base lorsque l'accaparement porte préjudice au marché de la cité, tandis que d'autres écoles le restreignent strictement aux denrées alimentaires (*aqwât*).
- **Statut** : `corrigé`.

---

### Constat 03 — Métrologie prophétique (*Mudd* et *Ṣâ‘*) et référence au *‘Amal Ahl al-Madîna* dans l'école malékite (`VIE-17`)

- **Fichiers et contenus concernés** :
  - `docs/LOT_13_REDACTION_BROUILLON_IA.md` (Section 4, `VIE-17 — Poids et mesures / الأوزان والمقاييس`)
  - `scripts/generate-lot-13-narrations.mjs` (`VIE-17`, FR & AR)
  - `public/content/manifest.v1.json` (`VIE-17`, `localized.fr` et `localized.ar`)
- **Problème et conséquence** :
  - Le texte mentionnait le *mudd* et le *ṣâ‘* pour la *zakât al-fiṭr* et les *kaffârât* sans préciser l'ancrage fondamental de cette mesure dans la pratique transmise des gens de Médine (*‘amal ahl al-Madîna*) au sein de l'école malékite ni la divergence métrologique classique avec l'étalon irakien.
- **Correction appliquée** :
  - Référence explicite au hadith *« La mesure de capacité est celle des gens de Médine, et le poids de masse est celui des gens de La Mecque »* (Abû Dâwûd, 3340 ; al-Nasâ'î, 4595).
  - Mention du principe malékite (*al-Muwaṭṭa'* de l'imam Mâlik) faisant du *‘amal ahl al-Madîna* la référence normative du *mudd* et du *ṣâ‘* prophétiques (4 *amdâd*, évalué à 5⅓ *arṭâl*) pour la *zakât al-fiṭr*, les expiations (*kaffârât*) et le seuil imposable (*niṣâb*) de 5 *awsâq* (60 *ṣâ‘*), tout en signalant la divergence d'évaluation avec l'école hanafite (8 *arṭâl*).
- **Sources consultées** :
  - Mâlik ibn Anas, *al-Muwaṭṭa'*, Kitâb al-Zakât, Bâb Kayl Zakât al-Fiṭr et Bâb Mâ Tajibu fîhi al-Zakât.
  - Abû Dâwûd, *Sunan*, Kitâb al-Buyû‘, n° 3340 ; al-Nasâ'î, *Sunan*, Kitâb al-Buyû‘, n° 4595.
  - Ibn Rushd, *Bidâyat al-Mujtahid*, Kitâb al-Zakât.
- **Divergences pertinentes** :
  - Divergence entre l'école malékite (suivie par les écoles chaféite et hanbalite sur le *ṣâ‘* médinois de 5⅓ *arṭâl*) et l'école hanafite (8 *arṭâl* selon le *ṣâ‘* irakien).
- **Statut** : `corrigé`.

---

### Constat 04 — Conditions de validité de la vente à livraison différée (*Salam* / *Salaf*) dans le fiqh malékite (`VIE-18`)

- **Fichiers et contenus concernés** :
  - `docs/LOT_14_REDACTION_BROUILLON_IA.md` (Section 3, `VIE-18 — Circulation des produits / تداول المنتجات`)
  - `scripts/generate-lot-14-narrations.mjs` (`VIE-18`, FR & AR)
  - `public/content/manifest.v1.json` (`VIE-18`, `localized.fr` et `localized.ar`)
- **Problème et conséquence** :
  - Le contrat de *salam* était évoqué de manière sommaire sans citer le hadith fondateur des *Ṣaḥīḥayn* ni les conditions de validité requises dans le référentiel malékite pour éviter le *ribâ* et le *gharar*.
- **Correction appliquée** :
  - Citation du hadith d'Ibn ‘Abbâs (*Ṣaḥīḥ al-Bukhārī*, 2240 ; *Ṣaḥīḥ Muslim*, 1604) : *« Celui qui pratique le salam dans quelque chose, qu'il le fasse selon une mesure connue et un poids connu, jusqu'à une échéance connue »*.
  - Explicitation des conditions requises par l'école malékite (*al-Muwaṭṭa'* de l'imam Mâlik ; *al-Risâla* d'Ibn Abî Zayd) : versement anticipé du capital (*ta‘jîl ra's al-mâl*), détermination exacte de la mesure ou du poids, description précise des caractéristiques du bien fongible et fixation d'un terme connu.
- **Sources consultées** :
  - *Ṣaḥīḥ al-Bukhārī*, Kitâb al-Salam, n° 2240 ; *Ṣaḥīḥ Muslim*, Kitâb al-Musâqât, n° 1604.
  - Mâlik ibn Anas, *al-Muwaṭṭa'*, Kitâb al-Buyû‘, Bâb al-Salaf fî al-Thimâr.
  - Ibn Abî Zayd al-Qayrawânî, *al-Risâla*, Bâb al-Buyû‘.
- **Divergences pertinentes** :
  - L'école malékite autorise un très court délai d'usage (deux ou trois jours sans stipulation) pour la remise du capital du *salam*, tandis que les écoles chaféite et hanafite exigent la remise intégrale avant la séparation de la séance contractuelle (*majlis al-‘aqd*).
- **Statut** : `corrigé`.

---

### Constat 05 — Harmonisation entre `CHR-14` et `HEG-ETP-06` sur le chant *Ṭala‘a al-Badru ‘Alaynâ* et la date d'arrivée à Qubâ'

- **Fichiers et contenus concernés** :
  - `docs/LOT_09_REDACTION_BROUILLON_IA.md` (Section 2, `CHR-14 — Arrivée à Qubâ' et Médine / الوصول إلى قباء والمدينة`)
  - `scripts/generate-lot-09-narrations.mjs` (`CHR-14`, FR & AR)
  - `public/content/manifest.v1.json` (`CHR-14`, `localized.fr` et `localized.ar`)
- **Problème et conséquence** :
  - Alors que la fiche `HEG-ETP-06` (Lot 4) présentait avec rigueur les réserves d'Ibn al-Qayyim et d'Ibn Ḥajar sur le poème *Ṭala‘a al-Badru ‘Alaynâ* ainsi que les variantes sur la date d'arrivée en Rabî‘ al-Awwal, la fiche `CHR-14` (Lot 9) affirmait sans réserve que les jeunes filles des Banû al-Najjâr avaient entonné *« La pleine lune s'est levée sur nous, depuis les défilés d'al-Wadâ‘ ! »* le 12 Rabî‘ al-Awwal lors de l'arrivée depuis Qubâ'.
  - **Conséquence** : Contradiction interne entre deux fiches de l'application et présentation comme fait certain d'un récit dont la chaîne chez al-Bayhaqî est interrompue (*mu‘ḍal*).
- **Correction appliquée** :
  - Harmonisation complète de `CHR-14` (FR & AR) avec `HEG-ETP-06` :
    1. Mention du chant authentifié des jeunes filles des Banû al-Najjâr (*« Naḥnu jawârin min Banî al-Najjâr, yâ ḥabbadhâ Muḥammadun min jâr »*, Ibn Mâjah 1899).
    2. Mention explicite de l'évaluation d'Ibn al-Qayyim (*Zâd al-Ma‘âd*) et d'Ibn Ḥajar (*Fatḥ al-Bârî*) concernant le poème *Ṭala‘a al-Badru ‘Alaynâ* rapporté par al-Bayhaqî avec une chaîne *mu‘ḍal* (interrompue de plusieurs maillons) et discussion topographique sur *Thaniyyât al-Widâ‘* (Hégire ou retour de Tabûk).
    3. Mention des variantes chronologiques sur le jour de Rabî‘ al-Awwal (le 8 ou le 12) et sur la durée du séjour à Qubâ' (4 à 14 jours).
- **Sources consultées** :
  - *Ṣaḥīḥ al-Bukhārī*, n° 3906.
  - Ibn Mâjah, *Sunan*, n° 1899.
  - Al-Bayhaqî, *Dalâ'il al-Nubuwwa*, 2/506–507.
  - Ibn al-Qayyim, *Zâd al-Ma‘âd fî Hady Khayr al-‘Ibâd*, 3/551.
  - Ibn Ḥajar al-‘Asqalânî, *Fatḥ al-Bârî*, 7/261.
- **Divergences pertinentes** :
  - Rattachement de *Ṭala‘a al-Badru ‘Alaynâ* soit à l'arrivée de l'Hégire (selon l'usage populaire et l'existence possible d'un col homonyme au sud selon al-Samhûdî), soit au retour de l'expédition de Tabûk par le nord (selon Ibn al-Qayyim), avec constat commun du caractère *mu‘ḍal* de la chaîne d'al-Bayhaqî.
- **Statut** : `corrigé`.

---

### Constat 06 — Terme arabe « جُلُودَ الْمَيْتَةِ » et variantes sur le feuillet du boycott rongé par la termite (`CHR-10`)

- **Fichiers et contenus concernés** :
  - `docs/LOT_07_REDACTION_BROUILLON_IA.md` (Section 2, `CHR-10 — Boycott et difficultés à La Mecque`)
  - `scripts/generate-lot-07-narrations.mjs` (`CHR-10`, FR & AR)
  - `public/content/manifest.v1.json` (`CHR-10`, `localized.fr` et `localized.ar`)
- **Problème et conséquence** :
  - Le texte arabe de `LOT_07_REDACTION_BROUILLON_IA.md` employait l'expression « وَجُلُودَ الْمَيْتَةِ » (*et les peaux de bêtes mortes sans abattage*), alors que le texte français parlait de « lanières de cuir » et que le hadith authentique de Sa‘d ibn Abî Waqqâs dans les *Ṣaḥīḥayn* parle de feuilles d'acacia (*waraq al-shajar* / *al-ḥubla*) et de cuir desséché (*qiṭ‘atu jildin yâbis*). En outre, l'épisode de la termite (*al-araḍa*) était présenté sous une seule version sans mentionner sa source biographique ni ses deux variantes.
- **Correction appliquée** :
  - Remplacement de « وَجُلُودَ الْمَيْتَةِ » par « وَالْجُلُودَ الْيَابِسَةَ كَمَا ثَبَتَ فِي حَدِيثِ سَعْدِ بْنِ أَبِي وَقَّاصٍ فِي الصَّحِيحَيْنِ ».
  - Attribution explicite du récit du feuillet rongé par la termite (*al-araḍa*) aux chroniques d'Ibn Isḥāq et d'Ibn Sa‘d, avec mention des deux variantes rapportées : (1) seule la formule *« Bismika Allâhumma »* fut épargnée, ou (2) toutes les clauses d'injustice et de rupture des liens du sang furent rongées à l'exception de la mention de Dieu.
- **Sources consultées** :
  - *Ṣaḥīḥ al-Bukhārī*, n° 6452 ; *Ṣaḥīḥ Muslim*, n° 2966 (hadith de Sa‘d ibn Abî Waqqâs).
  - Ibn Hishâm, *al-Sîra al-Nabawiyya*, 1/350–380 (d'après Ibn Isḥāq).
  - Ibn Sa‘d, *al-Ṭabaqât al-Kubrâ*, 1/208–210.
- **Divergences pertinentes** :
  - Variantes entre Ibn Isḥāq et Ibn Sa‘d sur la portion épargnée du feuillet, et sur la durée exacte du blocus (deux à trois ans).
- **Statut** : `corrigé`.

---

### Constat 07 — Qualification du hadith de l'invocation de Taïf, du récit de ‘Addâs et de l'appellation « Année de la tristesse » (`CHR-11`)

- **Fichiers et contenus concernés** :
  - `docs/LOT_08_REDACTION_BROUILLON_IA.md` (Section 1, `CHR-11 — Année de tristesse et épisode de Taïf`)
  - `scripts/generate-lot-08-narrations.mjs` (`CHR-11`, FR & AR)
  - `public/content/manifest.v1.json` (`CHR-11`, `localized.fr` et `localized.ar`)
- **Problème et conséquence** :
  - Le texte plaçait sur le même plan probatoire la marche vers Taïf (établie dans les *Ṣaḥīḥayn*) et les détails biographiques de l'invocation *« Allâhumma ilayka ashkû ḍa‘fa quwwatî... »* ainsi que l'épisode de ‘Addâs, en déclarant en arabe : *« تتفق الروايات التاريخية على تفاصيل المناجاة »*.
- **Correction appliquée** :
  - Distinction méthodologique explicite entre :
    1. **Le noyau établi dans les *Ṣaḥīḥayn*** : le départ vers Taïf, le rejet par les chefs de Thaqîf, l'épreuve décrite par le Prophète ﷺ à ‘Â'isha comme plus rude encore que le jour d'Uḥud, et le refuge dans le verger de ‘Utba et Shayba fils de Rabî‘a (*Ṣaḥīḥ al-Bukhārī*, 3231 ; *Ṣaḥīḥ Muslim*, 1795).
    2. **Les traditions des *Siyar*** : le texte de l'invocation *« Allâhumma ilayka ashkû... »* et le dialogue avec ‘Addâs rapportés par Ibn Isḥāq (sans chaîne continue) et par al-Ṭabarânî (*al-Mu‘jam al-Kabîr*, 13/73) avec une chaîne dont la faiblesse formelle (*irsal* ou *‘an‘ana* d'Ibn Isḥāq) est signalée par les critiques du hadith, bien que largement cités dans la littérature biographique.
    3. **L'appellation « Année de la tristesse » (*‘Âm al-Ḥuzn*)** : signalée comme une désignation historiographique postérieure.
- **Sources consultées** :
  - *Ṣaḥīḥ al-Bukhārī*, Kitâb Bad' al-Khalq, n° 3231 ; *Ṣaḥīḥ Muslim*, Kitâb al-Jihâd wa al-Siyar, n° 1795.
  - Ibn Hishâm, *al-Sîra al-Nabawiyya*, 1/419–422.
  - Al-Ṭabarânî, *al-Mu‘jam al-Kabîr*, 13/73, n° 181 ; al-Haythamî, *Majma‘ al-Zawâ'id*, 6/35.
- **Divergences pertinentes** :
  - Différence d'appréciation entre l'usage large du récit d'Ibn Isḥāq dans les ouvrages de *Sîra* et le jugement strict des spécialistes de l'*isnâd* sur la chaîne d'al-Ṭabarânî.
- **Statut** : `corrigé`.

---

### Constat 08 — Distinction critique entre la poursuite de Surâqa (*Ṣaḥīḥ al-Bukhārī*), la promesse des bracelets de Chosroès et le récit d'Umm Ma‘bad (`CHR-13` & `HEG-ETP-04`)

- **Fichiers et contenus concernés** :
  - `docs/LOT_09_REDACTION_BROUILLON_IA.md` (Section 1, `CHR-13 — Départ pour l'Hégire`)
  - `scripts/generate-lot-09-narrations.mjs` (`CHR-13`, FR & AR)
  - `docs/LOT_03_REDACTION_BROUILLON_IA.md` (`HEG-ETP-04 — Itinéraire vers Yathrib`)
  - `scripts/generate-lot-03-narrations.mjs` (`HEG-ETP-04`, FR & AR)
  - `public/content/manifest.v1.json` (`CHR-13` et `HEG-ETP-04`)
- **Problème et conséquence** :
  - `CHR-13` affirmait que les recueils canoniques s'accordaient unanimement sur les détails de la rencontre de Surâqa, de la promesse des bracelets de Chosroès et de la halte chez Umm Ma‘bad (*« تتفق أمهات كتب الحديث والسير على تفاصيل لقاء سراقة وخيمة أم معبد كشواهد يقين تاريخية »*).
- **Correction appliquée** :
  - Distinction précise dans `CHR-13` et `HEG-ETP-04` (FR & AR) entre :
    1. La poursuite de Surâqa ibn Mâlik, l'enfoncement des sabots de son cheval et la remise d'un écrit de sûreté (*kitâb amân*), authentifiés dans le *Ṣaḥīḥ al-Bukhārī* (3906).
    2. La mention de la promesse des bracelets de Chosroès lors de cette poursuite, rapportée par des voies *mursal* chez Ibn Isḥāq et al-Bayhaqî (tandis que la remise effective des bracelets sous le califat de ‘Umar est célèbre dans les *Siyar*).
    3. Le récit de la halte sous la tente d'Umm Ma‘bad al-Khuza‘iyya à Qudayd, rapporté par al-Ḥâkim (*al-Mustadrak*, 4274) et al-Ṭabarânî avec une chaîne bédouine dont al-Dhahabî a discuté certains maillons.
- **Sources consultées** :
  - *Ṣaḥīḥ al-Bukhārī*, Kitâb Manâqib al-Anṣâr, n° 3906.
  - Al-Ḥâkim, *al-Mustadrak ‘alâ al-Ṣaḥīḥayn*, n° 4274 (avec l'annotation critique d'al-Dhahabî dans *al-Talkhîṣ*).
  - Al-Bayhaqî, *Dalâ'il al-Nubuwwa*, 2/485–492 ; Ibn Ḥajar, *Fatḥ al-Bârî*, 7/240.
- **Divergences pertinentes** :
  - Différence de degré d'authenticité entre le hadith de Surâqa dans al-Bukhârî (*ṣaḥīḥ*) et le hadith d'Umm Ma‘bad chez al-Ḥâkim (jugé *ṣaḥīḥ* par al-Ḥâkim, mais discuté dans sa chaîne par al-Dhahabî tout en étant corroboré par sa notoriété dans les *Siyar*).
- **Statut** : `corrigé`.

---

### Constat 09 — Discussion chronologique classique sur le lundi du décès du Prophète ﷺ en Rabî‘ al-Awwal de l'an 11 et qualification du sermon de réparation (`CHR-24`)

- **Fichiers et contenus concernés** :
  - `docs/LOT_14_REDACTION_BROUILLON_IA.md` (Section 2, `CHR-24 — Derniers jours et décès`)
  - `scripts/generate-lot-14-narrations.mjs` (`CHR-24`, FR & AR)
  - `public/content/manifest.v1.json` (`CHR-24`, `localized.fr` et `localized.ar`)
- **Problème et conséquence** :
  - Le texte présentait la date du « lundi 12 Rabî‘ al-Awwal de l'an 11 » comme l'objet d'un consensus historique unanime, et citait le sermon d'offre de réparation corporelle (*« من كنت جلدت له ظهراً... »*) sans préciser son statut documentaire par rapport aux récits des *Ṣaḥīḥayn*.
- **Correction appliquée** :
  - Mention explicite du consensus sur le **jour de la semaine (le lundi)** et le **mois (Rabî‘ al-Awwal de l'an 11)** (*Ṣaḥīḥ al-Bukhārī* 680, 3667, 4463), suivie de la précision classique d'al-Suhaylî (*al-Rawḍ al-Unuf*), d'Ibn Ḥajar (*Fatḥ al-Bârî*) et d'Ibn Kathîr (*al-Bidâya wa al-Nihâya*) : la station d'Arafat (9 Dhû al-Ḥijja de l'an 10) ayant eu lieu unanimement un vendredi, le calcul calendaire lunaire situe nécessairement le lundi de Rabî‘ al-Awwal au 2 ou au 13–14 du mois, bien que le 12 soit la date la plus répandue chez Ibn Isḥāq.
  - Attribution explicite du sermon de réparation des torts à Ibn Isḥāq et al-Ṭabarânî avec mention de sa chaîne discutée.
- **Sources consultées** :
  - *Ṣaḥīḥ al-Bukhārī*, n° 680, 687, 3667, 4463.
  - Al-Suhaylî, *al-Rawḍ al-Unuf*, 7/598–601.
  - Ibn Ḥajar al-‘Asqalânî, *Fatḥ al-Bârî*, 8/129–130.
  - Ibn Kathîr, *al-Bidâya wa al-Nihâya*, 5/255–256.
- **Divergences pertinentes** :
  - Divergence classique entre la date fameuse dans les *Siyar* (12 Rabî‘ al-Awwal) et la vérification astronomique/calendaire des commentateurs du hadith (2 Rabî‘ al-Awwal selon al-Suhaylî et Ibn Ḥajar, ou 13–14 selon d'autres).
- **Statut** : `corrigé`.

---

### Constat 10 — Suppression des anachronismes politiques modernes (« république », « démocratie », « برلمان ») (`CHR-15`, `CHR-17`, `CHR-18`)

- **Fichiers et contenus concernés** :
  - `docs/LOT_10_REDACTION_BROUILLON_IA.md` (`CHR-15`) & `scripts/generate-lot-10-narrations.mjs` (`CHR-15`)
  - `docs/LOT_11_REDACTION_BROUILLON_IA.md` (`CHR-18`) & `scripts/generate-lot-11-narrations.mjs` (`CHR-17`)
  - `public/content/manifest.v1.json` (`CHR-15`, `CHR-17`, `CHR-18`)
- **Problème et conséquence** :
  - Emploi d'expressions modernes anachroniques telles que « jeune république médinoise », « égalité républicaine », « démocratie spirituelle », « برلماناً للشورى » (*parlement de la shûrâ*) et « consultation/concertation démocratique ».
  - **Conséquence** : Projection de concepts politiques contemporains sur les institutions prophétiques médinoises (*Umma*, *Shûrâ*, *Mu'âkhât*).
- **Correction appliquée** :
  - Remplacement par la terminologie historique et scripturaire exacte : « cité médinoise naissante », « fraternité communautaire », « fraternité spirituelle », « مَجْلِساً لِلشُّورَى » (*conseil de la shûrâ*) et « consultation / concertation (*shûrâ*) ».
- **Sources consultées** :
  - Coran, Sourate Âl ‘Imrân (3:159) et Sourate al-Shûrâ (42:38).
  - Ibn Hishâm, *al-Sîra al-Nabawiyya*, 1/501–504.
- **Divergences pertinentes** : Aucune.
- **Statut** : `corrigé`.

---

### Constat 11 — Intégration explicite du Référentiel religieux, jurisprudentiel malékite et méthodologique dans l'interface (`src/i18n.ts` & `src/pages/Information.tsx`)

- **Fichiers et contenus concernés** :
  - `src/i18n.ts` (`messages.fr` et `messages.ar` : `referentielTitle`, `referentielText`, `referentielFiqh`)
  - `src/pages/Information.tsx` (vue `Mentions & crédits / البيانات والحقوق`)
- **Problème et conséquence** :
  - Le référentiel religieux (islam sunnite, Coran et Sunna authentique selon la compréhension des pieux prédécesseurs), jurisprudentiel (école malékite de référence et encadrement strict du *qawl râjiḥ*) et historiographique n'était pas affiché dans la page des mentions de l'application.
- **Correction appliquée** :
  - Ajout d'une section bilingue dédiée dans `src/i18n.ts` et affichage dans `src/pages/Information.tsx` (mode `legal`).
- **Statut** : `corrigé`.

---

## 3. Points soumis à validation spécialisée indépendante (`validation spécialisée nécessaire`)

Conformément aux règles du projet (`AGENTS.md` et `CDC_SIRA_V1_FINAL.md`), la réussite des vérifications techniques et la correction des erreurs établies **ne valent pas approbation religieuse ou historique finale (`PUBLICATION_HISTORIQUE_OK`)** :

| Périmètre | État actuel | Action requise avant publication finale | Statut |
|---|---|---|---|
| **Arbitrage jurisprudentiel sur `VIE-15` (Tannage de la peau de *mayta*)** | Avis *mashhûr* malékite et avis alternatif présentés avec preuves et références. | Validation formelle par un juriste spécialiste du fiqh malékite et comparé. | `validation spécialisée nécessaire` |
| **Ensemble des 60 fiches FR/AR et 120 pistes audio TTS (`manifest.v1.json`)** | Statut maintenu à `BROUILLON_IA_NON_VALIDE` (`publicationReady: false`). | Relecture intégrale par un historien de la Sîra, un réviseur linguistique arabophone natif et un auditeur phonétique (tajwîd / vocalisation des noms propres). | `validation spécialisée nécessaire` |
| **Illustrations aniconiques (45 SVG) et modèles 3D (20 GLB)** | 100 % aniconiques (0 figure humaine ou animale), marqués `DEMO`. | Validation muséographique et patrimoniale des formes d'objets du VIIe siècle. | `validation spécialisée nécessaire` |

---

## 4. Vérifications techniques exécutées

1. **Synchronisation des sources vers `public/content/manifest.v1.json`** :
   - Exécution de `node scripts/sync-manifest-all-texts.mjs` et `node scripts/enrich-hegira-geography.mjs` : **60/60 fiches synchronisées**.
2. **Contrôle statique TypeScript & ESLint** :
   - `npm run typecheck` : **0 erreur**.
   - `npm run lint` : **0 erreur, 0 avertissement**.
3. **Tests unitaires et d'intégration (Vitest) & Validation de conformité du manifeste** :
   - `npm test` : **9/9 tests passés** (vérification de l'affichage FR/AR, du mode RTL `dir="rtl"`, des contrôles audio, de la vue 3D et de la persistance locale).
   - `npm run demo:validate` : **OK** (60 fiches, 20 objets, 120 pistes audio, respect strict des garde-fous de non-publication).
4. **Build de production Vite** :
   - `npm run build` : **OK**.
