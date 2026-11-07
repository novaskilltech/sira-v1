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

const LOT_05_SCRIPTS = [
  {
    contentId: "CHR-05",
    locale: "fr",
    filename: "narration-chr-05-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Premières révélations.

Première partie : Repère et périmètre.
L'événement marquant l'irruption de la Révélation constitue la césure inaugurale de l'histoire islamique, traditionnellement situé vers l'an 610 de l'ère chrétienne, au cours d'une nuit du mois de Ramaḍān. Âgé d'environ quarante ans, Muḥammad s'est retiré pour sa retraite méditative annuelle dans la cavité rocheuse de Ḥirāʾ, au sommet du mont an-Nūr, à quelques kilomètres au nord-est de La Mecque. Cette fiche examine le déroulement de cet épisode selon les récits canoniques les plus anciens, le bouleversement intérieur vécu par le futur messager, et le rôle capital d'apaisement joué par son épouse Khadīja et le lettré chrétien Waraqa ibn Nawfal.

Deuxième partie : Éléments sourcés.
Le récit fondamental transmis par ʿĀ'isha dans le Sahih al-Bukhārī rapporte que la Révélation débuta par des visions prémonitoires semblables à la clarté de l'aurore. Dans la grotte de Ḥirāʾ, l'ange de la révélation — identifié par la tradition comme Jibrīl — se manifesta à lui en lui intimant l'ordre : Lis ! À trois reprises, Muḥammad répondit : Je ne suis point de ceux qui lisent, avant que l'ange ne l'étreigne puissamment et ne lui transmette les cinq premiers versets de la sourate al-Alaq : Lis, au nom de ton Seigneur qui a créé, qui a créé l'homme d'une adhérence... Terrorisé par cette expérience qui dépassait toute mesure humaine, il regagna précipitamment son foyer, le cœur battant, et supplia son épouse : Couvrez-moi ! Couvrez-moi ! Khadīja le réconforta avec une lucidité remarquable, attestant que Dieu ne saurait l'abandonner en raison de sa générosité, de son souci des liens de parenté et de son aide aux opprimés. Elle le conduisit ensuite auprès de son cousin Waraqa ibn Nawfal, savant versé dans les Écritures chrétiennes en langue hébraïque et arabe. Ayant écouté le récit, Waraqa s'écria qu'il s'agissait du Nāmūs, la même émanation spirituelle descendue jadis sur Moïse, annonçant que son peuple finirait par le chasser de sa cité.

Troisième partie : Variantes, silences et limites.
L'épisode inaugural fut suivi d'une période de silence révélationnel dont la durée est discutée par les sources, allant de quelques semaines à plusieurs mois, période de profond désarroi intérieur jusqu'à la reprise des versets de la sourate al-Muddaththir. L'application s'abstient de toute dramatisation sensorielle excessive et respecte l'aniconisme absolu : aucune personnification angélique, aucune silhouette de la grotte habitée, la contemplation étant guidée par l'austérité minérale du mont an-Nūr.

Quatrième partie : Synthèse pédagogique.
Retenons trois enseignements capitaux. Premièrement, la Révélation ne naît pas d'une aspiration personnelle au pouvoir mais d'un choc spirituel déconcertant vécu dans la crainte et le tremblement. Deuxièmement, la sagacité de Khadīja et la confirmation scripturaire de Waraqa ibn Nawfal offrent un ancrage rationnel et prophétique immédiat. Troisièmement, le premier mot révélé — Lis — place d'emblée la connaissance, la lecture et l'apprentissage au centre de l'éthique musulmane.`
  },
  {
    contentId: "CHR-05",
    locale: "ar",
    filename: "narration-chr-05-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `بدء الوحي والرسالة.

القسم الأول : تحديد الموضوع ونطاقه.
يشكل مبعث النبي صلى الله عليه وسلم ونزول أوائل الوحي الحدث المفصلي الذي دشن تاريخ الرسالة الإسلامية، وذلك في ليلة مباركة من شهر رمضان نحو عام 610 للميلاد. فبينما كان صلى الله عليه وسلم في سن الأربعين يخلو في غار حراء بقمة جبل النور شمال شرقي مكة، فجأه الحق بأمر لم يعهده. وتسلط هذه البطاقة الضوء على وقائع بدء الوحي وفق أصح الأسانيد، وما رافقه من وجل إنساني عميق، ودور السيدة خديجة الحكيم وموقف ورقة بن نوفل.

القسم الثاني : العناصر المسندة إلى المصادر.
يوثق الحديث الصحيح الذي روته عائشة رضي الله عنها في صحيح البخاري أن أول ما بدئ به رسول الله صلى الله عليه وسلم الرؤيا الصادقة في النوم، فكانت تجيء مثل فلق الصبح. وفي خلوة حراء، نزل عليه الملك جبريل عليه السلام فقال له: اقرأ، فقال: ما أنا بقارئ، فغطّه الملك ثلاث مرات حتى بلغ منه الجهد، ثم أنزل عليه فواتح سورة العلق: اقرأ باسم ربك الذي خلق، خلق الإنسان من علق. فرجع بها رسول الله صلى الله عليه وسلم ترجف بوادره، حتى دخل على خديجة بنت خويلد فقال: زملوني زملوني. فطمأنته خديجة بعقل وازن ويقين ثابت، قائلة: كلا والله ما يخزيك الله أبدًا؛ إنك لتصل الرحم، وتحمل الكلّ، وتكسب المعدوم، وتقري الضيف، وتعين على نوائب الحق. ثم انطلقت به إلى ابن عمها ورقة بن نوفل، وكان شيخًا قد تنصر وقرأ الكتب العبرانية، فلما سمع منه قال: هذا الناموس الذي نزل الله على موسى، ليتني فيها جذعًا إذ يخرجك قومك.

القسم الثالث : الاختلافات والحدود.
أعقب نزول الوحي الأول فترة انقطاع عُرفت بـ فترة الوحي، تفاوتت الروايات في تحديد أمدها بين بضعة أسابيع أو أشهر، مما أورث النبي صلى الله عليه وسلم حزنًا ووجدًا حتى تتابع الوحي بسورة المدثر. ويلتزم التطبيق بالتجرد التام عن أي تمثيل تشخيصي للملك أو لخلوة الغار، مبرزًا الصمت المهيب لقمة جبل النور وعظمة الكلمة الأولى.

القسم الرابع : خلاصة تربوية.
نلخص هذا الحدث الجلل في ثلاث عبر: أولاها أن النبوة لم تكن استشرافًا لمجد شخصي بل أمانة ثقيلة استقبلها صاحبها بالرجفة والمسؤولية. وثانيتها نبل موقف السيدة خديجة وتثبيتها الأخلاقي للنبي في أحرج ساعات المفاجأة. وثالثتها تصدير الرسالة بأمر اقرأ، تنبيهًا على محورية العلم والعقل في إدراك غايات الوجود.`
  },
  {
    contentId: "CHR-06",
    locale: "fr",
    filename: "narration-chr-06-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Premiers adhérents au message.

Première partie : Repère et périmètre.
À la suite de la révélation initiale et de l'injonction divine de transmettre le message, commence une période de prédication discrète et individuelle qui s'étend sur environ trois années. Loin de toute proclamation publique sur les places marchandes de La Mecque, les premiers pas de la foi musulmane se déploient au sein du cercle intime familial et relationnel de Muḥammad. Cette fiche retrace les profils diversifiés de ces pionniers de la première heure — femmes, jeunes gens, affranchis et notables commerçants — dont l'engagement spontané a constitué le socle inébranlable de la communauté naissante.

Deuxième partie : Éléments sourcés.
L'unanimité des historiens de la Sîra place son épouse Khadīja bint Khuwaylid au premier rang de tous les croyants : elle est la première personne à embrasser l'Islam, apportant d'emblée son soutien moral, psychologique et financier. Au sein du foyer, deux figures de jeunesse répondent immédiatement à l'appel : son cousin ʿAlī ibn Abī Ṭālib, âgé d'une dizaine d'années et élevé sous son toit en raison des difficultés financières d'Abū Ṭālib, devenant ainsi le premier parmi les enfants et adolescents, ainsi que son affranchi et fils adoptif Zayd ibn Ḥāritha, premier parmi les affranchis. En dehors du cercle domestique, l'adhésion immédiate d'Abū Bakr ibn Abī Quḥāfa, commerçant aisé et notable influent estimé de toute la ville pour son intégrité et sa connaissance des généalogies arabes, donne une impulsion décisive. Grâce au rayonnement personnel d'Abū Bakr, plusieurs personnalités éminentes de Quraysh rejoignent la foi dès les premiers jours : ʿUthmān ibn ʿAffān, az-Zubayr ibn al-ʿAwwām, ʿAbd ar-Raḥmān ibn ʿAwf, Saʿd ibn Abī Waqqāṣ et Ṭalḥa ibn ʿUbayd Allāh.

Troisième partie : Variantes, silences et limites.
Les ouvrages classiques de théologie et d'histoire ont abondamment débattu des préséances respectives entre Khadīja, ʿAlī, Abū Bakr et Zayd. La conciliation méthodique opérée dès l'époque classique par des savants comme Ibn aṣ-Ṣalāḥ et an-Nawawī distingue les catégories : première parmi les femmes pour Khadīja, premier parmi les enfants et la famille proche pour ʿAlī, premier parmi les hommes libres majeurs pour Abū Bakr, et premier parmi les affranchis pour Zayd. L'application retient cette vision équilibrée qui rend hommage au dévouement distinct de chacun.

Quatrième partie : Synthèse pédagogique.
Retenons trois repères fondamentaux. Premièrement, la foi première s'est diffusée par la conviction personnelle et la confiance morale, sans aucune contrainte matérielle. Deuxièmement, la composition du premier noyau regroupe des catégories sociales variées, unies par un idéal éthique transcendant les privilèges de caste. Troisièmement, la discrétion des trois premières années illustre un sens aigu de la prudence stratégique face aux réflexes conservateurs de l'oligarchie mecquoise.`
  },
  {
    contentId: "CHR-06",
    locale: "ar",
    filename: "narration-chr-06-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الرعيل الأول من السابقين إلى الإسلام.

القسم الأول : تحديد الموضوع ونطاقه.
عقب نزول الوحي وتلقي الأمر الإلهي بالإنذار في فواتح سورة المدثر، بدأت مرحلة الدعوة الفردية التي استمرت زهاء ثلاث سنوات. وبعيدًا عن الجهر في نوادي مكة وأسواقها، انطلقت نبتة الإيمان في الدائرة الأقرب من أهل بيت النبي صلى الله عليه وسلم وخلصائه. وتستعرض هذه البطاقة ملامح هؤلاء الرواد الأوائل من النساء والفتيان والموالي وأعيان التجارة، الذين شكل تصديقهم المبدئي حجر الأساس الراسخ للجماعة المؤمنة.

القسم الثاني : العناصر المسندة إلى المصادر.
أجمعت كتب السيرة والآثار على أن السيدة خديجة بنت خويلد رضي الله عنها كانت أول من آمن بالله ورسوله على الإطلاق، باذلة نفسها ومالها وسكينتها نصرة للحق. ومن أهل البيت النبوي، سارع إلى الإسلام فتيان نشآ في كنفه: علي بن أبي طالب رضي الله عنه، وكان صبيًا يناهز العاشرة من عمره يعيش في رعاية النبي تخفيفًا عن والده أبي طالب، فكان أول من أسلم من الصبيان، ومولاه زيد بن حارثة رضي الله عنه، وكان أول من أسلم من الموالي. وخارج نطاق الأسرة، كان إسلام أبي بكر الصديق رضي الله عنه نقطة تحول كبرى؛ لما كان يتمتع به من وجاهة وأمانة وعلم بأنساب العرب وحسن خلق. وبفضل دعوته الصادقة، انضم إلى الرعيل الأول نخبة من خيرة رجال قريش: عثمان بن عفان، والزبير بن العوام، وعبد الرحمن بن عوف، وسعد بن أبي وقاص، وطلحة بن عبيد الله رضي الله عنهم أجمعين.

القسم الثالث : الاختلافات والحدود.
تناول العلماء والمؤرخون مسألة الأولية في الإسلام بمزيد من التمحيص؛ وقد وفق أئمة التحقيق كالنووي وابن كثير بين الروايات بتصنيف الأوليات: خديجة أول النساء، وعلي أول الصبيان وأهل البيت، وأبو بكر أول الرجال الأحرار، وزيد أول الموالي. ويعتمد التطبيق هذا التوفيق العلمي الرصين الذي يثبت فضل الجميع دون إفراط ولا تفريط.

القسم الرابع : خلاصة تربوية.
نستخلص ثلاث حقائق أساسية: أولاها أن الإيمان الأول قام على صدق المعاشرة والمحبة والتصديق الفطري. وثانيتها أن النواة الأولى جمعت بين الشرف القرشي وعطاء الموالي ونقاء الشباب في مجتمع إنساني متآخٍ. وثالثتها أن حكمة التدرج والكتمان في مستهل الدعوة عكست وعيًا سياسيًا حذرًا جنب الفئة المؤمنة الاستئصال المبكر.`
  },
  {
    contentId: "VIE-04",
    locale: "fr",
    filename: "narration-vie-04-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Denrées et usages alimentaires.

Première partie : Repère et périmètre.
Le régime alimentaire des populations du Hedjaz au septième siècle était étroitement conditionné par les contraintes d'un environnement désertique aride et par les cycles saisonniers de production des oasis. Loin de l'abondance et du raffinement gastronomique des cours byzantine ou perse, la subsistance quotidienne se caractérisait par une sobriété exemplaire, rythmée par quelques denrées fondamentales hautement caloriques et faciles à conserver. Cette fiche explore les aliments de base consommés à La Mecque et à Médine — la datte, le lait, les céréales rustiques et les matières grasses —, tout en analysant les normes culturelles de partage et d'hospitalité qui régissaient les repas.

Deuxième partie : Éléments sourcés.
L'aliment roi et providentiel de l'Arabie centrale est incontestablement la datte, séchée ou fraîche, issue des vastes palmeraies de Médine, de Khaybar ou du Nejd. Les sources mentionnent de multiples variétés locales, comme la ajwa, consommées quotidiennement, servant à la fois de fruit, de pain et de réserve énergétique pour les caravanes. Le deuxième pilier nutritionnel est le lait animal, fourni par les troupeaux de chamelles et de chèvres, consommé frais ou caillé, et dont l'eau constitue souvent l'unique apport hydrique lors des traversées de la steppe. Côté céréales, l'orge prédominait largement sur le blé dur, qui demeurait une denrée rare et coûteuse importée de Syrie ou du Yémen. Les grains d'orge étaient moulus sur des meules de basalte pour confectionner un pain plat non levé ou cuits en bouillie liquide. La matière grasse de cuisson par excellence était le beurre clarifié de brebis ou de chamelle, ainsi que l'huile de sésame. La viande n'était pas un aliment de consommation quotidienne : elle était réservée aux réceptions d'hôtes, aux fêtes sacrificielles ou aux mariages.

Troisième partie : Variantes, silences et limites.
Les témoignages concordants décrivent de longues périodes de frugalité extrême, illustrées par le propos célèbre de ʿĀ'isha rappelant qu'il pouvait se passer un à deux mois sans qu'aucun feu de cuisson ne soit allumé dans la maison prophétique, la nourriture se résumant alors aux deux choses noires : les dattes et l'eau. L'application restitue cette réalité avec authenticité, sans embellissement artificiel.

Quatrième partie : Synthèse pédagogique.
Retenons trois enseignements. Premièrement, l'alimentation hedjazienne est un modèle d'adaptation biologique fondé sur la synergie de la datte et du lait. Deuxièmement, la rareté du blé et de la viande inculquait un respect quasi sacré pour toute parcelle de nourriture, interdisant le gaspillage. Troisièmement, le repas était conçu comme un acte communautaire de partage, où la bénédiction était réputée croître avec le nombre de convives partageant le même plat.`
  },
  {
    contentId: "VIE-04",
    locale: "ar",
    filename: "narration-vie-04-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الأقوات والعادات الغذائية.

القسم الأول : تحديد الموضوع ونطاقه.
ارتبط النمط الغذائي في الحجاز خلال القرن السابع الميلادي ببيئة صحراوية شحيحة الموارد ومواسم جني الواحات. فبعيدًا عن الموائد الفاخرة المترفة في بلاط كسرى وقيصر، اتسم القوت اليومي بالبساطة البالغة والاعتماد على مواد محدودة لكنها غنية بالطاقة وقابلة للحفظ الطويل. وتستعرض هذه البطاقة الأغذية الرئيسة في مكة والمدينة: التمر، واللبن، والشعير، والسمن، مبرزة آداب الطعام وثقافة الإيثار التي طبعت المجتمع النبوي.

القسم الثاني : العناصر المسندة إلى المصادر.
يأتي التمر على رأس الأقوات بلا منازع؛ إذ وفرت واحات المدينة وخيبر أنواعًا شتى من الرطب والتمر اليابس كالعجوة، وشكل التمر طعام الحضر وسفرة المسافر وطاقة الرعاة. ويقابله اللبن، من نوق وشياه، فكان يُشرب حليبًا أو مخيضًا حامضًا، وهو الشراب المعوض عن الماء في مجاهل البادية. أما الحبوب، فكان الشعير عماد الخبز لغالبية الناس، بينما كان القمح عزيزًا مستوردًا من الشام أو اليمن. وكانت حبوب الشعير تُطحن بالرحى الحجرية لتخبز أقراصًا يابسة، أو تطبخ حساءً كالتلبينة. واستُعمل السمن البري وزيت السمسم للإدام والدهن. ولم يكن أكل اللحم ديدن الناس كل يوم، بل كان طعام ضيافة أو ولائم أعراس وأضاحٍ.

القسم الثالث : الاختلافات والحدود.
تنقل كتب الآثار صورًا ناطقة عن فترات الشدة والزهد في بيت النبوة، كحديث عائشة رضي الله عنها في صحيح البخاري: إن كنا لننظر إلى الهلال ثم الهلال ثم الهلال ثلاثة أهلة في شهرين، وما أوقدت في أبيات رسول الله نار، قيل: ما كان يعيشكم؟ قالت: الأسودان: التمر والماء. ويعرض التطبيق هذه الحقائق بأمانة تنزه السيرة عن التخيل الترفي المصطنع.

القسم الرابع : خلاصة تربوية.
نلخص ذلك في ثلاث عبر: أولاها الكفاءة الحيوية لنظام غذائي طبيعي متوازن بين نخلة الواحة ورعي الأنعام. وثانيتها تعظيم نعمة القوت وشكرها ونبذ التبذير. وثالثتها اقتران الطعام بالبركة الاجتماعية وحسن إكرام الضيف ومواساة الجائع.`
  },
  {
    contentId: "VIE-05",
    locale: "fr",
    filename: "narration-vie-05-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Préparation des repas.

Première partie : Repère et périmètre.
La confection des repas dans le cadre oasien et domestique du Hedjaz illustre une maîtrise pragmatique des techniques thermiques élémentaires et de l'outillage lithique et céramique. En l'absence de cuisines aménagées au sens moderne, la préparation culinaire s'effectuait couramment à l'air libre, dans un angle de la cour intérieure ou à proximité immédiate de l'entrée pour évacuer les fumées. Cette fiche décrit les instruments de broyage et de cuisson — meules rotatives en basalte, foyers de pierres, marmites de terre cuite et plats de service —, ainsi que les préparations emblématiques qui composaient la table médinoise et mecquoise.

Deuxième partie : Éléments sourcés.
L'opération quotidienne préliminaire à toute cuisson de céréales était la mouture manuelle du grain d'orge ou de blé à l'aide d'une meule rotative, composée de deux disques épais de basalte volcanique taillé, actionnés à la force du bras par une cheville de bois verticale. Le foyer de cuisson traditionnel reposait sur trois pierres brutes disposées en triangle, sur lesquelles était calée la marmite de terre cuite poreuse ou une marmite de pierre taillée issue des carrières locales. Le combustible employé consistait en brindilles d'épineux secs, en branches de palmier mortes et en crottin desséché de chameau, fournissant une braise vive sans dégager d'odeurs parasites. Parmi les plats cuisinés les plus renommés figure le tharīd, mets honorifique composé de morceaux de galette d'orge émiettés dans un bouillon de viande et de légumes. Pour les déplacements et les haltes rapides, on préparait le ḥays, pâte nutritive et non périssable obtenue en pilant des dattes dénoyautées avec du beurre clarifié et du fromage sec émietté. Le service des plats collectifs s'effectuait dans de grands plats évasés en céramique ou en bois tourné, autour desquels les convives mangeaient ensemble à même la main droite.

Troisième partie : Variantes, silences et limites.
L'archéologie oasienne montre que les ustensiles métalliques étaient rarissimes et constituaient des biens de grand prix réservés à l'aristocratie marchande. La quasi-totalité de la population employait des récipients de terre cuite cuits à basse température. L'application met en valeur ces objets archéologiques réels sans silhouette humaine d'artisan ni représentation figurative de cuisinier.

Quatrième partie : Synthèse pédagogique.
Retenons trois enseignements majeurs. Premièrement, la cuisine de l'époque de la Sîra repose sur une ingéniosité rustique où la meule de basalte et le trépied de pierre sont les instruments centraux. Deuxièmement, des mets comme le tharīd et le ḥays incarnent une gastronomie de la survie et de l'énergie concentrée. Troisièmement, la commensalité autour d'un plat unique partagé matérialise le principe d'égalité fraternelle au sein du foyer.`
  },
  {
    contentId: "VIE-05",
    locale: "ar",
    filename: "narration-vie-05-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `طرق إعداد الطعام وأدواته.

القسم الأول : تحديد الموضوع ونطاقه.
عكست أساليب إعداد الطعام في بيوت الحجاز وواحاته قدرة عملية على توظيف أدوات حجرية وفخارية بسيطة تلائم الموارد المتاحة. وفي غياب المطابخ المستقلة بمفهومها الحديث، كان الطهو يجري غالبًا في زاوية من فناء الدار المكشوف أو بجوار المدخل لتصريف الدخان في الهواء الطلق. وتسلط هذه البطاقة الضوء على آلات الطحن والطبخ: الرَّحى الحجرية، والأثافي، والقدر الفخارية، وقصاع الطعام الخشبية، إلى جانب أشهر الأطباق التي عرفها المجتمع النبوي.

القسم الثاني : العناصر المسندة إلى المصادر.
كانت الرحى الحجرية البازلتية أداة الطحن اليومية الأولى؛ وهي مكونة من حجرين مستديرين يدور أحدهما فوق الآخر بمقبض خشبي لطحن الشعير والحبوب. وتأسس موقد النار على ثلاثة أحجار توضع على الأرض وتُعرف بـ الأثافي، يُنصب عليها القِدر الفخارية أو البرمة الحجرية المنحوتة. وكان الحطب يُجمع من يابس السمر والعضاه وجريد النخل وبَعر الإبل الجاف، موفرًا جمرًا صافيًا سريع الاشتعال. ومن أشهر الأطعمة المصنوعة الثَّرِيد، وهو خبز مفتوت يُسكب عليه مرق اللحم، وكان يُعد أطيب الطعام عندهم. وفي الأسفار، استُعمل الحَيْس، وهي حلوى مغذية تُصنع بعجن التمر بالسمن البري والأَقِط. وتُقدم الوجبات في قِصاع واسعة من الخشب أو الفخار، يجتمع حولها الآكلون ليأكلوا باليد اليمنى من جانبهم المشترك.

القسم الثالث : الاختلافات والحدود.
تدل الآثار على ندرة الأواني النحاسية والمعدنية، واقتصارها على بيوت الأثرياء لعلو ثمنها، بينما سادت الأواني الفخارية المشوية محليًا بين عامة الناس. ويعرض التطبيق هذه الأواني والمجسمات مجردة من أي تمثيل لبشر أو طهاة، تماشيًا مع ميثاق عدم التجسيم.

القسم الرابع : خلاصة تربوية.
نلخص ذلك في ثلاث عبر: أولاها براعة الاستفادة من حجارة الأرض في الطحن والمواقد. وثانيتها القيمة الغذائية المركزة لأطعمة كالحيس والثريد التي جمعت بساطة المكونات وطاقة التحمل. وثالثتها ترسيخ أدب الاجتماع على الطعام والبركة النازلة في القَصعة المشتركة.`
  }
];

const draftsDir = path.resolve("public/media/drafts");
if (!fs.existsSync(draftsDir)) {
  fs.mkdirSync(draftsDir, { recursive: true });
}

async function generateNarrations() {
  console.log(`Starting generation of ${LOT_05_SCRIPTS.length} narrations for Lot 5...`);
  const results = [];

  for (const item of LOT_05_SCRIPTS) {
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
  const reportPath = path.resolve("reports/lot-05-narrations-generation.json");
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    provider: "OpenRouter",
    model: "minimax/speech-2.8-hd",
    statusNote: "LOT_05_DEMO_NON_VALIDE",
    results
  }, null, 2));

  console.log(`\nFinished Lot 5! Report saved to ${reportPath}`);
}

generateNarrations();
