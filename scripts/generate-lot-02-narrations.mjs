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

const LOT_02_SCRIPTS = [
  {
    contentId: "HEG-ETP-01",
    locale: "fr",
    filename: "narration-heg-etp-01-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `La Mecque : contexte du départ.

Première partie : Repère et périmètre.
L'Hégire ne constitue pas un départ improvisé ou une fuite désordonnée : elle représente l'aboutissement d'une crise politique et religieuse majeure au sein de la société mecquoise. Après plus d'une décennie d'épreuves, de boycott et d'hostilité croissante de la part des chefs de Quraysh, la communauté musulmane naissante se trouve dans une impasse sécuritaire à La Mecque. Cette fiche replace la décision de l'exode dans son contexte géopolitique, en montrant comment les accords passés avec les tribus de Yathrib ont ouvert la voie à une nouvelle ère, sans pour autant dissimuler les périls qui pesaient sur les derniers fidèles restés dans la cité.

Deuxième partie : Éléments sourcés.
Les sources de la Sîra, notamment les récits rapportés par Ibn Isḥāq et Ibn Hishām, décrivent l'émigration des croyants comme un mouvement progressif et discret s'étalant sur plusieurs semaines. À la suite des deux serments d'al-ʿAqaba, les clans de Yathrib s'engagent à offrir protection et asile. Répondant à cet appel, la majorité des compagnons quittent La Mecque par petits groupes, laissant derrière eux leurs demeures et une partie de leurs biens pour ne pas éveiller les soupçons. À la veille du départ final, seuls demeurent à La Mecque le Prophète lui-même, Abū Bakr et sa famille, ʿAlī ibn Abī Ṭālib, ainsi que quelques personnes retenues de force ou trop vulnérables pour voyager. Les historiens classiques situent alors la réunion des notables qurayshites à la Dār an-Nadwa, où la décision d'éliminer définitivement le dirigeant du mouvement est arrêtée, impliquant plusieurs clans pour diluer la responsabilité du sang.

Troisième partie : Variantes, silences et limites.
La tradition rapporte des détails précis sur les conciliabules de la Dār an-Nadwa, transmis sous forme d'anecdotes narratives dont les savants étudient la portée symbolique et historique. Du point de vue topographique, il est impossible aujourd'hui de cartographier avec exactitude l'emplacement des maisons des différents protagonistes dans le tissu urbain de l'époque, en raison des transformations architecturales séculaires du sanctuaire et de ses abords. De même, la chronologie fine des départs individuels varie légèrement selon les transmetteurs. L'application retient le cadre général unanimement attesté : une surveillance étroite exercée par l'oligarchie mecquoise et un climat d'extrême vigilance précédant la sortie.

Quatrième partie : Synthèse pédagogique.
Retenons trois enseignements majeurs. Premièrement, l'Hégire est une rupture sociale et territoriale délibérée, rendue nécessaire par la menace vitale qui pesait sur la communauté à La Mecque. Deuxièmement, cet exode repose sur une préparation minutieuse et une alliance politique structurée avec les habitants de Yathrib, rompant avec le cadre tribal traditionnel. Troisièmement, la rigueur de l'étude historique invite à contempler ce moment charnière comme un tournant stratégique majeur, où la fidélité aux principes spirituels l'a emporté sur l'attachement au sol natal.`
  },
  {
    contentId: "HEG-ETP-01",
    locale: "ar",
    filename: "narration-heg-etp-01-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `مكة المكرمة : سياق الخروج.

القسم الأول : تحديد الموضوع ونطاقه.
لم تكن الهجرة النبوية خروجًا عشوائيًا أو فرارًا مستعجلاً، بل جاءت خاتمةً لأزمة سياسية واجتماعية خانقة عاشتها مكة المكرمة. فبعد أكثر من عقد من الدعوة وما رافقها من تضييق ومقاطعة واضطهاد من سادة قريش، انسدت آفاق الأمان أمام الفئة المؤمنة في موطنها الأصلي. وتستعرض هذه البطاقة السياق التاريخي والسياسي الذي سبق قرار الهجرة، موضحة كيف مهّدت بيعتا العقبة الطريق نحو يثرب، دون إغفال لحجم المخاطر التي كانت تحيط بمن بقي من المسلمين في مكة.

القسم الثاني : العناصر المسندة إلى المصادر.
توضح مصادر السيرة، ولا سيما روايات ابن إسحاق وابن هشام، أن هجرة الصحابة تمت تدريجيًا وفي سرية تامة على مدى أسابيع. فعقب بيعتي العقبة والتزام قبائل يثرب بالنصرة والإيواء، انطلقت وفود المسلمين أرسالاً متفرقة، مخلفين وراءهم ديارهم وأموالهم تفاديًا لإثارة ريبة قريش. ومع اقتراب ساعة الحسم، لم يبقَ بمكة إلا النبي صلى الله عليه وسلم، وأبو بكر الصديق وأهله، وعلي بن أبي طالب، إلى جانب المستضعفين والمحبوسين قسرًا. وفي هذا التوقيت، اجتمع أعيان قريش في دار الندوة، واستقر رأيهم على خطة لإنهاء الدعوة عبر اشتراك فتيان من بطون شتى في تنفيذ القتل لتفريق الدم بين القبائل.

القسم الثالث : الاختلافات والحدود.
تنقل كتب الأخبار تفاصيل مسهبة حول مشاورات دار الندوة وما دار فيها من آراء، وهي روايات يحللها المؤرخون والعلماء لبيان أبعادها الدلالية والتاريخية. ومن الناحية الطبوغرافية، يتعذر على الدراسات المعاصرة تعيين مواضع دور الصحابة بدقة متناهية داخل النسيج العمراني المكي آنذاك، نظرًا لتعاقب أعمال البناء والتوسعة عبر القرون. وكذلك تتفاوت بعض الروايات في الترتيب الزمني الدقيق لهجرة الأفراد. لذلك يركز التطبيق على الإطار العام المتفق عليه: ترقب قريش الحذر والظروف الأمنية الدقيقة التي سبقت الخروج.

القسم الرابع : خلاصة تربوية.
نستخلص ثلاث حقائق رئيسة: أولاها أن الهجرة مثلت فصلاً فاصلاً وانتقالاً مدروسًا فرضته ضرورة حماية الدعوة من الاستئصال. وثانيتها أنها قامت على تدبير محكم وحلف سياسي واجتماعي مع أهل يثرب، تجاوز العصبية القبلية الضيقة. وثالثتها أن قراءة هذا الحدث التاريخي تبرز التوازن الدقيق بين الأخذ بالأسباب واليقين، وتؤسس لانطلاق مرحلة البناء المجتمعي في يثرب.`
  },
  {
    contentId: "HEG-ETP-02",
    locale: "fr",
    filename: "narration-heg-etp-02-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Le départ de La Mecque.

Première partie : Repère et périmètre.
Le départ effectif de La Mecque constitue le pivot dramatique marquant l'ouverture du parcours physique de l'Hégire. Cette étape couvre les quelques heures critiques durant lesquelles le Prophète quitte sa demeure sous la surveillance étroite des gardes qurayshites, rejoint la maison d'Abū Bakr et s'engage avec lui dans la nuit en direction du mont Thawr. L'objectif de cette fiche est d'éclairer les mesures prudentielles adoptées lors de cette sortie nocturne et le sens des arbitrages matériels, sans céder à la dramatisation romanesque ni prétendre retracer un plan de ruelles urbaines non vérifiable.

Deuxième partie : Éléments sourcés.
Les recueils de hadiths authentiques, au premier rang desquels le Sahih al-Bukhārī, ainsi que les chroniques d'Ibn Hishām, rapportent que le départ fut exécuté avec une extrême discrétion. Tandis que la maison était surveillée pour empêcher toute fuite avant l'aube, ʿAlī ibn Abī Ṭālib reçut la consigne de prendre place sur la couche pour faire diversion et maintenir l'illusion d'une présence normale. Une mission d'une haute portée éthique lui fut également confiée : demeurer sur place le temps nécessaire pour restituer fidèlement à leurs propriétaires respectifs les dépôts de valeur et biens confiés en garde par les Mecquois. Le Prophète gagna alors la demeure d'Abū Bakr, d'où tous deux partirent à la faveur de l'obscurité par une issue dérobée, marchant vers le sud pour dérouter les patrouilles qui s'attendaient à un départ direct vers le nord et Yathrib.

Troisième partie : Variantes, silences et limites.
La tradition orale a transmis divers récits populaires décrivant le passage du Prophète devant les vigiles endormis ou aveuglés. Si la tradition religieuse accorde une large place à la protection divine et cite à cet égard des versets de la sourate Yā-Sīn, l'analyse historique retient conjointement la rigueur tactique du stratagème : diversion dans la chambre, choix d'une heure insolite, déroute géographique et silence absolu. De plus, les voies de sortie exactes à travers le relief mecquois ne sont pas documentées avec précision archéologique. La carte de l'application indique un jalon de sortie symbolique sans prétendre tracer une trajectoire infaillible.

Quatrième partie : Synthèse pédagogique.
Retenons trois enseignements capitaux. Premièrement, le départ de La Mecque illustre une préparation stratégique exemplaire, conjuguant le secret, la diversion et le contre-pied géographique. Deuxièmement, la restitution scrupuleuse des biens confiés par des opposants démontre l'intransigeance morale maintenue même au cœur du danger mortel. Troisièmement, ce départ clandestin marque la fin définitive de l'époque mecquoise et le début de l'itinéraire qui donnera naissance à l'État et à la société de Médine.`
  },
  {
    contentId: "HEG-ETP-02",
    locale: "ar",
    filename: "narration-heg-etp-02-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الخروج من مكة المكرمة.

القسم الأول : تحديد الموضوع ونطاقه.
يمثل الخروج الفعلي من مكة المكرمة اللحظة المفصلية التي دشنت المسار المكاني للهجرة النبوية. وتغطي هذه المحطة الساعات الدقيقة التي غادر فيها النبي صلى الله عليه وسلم داره في جنح الليل تحت ترصد عيون قريش، ثم لقاءه بأبي بكر الصديق وانطلاقهما معًا في عتمة الليل نحو جبل ثور. وتهدف هذه البطاقة إلى تبيان التدابير الاحترازية المتخذة والمعاني المستفادة من هذا الانتقال، بعيدًا عن الإضافات القصصية غير الموثقة، ودون ادعاء رسم أزقة لا تثبتها الآثار.

القسم الثاني : العناصر المسندة إلى المصادر.
تتفق كتب السنن والأخبار، وفي مقدمتها صحيح البخاري وروايات ابن هشام، على أن الخروج تم بأقصى درجات الحيطة والكتمان. فبينما كانت الدار محاصرة لمنع أي مغادرة قبل الصباح، كُلّف علي بن أبي طالب رضي الله عنه بالمبيت في فراش النبي صلى الله عليه وسلم لإيهام المترصدين ببقائه وصرف أنظارهم. كما أوكلت إليه مهمة أخلاقية بارزة تمثلت في البقاء بمكة أيامًا لرد الودائع والأمانات التي كان أهل مكة يودعونها عنده إلى أصحابها. وانتقل النبي صلى الله عليه وسلم إلى دار أبي بكر، ومنها خرجا من خوخة في ظهر البيت متوجهين جنوبًا صوب جبل ثور، خلافًا للوجهة الطبيعية إلى يثرب شمالاً لتضليل المطاردين.

القسم الثالث : الاختلافات والحدود.
تناقلت الروايات تفاصيل متباينة حول كيفية اجتياز الطوق المضروب حول البيت؛ وبينما تؤكد الرواية الإيمانية عناية الله وحفظه، تبرز القراءة التاريخية الموضوعية تكامل التدبير البشري المحكم مع التوكل: الإيهام بالمبيت، التوقيت المباغت، ومخالفة المسار المعتاد. فضلاً عن ذلك، فإن المسالك الدقيقة التي سُلكت للخروج بين تضاريس مكة لم تُحفظ تفاصيلها الطبوغرافية الدقيقة. ولذا تعرض خريطة التطبيق إشارة عامة لموضع الخروج دون تتبع لمسار شرياني مفصل.

القسم الرابع : خلاصة تربوية.
نلخص هذا الحدث في ثلاث عبر: أولاها أن الخروج عكس تخطيطًا أمنيًا دقيقًا جمع بين التمويه والمباغتة الجغرافية. وثانيتها أن رد الأمانات إلى الخصوم في ذروة الملاحقة يجسد سمو المبدأ الأخلاقي ووفاء العهد حتى في أحلك الظروف. وثالثتها أن هذه الليلة طوت صفحة الاستضعاف في مكة ومهدت لولادة المجتمع المدني في دار الهجرة.`
  },
  {
    contentId: "CHR-02",
    locale: "fr",
    filename: "narration-chr-02-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Naissance et enfance.

Première partie : Repère et périmètre.
L'étude des débuts de la vie du Prophète s'inscrit dans le cadre social et coutumier de l'Arabie préislamique du sixième siècle. Marqué dès l'origine par l'épreuve de l'orphelinat, son itinéraire d'enfance se déroule entre le milieu urbain et marchand de La Mecque et l'immensité pastorale de la badiya. Cette fiche présente les données transmises sur sa naissance, son allaitement parmi les bédouins de Banū Saʿd, et les tutelles successives qui ont encadré ses premières années, en distinguant les faits biographiques concordants des récits merveilleux ultérieurs.

Deuxième partie : Éléments sourcés.
La tradition s'accorde sur le fait que son père, ʿAbdallāh ibn ʿAbd al-Muṭṭalib, mourut avant sa naissance lors d'un voyage marchand vers Yathrib ou Gaza, laissant la mère, Āmina bint Wahb, dans une situation modeste. La naissance est traditionnellement rattachée à l'année de l'Éléphant, associée à l'échec de l'expédition du gouverneur yéménite Abraha contre La Mecque, événement mentionné dans la sourate al-Fīl. Conformément aux usages des notables mecquois soucieux d'éloigner les nouveau-nés des miasmes de la ville et de les initier à la pureté de la langue arabe, le jeune enfant est confié à une nourrice bédouine, Ḥalīma as-Saʿdiyya, auprès de laquelle il passe plusieurs années dans le désert. De retour auprès de sa mère, il perd celle-ci vers l'âge de six ans à al-Abwā', lors d'un retour de Médine. Il est alors pris en charge par son grand-père ʿAbd al-Muṭṭalib, puis, à la mort de ce dernier deux ans plus tard, par son oncle paternel Abū Ṭālib.

Troisième partie : Variantes, silences et limites.
L'équivalence chronologique exacte de l'année de l'Éléphant avec le calendrier julien demeure un sujet de débat savant parmi les historiens contemporains : si la tradition musulmane la situe communément autour de l'an 570 de l'ère chrétienne, certaines inscriptions sud-arabiques et études critiques ont proposé des datations plus précoces. De même, les biographies classiques abondent en récits extraordinaires annonçant un destin exceptionnel. L'application présente ces récits pour ce qu'ils sont dans l'histoire de la piété musulmane, tout en rappelant que le texte coranique lui-même souligne avant tout la condition humaine, fragile et orpheline de l'enfant dans la sourate ad-Ḍuḥā : Ne t'a-t-Il pas trouvé orphelin, alors Il t'a accueilli ?

Quatrième partie : Synthèse pédagogique.
Retenons trois repères fondamentaux. Premièrement, l'enfance du Prophète est profondément façonnée par l'orphelinat et la dépendance affective à l'égard de tuteurs familiaux bienveillants mais aux ressources comptées. Deuxièmement, le séjour précoce dans la steppe chez les Banū Saʿd lui a offert une immersion linguistique et culturelle déterminante dans le monde bédouin. Troisièmement, la rigueur documentaire invite à aborder cette période avec un regard historique clair, respectant la piété traditionnelle sans perdre de vue la réalité sobre et dépouillée des faits transmis.`
  },
  {
    contentId: "CHR-02",
    locale: "ar",
    filename: "narration-chr-02-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `المولد والنشأة الأولى.

القسم الأول : تحديد الموضوع ونطاقه.
تندرج نشأة النبي صلى الله عليه وسلم الأولى ضمن البيئة الاجتماعية والعرفية لشبه الجزيرة العربية في القرن السادس الميلادي. وقد طُبعت هذه المرحلة منذ بدايتها بفقد الأب ورعاية القرابة، متنقلة بين فضاء مكة الحضري واستقرارها التجاري، ورحابة بادية الحجاز وهوائها الطلق. وتستعرض هذه البطاقة ما نقلته الروايات المعتمدة حول مولده الشريف، ورضاعه في بادية بني سعد، وتتابع الكفالات الأسرية التي احتضنت صباه، مميزة بين الثوابت التاريخية المتفق عليها والإضافات الرمزية التي حفلت بها كتب المغازي المتأخرة.

القسم الثاني : العناصر المسندة إلى المصادر.
أجمعت كتب السيرة على أن والده عبد الله بن عبد المطلب توفي قبل ولادته، وهو في طريق تجارة إلى يثرب، فنشأ صلى الله عليه وسلم يتيمًا في كنف أمه آمنة بنت وهب. واقترن عام مولده في الذاكرة العربية بـ عام الفيل، وهو العام الذي شهد اندحار حملة أبرهة عن مكة، وهي الحادثة التي خلدها القرآن الكريم في سورة الفيل. وجريًا على عادة أشراف قريش في التماس المرضعات لأبنائهم طلبًا لفصاحة اللسان وصحة البدن بعيدًا عن هواء المدن، استُرضع في بادية بني سعد عند حليمة السعدية، حيث قضى سنوات من طفولته المبكرة. وبعد عودته إلى أمه، توفيت عنه بالأبواء وهو ابن ست سنين في طريق عودتهما من زيارة لأخواله بيثرب، فكفله جده عبد المطلب، ثم عمه أبو طالب بعد وفاة الجد بعد سنتين.

القسم الثالث : الاختلافات والحدود.
لا تزال المطابقة الدقيقة لعام الفيل مع التقويم الميلادي محط نقاش وتحقيق بين المؤرخين والباحثين المعاصرين؛ فبينما تقرّبه الرواية التقليدية من عام خمسمئة وسبعين للميلاد، تشير دراسات نقدية ونقوش يمنية قديمة إلى احتمالات أخرى. ومن جهة أخرى، تزخر كتب السير الشعبية بإرهاصات وروايات خارقة، في حين يركز النص القرآني في سورة الضحى على البعد الإنساني المحض وواقع اليتم المجرد: ألم يجدك يتيما فآوى. ولذا يعرض التطبيق هذه المرحلة بأسلوب موضوعي يبرز كفالة الأسرة وواقع البيئة دون إقحام لعناصر لم تثبت أسانيدها.

القسم الرابع : خلاصة تربوية.
نخلص إلى ثلاث ركائز: أولاها أن النشأة الأولى اقترنت باليتم والاعتماد على التضامن الأسري تحت رعاية الجد ثم العم أبي طالب. وثانيتها أن الإقامة في بادية بني سعد صقلت فصاحته وعرفته بحياة البادية وفطرتها الأصيلة. وثالثتها أن دراسة هذه المرحلة تقتضي الالتزام بما صح من الأخبار، وإدراك ما غرسـته تلك التجارب المبكرة من صبر وتواضع في الشخصية النبوية.`
  }
];

const draftsDir = path.resolve("public/media/drafts");
if (!fs.existsSync(draftsDir)) {
  fs.mkdirSync(draftsDir, { recursive: true });
}

async function generateNarrations() {
  console.log(`Starting generation of ${LOT_02_SCRIPTS.length} narrations for Lot 2...`);
  const results = [];

  for (const item of LOT_02_SCRIPTS) {
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
  const reportPath = path.resolve("reports/lot-02-narrations-generation.json");
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    provider: "OpenRouter",
    model: "minimax/speech-2.8-hd",
    statusNote: "LOT_02_DEMO_NON_VALIDE",
    results
  }, null, 2));

  console.log(`\nFinished Lot 2! Report saved to ${reportPath}`);
}

generateNarrations();
