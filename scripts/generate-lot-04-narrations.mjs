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

const LOT_04_SCRIPTS = [
  {
    contentId: "HEG-ETP-05",
    locale: "fr",
    filename: "narration-heg-etp-05-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Arrivée à Qubā'.

Première partie : Repère et périmètre.
L'oasis de Qubā', située à environ trois à cinq kilomètres au sud de la plaine de Yathrib, constitue la première terre d'accueil et le seuil d'aboutissement de la marche physique de l'Hégire. L'arrivée de la petite troupe, traditionnellement datée du mois de Rabīʿ al-Awwal de l'an 622, marque la fin des périls de la traque désertique et l'entrée dans le territoire sécurisé par les pactes d'al-Aqaba. Cette fiche examine le déroulement de cette halte fondatrice de plusieurs jours au sein du clan des Banū ʿAmr ibn ʿAwf, l'édification du premier lieu d'assemblée communautaire et les retrouvailles avec les compagnons venus à pied depuis La Mecque.

Deuxième partie : Éléments sourcés.
Les sources de la Sîra décrivent l'attente fébrile des partisans médinois, les Anṣār, qui montaient chaque matin sur les collines de lave noire pour scruter l'horizon méridional, ne se retirant qu'aux heures les plus chaudes de la mi-journée. L'arrivée du Prophète et d'Abū Bakr est repérée sous le soleil accablant par un guetteur de la communauté juive de l'oasis, qui alerte les habitants de Yathrib par de grands cris. Le séjour dure selon les récits entre quatre et quatorze jours, au cours desquels le Prophète est hébergé chez Kulthūm ibn al-Hadam tandis qu'il reçoit les fidèles dans la demeure de Saʿd ibn Khaythama. Durant cette étape inaugurale est posée la première assise de la mosquée de Qubā', qualifiée dans le Coran de sanctuaire fondé sur la piété dès le premier jour. C'est également à Qubā' que ʿAlī ibn Abī Ṭālib rejoint le groupe, ayant marché de nuit pendant près de deux semaines après avoir accompli à La Mecque la restitution intégrale des biens confiés.

Troisième partie : Variantes, silences et limites.
La durée précise du séjour à Qubā' varie sensiblement selon les transmetteurs : al-Bukhārī rapporte une présence de quatorze nuits, tandis qu'Ibn Hishām et d'autres chroniques évoquent une durée plus brève, du lundi au vendredi. De même, la physionomie primitive de la mosquée de Qubā' n'avait rien de monumental : il s'agissait d'un enclos de pierres brutes et d'adobe sans minaret ni toiture ouvragée. L'application préserve cette sobriété originelle et refuse toute assimilation rétroactive de la mosquée primitive à l'imposant édifice architectural contemporain.

Quatrième partie : Synthèse pédagogique.
Retenons trois enseignements majeurs. Premièrement, Qubā' sert d'espace tampon stratégique, permettant d'organiser pacifiquement l'entrée dans Yathrib sans froisser les équilibres claniques locaux. Deuxièmement, la fondation immédiate d'un lieu d'assemblée consacre la prière et la concorde comme actes inauguraux de la nouvelle société. Troisièmement, l'arrivée de ʿAlī scelle avec succès la transition entre la période d'oppression mecquoise et le renouveau communautaire.`
  },
  {
    contentId: "HEG-ETP-05",
    locale: "ar",
    filename: "narration-heg-etp-05-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الوصول إلى قباء.

القسم الأول : تحديد الموضوع ونطاقه.
تمثل واحة قباء، الواقعة على بعد نحو ثلاثة إلى خمسة كيلومترات جنوبي يثرب، المحطة الأولى للوصول وعتبة الخلاص في المسار المكاني للهجرة النبوية. وقد وافق هذا الوصول شهر ربيع الأول من العام 622 للميلاد، معلنًا نهاية مخاطر الطريق وبدء مرحلة الأمان المستندة إلى بيعتي العقبة. وتسلط هذه البطاقة الضوء على هذه الوقفة التأسيسية التي دامت أيامًا في ضيافة بني عمرو بن عوف، وما شهدته من بناء أول مسجد أُسس في الإسلام، ولقاء الصحابة القادمين سيرًا على الأقدام من مكة.

القسم الثاني : العناصر المسندة إلى المصادر.
تبين كتب السيرة شوق الأنصار وترقبهم اليومي لخروج الركب؛ حيث كانوا يخرجون صبيحة كل يوم إلى مشارف الحَرّة يترقبون القادمين حتى يردهم حر الظهيرة. ولمّا وافى الركب ظهيرة يوم مشهود، كان أول من بصر بهما رجل من يهود يثرب، فهتف بأنصارهما معلنًا مقدمهما الميمون. وأقام النبي صلى الله عليه وسلم في قباء أيامًا تراوحت بحسب الروايات بين أربعة أيام وبضعة عشر يومًا، نازلاً في دار كلثوم بن الهدم ومجتمعًا بالناس في بيت سعد بن خيثمة. وفي هذه الأيام وُضعت لبنات مسجد قباء الأول، الذي نوه القرآن الكريم بفضله في سورة التوبة: لمسجد أسس على التقوى من أول يوم أحق أن تقوم فيه. كما شهدت قباء لحوق علي بن أبي طالب رضي الله عنه بعدما مشى الليالي الطوال على قدميه إثر إنجاز رد الودائع بمكة.

القسم الثالث : الاختلافات والحدود.
تفاوتت الروايات في عدد الأيام التي قضاها الركب في قباء؛ فصحيح البخاري يشير إلى بضع عشرة ليلة، في حين تجعلها روايات أخرى أربعة أيام تمتد من الاثنين إلى الجمعة. كما ينبغي التنبيه إلى أن هيئة مسجد قباء حينئذ كانت في غاية البساطة: فناء محاط بالحجارة واللَّبِن دون مآذن أو قباب مجصصة. ويحرص التطبيق على إبراز هذه البساطة المعمارية الأولى دون خلط مع المنشآت الضخمة الحالية.

القسم الرابع : خلاصة تربوية.
نستخلص ثلاث عبر أساسية: أولاها أن قباء كانت محطة تمهيدية مدروسة صانت التوازنات القبلية قبل الدخول إلى يثرب. وثانيتها أن المسارعة إلى تشييد المسجد جسدت أولوية الجمع الروحي والاجتماعي في فجر الهجرة. وثالثتها أن اكتمال وصول علي بن أبي طالب برهن على الوفاء الصارم بالعهود حتى في أحلك أوقات الملاحقة.`
  },
  {
    contentId: "HEG-ETP-06",
    locale: "fr",
    filename: "narration-heg-etp-06-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Arrivée et installation à Médine.

Première partie : Repère et périmètre.
L'entrée dans l'agglomération de Yathrib marque le terme triomphal de l'itinéraire de l'Hégire et le point de départ d'une refondation politique, sociale et spirituelle majeure. L'ancienne bourgade agricole oasienne, travaillée depuis des générations par les déchirements fratricides entre tribus rivales, s'apprête à devenir al-Madīna al-Munawwara, la Cité du Prophète. Cette fiche retrace le déroulement de cette journée d'accueil solennel, le choix impartial de l'emplacement de la demeure prophétique et de la mosquée, ainsi que la méthode pacificatrice qui désamorça d'emblée toute querelle de prestige entre les clans de la cité.

Deuxième partie : Éléments sourcés.
Un vendredi matin, le cortège quitte l'oasis de Qubā' pour s'engager dans la palmeraie centrale de Yathrib. En chemin, dans le lit du Wādī Rānūnā' au milieu des demeures des Banū Sālim ibn ʿAwf, le Prophète rassemble les fidèles pour accomplir la première prière collective du vendredi de l'ère musulmane. À l'entrée de la cité, une foule nombreuse d'hommes, de femmes et d'enfants acclame l'arrivée du Prophète, chaque chef de clan d'al-Aws et d'al-Khazraj s'avançant pour tenir la bride de la chamelle al-Qaṣwāʾ et réclamer l'honneur d'accueillir l'hôte illustre. Pour ne favoriser aucune faction et préserver la concorde civile naissante, le Prophète demande de laisser aller la monture, déclarant qu'elle est guidée par ordre divin. La chamelle s'agenouille finalement sur un terrain servant au séchage des dattes, propriété de deux orphelins nommés Sahl et Suhayl, sous la tutelle d'Asʿad ibn Zurāra. Le Prophète refuse tout don gracieux et acquitte le juste prix du terrain, qui deviendra l'emplacement de la mosquée et des logements familiaux, tout en acceptant l'hospitalité provisoire de la maison la plus proche, celle d'Abū Ayyūb al-Anṣārī.

Troisième partie : Variantes, silences et limites.
La tradition mémorielle a immortalisé l'accueil de Médine par le chant poétique Talaʿa al-Badru ʿAlaynā. Cependant, les critiques du hadith et les historiens modernes observent que la mention de Thaniyyāt al-Widāʿ dans ces versets correspond géographiquement au col septentrional par lequel revenaient les expéditions de Syrie, et non à la passe méridionale empruntée depuis Qubā'. L'application présente cet hymne célèbre comme l'expression pérenne de la joie populaire musulmane, tout en consignant avec rigueur cette réserve topographique des spécialistes.

Quatrième partie : Synthèse pédagogique.
Retenons trois enseignements capitaux. Premièrement, l'entrée à Médine s'est opérée sans ostentation guerrière, privilégiant la justice distributive et le consentement mutuel. Deuxièmement, le recours à la chamelle al-Qaṣwāʾ pour fixer le lieu d'installation constitue une solution diplomatique magistrale, évitant d'aviver les jalousies tribales ancestrales. Troisièmement, le paiement rigoureux du terrain des orphelins démontre que l'éthique de la justice économique fonde le premier acte civique de l'État médinois naissant.`
  },
  {
    contentId: "HEG-ETP-06",
    locale: "ar",
    filename: "narration-heg-etp-06-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الوصول والاستقرار في المدينة المنورة.

القسم الأول : تحديد الموضوع ونطاقه.
يشكل دخول النبي صلى الله عليه وسلم إلى قلب يثرب ختام المسار المكاني للهجرة وبداية عهد جديد في تاريخ المجتمع الإسلامي. فهذه الواحة الزراعية التي عانت لعقود من نزاعات دامية بين الأوس والخزرج، كانت على موعد مع تحول جذري لتغدو المدينة المنورة ودار الهجرة النبوية. وتسلط هذه البطاقة الضوء على وقائع يوم الدخول الأغر، والحكمة البالغة في اختيار موضع المسجد النبوي والدار، بما درأ التنافس القبلي ورسخ دعائم السلم الأهلي.

القسم الثاني : العناصر المسندة إلى المصادر.
خرج الموكب صبيحة يوم جمعة من قباء متوجهًا نحو يثرب؛ وفي بطن وادي رانوناء في ديار بني سالم بن عوف، أدركتهم الجمعة فخطب النبي صلى الله عليه وسلم وصلى بالناس أول جمعة في الإسلام. وعند الدخول إلى أحياء المدينة، استقبلته جموع الأنصار بالبشر والترحاب، وكان لا يمر بدار من دور الأوس والخزرج إلا وأخذ رجالها بزمام ناقته القصواء يسألونه النزول عندهم. وحرصًا على الحياد وتأليف القلوب، قال صلى الله عليه وسلم كلمته الشهيرة: دعوها فإنها مأمورة. وبركت الناقة في مربد لتجفيف التمر يعود لغلامين يتيمين هما سهل وسهيل في كفالة أسعد بن زرارة. ورفض النبي صلى الله عليه وسلم قبول الأرض هبة بل ابتاعها بثمنها العادل لتكون موضعًا للمسجد النبوي وحجراته، ثم نزل ضيفًا في دار أبي أيوب الأنصاري رضي الله عنه المجاورة للموضع.

القسم الثالث : الاختلافات والحدود.
خلدت الذاكرة الإسلامية استقبال أهل المدينة بالنشيد الذائع طلع البدر علينا. إلا أن أئمة الحديث والمحققين نبهوا إلى أن ذكر ثنيات الوداع في هذا النشيد يرتبط جغرافيًا بالجهة الشمالية للمدينة التي يُقبل منها القادمون من الشام، وليس من جهة قباء جنوبًا. ويعرض التطبيق هذا النشيد بوصفه تعبيرًا وجدانيًا صادقًا عن بهجة الاستقبال، مع الإشارة العلمية الدقيقة لهذا التدقيق الطبوغرافي.

القسم الرابع : خلاصة تربوية.
نستخلص ثلاث حقائق أساسية: أولاها أن الدخول إلى دار الهجرة اتسم بروح الوئام وتجاوز الضغائن القبلية السابقة. وثانيتها أن حكمة إطلاق الناقة عكست بصيرة قيادية نزعت فتيل التنافس على الشرف العشائري. وثالثتها أن ابتياع أرض المسجد بالثمن العادل صان حقوق الضعفاء وأرسى قدسية العدالة الاقتصادية في أول لبنة للمدينة المنورة.`
  },
  {
    contentId: "CHR-04",
    locale: "fr",
    filename: "narration-chr-04-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Vie familiale avant la Révélation.

Première partie : Repère et périmètre.
L'intervalle d'environ quinze années qui sépare le mariage de Muḥammad à l'âge de vingt-cinq ans de la première manifestation de la Révélation à l'âge de quarante ans correspond à une période de consolidation personnelle, familiale et spirituelle. Établi au cœur de la société mecquoise comme un chef de famille respecté et un négociant probe, il observe avec une lucidité critique les pratiques idolâtres, les inégalités criantes et les tensions claniques de sa cité. Cette fiche explore la structure de son foyer auprès de Khadīja bint Khuwaylid, son arbitrage mémorable lors de la reconstruction de la Kaaba, et son attrait progressif pour la méditation solitaire dans la grotte de Ḥirāʾ.

Deuxième partie : Éléments sourcés.
À la suite d'une expédition commerciale menée avec succès vers la Syrie pour le compte de la noble et fortunée marchande Khadīja bint Khuwaylid, cette dernière, impressionnée par les rapports d'intégrité transmis par son serviteur Maysara, propose le mariage à Muḥammad. Cette union monogame, qui durera un quart de siècle jusqu'à la disparition de Khadīja, donne naissance à plusieurs enfants : deux fils morts en bas âge, al-Qāsim et Abdallāh, et quatre filles qui atteindront l'âge adulte, Zaynab, Ruqayya, Umm Kulthūm et Fāṭima. Vers l'an 605, alors qu'il est âgé d'environ trente-cinq ans, des pluies torrentielles endommagent gravement la Kaaba, contraignant Quraysh à en reconstruire les murs. Lorsque vient le moment de replacer la vénérable Pierre Noire, une discorde mortelle éclate entre les chefs de clan pour s'attribuer cet honneur insigne. Les notables conviennent de s'en remettre au premier entrant par la porte du sanctuaire. Voyant paraître Muḥammad, ils s'écrient d'une seule voix : C'est al-Amīn, nous acceptons son jugement ! Celui-ci dépose la pierre au centre d'un manteau et fait tenir les pans par chaque chef de clan, avant de la fixer lui-même à son angle, apaisant le conflit par la concertation.

Troisième partie : Variantes, silences et limites.
L'âge exact de Khadīja lors du mariage est couramment rapporté comme étant de quarante ans, bien que certains historiens classiques et modernes soulignent l'existence de versions minoritaires indiquant vingt-huit ans au vu du nombre d'enfants nés de cette union. Par ailleurs, à mesure qu'il approche de la quarantaine, Muḥammad s'éloigne des distractions de la cité pour s'isoler chaque année durant le mois de Ramaḍān dans la grotte de Ḥirāʾ sur le mont an-Nūr, pratiquant la dévotion contemplative selon la tradition monothéiste abrahamique.

Quatrième partie : Synthèse pédagogique.
Retenons trois repères fondamentaux. Premièrement, la vie familiale auprès de Khadīja offre une stabilité affective et une confiance mutuelle inébranlables qui seront le premier soutien lors des débuts de la Révélation. Deuxièmement, l'arbitrage de la Pierre Noire consacre publiquement son sens politique et son génie de la concorde au service de la paix civile. Troisièmement, la retraite de Ḥirāʾ marque une rupture intérieure silencieuse avec le polythéisme ambiant, prélude à la mission prophétique.`
  },
  {
    contentId: "CHR-04",
    locale: "ar",
    filename: "narration-chr-04-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الحياة الأسرية قبل البعثة.

القسم الأول : تحديد الموضوع ونطاقه.
تمثل السنوات الخمس عشرة الفاصلة بين زواج النبي صلى الله عليه وسلم في سن الخامسة والعشرين وبدء البعثة في سن الأربعين مرحلة نضج واستقرار أسري وسمو روحي. فبصفته رب أسرة موقرًا وتاجرًا صدوقًا، عاين عن كثب واقع مكة الديني والاجتماعي، مراقبًا بعين البصيرة مظاهر الشرك والظلم الطبقي. وتستعرض هذه البطاقة معالم حياته الأسرية مع خديجة بنت خويلد، وحكمه المشهود في تجديد بناء الكعبة، ثم انقطاعه إلى التعبد في غار حراء.

القسم الثاني : العناصر المسندة إلى المصادر.
عقب تجارة رابحة قادها إلى الشام في مال السيدة خديجة بنت خويلد رضي الله عنها، وما نقله ميسرة من أمانته وسمو أخلاقه، رغبت في الاقتران به فتم الزواج المبارك. وكان هذا الزواج أحاديًا وفيًا دام ربع قرن حتى وفاتها، ورُزق منها بأولاده: القاسم وعبد الله، وأربع بنات عشن حتى بلغن الإسلام: زينب ورقية وأم كلثوم وفاطمة. وحين بلغ نحو الخامسة والثلاثين، هدم سيل جارف أجزاء من الكعبة، فأعادت قريش بناءها، فلما بلغ البنيان موضع الحجر الأسود تنازعت القبائل شرف وضعه حتى أوشكت الفتنة أن تقع. وتراضوا على تحكيم أول داخل من باب الصفا، فلما رأوه هتفوا: هذا الأمين، رضينا به! فبسط رداءه ووضع الحجر وسطه، وأمر كل قبيلة بأخذ طرف من الرداء، ثم رفعه بيده الشريفة إلى موضعه، فصان دماءهم بحكمته.

القسم الثالث : الاختلافات والحدود.
المشهور في السير أن عمر خديجة حين الزواج كان أربعين عامًا، غير أن روايات تاريخية ونقدية أخرى ترجح عمرًا دون ذلك بالنظر إلى الإنجاب المتكرر. ومع اقتراب الأربعين، حُبب إليه الخلاء، فكان يخلو بغار حراء في جبل النور الليالي ذوات العدد يتحنث ويتأمل في ملكوت السماوات والأرض على ملة إبراهيم الحنيفية، مبتعدًا عن أوثان قريش وأهوائها.

القسم الرابع : خلاصة تربوية.
نخلص إلى ثلاث ركائز: أولاها أن الأسرة كانت ملاذ السكينة والوفاء المتبادل وسندًا راسخًا للدعوة لاحقًا. وثانيتها أن حادثة وضع الحجر الأسود رسخت مكانته المجتمعية مرجعًا جامعًا للعدالة والسلم الأهلي. وثالثتها أن خلوة حراء كانت إعدادًا روحيًا صفّى النفس وهيأها لحمل أعباء الرسالة.`
  },
  {
    contentId: "VIE-03",
    locale: "fr",
    filename: "narration-vie-03-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Éclairage et rangement.

Première partie : Repère et périmètre.
L'intérieur domestique dans l'Arabie occidentale du septième siècle se distingue par une sobriété matérielle où chaque objet répond à une nécessité vitale rigoureuse. Loin de la surcharge mobilière des cités impériales byzantines ou perses, la maison hedjazienne tire sa dignité de la propreté de l'espace et de la flexibilité de ses usages : le sol battu, recouvert de nattes de jonc ou de tapis de laine tressée, sert tour à tour de lieu de réception le jour et d'espace de repos la nuit. Cette fiche examine les moyens techniques mis en œuvre pour apprivoiser l'obscurité nocturne et préserver les effets personnels, en étudiant la céramique d'éclairage, les coffres en bois et les dispositifs d'accès et de fermeture.

Deuxième partie : Éléments sourcés.
À la nuit tombée, la vie domestique dépendait de petites lampes à huile en terre cuite moulée, de forme piriforme ou circulaire, composées de deux valves assemblées avant cuisson. Ces lampes comportaient un réservoir central muni d'un orifice de remplissage et un bec antérieur où logeait une mèche de fibres végétales ou de lin torsadé. Elles étaient alimentées à l'huile végétale — huile de sésame produite localement ou huile d'olive acheminée depuis la Syrie par les caravanes. Pour stocker les étoffes, manteaux de laine et pièces de valeur à l'abri des insectes et des rongeurs, les familles aisées possédaient des coffres en bois chevillés, confectionnés en tamaris ou en bois d'acacia d'importation. Les murs épais en brique crue comportaient des niches intérieures creusées dans la maçonnerie, permettant de poser les luminaires en hauteur pour diffuser une clarté douce sans encombrer le sol. Les portes d'entrée en bois étaient sécurisées par des verrous à chevilles ou loquets à glissière en bois, actionnés par des clés dentées rudimentaires.

Troisième partie : Variantes, silences et limites.
L'archéologie montre que dans les campements bédouins sous tente de poil de chèvre, l'éclairage nocturne reposait plutôt sur le feu de camp commun et de simples récipients en pierre, l'huile restant une denrée précieuse réservée aux citadins. De même, les fouilles n'ont livré que peu d'exemplaires intacts de menuiserie en raison du climat et des insectes xylophages. L'application présente ces objets comme des témoins typiques de la culture matérielle régionale, sans jamais les associer à des reliques individuelles privées.

Quatrième partie : Synthèse pédagogique.
Retenons trois enseignements. Premièrement, l'habitat ancien privilégiait un mobilier minimaliste et des rangements intégrés aux parois rocheuses ou d'adobe. Deuxièmement, la lampe à huile et le coffre en bois illustrent la parfaite maîtrise des techniques céramiques et artisanales indispensables au confort de la vie de famille. Troisièmement, cette culture matérielle sobre témoigne d'un art de vivre respectueux des ressources et résolument centré sur l'essentiel.`
  },
  {
    contentId: "VIE-03",
    locale: "ar",
    filename: "narration-vie-03-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الإنارة وحفظ المتاع في المسكن.

القسم الأول : تحديد الموضوع ونطاقه.
تميز البيت الحجازي في القرن السابع الميلادي ببساطة أثاثه واقتصار مقتنياته على الضرورات المعيشية. فبعيدًا عن الترف والزخارف الشائعة في القصور البيزنطية والفارسية، استمد المسكن هيبته من نقاء فضائه ومرونة استعمالاته؛ حيث كانت الأرضية المفروشة بالحصير والبسط الصوفية فضاءً مشتركًا يجتمع فيه أهل الدار نهارًا ويتحول إلى موضع للنوم ليلاً. وتسلط هذه البطاقة الضوء على الأدوات المادية المستخدمة في الإنارة وحفظ المتاع، مستعرضة السراج الفخاري، والصندوق الخشبي، ومزاليج الأبواب الخشبية.

القسم الثاني : العناصر المسندة إلى المصادر.
عند حلول الظلام، اعتمدت إنارة البيوت على سُرُج فخارية صغيرة مصنوعة من الطين المحروق في قوالب مزدوجة. وتتكون هذه السرج من خزان مستدير لوضع الزيت وثقب أمامي تبرز منه فتيلة من ألياف النبات أو الكتان المفتول، وكان يُوقد غالبًا بزيت السمسم أو زيت الزيتون المجلوب من الشام. ولحفظ الملابس الفاخرة والمقتنيات الثمينة من الغبار والدواب، استعملت الأسر صناديق خشبية محكمة الصنع تُصنع من خشب الأثل المحلي أو السنط. واشتملت الجدران الطينية السميكة على تجاويف جدارية تُوضع فيها السرج على ارتفاع مناسب لنشر الضوء دون إشغال أرضية الغرفة. وأُحكم إغلاق الأبواب بضبات ومزاليج خشبية تقليدية تُفتح بمفاتيح خشبية ذات أسنان.

القسم الثالث : الاختلافات والحدود.
تبين الشواهد الأثرية تباينًا بين حياة الحواضر ومخيمات البادية؛ إذ اعتمد أهل البادية في بيوت الشَّعْر على ضوء النار ومصابيح الحجر المنحوتة لندرة الزيوت. كما لم تحظ المشغولات الخشبية بالحفظ الكامل في المواقع الأثرية بفعل تقلبات المناخ ودودة الخشب. ويعرض التطبيق هذه النماذج شواهد على نمط العيش الحجازي دون نسبتها إلى شخصيات بعينها.

القسم الرابع : خلاصة تربوية.
نلخص ذلك في ثلاث عبر: أولاها مرونة الفضاء الداخلي القائم على بساطة الأثاث والتخزين الجداري المدمج. وثانيتها الكفاءة الوظيفية للأواني الفخارية والصناديق في تلبية حاجات الأمان والإنارة. وثالثتها أن هذه الثقافة المادية المقتصدة جسدت سمات الاعتدال التي طبعت الحياة اليومية في فجر الإسلام.`
  }
];

const draftsDir = path.resolve("public/media/drafts");
if (!fs.existsSync(draftsDir)) {
  fs.mkdirSync(draftsDir, { recursive: true });
}

async function generateNarrations() {
  console.log(`Starting generation of ${LOT_04_SCRIPTS.length} narrations for Lot 4...`);
  const results = [];

  for (const item of LOT_04_SCRIPTS) {
    const targetPath = path.join(draftsDir, item.filename);
    console.log(`\n--- [${item.contentId} ${item.locale.toUpperCase()}] -> ${item.filename} ---`);
    console.log(`Script length: ${item.text.length} characters`);

    const t0 = Date.now();
    try {
      const response = await fetch("https://openrouter.ai/api/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: item.model,
          input: item.text,
          voice: item.voice,
          response_format: "mp3"
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenRouter HTTP ${response.status}: ${errText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(targetPath, buffer);
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

      console.log(`✓ Success! Saved ${item.filename} (${buffer.length} bytes in ${elapsed}s)`);
      results.push({
        contentId: item.contentId,
        locale: item.locale,
        filename: item.filename,
        path: `/media/drafts/${item.filename}`,
        sizeBytes: buffer.length,
        elapsedSeconds: elapsed,
        status: "GENERATED_OK"
      });
    } catch (err) {
      console.error(`✗ Error generating ${item.filename}:`, err.message);
      results.push({
        contentId: item.contentId,
        locale: item.locale,
        filename: item.filename,
        error: err.message,
        status: "FAILED"
      });
    }
  }

  // Save report
  const reportPath = path.resolve("reports/lot-04-narrations-generation.json");
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    provider: "OpenRouter",
    model: "minimax/speech-2.8-hd",
    statusNote: "LOT_04_DEMO_NON_VALIDE",
    results
  }, null, 2));

  console.log(`\nFinished Lot 4! Report saved to ${reportPath}`);
}

generateNarrations();
