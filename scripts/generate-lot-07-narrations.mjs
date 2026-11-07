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

const LOT_07_SCRIPTS = [
  {
    contentId: "CHR-09",
    locale: "fr",
    filename: "narration-chr-09-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Départs vers l'Abyssinie.

Première partie : Repère et périmètre.
Face à l'intensification des persécutions à La Mecque et à l'impossibilité matérielle pour les croyants vulnérables de pratiquer librement leur foi, le Prophète préconise une seconde vague d'émigration vers le royaume chrétien d'Abyssinie, l'empire d'Aksoum. Plus de quatre-vingts hommes, accompagnés de leurs familles, traversent la mer Rouge sous la conduite de Jafar ibn Abi Talib. Cet exode pacifique atteste de la vision politique de la première communauté, capable de franchir les frontières du monde arabique pour chercher refuge auprès d'un monarque étranger réputé pour sa justice.

Deuxième partie : Éléments sourcés.
Inquiets de voir cette dissidence religieuse échapper à leur juridiction, les notables de Quraysh dépêchent à la cour d'Aksoum deux émissaires habiles, Amr ibn al-As et Abd Allah ibn Abi Rabia, munis de présents de cuir tanné mecquois très prisés des dignitaires abyssins. Ils réclament l'extradition immédiate des réfugiés en les accusant d'avoir abjuré la religion ancestrale sans adopter la foi chrétienne.
Refusant de livrer des proscrits sans les entendre, le Negus Ashama convoque la délégation musulmane en présence de ses évêques. Prenant la parole, Jafar ibn Abi Talib dresse un tableau saisissant de la Jahiliyya : l'idolâtrie, l'oppression du faible par le fort et la rupture des liens du sang, contrastant avec l'éthique de vérité, de justice et de chasteté portée par le Prophète. Interrogé sur les écritures révélées, Jafar récite les premiers versets de la sourate Maryam narrant la conception virginale de Jésus. Émus aux larmes, le Negus et ses patriarches attestent de la conformité spirituelle du message avec l'Évangile. Le roi congédie les émissaires mecquois et accorde une protection solennelle aux musulmans.

Troisième partie : Variantes, silences et limites.
Les chroniques s'accordent sur le triomphe moral de cette audience, malgré les intrigues ultérieures des diplomates mecquois. L'application respecte rigoureusement l'aniconisme : aucun portrait du Negus ni des compagnons, l'accent étant placé sur la puissance du verbe coranique et le contexte géopolitique de la mer Rouge.

Quatrième partie : Synthèse pédagogique.
Retenons trois enseignements capitaux. Premièrement, l'Abyssinie constitue le premier sanctuaire territorial de l'Islam, affirmant la légitimité de l'exil pour préserver la liberté de conscience. Deuxièmement, le plaidoyer de Jafar illustre la convergence spirituelle originelle entre traditions monothéistes. Troisièmement, l'équité du souverain chrétien souligne la primauté universelle de la justice sur les solidarités tribales.`
  },
  {
    contentId: "CHR-09",
    locale: "ar",
    filename: "narration-chr-09-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الهجرة إلى الحبشة.

القسم الأول : تحديد الموضوع ونطاقه.
أمام تصاعد الاضطهاد في بطحاء مكة وضيق الخناق على المستضعفين، وجه النبي صلى الله عليه وسلم دفة الدعوة نحو هجرة ثانية كبرى إلى مملكة أكسوم بأرض الحبشة. انطلق أكثر من ثمانين رجلاً مع أسرهم بقيادة جعفر بن أبي طالب في مسار بحري شجاع عبر البحر الأحمر، مجسدين أول انتقال للأمة الناشئة خارج جزيرة العرب التماساً للأمن والحرية الدينية.

القسم الثاني : العناصر المسندة إلى المصادر.
خشيت قريش من اتساع نفوذ المسلمين في الحبشة، فأوفدت عمرو بن العاص وعبد الله بن أبي ربيعة بهدايا نفيسة من أدم مكة إلى النجاشي أصحمة وبطارقته، زاعمين أن المهاجرين فارقوا دين قومهم وابتدعوا ديناً لا يُعرف. غير أن النجاشي العادل رفض تسليمهم قبل أن يسمع حجتهم.
وقف جعفر بن أبي طالب أمام البلاط الملكي شامخ اليقين، فبين ظلمات الجاهلية وعبادة الأوثان وقطيعة الأرحام، مقابل نور الإسلام الداعي إلى الصدق والوفاء بالعهد وبر الوالدين وحرمة الدماء. وحين استنطقه الملك عن الوحي، تلا جعفر صدراً من سورة مريم في شأن عيسى وأمه، فبكى النجاشي حتى اخضلت لحيته، ورد هدايا قريش مؤكداً أن القرآن والإنجيل يخرجان من مشكاة واحدة، ومنح المسلمين الأمان التام في ربوع مملكته.

القسم الثالث : الاختلافات والحدود.
تجمع المصادر التاريخية المعتمدة على نبل موقف النجاشي وصدق الحوار العقدي، مع تباين يسير في تفاصيل لقاء اليوم الثاني بشأن نظرة المسلمين للمسيح. ويتحرى الأطلس التجرد التام؛ فلا تجسيد للبلاط الملكي أو الشخصيات، بل تركيز وثائقي على أصالة الرواية وأبعادها الحضارية.

القسم الرابع : خلاصة تربوية.
نلخص هذه الهجرة في ثلاث دلالات تاريخية: أولاها أن حفظ الدين والكرامة يسمو على التعلق بالأوطان. وثانيتها أن الخطاب الإسلامي الأول ارتكز على القيم الإنسانية المشتركة. وثالثتها أن العدل قيمة عالمية تلتقي عندها الفطر السليمة باختلاف الملل والأعراق.`
  },
  {
    contentId: "CHR-10",
    locale: "fr",
    filename: "narration-chr-10-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Boycott et difficultés à La Mecque.

Première partie : Repère et périmètre.
Après l'échec de la diplomatie mecquoise en Abyssinie et l'entrée dans l'Islam de figures respectées telles que Hamza et Umar, les clans aristocratiques de Quraysh décident d'asphyxier la résistance prophétique. Ne pouvant violer ouvertement les règles de protection du sang sans allumer une guerre intestine, ils décrètent un blocus économique et social absolu contre les Banu Hashim et les Banu al-Muttalib, reclus pendant trois pénibles années dans le ravin escarpé de Shib Abi Talib.

Deuxième partie : Éléments sourcés.
Vers 616 de l'ère chrétienne, les oligarques mecquois rédigent une charte d'ostracisme impitoyable : interdiction formelle de commercer, de contracter mariage ou même de converser avec les membres des deux clans réfractaires jusqu'à ce qu'ils livrent Muhammad. Le parchemin scellé est suspendu dans l'enceinte de la Kaaba pour lui conférer une autorité sacrée.
Confinés dans le ravin aride, les reclus endurent une disette sévère attestée dans les Deux Sahihs (hadith de Sa'd ibn Abi Waqqas sur la consommation des feuilles d'acacia et du cuir desséché). Face à la dureté de ce siège, cinq dignitaires mecquois menés par Hisham ibn Amr, Zuhayr ibn Abi Umayya et Mut'im ibn Adi exigent la rupture publique du pacte au sanctuaire. Les récits biographiques d'Ibn Ishaq et d'Ibn Sa'd rapportent qu'en décrochant la charte, ils constatent que la termite (al-arada) avait rongé le parchemin.

Troisième partie : Variantes, silences et limites.
La durée exacte de l'isolement dans le ravin est située entre deux et trois années selon les annales, et les traditions d'Ibn Ishaq et d'Ibn Sa'd rapportent deux variantes sur le feuillet rongé par la termite : soit seule la formule En Ton Nom, ô Dieu demeura intacte, soit seules les clauses d'injustice et de rupture des liens du sang furent dévorées. L'application proscrit toute dramatisation imagée de la détresse humaine, privilégiant la rigueur topographique et documentaire.

Quatrième partie : Synthèse pédagogique.
Trois enseignements majeurs se dégagent de cette épreuve. Premièrement, le blocus démontre la dérive tyrannique de l'oligarchie marchande lorsqu'elle voit ses rentes menacées. Deuxièmement, la fidélité inébranlable des Banu Hashim, y compris de leurs membres non-musulmans, met en relief l'honneur clanique mis au service de la justice. Troisièmement, la dénonciation courageuse de la charte par des notables mecquois prouve que la conscience morale transcende les sectarismes partisans.`
  },
  {
    contentId: "CHR-10",
    locale: "ar",
    filename: "narration-chr-10-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `المقاطعة والصعوبات في مكة.

القسم الأول : تحديد الموضوع ونطاقه.
عقب إخفاق محاولات قريش لإعادة مهاجري الحبشة واستعلاء شأن الإسلام بإسلام حمزة وعمر رضي الله عنهما، لجأت قريش إلى سلاح الحصار الاقتصادي والاجتماعي الشامل. أجمعت بطون قريش على ميثاق جائر يقضي بعزل بني هاشم وبني المطلب في شعب أبي طالب، في محاولة لإجبارهم على تسليم رسول الله صلى الله عليه وسلم أو التراجع عن حمايته.

القسم الثاني : العناصر المسندة إلى المصادر.
كُتبت صحيفة المقاطعة نحو عام 616 للميلاد، ونصت بنودها الجائرة على تحريم البيع والشراء والزواج والمجالسة مع بني هاشم، وعُلقت الصحيفة في جوف الكعبة لتوكيد حرمتها. عانى المحاصرون داخل الشعب مرارة الجوع والحرمان لثلاث سنين، حتى تساقطت أوراق الشجر قوتًا لهم، وسُمع بكاء الصبية من وراء الشعاب.
ورغم بطش أبي جهل وقسوته، تحركت مروءة رجال من قريش رفضوا هذا الخزي؛ فكان هشام بن عمرو وحكيم بن حزام يسوقان الإبل المحملة بالطعام ليلًا. ثم تداعى خمسة من أشراف مكة يقودهم المطعم بن عدي وزهير بن أبي أمية لنقض الصحيفة علانية في نادي قريش. وحين قصدوا تمزيقها، وجدوا أن دابة الأرض قد أكلت بنود الظلم والقطيعة ولم تُبقِ إلا كلمة باسمك اللهم، فانفك الحصار وسط خيبة المستكبرين.

القسم الثالث : الاختلافات والحدود.
تتفق كتب السيرة المعتبرة وأحاديث الصحيحين (حديث سعد بن أبي وقاص في أكل ورق الشجر والجلد اليابس) على شدة الحصار وصمود المحاصرين، بينما ترد قصة أكل الأرضة للصحيفة عند ابن إسحاق وابن سعد بوجهين: إما بقاء لفظ باسمك اللهم وحده، أو أكل مواضع القطيعة والظلم دون ذكر الله. ويحرص الأطلس على توثيق الحادثة توثيقاً تاريخياً رصيناً ينأى عن المبالغات التراجيدية أو التشخيص الحسي.

القسم الرابع : خلاصة تربوية.
نستخلص من مأساة المقاطعة ثلاث عبر بليغة: أولاها أن الحق قد يمر بابتلاءات التضييق المادي لتمحيص الصفوف وتثبيت القلوب. وثانيتها أن نصرة المظلوم قيمة فطرية قد تنبعث من ضمائر المنصفين حتى في صفوف الخصوم. وثالثتها أن مواثيق الظلم والبغي تحمل في ذاتها بذور فنائها أمام صلابة المبدأ.`
  },
  {
    contentId: "VIE-07",
    locale: "fr",
    filename: "narration-vie-07-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Approvisionnement en eau.

Première partie : Repère et périmètre.
Dans le climat hyperaride du Hedjaz, où les précipitations annuelles sont rares et irrégulières, l'accès à l'eau potable constituait le fondement même de la survie humaine et de l'organisation politique. À La Mecque, ville minérale enserrée de granits stériles, comme à Médine, oasis volcanique verdoyante, l'exploitation des nappes souterraines exigeait une ingénierie hydraulique pragmatique et un cadre coutumier régulant le partage équitable de cette ressource vitale.

Deuxième partie : Éléments sourcés.
À La Mecque, le puits de Zamzam, redécouvert par Abd al-Muttalib, assurait la subsistance de la cité et légitimait l'institution séculaire de la Siqaya, le service d'abreuvement des pèlerins confié aux Banu Hashim. Pour puiser l'eau dans ces puits profonds creusés à même la roche, on employait le dalw, un grand seau de cuir de bœuf ou de chèvre tanné suspendu à des cordes végétales en fibres de palmier, actionné manuellement ou à l'aide de poulies de bois d'acacia.
Dans les maisonnées mecquoises et médinoises, l'eau recueillie était transvasée dans des outres de cuir de chèvre, répertoriées sous le code OBJ-006, qui permettaient une manipulation aisée. À Médine, l'abondance relative des nappes alimentées par les coulées basaltiques a permis le creusement de puits agricoles renommés, tels que Bi'r Ruma, racheté par Uthman ibn Affan pour être mis à la disposition gratuite de tous les habitants. L'eau destinée à la boisson était décantée et rafraîchie dans de grandes jarres en terre cuite poreuse, à l'exemple de l'objet OBJ-007, dont la transpiration naturelle abaissait sensiblement la température de l'eau par évaporation.

Troisième partie : Variantes, silences et limites.
Les vestiges archéologiques d'Arabie révèlent une diversité de techniques de cuvelage de puits, associant moellons de basalte et mortier de chaux. L'application met en valeur ces technologies hydrauliques traditionnelles à travers des modèles matériels précis, sans aucune figuration anthropomorphe.

Quatrième partie : Synthèse pédagogique.
Trois leçons structurent cette culture de l'eau. Premièrement, la maîtrise du puisage et de la décantation a permis l'émergence d'une vie urbaine prospère au milieu du désert. Deuxièmement, la gratuité de l'eau consacrée par l'institution de la Siqaya et le legs de Bi'r Ruma élève l'accès à l'eau au rang de devoir éthique fondamental. Troisièmement, la jarre poreuse et l'outre en cuir démontrent une science empirique remarquable de la thermodynamique passive.`
  },
  {
    contentId: "VIE-07",
    locale: "ar",
    filename: "narration-vie-07-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `التزوّد بالماء.

القسم الأول : تحديد الموضوع ونطاقه.
في بيئة الحجاز الجافة التي تشح فيها الأمطار الموسمية، مثل الحصول على الماء العذب ركيزة الاستقرار البشري ومحور التنظيم الاجتماعي والسياسي. وسواء في مكة ذات الطبيعة الصخرية الجرداء أو في يثرب ذات الواحات النخيلية، تطلب استخراج المياه الجوفية مهارات هندسية متوارثة وأعرافاً تكافلية صارمة تصون حق الجميع في هذه النعمة الحيوية.

القسم الثاني : العناصر المسندة إلى المصادر.
في مكة المكرمة، كانت بئر زمزم شريان الحياة الأكبر، وشكلت السقاية شرفاً رفيعاً نهض به بنو هاشم لوفادة الحجيج. واستُخرج الماء من الآبار العميقة بواسطة الدلو، وهو وعاء جلدي متين يُصنع من أدم البقر أو الإبل ويُشد بحبال مفتولة من ليف النخيل، ويُسحب بالأيدي أو عبر بكرات خشبية مثبَّتة.
وكانت مياه الشرب تُنقل في قرب جلدية مرنة موثقة برمز OBJ-006، في حين تميزت يثرب بوفرة آبارها العذبة المتفجرة من الحرات البركانية، كبئر رومة التي اشترى عثمان بن عفان رضي الله عنه شطرها ثم كلها ليجعلها وقفاً مجانياً يستقي منه المسلمون وعابرو السبيل. وفي المنازل، كان الماء يُصفى ويُبرَّد في الجرار الفخارية المسامية كالقطعة OBJ-007، حيث يؤدي ترشح قطرات الماء عبر مسام الفخار وتبخرها في الهواء الجاف إلى خفض حرارة الماء الداخلي بصورة طبيعية بارعة.

القسم الثالث : الاختلافات والحدود.
تظهر الشواهد الأثرية في الحجاز تبايناً في طرائق طي الآبار بالحجارة البازلتية وإحكام فوهاتها بالقصارة الجيرية. ويعرض الأطلس هذه المعالم بأسلوب وثائقي هادف، مستنداً إلى الآثار المادية المجردة دون أي افتعال درامي للأشخاص.

القسم الرابع : خلاصة تربوية.
نستخلص من تدبير المياه ثلاث حقائق حضارية: أولاها أن هندسة الآبار وتبريد الفخار طوعا قسوة الطبيعة لصالح استقرار المجتمع. وثانيتها أن جعل الماء وقفاً عاماً كما في زمزم وبئر رومة كرس مفهوم التكافل الاجتماعي في الإسلام. وثالثتها أن إكرام السائل وإماطة العطش عُدّا من أعظم القربات الأخلاقية في ثقافة الجزيرة.`
  },
  {
    contentId: "VIE-08",
    locale: "fr",
    filename: "narration-vie-08-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Transport de l'eau.

Première partie : Repère et périmètre.
Dans les immensités désertiques d'Arabie, où les puits pérennes étaient souvent distants de dizaines de lieues, le transport sécurisé de l'eau conditionnait toute mobilité humaine. Qu'il s'agît des caravanes marchandes traversant le plateau du Nejd, des pèlerins convergeant vers le sanctuaire mecquois ou des voyageurs sur la piste de l'Hégire, la préservation des réserves hydriques relevait d'une logistique méticuleuse reposant sur le savoir-faire des tanneurs et des chameliers.

Deuxième partie : Éléments sourcés.
Le contenant de référence pour le portage individuel et domestique était la qirba, une outre en cuir de chèvre cousue et imperméabilisée, représentée par l'objet OBJ-006. Dépouillée d'une seule pièce, tannée à l'écorce d'acacia et enduite de graisse ou de résine végétale pour prévenir toute fuite et éviter le goût âcre du cuir brut, elle était portée à dos d'homme par les porteurs d'eau professionnels, les saqqa'un, qui approvisionnaient les réservoirs et les jarres de stockage comme le modèle OBJ-007.
Pour les expéditions lointaines et les traversées caravanières, les nomades confectionnaient des outres de grande contenance appelées mazada et rawiya, faites de peaux de bœuf renforcées pouvant contenir jusqu'à cent litres. Ces réservoirs mobiles étaient arrimés par paires équilibrées sur les flancs des dromadaires, protégés de l'ardeur du soleil par des bâches de laine grossière qui limitaient l'évaporation causée par le vent du désert. Lors de l'Hégire, le soin apporté par Asma bint Abi Bakr à attacher les outres et les vivres à l'aide de sa propre ceinture, ce qui lui valut le titre de Dhat an-Nitaqayn, témoigne du caractère crucial de cette préparation matérielle.

Troisième partie : Variantes, silences et limites.
Les sources décrivent des procédés de calfeutrage variés selon les régions, utilisant la poix minérale côtière ou les gommes végétales du désert. L'application s'attache à restituer ces conteneurs avec une fidélité archéologique intégrale, excluant tout personnage pour privilégier l'étude fonctionnelle des matériaux.

Quatrième partie : Synthèse pédagogique.
Trois enseignements logistiques résument cette ingéniosité nomade. Premièrement, l'outre en cuir représente un chef-d'œuvre de légèreté, de flexibilité et de résistance aux chocs sur les sentiers escarpés. Deuxièmement, l'équilibrage des charges sur le chameau démontre une connaissance empirique aiguë de la biomécanique animale. Troisièmement, le respect méticuleux accordé aux récipients d'eau rappelle la précarité permanente de la vie dans les grands espaces arides.`
  },
  {
    contentId: "VIE-08",
    locale: "ar",
    filename: "narration-vie-08-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `نقل الماء.

القسم الأول : تحديد الموضوع ونطاقه.
في صحاري الجزيرة المترامية التي تتباعد فيها موارد المياه مسيرة أيام، مثل نقل الماء وحفظه شريان كل حركة تجارية أو ارتحال سكاني. وسواء في مسالك القوافل الصاعدة نحو الشام أو في هجرة النبي صلى الله عليه وسلم وصاحبه إلى يثرب، اعتمدت النجاة في المهالك على دقة التخطيط اللوجستي وجودة الأوعية المحمولة التي أبدعتها يد الصانع العربي من جلود الماشية.

القسم الثاني : العناصر المسندة إلى المصادر.
كانت القربة الفردية الموثقة برمز OBJ-006 الوعاء الأساسي لحمل الماء؛ تُصنع من جلد الشاة المدبوغ بالقَرَظ ونباتات البادية، وتُدهن بالأدهان الطبيعية لمنع التسرب ورائحة الدباغة. وكان السقاؤون في مكة والمدينة يحملون القرب على ظهورهم لسقاية البيوت وإفراغها في الجرار الخزفية المخصصة للتخزين مثل OBJ-007.
أما في الأسفار البعيدة، فكانت تُستخدم المزاود والروايا الكبيرة المصنوعة من جلود الإبل والبقر، وتتسع لقرابة مئة لتر، حيث تُحمل مثنى على جانبي البعير لتحقيق التوازن الدقيق أثناء السير في الدروب الوعرة، وتُغطى بأكسية من الصوف الخشن لرد وهج الشمس وتقليل التبخر. وتتجلى أهمية هذا الإعداد في موقف أسماء بنت أبي بكر رضي الله عنها حين شقت نطاقها لتربط به سفرة الطعام وقربة الماء في غار ثور، فاستحقت لقب ذات النطاقين تخليداً لهذه المساهمة المادية الحاسمة.

القسم الثالث : الاختلافات والحدود.
تتفاوت الروايات في ذكر المواد المستعملة لطلاء الجلود داخلياً بين القطران والزيوت العطرية بحسب البيئة الجغرافية ونوع الاستخدام. ويعتمد الأطلس على التوثيق المادي المجرد لهذه الأوعية التراثية، بعيداً عن أي محاكاة درامية للأشخاص.

القسم الرابع : خلاصة تربوية.
نستخلص من ثقافة نقل الماء ثلاث عبر جليلة: أولاها أن القربة الجلدية كانت حلاً تقنياً نموذجياً يجمع بين خفة الوزن ومقاومة الكسر في المسالك الصخرية. وثانيتها أن توازن الأحمال على ظهور الرواحل عكس دراية علمية بطبيعة السفر وأوزانه. وثالثتها أن صون الماء في الصحراء هو عنوان الحكمة واليقظة الإنسانية في حفظ الحياة.`
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
  console.log("Starting generation of 8 narrations for Lot 7...");
  const results = [];
  for (const script of LOT_07_SCRIPTS) {
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
    statusNote: "LOT_07_DEMO_NON_VALIDE",
    results
  };

  fs.writeFileSync("reports/lot-07-narrations-generation.json", JSON.stringify(report, null, 2));
  console.log("\nFinished Lot 7! Report saved to " + path.resolve("reports/lot-07-narrations-generation.json"));
}

main().catch(err => {
  console.error("Fatal in main:", err);
  process.exit(1);
});
