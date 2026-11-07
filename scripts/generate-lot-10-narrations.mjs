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

const LOT_10_SCRIPTS = [
  {
    contentId: "CHR-15",
    locale: "fr",
    filename: "narration-chr-15-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Mosquée et vie communautaire.

Première partie : Repère et périmètre.
Dès son arrivée à Médine à l'automne 622, le premier acte d'édification du Prophète est la construction de la Mosquée, Masjid al-Nabawi, à l'emplacement exact où s'était agenouillée sa chamelle. Cet édifice d'une sobriété exemplaire ne constitue pas seulement un sanctuaire pour la prière rituelle, mais le véritable centre civique, délibératif, diplomatique et éducatif de la jeune société médinoise.

Deuxième partie : Éléments sourcés.
La mosquée est bâtie avec les matériaux immédiats de l'oasis : murs de briques de terre crue et pierres basaltiques, colonnes formées de troncs de palmiers et toiture de palmes nattées. Le Prophète participe physiquement au chantier aux côtés des Muhajirun mecquois et des Ansar médinois, scellant par l'effort partagé la cohésion de la communauté.
Au fond de l'enclos, sous l'auvent d'al-Suffa, logent les compagnons démunis et voyageurs sans toit, comme Abu Hurayra. Ce lieu devient la première académie de l'Islam où l'on étudie le Coran et le droit avant de transmettre ces enseignements aux tribus bédouines. Parallèlement, l'espace accueille les délibérations politiques, les ambassades étrangères et le soin des blessés. Enfin, l'appel à la prière proclamé par la voix retentissante de Bilal ibn Rabah depuis le plus haut toit avoisinant rythme désormais la vie de toute l'oasis cinq fois par jour.

Troisième partie : Variantes, silences et limites.
Les récits s'accordent sur les dimensions initiales modestes du sanctuaire et son agrandissement ultérieur. L'application observe un aniconisme strict : aucune représentation humaine de la prière ou de la construction, l'évocation se concentrant sur les matériaux bruts et l'esprit d'égalité républicaine.

Quatrième partie : Synthèse pédagogique.
Trois principes fondent cette institution. Premièrement, la mosquée réunit en un même lieu le spirituel et le temporel dans une transparence totale. Deuxièmement, l'asile de la Suffa pose les bases de la solidarité institutionnelle et de la diffusion du savoir. Troisièmement, la voix de Bilal institue une démocratie spirituelle où le mérite moral l'emporte sur l'origine ethnique.`
  },
  {
    contentId: "CHR-15",
    locale: "ar",
    filename: "narration-chr-15-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `المسجد والحياة الجماعية.

القسم الأول : تحديد الموضوع ونطاقه.
شكل بناء المسجد النبوي الشريف في خريف عام 622 للميلاد أول عمل عمراني واجتماعي للنبي صلى الله عليه وسلم في يثرب. ولم يكن المسجد موضعاً للصلاة فحسب، بل كان داراً للشورى ومركزاً للقيادة ومعهداً للتعليم ومأوى للتكافل بين أبناء المجتمع الناشئ.

القسم الثاني : العناصر المسندة إلى المصادر.
شُيد المسجد بخامات البيئة المحلية البسيطة: جدران من اللبن والطين، وأعمدة من جذوع النخيل، وسقف من جريدها، وفراش من حصباء الوادي. وشارك النبي بيده في حمل اللبن مع المهاجرين والأنصار، مما رسخ روح المساواة ونبذ الطبقية.
وفي ركن المسجد، خُصصت «الصفة» لإيواء فقراء المهاجرين والغرباء كأبي هريرة، فكانت أول جامعة إسلامية تُخرّج الدعاة والمعلمين. كما شهدت رحاب المسجد استقبال الوفود ومداواة الجرحى. وشُرع الأذان بصوت بلال بن رباح الشجي، ليعلن خمس مرات يومياً وحدة الأمة وسقوط الفوارق الجاهلية.

القسم الثالث : الاختلافات والحدود.
تتفق الروايات التاريخية المعتمدة على تفاصيل بناء المسجد وتواضعه المادي، مع ضبط لمراحله التوسعية اللاحقة. ويلتزم الأطلس بالوقار المنهجي؛ فلا تمثيل للأشخاص في الصلاة أو البناء، بل تركيز على عظمة الدلالة وتكامل وظائف المسجد الحضارية.

القسم الرابع : خلاصة تربوية.
نستخلص من بناء المسجد ثلاث دلالات مركزية: أولاها أن الاجتماع في العبادة هو الركيزة الأساسية لوحدة الأمة وسيادتها. وثانيتها أن كفالة أهل الصفة جسدت مبدأ العدالة الاجتماعية ورعاية العلم. وثالثتها أن الأذان صوت الحرية والكرامة الإنسانية الصادح في الآفاق.`
  },
  {
    contentId: "CHR-16",
    locale: "fr",
    filename: "narration-chr-16-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Organisation sociale et accords à Médine.

Première partie : Repère et périmètre.
À Médine, l'arrivée des émigrants mecquois dépourvus de ressources et la diversité des populations de l'oasis — tribus arabes des Aws et Khazraj et clans juifs des Banu Qaynuqa, al-Nadir et Qurayza — exigeaient une régulation institutionnelle novatrice. Le Prophète y répond par deux actes majeurs : le pacte de fraternisation et la Constitution de Médine.

Deuxième partie : Éléments sourcés.
Le pacte de fraternisation associe chaque émigrant de La Mecque à un auxiliaire médinois. L'Ansar partage avec son frère Muhajir son logis, ses récoltes et son capital, dans un élan de générosité immortalisé par le Coran. Avec dignité, Abd al-Rahman ibn Awf demande simplement qu'on lui indique le marché pour s'y établir par son propre labeur.
Parallèlement, la rédaction de la Sahifat al-Madina établit la première charte politique écrite d'Arabie. Ce texte contractuel regroupe musulmans, juifs et alliés en une Oumma territoriale solidaire. Chacun y conserve sa liberté religieuse et ses biens, avec l'obligation de concourir à la défense commune de Médine contre toute agression extérieure et de déférer les litiges au jugement impartial du Messager.

Troisième partie : Variantes, silences et limites.
Le texte de la charte nous a été transmis intégralement par Ibn Ishaq et Abu Ubayd. L'application examine ce document fondateur dans sa rigueur constitutionnelle, proscrivant toute caricature figurative et exaltant la naissance de l'État de droit.

Quatrième partie : Synthèse pédagogique.
Trois principes gouvernent cette refondation. Premièrement, la fraternisation résout la crise des réfugiés par la solidarité active sans assistanat passif. Deuxièmement, la Constitution de Médine consacre le pluralisme religieux et la liberté de conscience. Troisièmement, le pacte substitue la primauté de la loi et de la citoyenneté à la vengeance tribale ancestrale.`
  },
  {
    contentId: "CHR-16",
    locale: "ar",
    filename: "narration-chr-16-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `التنظيم الاجتماعي والعهود في المدينة.

القسم الأول : تحديد الموضوع ونطاقه.
واجه النبي صلى الله عليه وسلم في المدينة نسيجاً مجتمعياً مركباً؛ فقر المهاجرين، والنزاعات القديمة بين الأوس والخزرج، والوجود العريق للقبائل اليهودية. فأسس البناء الاجتماعي والسياسي على دعامتين تاريخيتين: «المؤاخاة» الإنسانية، و«وثيقة المدينة» الدستورية.

القسم الثاني : العناصر المسندة إلى المصادر.
أرسى النبي عقد المؤاخاة بين المهاجرين والأنصار، فقاسم الأنصاري أخاه المهاجر داره ومطعمه وتجارته في أسمى صور التضامن. وبرزت عفة المهاجرين في موقف عبد الرحمن بن عوف الذي قال لأخيه سعد بن الربيع: دلني على السوق، معتمداً على كده وجهده.
ثم صاغ النبي «وثيقة المدينة» التي وحدت سكان الواحة من مسلمين ويهود في «أمة واحدة من دون الناس» في إطار المواطنة والدفاع المشترك. وضمنت الوثيقة حرية الاعتقاد وحرمة الأموال والاستقلال المالي لكل طائفة، مع الالتزام بالدفاع عن يثرب ضد أي غزو خارجي ورد النزاعات الكبرى إلى قضاء الله ورسوله.

القسم الثالث : الاختلافات والحدود.
حفظت المصادر التاريخية نصوص الوثيقة بدقة متناهية تشهد بسبقها الدستوري العالمي. ويعرض الأطلس هذا الميثاق بعين التقدير الوثائقي المجرد، بعيداً عن أي محاكاة تشخيصية للأطراف.

القسم الرابع : خلاصة تربوية.
نستحضر من هذه العهود ثلاث ركائز سامية: أولاها أن التكافل العملي هو الحل الأمثل للأزمات الاجتماعية. وثانيتها أن وثيقة المدينة أسست لأول نموذج للتعايش الديني والمواطنة المتكافئة. وثالثتها استبدال سيادة القانون والعدالة الاجتماعية بالفوضى القبلية والانتقام العشائري.`
  },
  {
    contentId: "VIE-12",
    locale: "fr",
    filename: "narration-vie-12-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Chaussures et accessoires.

Première partie : Repère et périmètre.
Sur les sols volcaniques et caillouteux du Hedjaz, la protection de la marche constituait un enjeu sanitaire et matériel de premier ordre. Évoluer pieds nus sur les scories acérées des harra ou les sables surchauffés exposait les habitants à des blessures incapacitantes. La confection de sandales de cuir et d'accessoires de voyage formait ainsi l'une des branches artisanales les plus développées de la péninsule.

Deuxième partie : Éléments sourcés.
La sandale traditionnelle al-na'l, représentée par l'objet OBJ-008, était taillée dans une semelle de cuir de bœuf ou de chameau tannée aux écorces d'acacia. Deux lanières assuraient sa fixation ergonomique : le qibal enserrant le gros orteil et le shis maintenant le cou-de-pied. Cette structure ouverte offrait une ventilation optimale tout en isolant la plante du pied de la chaleur du sol.
Pour compléter cet équipement, les habitants portaient des ceintures de cuir ou de laine pour maintenir l'izar et suspendre les outres ou couteaux, tandis que le peigne OBJ-010 servait à la toilette quotidienne des cheveux et de la barbe après les ablutions. Le fuseau traditionnel OBJ-009 permettait de filer à domicile les lanières et les cordonnets nécessaires à la réparation continue des chaussures, le Prophète donnant l'exemple en réparant lui-même ses sandales.

Troisième partie : Variantes, silences et limites.
Les fouilles archéologiques en Arabie attestent d'une continuité séculaire dans la forme de ces sandales à brides doubles. L'application présente ces artefacts dans leur pureté matérielle et fonctionnelle, sans aucune figuration corporelle.

Quatrième partie : Synthèse pédagogique.
Trois leçons matérielles éclairent cet artisanat. Premièrement, la sandale à lanières allie simplicité de fabrication et parfaite adaptation biomécanique au terrain désertique. Deuxièmement, la pratique du raccommodage valorise le soin et l'économie des biens contre le gaspillage. Troisièmement, l'attention portée à la propreté des pieds et de la chaussure s'intègre harmonieusement dans l'éthique de la pureté rituelle.`
  },
  {
    contentId: "VIE-12",
    locale: "ar",
    filename: "narration-vie-12-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الأحذية والملحقات.

القسم الأول : تحديد الموضوع ونطاقه.
مثلت حماية الأقدام في بيئة الحجاز الصخرية الوعرة ضرورة صحية أساسية؛ فالمشي حافياً فوق حجارة الحرات البركانية أو رمضاء الصحراء المحرقة يعرض المرء لإصابات خطيرة. لذا ازدهرت صناعة النعال والأحزمة الجلدية كحرفة نفعية ملازمة لحياة الحضر والبادية.

القسم الثاني : العناصر المسندة إلى المصادر.
صُنعت النعل العربية التراثية كالموثقة في القطعة OBJ-008 من جلد سميك مدبوغ بالقرظ، وثُبتت بشراكين متقنين: القبال بين الإبهام وما يليه، والشسع على ظاهر القدم، مما يضمن ثبات الخطوة وتهوية القدم في شدة القيظ.
واستخدم الناس الأحزمة لشد الإزار وحمل الأدوات الخفيفة، والمشط الخشبي OBJ-010 لترجيل الشعر واللحية. كما استُعمل المغزل OBJ-009 لغزل الخيوط الكتانية والجلدية القوية لإصلاح النعال وخياطتها، حيث كان النبي صلى الله عليه وسلم يخصف نعله بيده الشريفة تعليماً للتواضع وصيانة للمتاع.

القسم الثالث : الاختلافات والحدود.
تثبت الكشوف الأثرية في الجزيرة العربية استقرار هذا النمط من النعال عبر العصور لجودته الوظيفية. ويلتزم التطبيق بالعرض المتحفي الرصين للأدوات والنعال دون تجسيد للأشخاص.

القسم الرابع : خلاصة تربوية.
نستخلص من صناعة النعال ثلاث عبر عملية: أولاها البراعة في تطويع جلود الأنعام لتأمين سلامة المسافر بأبسط الوسائل. وثانيتها خلق التواضع وترشيد الاستهلاك بإصلاح الأحذية بدل إتلافها. وثالثتها اقتران النظافة الشخصية بالحرص على طهارة الملبس ووقار الهيئة.`
  },
  {
    contentId: "HEG-DOS-09",
    locale: "fr",
    filename: "narration-heg-dos-09-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Conditions et paysages du trajet.

Première partie : Repère et périmètre.
Le périple de l'Hégire reliant La Mecque à Médine sur près de cinq cents kilomètres d'un tracé dérobé s'inscrit dans l'un des reliefs les plus austères d'Arabie. Accomplir cette marche au début de l'automne, sous un soleil impitoyable et dans la clandestinité, imposait une maîtrise consommée de la topographie, des haltes nocturnes et des réserves hydriques.

Deuxième partie : Éléments sourcés.
Le guide Abd Allah ibn Urayqit engage Muhammad et Abu Bakr sur les rivages de la Tihama longeant la mer Rouge, loin de la route caravanière classique surveillée par Quraysh. Le paysage y est fait de plaines sableuses infinies, de cordons de dunes et de sebkhas salines où la réverbération solaire et le vent sec brûlent la gorge des marcheurs. Les haltes s'effectuent à l'ombre frugale de bouquets d'acacias et de tamaris.
Puis la piste remonte vers le nord à travers les contreforts du Sarawat. Le sable cède la place aux harra, vastes plateaux de lave basaltique noire et coupante nés d'anciennes éruptions, où les montures cheminent avec précaution dans des lits d'oueds caillouteux menacés par des crues subites. Malgré cette désolation minérale, le parcours est illuminé par la halte sous la tente d'Umm Ma'bad, avant d'atteindre la fraîcheur bienfaisante des palmeraies de Quba.

Troisième partie : Variantes, silences et limites.
L'analyse géographique confirme la cohérence de ce tracé côtier de contournement. L'application expose ces paysages dans leur réalité géomorphologique exacte, excluant toute dramatisation fictive pour valoriser la vérité du terrain.

Quatrième partie : Synthèse pédagogique.
Trois clés de lecture résument cette traversée. Premièrement, le franchissement des sables et des harra met en relief une endurance physique et morale exceptionnelle. Deuxièmement, le choix d'une route côtière méconnue démontre le génie tactique de l'évitement. Troisièmement, ce trajet transforme un désert hostile en couloir historique vers la liberté et la justice.`
  },
  {
    contentId: "HEG-DOS-09",
    locale: "ar",
    filename: "narration-heg-dos-09-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `ظروف الطريق وطبيعته.

القسم الأول : تحديد الموضوع ونطاقه.
امتد مسار الهجرة النبوية على قرابة خمسمئة كيلومتر في تضاريس بالغة القسوة والتباين في الحجاز. وتطلب قطع هذا الدرب الالتفافي في مطلع الخريف تحت وطأة القيظ السري دراية تامة بمصادر المياه ومواضع الكمون ومسالك الأودية.

القسم الثاني : العناصر المسندة إلى المصادر.
سلك الركب الشريف طريق الساحل في سهول تهامة بمحاذاة البحر الأحمر لتفادي دوريات قريش. وتنوعت المشاهد بين رمال متحركة وسباخ مالحة تعكس لهيب الشمس، مما فرض السير ليلاً والكمون نهاراً تحت شجر السمر.
ثم صعد المسار شمالاً ليخترق حرات اللابة البركانية الصخرية الحادة وشعاب جبال السروات القاحلة، حيث عانت الرواحل وعورة الصخور السوداء في مجاري سيول جافة. وتخللت الرحلة محطات البركة كما في خيمة أم معبد، حتى أشرقت أنوار واحة قباء.

القسم الثالث : الاختلافات والحدود.
تؤكد الدراسات الجغرافية والتاريخية دقة هذا المسار الساحلي ووعورته. ويلتزم الأطلس بالتوثيق الطبوغرافي المجرد للبيئة الطبيعية دون أي تجسيد حسي للأشخاص.

القسم الرابع : خلاصة تربوية.
نستخلص من طبيعة مسار الهجرة ثلاث دلالات كبرى: أولاها عظمة الصبر والجلد في مواجهة قسوة المناخ والصحراء. وثانيتها الذكاء الميداني في اختيار الطرق البديلة لصون الأرواح. وثالثتها أن طريق المبادئ الكبرى يبدأ من مغالبة الصعاب وتذليل المستحيل بثبات اليقين.`
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
  console.log("Starting generation of 8 narrations for Lot 10...");
  const results = [];
  for (const script of LOT_10_SCRIPTS) {
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
    statusNote: "LOT_10_DEMO_NON_VALIDE",
    results
  };

  fs.writeFileSync("reports/lot-10-narrations-generation.json", JSON.stringify(report, null, 2));
  console.log("\nFinished Lot 10! Report saved to " + path.resolve("reports/lot-10-narrations-generation.json"));
}

main().catch(err => {
  console.error("Fatal in main:", err);
  process.exit(1);
});
