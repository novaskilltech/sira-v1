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

const LOT_09_SCRIPTS = [
  {
    contentId: "CHR-13",
    locale: "fr",
    filename: "narration-chr-13-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Départ pour l'Hégire.

Première partie : Repère et périmètre.
Au terme de trois jours d'attente vigilante dans la grotte du mont Thawr, le tumulte des battues mecquoises s'apaise. Le guide bédouin Abd Allah ibn Urayqit rejoint Muhammad et Abu Bakr avec les deux chamelles d'endurance. Prenant résolument le contre-pied de la piste caravanière directe vers le nord, le guide engage les voyageurs sur un tracé côtier sinueux à travers la plaine aride de la Tihama, longeant la mer Rouge pour déjouer les postes de guet de Quraysh.

Deuxième partie : Éléments sourcés.
L'expédition est jalonnée de signes providentiels qui ont marqué la mémoire des compagnons. Attiré par la rançon royale de cent chamelles promise par les chefs de La Mecque, le cavalier Suraqa ibn Malik parvient à repérer les émigrants. Mais alors qu'il élance son coursier l'épée tirée, les sabots de sa monture s'enfoncent inexplicablement dans le sol durci, projetant le cavalier à terre dans un tourbillon de poussière. Comprenant la protection divine entourant le Messager, Suraqa implore sa grâce et obtient un sauf-conduit, le Prophète lui promettant même qu'il portera un jour les bracelets d'or du roi persan Khosro.
Plus loin sur la côte, les voyageurs assoiffés s'arrêtent près de la tente nomade d'Umm Ma'bad. Constatant que la sécheresse a tari tous ses animaux, le Prophète passe la main sur le pis flétri d'une vieille brebis épuisée : le lait afflue avec une telle abondance que tous s'abreuvent et qu'un récipient comble est laissé à l'hôtesse. Le voyage se poursuit sans relâche sous les chaleurs étouffantes du jour et la fraîcheur des nuits désertiques, contournant les relais connus pour atteindre sans encombre les abords méridionaux de Yathrib.

Troisième partie : Variantes, silences et limites.
Sur le plan des sources, la poursuite de Suraqa ibn Malik, l'enfoncement des sabots de son cheval et la remise d'un écrit de sûreté (kitab aman) sont authentifiés dans le Sahih al-Bukhari (3906), tandis que la promesse des bracelets de Khosro lors de cette rencontre est rapportée par des voies mursal chez Ibn Ishaq et al-Bayhaqi, et que le récit de la tente d'Umm Ma'bad est transmis par al-Hakim (al-Mustadrak, 4274) et al-Tabarani avec une chaîne bédouine discutée par al-Dhahabi. L'application observe un aniconisme strict : aucune figuration des miracles ni silhouette des voyageurs.

Quatrième partie : Synthèse pédagogique.
Trois leçons majeures illuminent ce départ. Premièrement, le salut dans l'épreuve repose sur l'alliance inséparable de la foi spirituelle et de l'intelligence tactique. Deuxièmement, l'octroi de l'écrit de sûreté à Suraqa illustre la clémence et la maîtrise politique du Prophète au cœur du péril. Troisièmement, la halte chez Umm Ma'bad consacre l'hospitalité du désert dans la mémoire de l'Hégire.`
  },
  {
    contentId: "CHR-13",
    locale: "ar",
    filename: "narration-chr-13-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الانطلاق في الهجرة.

القسم الأول : تحديد الموضوع ونطاقه.
بعد انقضاء الأيام الثلاثة في غار ثور وهدوء سورة البحث في مكة، جاء الخبير عبد الله بن أريقط بالراحلتين، فانطلق بالركب النبوي في طريق ساحلي قاحل بمحاذاة البحر الأحمر في سهول تهامة، متجنباً الطريق العام الذي تسلكه القوافل، في مسار التفافي محكم يبرز قمة اليقظة وحسن التقدير.

القسم الثاني : العناصر المسندة إلى المصادر.
حفل مسار الهجرة بآيات الصدق والحفظ الإلهي؛ إذ تتبع أثرهما سراقة بن مالك طمعاً في دية قريش، فكلما دنا ساخت قوائم فرسه في الأرض وسقط عنها محاطاً بدخان كالغبار. فلما أيقن بالعجز نادى بالأمان، فكتب له النبي كتاب أمان وبشره بسواري كسرى تاجر الملوك، فرجع سراقة يصد الطلب ويقول: كفيتم ما هاهنا.
ثم نزل الركب بخيمة أم معبد الخزاعية وقد أجهدها القحط، فمسح النبي بيده الشريفة على ضرع شاة هزيلة لم يبقَ فيها لبن، فدرت بلبن غزير ملأ الإناء وشرب القوم جميعاً حتى رووا، وترك عندها فضلاً وفيراً. ومضى الموكب يقطع الفيافي ليلاً ونهاراً حتى لاحت بشائر واحة يثرب المباركة.

القسم الثالث : الاختلافات والحدود.
يميز المحدثون بين حديث سراقة وكتاب الأمان الثابت في صحيح البخاري (3906)، وبين زيادة البشارة بسواري كسرى حال المطاردة المروية مرسلاً عند ابن إسحاق والبيهقي، وحديث أم معبد المروي عند الحاكم (4274) والطبراني بإسناد أعرابي ناقش الذهبي بعض رواته. ويتحرى الأطلس أعلى درجات التحفظ المنهجي؛ فلا تجسيد حسياً ولا محاكاة للأشخاص.

القسم الرابع : خلاصة تربوية.
نستخلص من انطلاق الهجرة ثلاث عبر جليلة: أولاها أن عناية الله تحف المخلصين وتذلل أمامهم المهالك. وثانيتها أن البشارة العظيمة لسراقة تعكس ثقة القائد في مستقبل دعوته في أحلك ساعات المطاردة. وثالثتها أن رحلة الهجرة دشت انبعاث أمة تلتقي فيها العزيمة الصادقة مع الأسباب الواقعية.`
  },
  {
    contentId: "CHR-14",
    locale: "fr",
    filename: "narration-chr-14-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Arrivée à Qubâ' et Médine.

Première partie : Repère et périmètre.
Au mois de Rabi' al-Awwal de l'an 622 (le 8 ou le 12 selon les chroniqueurs), après une traversée épuisante, la caravane de l'Hégire parvient aux portes méridionales de Yathrib. Les fidèles de la cité, qui se rendaient chaque matin sur les collines volcaniques pour guetter l'arrivée du Messager, l'accueillent dans une ferveur solennelle. Cet événement refonde l'ordre social et spatial de l'oasis, marquant le commencement officiel du calendrier hégirien et la métamorphose de Yathrib en al-Madina al-Munawwara.

Deuxième partie : Éléments sourcés.
Le Prophète s'établit d'abord pendant quelques jours dans le bourg agricole de Quba, chez Kulthum ibn al-Hadm. Il y supervise l'édification de Masjid Quba, le premier lieu de culte de l'Islam, fondé sur la piété collective. C'est à Quba qu'il est rejoint par Ali ibn Abi Talib, qui avait marché seul depuis La Mecque après avoir restitué sans exception tous les dépôts confiés à Muhammad par ses concitoyens.
Le vendredi, monté sur sa chamelle al-Qaswa, le Prophète fait son entrée dans Yathrib au milieu d'une foule en liesse et des chants des jeunes filles des Banu al-Najjar saluant leur voisin (Ibn Majah, 1899). Devant chaque demeure, les chefs de clan rivalisent pour tenir la bride de l'animal et offrir leur hospitalité. Avec une équité proverbiale qui prévient toute jalousie tribale, Muhammad annonce que la monture est guidée par l'ordre divin. Al-Qaswa s'agenouille sur un terrain appartenant à deux orphelins, face à la maison d'Abu Ayyub al-Ansari, fixant l'emplacement de la future Mosquée du Prophète (Sahih al-Bukhari, 3906).

Troisième partie : Variantes, silences et limites.
Les sources mentionnent plusieurs durées pour la halte à Quba (de quatre à quatorze jours) ainsi que les dates du 8 ou du 12 Rabi' al-Awwal. Quant au chant célèbre Tala'a al-Badru 'alayna, les critiques du hadith comme Ibn al-Qayyim (Zad al-Ma'ad) et Ibn Hajar (Fath al-Bari) soulignent que sa chaîne chez al-Bayhaqi est interrompue (mu'dal) et discutent son rattachement à l'arrivée de l'Hégire ou au retour de Tabuk. L'application proscrit tout portrait du Prophète et d'al-Qaswa.

Quatrième partie : Synthèse pédagogique.
Trois piliers caractérisent cette installation. Premièrement, la construction prioritaire du sanctuaire de Quba affirme que la prière commune et la fraternité spirituelle constituent le ciment de la société. Deuxièmement, la restitution exemplaire des dépôts par Ali illustre une intégrité morale absolue même envers les adversaires. Troisièmement, le choix impartial du lieu d'installation consacre la justice distributive et l'abolition des privilèges de castes.`
  },
  {
    contentId: "CHR-14",
    locale: "ar",
    filename: "narration-chr-14-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الوصول إلى قباء والمدينة.

القسم الأول : تحديد الموضوع ونطاقه.
في شهر ربيع الأول لعام 622 للميلاد (في الثامن أو الثاني عشر منه)، تكللت رحلة الهجرة ببلوغ مشارف يثرب؛ حيث استقبل الأنصار النبي صلى الله عليه وسلم ببهجة عارمة بعد أيام من الترقب في الحرة. ودشن هذا الوصول التاريخي فجر الدولة الإسلامية، وتحولت به يثرب إلى المدينة المنورة، عاصمة العدالة والحرية.

القسم الثاني : العناصر المسندة إلى المصادر.
نزل النبي أولاً في قباء ضيفاً على كلثوم بن الهدم، فأسس مسجد قباء المبارك أول مسجد أُسس على التقوى في الإسلام. وفي قباء لحق به علي بن أبي طالب رضي الله عنه بعد أن أدى الأمانات كاملة إلى أهل مكة.
ثم امتطى ناقته القصواء متوجهاً إلى قلب المدينة، فأنشدت جوارٍ من بني النجار فرحاً بقدومه كما عند ابن ماجه (1899)، وتسابقت بطون الأنصار في الإمساك بخطامها، كل يعرض المنعة والدار، والنبي يقول لهم بحكمة جامعة: دعوها فإنها مأمورة. حتى بركت في مربد ليتيمين من بني النجار أمام بيت أبي أيوب الأنصاري (صحيح البخاري، 3906)، فكانت داره منزله الشريف ريثما بُني المسجد النبوي وحجراته.

القسم الثالث : الاختلافات والحدود.
تعددت الروايات في تحديد يوم الوصول من ربيع الأول (الثامن أو الثاني عشر) ومدة الإقامة في قباء (بين أربعة أيام وأربعة عشر يوماً). كما نبه ابن القيم في زاد المعاد وابن حجر في فتح الباري إلى أن نشيد طلع البدر علينا أورده البيهقي بإسناد معضل، وناقشا نسبته إلى مقدم الهجرة أو غزوة تبوك. ويتحرى الأطلس الالتزام بالضوابط التراثية المانعة لأي تمثيل للأشخاص.

القسم الرابع : خلاصة تربوية.
نستخلص من وصول الهجرة ثلاث ركائز كبرى: أولاها أن بناء المسجد في قباء والمدينة جعل من العبادة المشتركة منطلقاً لوحدة المجتمع. وثانيتها أن أداء الأمانات لأهل مكة يبرز سمو الأخلاق الإسلامية فوق كل خلاف دنيوي. وثالثتها أن حكمة النزول على بروك الناقة أنهت النزاعات القبلية ورسخت مبدأ العدل والمساواة بين أهل الدار.`
  },
  {
    contentId: "VIE-10",
    locale: "fr",
    filename: "narration-vie-10-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Fibres et matières.

Première partie : Repère et périmètre.
Dans les sociétés d'Arabie occidentale du septième siècle, la culture matérielle textile et le travail des matières organiques constituaient une activité domestique et artisanale fondamentale. Face aux amplitudes thermiques sévères du désert, où la brûlure du soleil diurne cède la place à des nuits fraîches, la transformation de la laine, du poil et du cuir offrait des solutions vestimentaires d'une remarquable efficacité technique et thermique.

Deuxième partie : Éléments sourcés.
Les matières premières d'origine animale étaient collectées au sein des troupeaux locaux : la laine de mouton, le poil de chèvre et le poil de chameau. Ces toisons brutes étaient débarrassées de leurs impuretés et cardées à l'aide de peignes en bois dur ou en corne, comme le peigne archéologique OBJ-010. Le filage s'effectuait au moyen du fuseau traditionnel OBJ-009, pourvu d'une fusaïole d'argile ou de pierre qui imprimait une torsion régulière et solide au fil.
Le travail du cuir constituait le second volet majeur de cet artisanat. Tannées à l'aide de décoctions végétales d'écorce de grenadier et d'acacia d'Arabie, les peaux devenaient douces, imperméables et imputrescibles. Les artisans cordonniers y découpaient les sandales traditionnelles OBJ-008, pourvues de deux lanières solides maintenant le gros orteil et le cou-de-pied, indispensables pour isoler la plante des pieds de l'ardeur du sable et des cailloux volcaniques acérés des harra.

Troisième partie : Variantes, silences et limites.
Les pièces archéologiques retrouvées dans la péninsule attestent de l'usage conjoint de fibres locales et de cotonnades importées d'Inde et d'Égypte via les routes caravanières. L'atlas restitue ces artefacts avec une rigueur muséale sans personnification humaine, mettant en lumière la fonctionnalité et la sobriété des matières.

Quatrième partie : Synthèse pédagogique.
Trois enseignements matériels se dégagent de ces pratiques. Premièrement, l'utilisation exhaustive des toisons et des cuirs illustre une valorisation intégrale des ressources animales sans gaspillage. Deuxièmement, la complémentarité entre fibres isolantes et cuir protecteur répondait parfaitement aux exigences du voyage. Troisièmement, le fuseau et la sandale reflètent la perfection d'outils simples éprouvés par des siècles d'expérience humaine.`
  },
  {
    contentId: "VIE-10",
    locale: "ar",
    filename: "narration-vie-10-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الألياف والمواد.

القسم الأول : تحديد الموضوع ونطاقه.
شكلت معالجة الألياف الطبيعية ودباغة الجلود في الحجاز ركيزة اللباس والوقاية في مواجهة بيئة صحراوية قاسية تتميز بتباين درجات الحرارة بين هجير النهار وقرة الليل. واعتمدت الأسر في مكة والمدينة على خامات الأنعام المحلية لتأمين احتياجاتها اليومية من الكساء والفرش ومعدات السفر.

القسم الثاني : العناصر المسندة إلى المصادر.
كان صوف الضأن وشعر الماعز ووبر الإبل المواد الأولية الرئيسة في النسيج؛ حيث كانت تُغسل وتُنظف، ثم تُسرح بالمشط الخشبي أو العظمي الموثق برمز OBJ-010 لإزالة العوالق. ثم تُغزل بواسطة المغزل اليدوي التقليدي OBJ-009 الذي تمنحه ثقالته الحجرية استقراراً وبرماً متيناً للغزول.
أما الجلود، فكانت تُدبغ بمهارة بالغة باستخدام نبات القرظ وقشور الرمان لتكتسب ليونة ومتانة تقاومان البلى. ومن هذه الجلود صنعت النعال التراثية كالموديل OBJ-008، بشراكين يمسكان القدم بإحكام، لتقي الأقدام من لفح الرمضاء الحارقة وحدّة الحجارة البازلتية في مسالك الحجاز.

القسم الثالث : الاختلافات والحدود.
تؤكد الاكتشافات الأثرية تنوع المنسوجات بين ما صُنع محلياً من الصوف وما جُلب من الكتان والقطن عبر تجارة القوافل مع اليمن والشام. ويلتزم التطبيق بالعرض الوثائقي المجرد للأدوات والنعال دون أي تشخيص للأفراد.

القسم الرابع : خلاصة تربوية.
نستخلص من صناعة الألياف ثلاث حقائق مادية: أولاها استثمار كل ما تجود به الأنعام دون هدر للموارد. وثانيتها كفاءة الأدوات البسيطة كالمغزل والمشط في تلبية الاحتياجات الأساسية. وثالثتها ملاءمة اللباس المصنوع محلياً لمتطلبات الصحة والحركة في البيئة العربية.`
  },
  {
    contentId: "VIE-11",
    locale: "fr",
    filename: "narration-vie-11-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Confection et entretien.

Première partie : Repère et périmètre.
Au-delà de la production des fils et des peaux brutes, la société hejazienne accordait un soin attentif à la confection, à la teinture et à l'entretien de ses vêtements. Dans un milieu aride où les textiles constituaient des biens précieux transmis au sein des familles, la longévité du vêtement reposait sur des savoir-faire de tissage domestique, de lavage avec des détergents végétaux et de réparation méticuleuse.

Deuxième partie : Éléments sourcés.
Le tissage était exécuté dans les maisonnées sur des métiers horizontaux rudimentaires tendus au sol. Les lais d'étoffe étaient assemblés pour former les deux pièces maîtresses du costume masculin : l'izar noué autour de la taille et le rida' drapé sur les épaules. Pour égayer les étoffes, on utilisait des teintures d'origine végétale : le jaune d'or du safran et du wars, et le rouge profond de la garance.
L'entretien du corps et des parures répondait à des prescriptions d'hygiène rigoureuses sanctifiées par la coutume et l'éthique prophétique. En l'absence de savon manufacturé, les toiles et les lainages étaient lavés avec l'ushnan, une poudre moussante tirée de plantes salines dégraissantes. La barbe et la chevelure étaient peignées quotidiennement avec le peigne OBJ-010 et entretenues à l'huile végétale. Enfin, les sandales OBJ-008 étaient régulièrement graissées pour éviter le dessèchement du cuir, et ressemelées dès usure, le Prophète lui-même raccommodant ses propres sandales et cousant ses habits, érigeant l'économie et le soin des biens en vertu cardinale.

Troisième partie : Variantes, silences et limites.
Les chroniques de la Sira décrivent la simplicité volontaire du vestiaire prophétique, composé de toiles blanches ou rayées sans apprêt fastueux. L'application met en valeur ces objets du quotidien avec une sobriété exemplaire, excluant toute figure humaine.

Quatrième partie : Synthèse pédagogique.
Trois principes régissent cet entretien. Premièrement, le raccommodage et la longévité des vêtements témoignent d'un refus constant du gaspillage et de l'ostentation. Deuxièmement, l'utilisation de plantes saponifères illustre une chimie domestique adaptée aux contraintes locales. Troisièmement, le soin apporté à la tenue vestimentaire reflète la recherche constante de dignité, de propreté et de simplicité.`
  },
  {
    contentId: "VIE-11",
    locale: "ar",
    filename: "narration-vie-11-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الصناعة والعناية.

القسم الأول : تحديد الموضوع ونطاقه.
تجاوزت ثقافة اللباس في الحجاز مجرد غزل الصوف ودباغة الجلود إلى إتقان طرائق الحياكة والصباغة والعناية بالثياب. وفي مجتمع يقدر قيمة القماش كمال متوارث، شكلت العناية بالملبس وغسله وترقيعه مظهراً من مظاهر النظافة وحسن التدبير المنزلي.

القسم الثاني : العناصر المسندة إلى المصادر.
نُسجت الثياب على أنوال أرضية بسيطة في المنازل لتفصيل الإزار والرداء والبرد الحجازية. وصُبغت الأقمشة بأصباغ طبيعية كالورس والزعفران والحناء والفوّة لإضفاء درجات الصفرة والحمرة النضرة.
وكانت النظافة سمة يومية أصيلة؛ حيث غُسلت الثياب بمسحوق الأشنان القلوي الذي يزيل الأوساخ والدهون من الصوف والكتان. كما اعتنى الرجال والنساء بترجيل شعورهم ولحاهم يومياً بالمشط الخشبي OBJ-010 ودهنها بالزيوت. وتعهدت الأيدي النعال الجلدية مثل OBJ-008 بالدهن لمنع تشققها، مع خرز سيورها وإصلاحها؛ وكان النبي صلى الله عليه وسلم يخصف نعله ويرقع ثوبه بيده، مرسخاً مبدأ العناية بالنعم ورفض التبذير.

القسم الثالث : الاختلافات والحدود.
تبرز نصوص السيرة الشريفة بساطة الملبس النبوي ورغبته في الثياب البيضاء النظيفة، بعيداً عن الخيلاء والشهرة. ويلتزم التطبيق بالعرض المتحفي الرصين للأدوات والنعال دون تجسيد للأشخاص.

القسم الرابع : خلاصة تربوية.
نستخلص من صناعة الكساء والعناية به ثلاث دلالات تربوية: أولاها أن إصلاح المتاع وترقيعه خلق نبوي شريف يدعو للتواضع وحفظ الموارد. وثانيتها أن النظافة وطيب المظهر جزء لا يتجزأ من السمت الإسلامي الأصيل. وثالثتها استثمار نباتات البيئة كالأشنان في تلبية متطلبات الطهارة والصحة.`
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
  console.log("Starting generation of 8 narrations for Lot 9...");
  const results = [];
  for (const script of LOT_09_SCRIPTS) {
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
    statusNote: "LOT_09_DEMO_NON_VALIDE",
    results
  };

  fs.writeFileSync("reports/lot-09-narrations-generation.json", JSON.stringify(report, null, 2));
  console.log("\nFinished Lot 9! Report saved to " + path.resolve("reports/lot-09-narrations-generation.json"));
}

main().catch(err => {
  console.error("Fatal in main:", err);
  process.exit(1);
});
