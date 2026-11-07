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

const LOT_12_SCRIPTS = [
  {
    contentId: "CHR-19",
    locale: "fr",
    filename: "narration-chr-19-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Épisode du Fossé.

Première partie : Repère et périmètre.
En chawwal de l'an 5 de l'Hégire, en 627, Médine fait face à la plus grande coalition militaire de son histoire. Dix mille guerriers issus de Quraysh, des tribus de Ghatafan et des Banu al-Nadir marchent pour assiéger l'oasis. Face à ce péril existentiel, le Prophète réunit ses compagnons et adopte la proposition visionnaire du Persan Salman al-Farisi : creuser un large fossé défensif barrant le flanc nord découvert de la ville.

Deuxième partie : Éléments sourcés.
Durant six jours d'un labeur épuisant par un froid polaire et une disette aiguë, le Prophète manie la pioche aux côtés de ses compagnons pour creuser la tranchée. Stupéfaits par cet obstacle inconnu des tactiques arabes, les coalisés s'installent dans un siège infructueux d'un mois.
La trahison intérieure des Banu Qurayza menace un temps de prendre la ville à revers. Mais la diplomatie habile de Nu'aym ibn Mas'ud, semant la méfiance entre les chefs ennemis, combinée à une tempête d'un vent glacial qui renverse les tentes et éteint les feux du camp adverse, brise le moral des confédérés qui s'enfuient dans la tourmente. Le Prophète proclame alors que Médine ne subira plus jamais d'invasion.

Troisième partie : Variantes, silences et limites.
La sourate al-Ahzab dépeint avec intensité l'angoisse des croyants lors de ce siège d'usure. L'atlas proscrit toute dramatisation imagée des assauts, privilégiant la reconstitution topographique du tracé du fossé au pied du mont Sal' et la portée stratégique de l'innovation militaire.

Quatrième partie : Synthèse pédagogique.
Trois leçons majeures émergent de la bataille du Fossé. Premièrement, l'ouverture aux techniques étrangères incarnée par Salman al-Farisi prouve la flexibilité pragmatique de la pensée islamique. Deuxièmement, la participation physique du dirigeant aux corvées fortifie la confiance collective. Troisièmement, la ténacité morale face aux coalitions écrasantes transforme l'impasse défensive en suprématie politique.`
  },
  {
    contentId: "CHR-19",
    locale: "ar",
    filename: "narration-chr-19-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `غزوة الخندق.

القسم الأول : تحديد الموضوع ونطاقه.
في شوال من العام الخامس للهجرة، حاصرت الأحزاب المدينة بعشرة آلاف مقاتل من قريش وغطفان وحلفائهم لاستئصال المسلمين. واستشار النبي أصحابه، فأشار سلمان الفارسي بحفر خندق يحمي شمال المدينة المكشوف، في خطة دفاعية عبقرية أذهلت قادة العرب.

القسم الثاني : العناصر المسندة إلى المصادر.
شارك النبي بنفسه في الحفر وتكسير الصخور وسط برد قارس وجوع شديد. ووقف الغزاة عاجزين أمام الخندق فضربوا حصاراً طال شهراً، وتفاقم الخطر بنقض بني قريظة لعهدهم.
غير أن دهاء نعيم بن مسعود في تخذيل صفوف العدو، مصحوباً بريح عاتية أرسلها الله في ليلة شاتية كفأت قدورهم واقتلعت خيامهم، ألقى الرعب في قلوب الأحزاب ففروا مدبرين. وأعلن النبي بعدها نهاية العهد الدفاعي وبدء المبادأة الإسلامية.

القسم الثالث : الاختلافات والحدود.
خلد القرآن أهوال الحصار في سورة الأحزاب بدقة وجدانية عميقة. ويتحرى الأطلس أعلى درجات النزاهة العلمية المانعة لأي تمثيل للأشخاص، مبرزاً الأبعاد الهندسية والقيادية.

القسم الرابع : خلاصة تربوية.
نستخلص من الخندق ثلاث عبر كبرى: أولاها الانفتاح الحضاري والاستفادة من تجارب الأمم كفكرة سلمان. وثانيتها مشاركة القائد الميدانية لشعبه في الشدائد. وثالثتها أن الصبر والثبات كفيلان بإحباط أعتى التحالفات الباطلة.`
  },
  {
    contentId: "CHR-20",
    locale: "fr",
    filename: "narration-chr-20-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Accord d'al-Hudaybiyya.

Première partie : Repère et périmètre.
En dhou al-qi'da de l'an 6 de l'Hégire, en 628, le Prophète s'avance vers La Mecque avec mille quatre cents compagnons sans armes, vêtus du pagne de pèlerinage pour accomplir la Umra. Bloqué à al-Hudaybiyya par la cavalerie mecquoise, il engage des pourparlers diplomatiques qui aboutissent à la signature d'un traité de paix historique de dix ans.

Deuxième partie : Éléments sourcés.
Après le Serment de l'agrément conclu sous l'arbre pour affirmer la détermination des fidèles, le plénipotentiaire qurayshite Suhayl ibn Amr négocie les termes de l'accord. Par une lucidité prophétique d'une hauteur remarquable, Muhammad accepte des concessions de pure forme : effacer le titre de Messager de Dieu sur le traité, ajourner la visite à l'année suivante et restituer les transfuges mecquois.
Ce compromis, qualifié par le Coran de Victoire éclatante, constitue en réalité un triomphe diplomatique majeur : Quraysh reconnaît pour la première fois l'autorité légitime et souveraine de l'État médinois, ouvrant une ère de liberté de conscience qui permettra la diffusion rapide et pacifique du message à travers toute l'Arabie.

Troisième partie : Variantes, silences et limites.
Les chroniques décrivent l'émotion de certains compagnons devant ces clauses avant de comprendre leur portée stratégique. L'application met en valeur ce jalon politique avec une rigueur historique totale, sans reconstitution imagée de la signature.

Quatrième partie : Synthèse pédagogique.
Trois principes gouvernent al-Hudaybiyya. Premièrement, la paix négociée et le désarmement prévalent sur la confrontation armée pour faire triompher les idées. Deuxièmement, la concession sur la forme garantit la victoire sur le fond. Troisièmement, le traité consacre l'universalité de la diplomatie et le respect scrupuleux des engagements contractuels.`
  },
  {
    contentId: "CHR-20",
    locale: "ar",
    filename: "narration-chr-20-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `صلح الحديبية.

القسم الأول : تحديد الموضوع ونطاقه.
في ذي القعدة من العام السادس للهجرة، توجه النبي صلى الله عليه وسلم بألف وأربعمئة معتمر نحو مكة تعظيماً للبيت الحرام. فصدتهم قريش عند الحديبية، لتبدأ مفاوضات دبلوماسية كبرى انتهت بإبرام هدنة تاريخية لعشر سنوات.

القسم الثاني : العناصر المسندة إلى المصادر.
عقب بيعة الرضوان تحت الشجرة، فاوض سهيل بن عمرو ممثلاً لقريش، فقبل النبي بحكمة ثاقبة شروطاً شكلية صعبة كمسح وصف الرسالة وتأجيل العمرة لعام قادم، مؤثراً مصلحة السلم والاستقرار.
وعد القرآن هذا الصلح فتحاً مبيناً؛ إذ انتزع اعتراف قريش بسيادة دولة المدينة، وأتاح مناخاً من الأمان والحرية الفكرية دخلت خلاله أعداد غفيرة في الإسلام تفوق كل ما سبق.

القسم الثالث : الاختلافات والحدود.
توثق كتب السير تفاصيل المعاهدة ومشاعر الصحابة حيالها بدقة تامة. ويلتزم التطبيق بالعرض الوثائقي الرصين لبنود الصلح بعيداً عن أي محاكاة للأشخاص.

القسم الرابع : خلاصة تربوية.
نستخلص من صلح الحديبية ثلاث ركائز سامية: أولاها تقديم خيار السلام والحوار الفكري على لغة السلاح. وثانيتها الحكمة في التنازل عن الشكليات لحفظ جوهر المقاصد الكبرى. وثالثتها الوفاء بالعهود كعنوان للشرف والسيادة في الإسلام.`
  },
  {
    contentId: "VIE-15",
    locale: "fr",
    filename: "narration-vie-15-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Travail du cuir.

Première partie : Repère et périmètre.
Dans l'économie pastorale et caravanière du Hedjaz, le cuir constituait la ressource technique indispensable par excellence. Des outres de transport aux harnais de bât, en passant par les sandales et les carquois, le travail des peaux de bêtes fournissait un matériau souple, résistant et imperméable.

Deuxième partie : Éléments sourcés.
Le tannage s'opérait avec les gousses d'acacia qaradh et l'écorce de grenadier qui traitaient les peaux d'animaux. L'artisan cordonnier ou bourrelier employait l'alêne OBJ-013 à manche d'os poli pour percer les cuirs sans les déchirer, assemblant les brides et lanières avec les aiguilles et les fils filés au fuseau OBJ-009 ou tissés à la navette OBJ-012.
Les recueils rapportent le hadith d'Ibn Abbas dans Sahih Muslim (366) : Toute peau tannée est purifiée. Dans l'école malékite de référence (al-Muwatta' de l'imam Malik, al-Risala d'Ibn Abi Zayd, Mukhtasar Khalil), la peau d'un animal abattu rituellement (mudhakkat) est pure en tout usage, tandis que selon l'avis retenu (al-mashhur), la peau d'une bête morte sans abattage rituel (mayta) ne devient pas rituellement pure pour la prière, mais son usage est autorisé par dispense (rukhsa) pour les matières sèches (al-yabisat) et l'eau.

Troisième partie : Variantes, silences et limites.
En jurisprudence, un avis alternatif (rapporté d'Ibn Wahb chez les malékites et retenu par les écoles chaféite et hanafite, en conciliation avec le hadith de Abd Allah ibn Ukaym) considère que le tannage purifie la peau de la mayta (hors porc et chien) pour tout usage ; cet arbitrage demeure à faire valider par un spécialiste. L'archéologie confirme par ailleurs l'excellence des cuirs mecquois exportés jusqu'en Abyssinie et en Syrie. L'atlas expose ces pièces sous un angle fonctionnel dépouillé, sans aucune mise en scène humaine.

Quatrième partie : Synthèse pédagogique.
Trois leçons matérielles éclairent cet artisanat. Premièrement, le tannage végétal transforme une matière périssable en équipement durable. Deuxièmement, l'alêne OBJ-013 illustre la précision de l'outillage préindustriel. Troisièmement, la valorisation encadrée du cuir incarne une gestion sobre et vertueuse des ressources animales.`
  },
  {
    contentId: "VIE-15",
    locale: "ar",
    filename: "narration-vie-15-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `صناعة الجلود.

القسم الأول : تحديد الموضوع ونطاقه.
مثلت الجلود المورد الصناعي الأهم في الحجاز؛ حيث اعتمدت عليها القوافل والبيوت في صنع القرب والأحذية والأسفاط وأدوات السفر لمرونتها ومتانتها الفائقة.

القسم الثاني : العناصر المسندة إلى المصادر.
دُبغت الجلود بنبات القرظ المحلي وقشور الرمان. وكان المخرز OBJ-013 أداة الحرفي الأساسية لثقب الأديم وخياطة السيور، متكاملاً مع أدوات الفخار OBJ-011 ومكوك النسيج OBJ-012.
وورد في صحيح مسلم (366) حديث ابن عباس رضي الله عنهما: أيما إهاب دبغ فقد طهر. وفي المذهب المالكي المعتمد (الموطأ للإمام مالك، والرسالة لابن أبي زيد، ومختصر خليل)، فإن جلد المذكاة طاهر مطلقاً، أما جلد الميتة فالمشهور أنه لا يطهر بالدباغ للصلاة عليه، بل يُرخّص في استعماله في اليابسات والماء دون المائعات الدسمة حفظاً للموارد من الإهدار.

القسم الثالث : الاختلافات والحدود.
في الفقه، ذهب ابن وهب من المالكية والشافعية والحنفية إلى طهارة جلد الميتة بالدباغ في سائر الاستعمالات، جمعاً بين حديث ابن عباس وحديث عبد الله بن عكيم، وهو ترجيح يحتاج إلى اعتماد مختص. وتثبت الوثائق شهرة الأدَم الحجازي في أسواق الشام واليمن، ويلتزم التطبيق بالعرض المتحفي المجرد للأدوات الجلدية دون أي تمثيل للأفراد.

القسم الرابع : خلاصة تربوية.
نستخلص من دباغة الجلود ثلاث فوائد: أولاها تدوير موارد البيئة واستثمارها بكفاءة وفق الضوابط الشرعية. وثانيتها براعة الأدوات البسيطة كالمخرز في إتقان الصنعة. وثالثتها تشريع النظافة والانضباط الفقهي في الانتفاع بالموارد المادية.`
  },
  {
    contentId: "HEG-DOS-10",
    locale: "fr",
    filename: "narration-heg-dos-10-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Variantes et incertitudes de l'itinéraire.

Première partie : Repère et périmètre.
La reconstitution précise du parcours de l'Hégire à travers les reliefs du Hedjaz pose à la géographie historique la question des variantes toponymiques et des divergences textuelles entre les annales anciennes d'Ibn Ishaq, d'Ibn Sa'd et d'al-Tabari.

Deuxième partie : Éléments sourcés.
Si les grands jalons du départ du mont Thawr vers le littoral de la Tihama puis la remontée nord-est vers Quba et Médine sont incontestables, plusieurs micro-stations et noms d'oueds ont évolué au fil des siècles.
De plus, la nature clandestine du voyage a conduit le guide Abd Allah ibn Urayqit à contourner les passages obligés et à emprunter des sentiers de crêtes rocailleuses pour effacer toute trace, expliquant pourquoi certains récits rapportent des haltes complémentaires sans se contredire.

Troisième partie : Variantes, silences et limites.
L'application de la Sîra distingue rigoureusement les segments fermement attestés par la topographie des passages probables documentés avec nuance, évitant tout tracé dogmatique.

Quatrième partie : Synthèse pédagogique.
Trois principes méthodologiques guident cette approche. Premièrement, la reconnaissance loyale des lacunes textuelles honore l'intégrité scientifique. Deuxièmement, la tactique d'évitement bédouine explique les bifurcations du voyage. Troisièmement, la cartographie interactive sert la vérité historique sans céder à la fiction romancée.`
  },
  {
    contentId: "HEG-DOS-10",
    locale: "ar",
    filename: "narration-heg-dos-10-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `اختلاف الروايات وعدم يقين المسار.

القسم الأول : تحديد الموضوع ونطاقه.
تتطلب دراسة مسار الهجرة النبوية فحصاً نقدياً دقيقاً للروايات الجغرافية؛ فبينما تتفق المصادر على الاتجاه الساحلي العام، تتباين تفاصيل بعض المنازل والشعاب الوعرة في كتب السير.

القسم الثاني : العناصر المسندة إلى المصادر.
يرجع تباين الروايات إلى تغير أسماء المواضع عبر الزمن، وإلى حنكة الدليل ابن أريقط في تنويع المسالك على الصخور الصماء لإخفاء الأثر عن عيون قريش.
وقد بذل المؤرخون والجغرافيون جهوداً معاصرة لمطابقة أسماء الأودية مع الخرائط وصور الأقمار الصناعية لتحديد أدق المسارات الممكنة.

القسم الثالث : الاختلافات والحدود.
يعتمد الأطلس منهجية نقدية تفرق بين المحطات الثابتة يقيناً كالغار وقباء، وبين المقاطع التقديرية، صيانة للأمانة العلمية.

القسم الرابع : خلاصة تربوية.
نستخلص من فحص المسار ثلاث ركائز: أولاها تحري الدقة والنزاهة في توثيق التاريخ. وثانيتها إدراك البعد الأمني في تنويع خطوط السير في الصحراء. وثالثتها احترام حدود المعرفة العلمية المتاحة دون اختلاق افتراضي.`
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
  console.log("Starting generation of 8 narrations for Lot 12...");
  const results = [];
  for (const script of LOT_12_SCRIPTS) {
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
    statusNote: "LOT_12_DEMO_NON_VALIDE",
    results
  };

  fs.writeFileSync("reports/lot-12-narrations-generation.json", JSON.stringify(report, null, 2));
  console.log("\nFinished Lot 12! Report saved to " + path.resolve("reports/lot-12-narrations-generation.json"));
}

main().catch(err => {
  console.error("Fatal in main:", err);
  process.exit(1);
});
