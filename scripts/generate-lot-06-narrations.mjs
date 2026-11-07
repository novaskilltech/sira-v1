import fs from "node:fs";
import path from "node:path";

// Load .env if present
if (fs.existsSync(".env")) {
  const envContent = fs.readFileSync(".env", "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
  }
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error("Missing OPENROUTER_API_KEY in environment or .env");
  process.exit(1);
}

const LOT_06_SCRIPTS = [
  {
    contentId: "CHR-07",
    locale: "fr",
    filename: "narration-chr-07-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Prédication publique.

Première partie : Repère et périmètre.
Au terme de trois années d'exhortation discrète et intimiste, au cours desquelles une première communauté solidaire s'était consolidée dans la discrétion des demeures mecquoises, l'ordre divin prescrit une ouverture sans concession de l'appel. Les versets de la sourate al-Hijr résonnent comme une injonction solennelle : Proclame donc publiquement ce qui t'est ordonné et détourne-toi des associateurs. Cette transition inaugurale, loin d'être une simple prise de parole religieuse, ébranle l'ordre tribal, marchand et aristocratique d'une cité tout entière bâtie sur le prestige sacré de la Kaaba et le culte de ses idoles.

Deuxième partie : Éléments sourcés.
Le premier acte de cette nouvelle étape s'adresse au cercle parental immédiat, en vertu de l'injonction coranique : Et avertis les membres les plus proches de ta tribu. Le Prophète réunit les fils de Hashim et d'al-Muttalib pour un repas partagé. Malgré l'hostilité immédiate d'Abu Lahab, qui tente d'étouffer d'emblée la portée de l'appel, l'engagement d'Abu Talib garantit à son neveu la protection clanique fondamentale, sans laquelle toute parole publique eût entraîné une proscription immédiate.
Peu après, le Prophète gravit le promontoire rocheux d'al-Safa, au cœur de la cuvette mecquoise. Il lance le cri séculaire d'alerte qui rassemblait traditionnellement la cité en cas de péril imminent : Ya Sabaha ! Accourant de chaque ruelle, notables de Quraysh, marchands et anonymes s'agglutinent au pied du rocher. Le Prophète s'adresse à l'assemblée : Si je vous avertissais qu'une troupe de cavaliers en armes au bas de ce mont s'apprête à vous attaquer, me croiriez-vous ? D'une seule voix, l'assistance répond sans hésiter : Oui, nous ne t'avons jamais connu que véridique et digne de foi. C'est alors que l'avertissement éclate : Je suis pour vous un avertisseur annonçant un châtiment redoutable. La colère d'Abu Lahab est immédiate : Périsses-tu pour le reste du jour ! Est-ce pour cela que tu nous as réunis ?

Troisième partie : Variantes, silences et limites.
Les récits divergent légèrement sur l'ordre exact entre le banquet des proches et l'interpellation publique d'al-Safa, mais concordent pleinement sur la stupeur de l'oligarchie face à la remise en cause des idoles al-Lat, al-Uzza et Manat. L'application respecte rigoureusement l'aniconisme : aucun portrait du rassemblement, l'évocation reposant sur la topographie rocheuse d'al-Safa et la force dépouillée du Verbe.

Quatrième partie : Synthèse pédagogique.
Retenons trois enseignements capitaux. Premièrement, la transition vers l'espace public n'est pas une improvisation politique mais une obligation de témoignage universel. Deuxièmement, la réputation de loyauté établie pendant quarante ans constitue le premier argument moral face aux notables. Troisièmement, le rejet de l'Unicité par les aristocrates mecquois découle d'abord de la défense de leurs privilèges marchands et de leur hégémonie sacrée sur l'Arabie.`
  },
  {
    contentId: "CHR-07",
    locale: "ar",
    filename: "narration-chr-07-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الدعوة العلنية.

القسم الأول : تحديد الموضوع ونطاقه.
بعد ثلاث سنوات من الدعوة السرية الهادئة التي نمت فيها بذور الإيمان في كنف دار الأرقم، جاء الأمر الإلهي بالصدع بالحق وتبليغ الرسالة إلى الملأ كافة. نزلت الآية الكريمة: فاصدع بما تؤمر وأعرض عن المشركين، مؤذنة بانتقال الدعوة إلى مرحلة المواجهة الفكرية والاجتماعية الشاملة مع قريش، وهدم الأوثان التي تحكمت في عقول أهل مكة وعقائدهم.

القسم الثاني : العناصر المسندة إلى المصادر.
بدأ الإنذار بالدائرة العائلية الأقرب امتثالاً لقوله تعالى: وأنذر عشيرتك الأقربين. فدعا النبي بني عبد المطلب إلى طعام، وعرض عليهم رسالة التوحيد والنجاة، ورغم معارضة أبي لهب المتعنتة، أعلن عمه أبو طالب حمايته وحياطته العشائرية التي كفلت للمصطفى حرية البلاغ في أزقة مكة.
ثم صعد الرسول صلوات الله عليه على ربوة الصفا الصخرية، ونادى بالنداء العربي التقليدي للنفير: يا صباحاه! فهرع إليه سادة البطحاء وبطون قريش، فقال لهم: أرأيتم لو أخبرتكم أن خيلاً بسفح هذا الجبل تريد أن تغير عليكم، أكنتم مصدقي؟ قالوا جميعاً بلسان واحد: نعم، ما جربنا عليك إلا صدقاً، وأنت عندنا الصادق الأمين. فقال لهم: فإني نذير لكم بين يدي عذاب شديد. فانفجر غضب أبي لهب قائلاً: تباً لك سائر اليوم، ألهذا جمعتنا؟ فنزلت سورة المسد تفصل في مصير المستكبرين.

القسم الثالث : الاختلافات والحدود.
تتفاوت الروايات في الترتيب الزمني الدقيق بين دعوة العشيرة والوقوف على الصفا، لكنها تتفق في إبراز الصدمة التي هزت نوادي قريش حين طالبتهم الدعوة بنبذ آلهتهم والتحلل من سطوة الشرك. ويلتزم الأطلس بمبدأ النزاهة التامة؛ فلا تجسيد للأشخاص أو الجموع، بل تركيز واعٍ على جغرافية الصفا المنيفة وهيبة الموقف التاريخي.

القسم الرابع : خلاصة تربوية.
نستخلص من الصدع بالدعوة ثلاث ركائز كبرى: أولاها شجاعة المبدأ ووضوح الغاية في مواجهة الضغوط المجتمعية. وثانيتها أن السيرة الأخلاقية السابقة كانت الحجة الدامغة التي ألزمت الخصوم بالاعتراف بأمانة النبي قبل سماع نبوته. وثالثتها أن كلمة التوحيد ترفض المساومة على حساب الحق والكرامة الإنسانية.`
  },
  {
    contentId: "CHR-08",
    locale: "fr",
    filename: "narration-chr-08-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Oppositions et premières épreuves.

Première partie : Repère et périmètre.
Dès lors que la prédication franchit le seuil des demeures pour s'adresser à toute la cité, l'oligarchie qurayshite engage une campagne d'oppression méthodique. Ne pouvant attenter directement aux membres des clans puissants sans déclencher de vendettas sanglantes, les chefs de La Mecque reportent toute leur cruauté sur les croyants sans alliance tribale : esclaves affranchis, bergers et étrangers. Cette période fondatrice éprouve la foi des pionniers et révèle la dimension profondément égalitaire du message coranique.

Deuxième partie : Éléments sourcés.
Les chroniques d'Ibn Ishaq et les recueils de Bukhari et Muslim dépeignent la férocité de ces épreuves au milieu de la Batha mecquoise. Umayya ibn Khalaf traîne l'Abyssin Bilal ibn Rabah sous la canicule écrasante du midi, lui appliquant une roche incandescente sur la poitrine pour lui arracher le reniement de son Dieu. De ses lèvres asséchées ne filtre qu'un murmure inébranlable : Ahad ! Ahad ! Dieu est Unique ! Informé de ce martyre, Abu Bakr débourse une forte somme pour racheter Bilal et lui conférer sa pleine liberté, comme il le fait pour de nombreux captifs convertis.
Non loin de là, la famille de Yasir subit les fers et la torture sous les yeux d'Abu Jahl, jusqu'à ce que la mère, Sumayya, transpercée par la lance du tyran, devienne la première martyre de l'Islam. Dans le même temps, Abd Allah ibn Masud brave l'assemblée des chefs devant la Kaaba en récitant publiquement la sourate ar-Rahman, acceptant d'être roué de coups pour faire entendre la beauté du texte sacré. Devant l'intensité des sévices, le Prophète ordonne en 615 l'émigration d'un premier groupe vers le royaume chrétien d'Abyssinie, chez le Negus Ashama, un souverain équitable auprès duquel aucun réfugié ne subit d'injustice.

Troisième partie : Variantes, silences et limites.
Si les sources divergent sur les dates exactes des départs vers Aksoum ou sur le nombre précis d'exilés, elles s'accordent sur le rôle pionnier de cette terre d'accueil africaine. L'application s'interdit formellement toute mise en scène sensationnaliste ou figurative de la torture, préférant évoquer la noblesse morale du témoignage et la rigueur minérale du désert.

Quatrième partie : Synthèse pédagogique.
Trois leçons se dégagent de ces épreuves inaugurales. Premièrement, la foi des premiers musulmans a été scellée dans l'endurance la plus désintéressée, à rebours de tout opportunisme matériel. Deuxièmement, la solidarité financière et l'affranchissement des esclaves par Abu Bakr illustrent l'idéal de justice sociale porté par l'Islam naissant. Troisièmement, le premier asile trouvé en Abyssinie auprès d'un roi chrétien souligne l'ouverture universelle et le respect mutuel entre traditions monothéistes.`
  },
  {
    contentId: "CHR-08",
    locale: "ar",
    filename: "narration-chr-08-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `المعارضة والابتلاءات الأولى.

القسم الأول : تحديد الموضوع ونطاقه.
حين صدع النبي صلى الله عليه وسلم بالدعوة في رحاب مكة، أيقنت قريش أن مبادئ الوحي تهدد امتيازاتها الطبقية ومكانتها الاقتصادية. ولما كان صلى الله عليه وسلم في حماية بني هاشم، صب طغاة مكة جام غضبهم على المستضعفين الذين لا عشيرة تحميهم من الموالي والعبيد والفقراء، فكانت تلك المحنة برهاناً ساطعاً على صدق الإيمان وخلود رسالة العدالة الإنسانية.

القسم الثاني : العناصر المسندة إلى المصادر.
تنقل كتب السير والصحاح صوراً مؤثرة لثبات الصحابة الأوائل في رمضاء مكة الملتهبة. كان أمية بن خلف يخرج ببلال بن رباح رضي الله عنه في وقت الظهيرة، ويطرحه على حصباء الوادي الملتهبة واضعاً صخرة عظيمة على صدره، وهو لا يزيد على قوله الخالد: أحدٌ.. أحد. حتى رآه أبو بكر الصديق فاشتراه وأعتقه لوجه الله، كما فعل مع نخبة من المعذبين.
وقاست أسرة ياسر ألوان النكال والبلاء، حتى طعن أبو جهل سمية بنت خياط فكانت أول شهيدة في الإسلام بعد أن أبت التراجع عن دينها. وفي صحن الكعبة، جهر عبد الله بن مسعود بسورة الرحمن أمام ملإ قريش، وتحمل الضرب المبرح في سبيل إعلاء آيات الله. وأمام اشتداد الأذى، أمر النبي صلى الله عليه وسلم فئة من أصحابه بالهجرة إلى أرض الحبشة في عام 615 للميلاد، قائلاً: إن بها ملكاً لا يُظلم عنده أحد، فكان النجاشي نعم الملاذ المنصف للمؤمنين.

القسم الثالث : الاختلافات والحدود.
تختلف كتب التاريخ في الإحصاء الدقيق للمهاجرين إلى الحبشة في الدفعة الأولى، غير أن الروايات تجمع على شهامة النجاشي ونزاهته عند سماعه القرآن. ويتحرى الأطلس أعلى درجات التحفظ العلمي؛ فلا تمثيل لصنوف التعذيب ولا تجسيد للشخصيات، بل إبراز لقوة الروح والصلابة الأخلاقية.

القسم الرابع : خلاصة تربوية.
نستحضر من هذه المرحلة ثلاث عبر جليلة: أولاها أن الحق لا يستقر في الأرض إلا بالتضحية والصبر الجميل. وثانيتها أن المجتمع الإسلامي الأول قام على المساواة التامة بين الشريف والعبد الأعجمي. وثالثتها أن اختيار أرض الحبشة ملاذاً جسد الحكمة النبوية في بناء الجسور مع أهل العدل والإنصاف من أصحاب الرسالات السماوية.`
  },
  {
    contentId: "VIE-06",
    locale: "fr",
    filename: "narration-vie-06-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Conservation des aliments.

Première partie : Repère et périmètre.
Dans l'environnement hyperaride du Hedjaz, où la canicule estivale accélère inexorablement l'altération des denrées périssables, la conservation de la nourriture était une condition sine qua non de la survie collective. Dépourvues de froid artificiel, les sociétés d'Arabie ont élaboré des savoir-faire ingénieux fondés sur le séchage solaire, le salage minéral, la cuisson réductrice et l'usage de récipients en terre cuite et en cuir, assurant ainsi la subsistance des familles et le ravitaillement des caravanes au long cours.

Deuxième partie : Éléments sourcés.
La viande était préservée sous la forme séculaire du qadid. Après le sacrifice ou l'abattage, la viande était débitée en lanières effilées, frottée de sel marin extrait des lagunes ou des salines désertiques, puis suspendue au grand vent sur des cordes tendues sous un soleil brûlant. Une fois déshydratée, cette chair devenue incorruptible pouvait se conserver des mois durant dans des sacs de toile, avant d'être réhydratée dans les potages et les bouillons d'orge.
Le lait subissait également une déshydratation systématique sous forme d'aqit. Ce fromage sec, obtenu par l'ébullition et le séchage du babeurre battu sur des nattes de palmes, formait des blocs pierreux faciles à transporter dans les besaces de voyage, prêts à être broyés entre deux pierres pour enrichir les bouillies. Le beurre clarifié, le samn, cuit avec précaution pour en évaporer chaque goutte d'eau, était transvasé dans des outres de cuir de chèvre imperméabilisées, appelées ukka. Enfin, les dattes mûres étaient tassées dans les grandes jarres de stockage en terre cuite, comme les modèles OBJ-004 et OBJ-005 documentés dans notre catalogue. En se comprimant sous leur propre poids, elles sécrétaient un sirop sirupeux, le dibs, qui saturait les poches d'air et interdisait toute fermentation bactérienne.

Troisième partie : Variantes, silences et limites.
Les fouilles archéologiques en Arabie attestent d'une remarquable continuité technique depuis l'Âge du Fer jusqu'à l'époque abbasside, avec des variations locales touchant la porosité des céramiques et les herbes aromatiques infusées dans le beurre. L'atlas met en lumière les témoins matériels sans aucune reconstitution anthropomorphe, laissant parler la pureté des contenants et des matières brutes.

Quatrième partie : Synthèse pédagogique.
Trois leçons matérielles éclairent cette ingéniosité. Premièrement, la maîtrise de la dessiccation transforme la contrainte aride en un agent naturel de préservation. Deuxièmement, la complémentarité entre élevage bédouin et palmeraies sédentaires crée un équilibre nutritionnel durable. Troisièmement, ces techniques de stockage révèlent une prévoyance rationnelle face aux aléas climatiques du désert d'Arabie.`
  },
  {
    contentId: "VIE-06",
    locale: "ar",
    filename: "narration-vie-06-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `حفظ الأغذية.

القسم الأول : تحديد الموضوع ونطاقه.
في مناخ الحجاز شديد الجفاف والحرارة، كان حفظ الأغذية من الفساد مسألة بقاء محورية لأهل الحواضر وأصحاب القوافل في بوادي نجد وتهامة. وفي غياب وسائل التبريد الحديثة، طور العرب خبرات متوارثة بارعة قامت على التجفيف بالشمس والرياح، والتمليح، والطهي المعالج، واستخدام الأواني الفخارية والجلود الطبيعية لتخزين فائض المواسم.

القسم الثاني : العناصر المسندة إلى المصادر.
كان القديد الوسيلة الرئيسة لحفظ اللحوم؛ حيث تُقطع اللحوم شرائح رفيعة، وتُغمر بالملح البحري أو السبخي، ثم تُنشر على الحبال في مهب السموم الحارة لتجف تماماً وتصبح صلبة لا يدخلها العفن، وتُحمل في الأسفار الطويلة لتُطبخ في المرق مع الثريد.
أما الألبان فكانت تُحول إلى الأقط، وهو لبن مخيض مجفف على سعف النخيل في شكل أقراص صلبة كالحجر، تظل صالحة لسنوات وتُطحن عند الحاجة وتُخلط بالماء ودقيق الشعير. كما كان يُصنع السمن بتسخين الزبد حتى تتبخر رطوبته بالكامل، ثم يُخزن في قرب جلدية محكمة الدباغة تُعرف بالعُكة، فتحفظ طعمه ونقاءه من الأكسدة. وفي الواحات، كان التمر يُكنز في الجرار الفخارية الضخمة، كالقطع المسجلة في الأطلس برقمي OBJ-004 و OBJ-005، فيفرز التمر تحت ضغطه عسلاً طبيعياً كثيفاً يُسمى الدبس، يسد مسام الهواء ويمنع التلف والتخمر.

القسم الثالث : الاختلافات والحدود.
تؤكد الاكتشافات الأثرية في شبه الجزيرة استقرار هذه الأساليب التقنية عبر القرون، مع تفاوت طفيف في نقاء الفخار المستعمل وطرق الدباغة بالنباتات المحلية كالقرظ. ويعتمد التطبيق على الإبراز الوثائقي للجرار والأدوات دون أي افتعال تمثيلي للأفراد.

القسم الرابع : خلاصة تربوية.
نستخلص من أساليب التخزين ثلاث فوائد كبرى: أولاها استثمار طاقة الشمس والرياح في تذليل قسوة البيئة. وثانيتها التكامل الاقتصادي بين منتجات بادية الأنعام وثمار الواحات الزراعية. وثالثتها تدبير الموارد بوعي وتخطيط لمواجهة أوقات القحط وسنوات الجدب.`
  },
  {
    contentId: "HEG-DOS-07",
    locale: "fr",
    filename: "narration-heg-dos-07-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Pourquoi l'Hégire ?

Première partie : Repère et périmètre.
L'Hégire de l'an 622 de l'ère chrétienne ne constitue ni une retraite désespérée ni une fuite clandestine sous la contrainte, mais l'aboutissement politique et spirituel d'un long processus d'émancipation. Ce dossier thématique analyse la conjonction des facteurs historiques qui ont rendu le départ de La Mecque inévitable : le blocage irrémédiable du système clanique mecquois, l'isolement mortel consécutif à l'Année de la tristesse, et l'émergence d'une opportunité institutionnelle inédite au sein de l'oasis de Yathrib.

Deuxième partie : Éléments sourcés.
En l'an 619, la disparition simultanée de Khadija, épouse et pilier affectif, et d'Abu Talib, doyen protecteur des Banu Hashim, porte un coup dévastateur à la sécurité du Prophète. Le nouveau chef de clan, Abu Lahab, rompt le pacte tribal en lui retirant toute protection légale. Dans les coutumes bédouines, cette exclusion équivaut à un arrêt de mort : quiconque assassine un proscrit sans garant échappe à la loi du talion.
Après l'échec tragique de la mission d'al-Ta'if, où le Prophète fut rejeté et lapidé par les tribus Thaqif, l'horizon s'ouvre inopinément au nord. L'oasis de Yathrib, déchirée depuis des décennies par des vendettas fratricides entre les tribus arabes des Aws et des Khazraj après la sanglante journée de Buath, cherchait désespérément un arbitre neutre et intègre. La rencontre lors du pèlerinage avec un groupe de Khazrajites débouche sur les serments d'al-Aqaba en 621 et 622. Plus de soixante-dix notables de Yathrib prêtent serment d'accueillir et de protéger le Messager et ses compagnons comme leurs propres familles, offrant un cadre souverain pour l'établissement d'une communauté libre.

Troisième partie : Variantes, silences et limites.
L'analyse historiographique contemporaine confirme que l'Hégire fut préparée avec une rigueur logistique méticuleuse sur plus de deux années, réfutant la thèse d'un exode improvisé. L'application présente cette transition dans sa réalité géopolitique globale, sans fiction narrative, en mettant l'accent sur les dynamiques territoriales et les pactes contractuels.

Quatrième partie : Synthèse pédagogique.
Trois clés de compréhension résument ce tournant historique. Premièrement, l'Hégire sanctionne la faillite morale d'une société mecquoise incapable de concevoir la justice hors de la vengeance tribale. Deuxièmement, elle concrétise la naissance d'une citoyenneté fondée sur la fraternité morale et le droit contractuel, supplantant les solidarités du sang. Troisièmement, elle marque l'an un du calendrier islamique, affirmant que l'Histoire ne commence pas par la naissance du Messager, mais par l'édification de la cité de justice.`
  },
  {
    contentId: "HEG-DOS-07",
    locale: "ar",
    filename: "narration-heg-dos-07-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `لماذا الهجرة؟

القسم الأول : تحديد الموضوع ونطاقه.
لم تكن الهجرة النبوية الشريفة عام 622 للميلاد فراراً من بطش ولا انسحاباً يائساً، بل كانت تحولاً استراتيجياً وتأسيسياً نُقلت به الرسالة من حيز الاستضعاف إلى فضاء بناء المجتمع والدولة. ويعالج هذا الملف أسباب الهجرة العميقة؛ حيث تضافر انسداد الأفق السياسي في مكة بعد عام الحزن مع حاجة يثرب التاريخية إلى قيادة حكيمة تنقذها من نزاعاتها الأهلية.

القسم الثاني : العناصر المسندة إلى المصادر.
في عام 619 للميلاد، وقعت فاجعة عام الحزن بوفاة أم المؤمنين خديجة رضي الله عنها، وعم النبي الحامي أبي طالب. وتولى زعامة بني هاشم أبو لهب الذي سارع إلى تجريد النبي من حماية العشيرة، مما جعل دمه مهدراً في أعراف العرب دون خوف من ثأر أو قصاص.
وبعد محاولة الطائف التي قابلتها قبيلة ثقيف بالصد والإيذاء، لاحت بشائر النصرة في موسم الحج حين التقى النبي صلى الله عليه وسلم بنفر من خزرج يثرب. كانت يثرب واحة زراعية تئن تحت وطأة الاقتتال الداخلي بين الأوس والخزرج بعد مذبحة بُعاث، فوجد عقلاؤها في رسالة الإسلام وصدق النبي سبيلاً للمصالحة والسلام الشامل. فأثمرت بيعتا العقبة الأولى والثانية عهداً سياسياً ودفاعياً ملزماً؛ حيث بايع أكثر من سبعين رجلاً وامرأتان على نصرة النبي وإيواء المهاجرين، مما مهد لانطلاق الهجرة المنظمة نحو المدينة المنورة.

القسم الثالث : الاختلافات والحدود.
تجمع المصادر التاريخية المعتمدة على أن الهجرة كانت عملاً مخططاً بدقة استخبارية وأمنية بالغة، وليست حدثاً عفوياً. ويلتزم التطبيق بالقراءة الرصينة لوثائق السيرة والعهود المبرمة، مبرزاً الأبعاد السياسية دون أدنى تزييف للوقائع.

القسم الرابع : خلاصة تربوية.
نستخلص من دوافع الهجرة ثلاث دلالات مركزية: أولاها أن الهجرة كانت إعلاناً لنهاية حقبة العصبية القبلية الظالمة لصالح دولة المؤسسات. وثانيتها الانتقال من رابطة النسب المجرد إلى رابطة العقيدة والمواطنة المشتركة التي حفظتها وثيقة المدينة. وثالثتها اعتماد الهجرة مبدأ للتقويم الهجري، تذكيراً بأن شرف الزمان يرتبط بإقامة العدل والحرية في الأرض.`
  }
];

async function generateNarration(script) {
  const destPath = path.join("public", "media", "drafts", script.filename);
  console.log(`\n--- [${script.contentId} ${script.locale.toUpperCase()}] -> ${script.filename} ---`);
  console.log(`Script length: ${script.text.length} characters`);

  const t0 = Date.now();
  const res = await fetch("https://openrouter.ai/api/v1/audio/speech", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://sira-atlas.local",
      "X-Title": "Sira Atlas V1 TTS Pipeline"
    },
    body: JSON.stringify({
      model: script.model,
      input: script.text,
      voice: script.voice,
      response_format: "mp3"
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter TTS failed (${res.status} ${res.statusText}): ${errText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(destPath, buffer);
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`✓ Success! Saved ${script.filename} (${buffer.length} bytes in ${elapsed}s)`);

  return {
    contentId: script.contentId,
    locale: script.locale,
    filename: script.filename,
    path: `/media/drafts/${script.filename}`,
    sizeBytes: buffer.length,
    elapsedSeconds: elapsed,
    status: "GENERATED_OK"
  };
}

async function main() {
  console.log("Starting generation of 8 narrations for Lot 6...");
  const results = [];
  for (const script of LOT_06_SCRIPTS) {
    try {
      const r = await generateNarration(script);
      results.push(r);
    } catch (e) {
      console.error(`✗ Error on ${script.filename}:`, e.message);
      results.push({
        contentId: script.contentId,
        locale: script.locale,
        filename: script.filename,
        error: e.message,
        status: "GENERATION_FAILED"
      });
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    provider: "OpenRouter",
    model: "minimax/speech-2.8-hd",
    statusNote: "LOT_06_DEMO_NON_VALIDE",
    results
  };

  fs.writeFileSync("reports/lot-06-narrations-generation.json", JSON.stringify(report, null, 2));
  console.log("\nFinished Lot 6! Report saved to " + path.resolve("reports/lot-06-narrations-generation.json"));
}

main().catch(err => {
  console.error("Fatal in main:", err);
  process.exit(1);
});
