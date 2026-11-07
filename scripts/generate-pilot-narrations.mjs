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

const PILOT_SCRIPTS = [
  {
    contentId: "CHR-01",
    locale: "fr",
    filename: "narration-chr-01-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `La Mecque : cadre géographique et social.

Première partie : Repère et périmètre.
Au sixième siècle de l'ère chrétienne, la péninsule Arabique se caractérise par une grande diversité de milieux géographiques et d'organisations humaines. Dans la région occidentale du Hedjaz, la cité de La Mecque se singularise par son implantation particulière : nichée au creux d'une vallée aride, enserrée par des massifs granitiques, la localité ne dispose ni de terres agricoles fertiles ni d'oasis comparables à celles de Yathrib ou de Taëf. Son existence et sa vitalité reposent sur deux facteurs déterminants : le jaillissement d'un point d'eau pérenne et une tradition ancienne rattachant à ce site le sanctuaire de la Kaaba, vers lequel convergent les circulations régionales.

Deuxième partie : Le contexte et les clans.
Le cadre naturel impose une économie d'adaptation rigoureuse. Les précipitations, rares mais soudaines, peuvent provoquer des crues torrentielles dévalant les pentes des monts environnants. Au fil des générations précédant l'avènement de l'Islam, la tribu de Quraysh s'établit de façon prépondérante dans la cuvette et sur les hauteurs. Les récits classiques attribuent à Quṣayy ibn Kilāb une structuration majeure de la cité : l'attribution des quartiers selon les clans, la création de la Dār an-Nadwa — lieu d'assemblée et de concertation des notables — et l'organisation des charges d'intendance liées à l'accueil des pèlerins, telles que la siqāya et la rifāda. Les habitations se répartissent alors entre Quraysh al-Biṭāḥ, installés au fond de la vallée près du sanctuaire, et Quraysh aẓ-Ẓawāhir, établis sur les collines périphériques.

Troisième partie : Carrefour caravanier et sanctuaire.
Bien qu'isolée dans son écrin minéral, La Mecque occupe une position stratégique sur les corridors commerciaux reliant le Yémen au sud aux marchés byzantins et levantins au nord. Les caravanes mecquoises profitent des traités d'alliance et de la sacralité reconnue au sanctuaire pour sécuriser deux expéditions annuelles majeures : l'une en hiver vers les contrées méridionales, l'autre en été vers le nord. Durant les mois sacrés, une trêve générale suspend les conflits intertribaux, favorisant d'importantes foires régionales, telles que celle de ʿUkāẓ. Pour aborder l'histoire de la Sîra, il convient toutefois de distinguer le milieu naturel documenté des reconstructions urbaines tardives. L'archéologie du site antique demeure difficilement accessible en raison des aménagements continus. De même, la concordance exacte entre la cité mecquoise et certains toponymes mentionnés par les géographes de l'Antiquité, notamment la cité de Macoraba chez Ptolémée, fait encore l'objet de discussions savantes sans certitude absolue.

Quatrième partie : Synthèse pédagogique.
Retenons trois idées maîtresses. Premièrement, La Mecque s'est développée au cœur d'un environnement minéral contraignant, où la maîtrise de l'eau et la topographie ont forgé l'habitat. Deuxièmement, son essor social et marchand s'est articulé autour du sanctuaire de la Kaaba, pôle de convergence et de trêve sacrée pour les clans d'Arabie. Troisièmement, la rigueur historique invite à lire les récits de tradition en respectant leurs strates, sans confondre les repères documentés avec des certitudes topographiques modernes.`
  },
  {
    contentId: "CHR-01",
    locale: "ar",
    filename: "narration-chr-01-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `مكة المكرمة : الإطار الجغرافي والاجتماعي.

القسم الأول : تحديد الموضوع ونطاقه.
في القرن السادس الميلادي، تميزت شبه الجزيرة العربية بتنوع بيئاتها وأنماط العيش فيها. وفي إقليم الحجاز الغربي، استند موقع مكة المكرمة إلى خصوصية جغرافية بارزة؛ إذ نشأت في وادٍ جبلي غير ذي زرع، تحيط به تضاريس وعرة من صخور الجرانيت، كجبل أبي قُبَيْس وقُعَيْقِعَان، دون أراضٍ زراعية تضاهي واحات يثرب أو الطائف. واستند استقرارها البشري إلى نبع ماء دائم، وإلى تقليد ضارب في القدم يربط بهذا الموضع البيتَ العتيق، الكعبة المشرفة، التي استقطبت القوافل من شتى الأصقاع.

القسم الثاني : العناصر المسندة إلى المصادر.
فرضت الطبيعة الجغرافية نمط حياة محكمًا تحسبًا لشح الأمطار أو لسيول جارفة كانت تباغت الوادي. وتذكر المصادر التاريخية الكلاسيكية أن قبيلة قريش استقرت بمكة وأعادت تنظيمها، وتبرز الروايات دور قُصَيّ بن كِلاب في جمع بطونها، وتأسيس دار الندوة لتداول الرأي، فضلاً عن ترتيب مهام السقاية والرفادة لخدمة وفود البيت. وتوزعت مساكن القبيلة بين قريش البطاح في بطن الوادي وقريش الظواهر في المرتفعات المحيطة.

القسم الثالث : الاختلافات والحدود.
غدت مكة محطة تجارية بارزة بفضل موقعها على محاور القوافل بين بلاد اليمن جنوبًا وأسواق الشام شمالاً، واعتمد أهلها على إيلاف الرحلتين الموسمتين: رحلة الشتاء والصيف. وفي الأشهر الحرم، كانت الهدنة تتيح ازدهار أسواق كبرى مثل سوق عُكاظ، لتجتمع التجارة بالخطابة والشعر. ومع ذلك، تقتضي القراءة التاريخية التفريق بين الثوابت الجغرافية والتفاصيل العمرانية التي يتعذر حصرها أثريًا اليوم بسبب التوسع المعماري المتواصل. كما تظل بعض الإشارات في خرائط الجغرافيا القديمة، كاسم «ماكورابا» عند بطليموس، فرضية أكاديمية غير محسومة قطعيًا.

القسم الرابع : خلاصة تربوية.
نخلص إلى ثلاث ركائز: أولاها أنّ نشأة مكة اقترنت ببيئة صخرية شحيحة الموارد صيّرت الماء والحرم ركيزتي البقاء. وثانيتها أنّ مكانتها الاجتماعية والتجارية انبثقت من حرمة الكعبة وحفظ الأمن الموسمي للقوافل. وثالثتها أنّ قراءة السيرة تتطلب التمييز بين المعالم الموثقة في الرواية المعتمدة والتأويلات الجغرافية الحديثة، بأمانة معرفية وتوقير.`
  },
  {
    contentId: "HEG-ETP-03",
    locale: "fr",
    filename: "narration-heg-etp-03-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `La grotte de Thawr.

Première partie : Repère et périmètre.
Parmi les étapes de l'Hégire, la grotte de Thawr occupe une place singulière dans la mémoire musulmane. La tradition de la Sîra y situe un moment de refuge, juste après le départ de La Mecque et avant le long chemin vers Yathrib, la future Médine. Cette fiche ne prétend pas reconstituer la scène : elle distingue ce que dit le texte coranique, ce que rapportent les ouvrages de Sîra, et ce que l'on peut dire aujourd'hui du lieu lui-même.

Deuxième partie : Éléments sourcés.
Le Coran évoque l'épisode dans la sourate at-Tawba, au verset quarante. Le verset mentionne le second de deux, deux personnes réfugiées dans une grotte, et la parole adressée par l'un à son compagnon : Ne t'afflige pas, Dieu est avec nous. Le verset ne nomme ni le lieu ni le compagnon. Ce sont les récits de Sîra, notamment ceux transmis par Ibn Isḥāq et repris par Ibn Hishām, qui identifient ce compagnon comme Abū Bakr et associent la grotte au mont Thawr. Ar-Raḥīq al-Makhtūm, synthèse moderne d'al-Mubārakpūrī, reprend cette association dans ses chapitres consacrés au départ. Selon ces récits, le refuge dure quelques nuits, le temps que la recherche lancée depuis La Mecque se relâche. Le choix d'une direction opposée à celle de Yathrib est généralement présenté comme une manière de déjouer les poursuivants.

Troisième partie : Variantes, silences et limites.
Il faut ici séparer plusieurs niveaux. Le texte coranique, d'abord, qui fonde l'épisode sans en donner la géographie. Les récits de Sîra, ensuite, qui le situent et le détaillent, avec des chaînes de transmission dont la solidité est examinée par les savants. Certains détails narratifs largement diffusés proviennent de récits dont l'authenticité est discutée : l'application ne les présente pas comme des faits établis. Enfin, le site désigné aujourd'hui comme Ghār Thawr se trouve sur un relief situé au sud de La Mecque, dont l'altitude est indiquée autour de sept cent soixante mètres par une notice patrimoniale saoudienne. Ce repère contemporain ne renseigne ni sur l'état de la cavité au septième siècle, ni sur le chemin exact emprunté. C'est pourquoi la carte de l'application place Thawr comme un repère général, sans coordonnée précise ni tracé d'accès, et pourquoi l'illustration de cette fiche est une étude rocheuse non localisée, et non une vue de la grotte.

Quatrième partie : Synthèse pédagogique.
Retenons trois idées. Premièrement, l'épisode de la grotte est attesté par le Coran comme un moment de refuge et de confiance, sans indication de lieu. Deuxièmement, son rattachement au mont Thawr et l'identité du compagnon proviennent de la tradition de la Sîra, qu'il convient de citer comme telle. Troisièmement, le lieu que l'on visite aujourd'hui est un repère de mémoire, à distinguer d'une reconstitution historique. Comprendre l'Hégire, c'est aussi apprendre à lire ces différentes couches de sources avec rigueur et respect.`
  },
  {
    contentId: "HEG-ETP-03",
    locale: "ar",
    filename: "narration-heg-etp-03-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `غار ثور.

القسم الأول : تحديد الموضوع ونطاقه.
من بين محطات الهجرة، يحتلّ غار ثور مكانة خاصة في الذاكرة الإسلامية؛ إذ تجعل منه كتب السيرة موضع الاحتماء الأول بعد الخروج من مكة، قبل الطريق الطويل إلى يثرب، المدينة المنورة لاحقًا. ولا تسعى هذه البطاقة إلى إعادة تمثيل المشهد، بل إلى التمييز بين ما ورد في القرآن الكريم، وما نقلته كتب السيرة، وما يمكن قوله اليوم عن الموضع نفسه.

القسم الثاني : العناصر المسندة إلى المصادر.
يشير القرآن الكريم إلى هذه الحادثة في سورة التوبة، الآية الأربعين، فيذكر ثاني اثنين إذ هما في الغار، وقولَ أحدهما لصاحبه: لا تحزن إن الله معنا. ولا تسمّي الآية الموضع ولا الصاحب. أمّا تعيين الصاحب بأبي بكر الصديق رضي الله عنه، وربط الغار بجبل ثور، فمصدره روايات السيرة، ومنها ما رواه ابن إسحاق ونقله ابن هشام. ويعرض الرحيق المختوم للمباركفوري، وهو مؤلَّف معاصر، هذا الربط في فصوله المتعلقة بالخروج. وتذكر هذه الروايات أنّ المكوث في الغار دام ليالي معدودة حتى يخفّ الطلب، وأنّ اختيار جهة مخالفة لطريق يثرب كان تدبيرًا لتضليل المطاردين.

القسم الثالث : الاختلافات والحدود.
ينبغي هنا الفصل بين مستويات متعددة: النص القرآني الذي يثبت الحادثة دون تحديد جغرافي؛ ثم روايات السيرة التي تعيّن المكان وتفصّل الأحداث، وأسانيدها موضع نظر عند أهل العلم؛ ثم تفاصيل قصصية ذائعة وردت في روايات تكلّم العلماء في صحتها، فلا يعرضها التطبيق بوصفها حقائق ثابتة. أمّا الموضع المعروف اليوم بغار ثور، فيقع في جبل جنوب مكة، ويُذكر أنّ ارتفاعه نحو سبعمئة وستين مترًا وفق موسوعة سعودية. وهذا المعلم المعاصر لا يدلّ على هيئة الغار في القرن السابع، ولا على الطريق الدقيق الذي سُلك. لذلك تعرض خريطة التطبيق غارَ ثور معلمًا عامًّا دون إحداثيات أو مسار، وما يرافق هذه البطاقة من رسم إنما هو دراسة صخرية غير محددة الموقع، لا صورة للغار.

القسم الرابع : خلاصة تربوية.
نخلص إلى ثلاث أفكار: أولاها أنّ حادثة الغار ثابتة بنص القرآن موضعَ احتماء وتوكّل، دون تعيين للمكان. وثانيتها أنّ ربطها بجبل ثور وتعيين الصاحب مصدرهما روايات السيرة، فيُنسبان إليها. وثالثتها أنّ الموضع الذي يُزار اليوم معلمٌ للذاكرة، يختلف عن إعادة البناء التاريخي. ففهم الهجرة يقتضي أيضًا قراءة طبقات المصادر بدقة وتوقير.`
  },
  {
    contentId: "VIE-01",
    locale: "fr",
    filename: "narration-vie-01-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Espaces domestiques et habitat.

Première partie : Repère et périmètre.
L'exploration de la vie quotidienne à l'époque de la Sîra commence par le cadre le plus intime : l'espace domestique. Loin des palais monumentaux des empires byzantin ou sassanide voisins, l'habitat des cités et des oasis du Hedjaz, à La Mecque comme à Yathrib, se distingue par une architecture vernaculaire sobre, pragmatique et dictée par les ressources du milieu désertique. Cette fiche propose de découvrir l'organisation d'une demeure type du septième siècle, sans prétendre reconstituer le logis d'une figure historique précise.

Deuxième partie : Éléments sourcés.
Les recherches archéologiques conduites sur les sites anciens de la péninsule Arabique mettent en évidence des techniques constructives adaptées aux amplitudes thermiques extrêmes. Les habitations reposent couramment sur des soubassements de pierres locales ou de blocs de basalte issus des étendues volcaniques environnantes, protégeant les murs de l'humidité du sol lors des rares crues d'orage. Les murs sont élevés en briques d'argile séchées au soleil, mêlées de paille hachée pour assurer leur cohésion. L'arbre providentiel des oasis, le palmier dattier, fournit l'essentiel de la charpente : ses troncs refendus servent de poutres maîtresses, tandis qu'un clayonnage de palmes serrées et une épaisse couche de terre battue forment une toiture plate isolante.

Troisième partie : Variantes, silences et limites.
L'organisation des pièces s'articule traditionnellement autour d'une cour intérieure découverte. Cet aménagement introverti remplit une double fonction : il capte l'air frais de la nuit pour ventiler le logis tout en protégeant les activités familiales des regards de la rue et des vents de sable. À l'intérieur, le mobilier est réduit à l'essentiel : nattes de jonc, tapis de laine, outres suspendues pour maintenir l'eau fraîche par évaporation, et coffres en bois pour conserver les étoffes précieuses. À la nuit tombée, l'éclairage repose sur de petites lampes à huile en terre cuite moulée, alimentées à l'huile végétale. Il faut souligner que l'habitat variait sensiblement entre les campements nomades sous tentes de poil tissé et les demeures oasiennes permanentes ; aucune maison universelle n'existait dans l'Arabie du septième siècle.

Quatrième partie : Synthèse pédagogique.
L'espace domestique de la Sîra reflète une harmonie étroite entre ingéniosité humaine et contraintes de l'environnement. La simplicité apparente des matériaux — terre crue, pierre, bois de palmier — dissimule une maîtrise thermique remarquable face à l'aridité. Observer ces espaces dépouillés permet de comprendre le quotidien réel des contemporains de la révélation, fait de sobriété, d'hospitalité et de respect scrupuleux de la sphère familiale.`
  },
  {
    contentId: "VIE-01",
    locale: "ar",
    filename: "narration-vie-01-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `المسكن والحياة اليومية.

القسم الأول : تحديد الموضوع ونطاقه.
تبدأ دراسة الحياة اليومية في عصر السيرة النبوية من الفضاء الأكثر خصوصية: المسكن. فبعيدًا عن القصور الفخمة في الإمبراطوريتين البيزنطية والساسانية، تميزت مساكن مدن الحجاز وواحاته، في مكة ويثرب، بعمارة تقليدية بسيطة وعملية فرضتها طبيعة البيئة الصحراوية ومواردها المتاحة. وتستعرض هذه البطاقة معالم المسكن الحجازي في القرن السابع الميلادي، دون ادعاء تمثيل دار لشخصية محددة.

القسم الثاني : العناصر المسندة إلى المصادر.
تبيّن الشواهد الأثرية في الجزيرة العربية أساليب بناء تكيّفت مع التفاوت الحراري الشديد. فقد أقيمت الجدران في الغالب على أساسات من الحجارة أو صخور البازلت المجلوبة من الحِرار المجاورة، لحماية البناء من مياه السيول الموسمية. أما الجدران فبُنيت من اللَّبِن، وهو طين مخلوط بالتّبن ومجفف تحت الشمس ليمنح الغرف عزلاً حراريًا. وشكّل النخل عماد التسقيف؛ حيث استخدمت جذوعه دعائم وجسورًا رئيسة، وغُطّيت بجريد النخل والحصير، ثم أُحكمت بطبقة سميكة من الطين المرصوص.

القسم الثالث : الاختلافات والحدود.
ينتظم البيت الحجازي غالبًا حول فناء داخلي مكشوف، يوفر تهوية طبيعية للمنزل ويصون خصوصية الأسرة عن الطريق العام وعواصف الرمال. وكان الأثاث غاية في البساطة: بُسُط وحُصُر، وقِرَب تُعلّق لتبريد الماء بالتبخير، وصناديق خشبية لحفظ المتاع. وعند حلول الظلام، استُخدمت سُرُج فخارية صغيرة تُوقد بالزيت النباتي. وينبغي التنبيه إلى تباين أنماط السكن بين بيوت الطين في الواحات المستقرة وبيوت الشَّعْر في البادية؛ إذ لم يكن هناك نمط سكني موحد في أرجاء الجزيرة.

القسم الرابع : خلاصة تربوية.
يجسد المسكن في عصر السيرة توازنًا دقيقًا بين بساطة الموارد والبراعة في مواجهة قسوة المناخ. فاستخدام الطين والحجر وخشب النخل وفّر عزلاً وراحة وظيفية تلائم الحياة الأسرية. والوقوف على هذه البيئة المادية يقرّبنا من واقع العيش في زمن التنزيل، بما تميز به من اقتصاد في العيش وحسن استغلال لما جادت به الطبيعة.`
  }
];

const draftsDir = path.resolve("public/media/drafts");
if (!fs.existsSync(draftsDir)) {
  fs.mkdirSync(draftsDir, { recursive: true });
}

async function generateNarrations() {
  console.log(`Starting generation of ${PILOT_SCRIPTS.length} pilot narrations...`);
  const results = [];

  for (const item of PILOT_SCRIPTS) {
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
  const reportPath = path.resolve("reports/pilot-narrations-generation.json");
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    provider: "OpenRouter",
    model: "minimax/speech-2.8-hd",
    statusNote: "PILOTE_DEMO_NON_VALIDE",
    results
  }, null, 2));

  console.log(`\nFinished! Report saved to ${reportPath}`);
}

generateNarrations();
