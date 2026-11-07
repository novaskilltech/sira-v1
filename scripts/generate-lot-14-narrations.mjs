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

const LOT_14_SCRIPTS = [
  {
    contentId: "CHR-23",
    locale: "fr",
    filename: "narration-chr-23-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Pèlerinage d'adieu.

Première partie : Repère et périmètre.
En dhou al-hijja de l'an 10 de l'Hégire, en mars 632, le Prophète accomplit son pèlerinage d'adieu en présence de plus de cent mille fidèles. Ce rassemblement solennel sur la plaine d'Arafat constitue le couronnement spirituel et éthique de la Révélation.

Deuxième partie : Éléments sourcés.
Monté sur sa chamelle al-Qaswa, Muhammad proclame son Sermon d'adieu historique : l'inviolabilité absolue de la vie humaine, des biens et de l'honneur des personnes, l'abolition définitive des vengeances de sang et de l'usure prédatrice.
Il affirme l'égalité totale des êtres humains, sans distinction de race ou d'origine, la piété étant le seul critère de noblesse, et recommande avec ferveur la bienveillance envers les femmes. C'est à Arafat que descend le verset de parachèvement : Aujourd'hui, J'ai parachevé pour vous votre religion et accompli sur vous Mon bienfait.

Troisième partie : Variantes, silences et limites.
Les recueils de hadiths ont transmis le sermon avec une exactitude scrupuleuse. L'atlas respecte un aniconisme total : aucune image humaine des foules ni du mont Arafat habité, l'attention portant sur la portée universelle des droits fondamentaux énoncés.

Quatrième partie : Synthèse pédagogique.
Trois piliers consacrent ce sermon. Premièrement, la sacralité de la dignité humaine fonde la justice sociale. Deuxièmement, l'égalité raciale universelle abolit tous les préjugés tribaux. Troisièmement, le parachèvement de la foi scelle l'autonomie et la responsabilité de la communauté des croyants.`
  },
  {
    contentId: "CHR-23",
    locale: "ar",
    filename: "narration-chr-23-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `حجة الوداع.

القسم الأول : تحديد الموضوع ونطاقه.
في ذي الحجة من العام العاشر للهجرة، شهد صعيد عرفات حجة الوداع بحضور أكثر من مئة ألف مسلم؛ في مشهد تاريخي مهيب ختم بلاغ الرسالة وثبت مناسك الحج.

القسم الثاني : العناصر المسندة إلى المصادر.
ألقى النبي على ناقته القصواء خطبة الوداع الجامعة؛ أعلن فيها حرمة الدماء والأموال والأعراض، ووضع ربا الجاهلية وثاراتها، وأصل المساواة الإنسانية الكاملة فلا فضل لعربي على أعجمي إلا بالتقوى، وأوصى بالنساء خيراً.
واستشهد الأمة على البلاغ ثم نزل قوله تعالى: اليوم أكملت لكم دينكم وأتممت عليكم نعمتي ورضيت لكم الإسلام ديناً.

القسم الثالث : الاختلافات والحدود.
توثق الصحاح نصوص الخطبة المباركة بإجماع قطعي. ويلتزم التطبيق بالتجرد التراثي المانع لأي تمثيل للأشخاص، مبرزاً الأبعاد الحقوقية الكبرى.

القسم الرابع : خلاصة تربوية.
نستخلص من حجة الوداع ثلاث ركائز سامية: أولاها حرمة حقوق الإنسان وكرامته. وثانيتها نبذ العنصرية والتمييز العرقي. وثالثتها استقرار أركان الشريعة بتمام البلاغ ونيل الرضا الإلهي.`
  },
  {
    contentId: "CHR-24",
    locale: "fr",
    filename: "narration-chr-24-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Derniers jours et décès.

Première partie : Repère et périmètre.
Au terme du mois de safar de l'an 11 de l'Hégire, en juin 632, le Prophète est frappé par une fièvre aiguë. Conscient de son départ imminent, il prépare la communauté à sa succession spirituelle et institutionnelle avec une transparence bouleversante.

Deuxième partie : Éléments sourcés.
Soigné dans la demeure d'A'isha, le Prophète demande à ses compagnons de régler toute dette qu'il pourrait avoir envers eux, offrant son propre corps et ses biens en réparation. Ne pouvant plus se tenir debout, il désigne expressément Abu Bakr pour diriger la prière commune.
Le lundi 12 Rabi' al-Awwal de l'an 11, contemplant une dernière fois ses fidèles en prière avec un sourire d'apaisement, le Prophète rejoint le Très-Haut Compagnon. Devant le désarroi général, Abu Bakr proclame la parole fondatrice : Que celui qui adorait Muhammad sache que Muhammad est mort ; mais que celui qui adore Dieu sache que Dieu est Vivant et ne meurt jamais !

Troisième partie : Variantes, silences et limites.
La chronologie des derniers jours fait l'objet d'un consensus historique unanime. L'application observe une pudeur et un aniconisme absolus, refusant toute dramatisation figurative de l'agonie pour honorer la sérénité du passage.

Quatrième partie : Synthèse pédagogique.
Trois vérités émergent de ce dénouement. Premièrement, la mortalité du Prophète rappelle que nul homme n'est divin. Deuxièmement, la désignation d'Abu Bakr à la prière assure la continuité sereine de la gouvernance. Troisièmement, la foi islamique repose sur Dieu l'Éternel et non sur la présence physique d'un individu mortel.`
  },
  {
    contentId: "CHR-24",
    locale: "ar",
    filename: "narration-chr-24-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الأيام الأخيرة والوفاة.

القسم الأول : تحديد الموضوع ونطاقه.
في ربيع الأول من العام الحادي عشر للهجرة، اشتدت الحمى برسول الله صلى الله عليه وسلم، فضرب في أيامه الأخيرة أروع الأمثلة في العدل والشفافية وتوديع أمته بيقين وثبات.

القسم الثاني : العناصر المسندة إلى المصادر.
مُرّض النبي في بيت عائشة، وعرض نفسه للقصاص من كل مظلمة، وأمر أبا بكر أن يصلي بالناس عند اشتداد الوجع.
وفي يوم الاثنين الثاني عشر من ربيع الأول، انتقل إلى الرفيق الأعلى، وثبت أبو بكر القلوب بكلمته التاريخية: ألا من كان يعبد محمداً فإن محمداً قد مات، ومن كان يعبد الله فإن الله حي لا يموت.

القسم الثالث : الاختلافات والحدود.
أجمعت كتب السير والصحاح على تفاصيل الوفاة وموضع الدفن الشريف في حجرة عائشة. ويلتزم التطبيق بالوقار التام الخالي من أي تمثيل للجسد الشريف.

القسم الرابع : خلاصة تربوية.
نستخلص من هذه الأيام ثلاث عبر بليغة: أولاها بشرية الأنبياء وبقاء دين الله الخالد. وثانيتها تقديم أبي بكر للصلاة رسخ استقرار الدولة. وثالثتها أن كمال الإيمان يتحقق بالارتباط بالحي القيوم الذي لا يموت.`
  },
  {
    contentId: "VIE-18",
    locale: "fr",
    filename: "narration-vie-18-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Circulation des produits.

Première partie : Repère et périmètre.
Dans l'Arabie du VIIe siècle, la circulation des marchandises reliait étroitement les oasis agricoles aux centres caravaniers. Loin de vivre en autarcie, Médine et La Mecque s'intégraient dans de vastes circuits marchands où s'échangeaient dattes, céréales, cuirs et tissus.

Deuxième partie : Éléments sourcés.
Les caravanes de dromadaires acheminaient les récoltes de dattes vers La Mecque et rapportaient le blé, l'huile et les toiles. Au marché, les transactions s'effectuaient avec les monnaies pesées à la balance OBJ-014 et les poids de mesure OBJ-015, ou par le contrat de vente à terme salam, régulé par le Prophète pour protéger les revenus des producteurs sans spéculation.

Troisième partie : Variantes, silences et limites.
Les sources juridiques précisent les conditions de licéité des contrats de vente ambulante et de transport. L'application examine ces mécanismes économiques avec une fidélité archéologique intégrale.

Quatrième partie : Synthèse pédagogique.
Trois principes régissent cette circulation. Premièrement, la fluidité des transports caravaniers garantit la sécurité alimentaire des cités. Deuxièmement, les instruments de pesée OBJ-014 et OBJ-015 sécurisent la confiance mutuelle. Troisièmement, la morale commerciale proscrit tout péage arbitraire au profit de l'abondance partagée.`
  },
  {
    contentId: "VIE-18",
    locale: "ar",
    filename: "narration-vie-18-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `تداول المنتجات.

القسم الأول : تحديد الموضوع ونطاقه.
قامت حركة التجارة في الحجاز على شبكة قوافل نشطة ربطت الواحات بالمدن والأسواق الكبرى، مما حقق توازناً غذائياً واقتصادياً للمجتمع.

القسم الثاني : العناصر المسندة إلى المصادر.
نُقلت التمور والحبوب على قوافل الإبل، وبِيعت في السوق نَقداً بالعملات الموزونة بالميزان OBJ-014 وأوزان القياس OBJ-015، أو بعقد السَّلَم المنضبط بالشروط الشرعية لحماية حقوق المزارعين.

القسم الثالث : الاختلافات والحدود.
تؤكد كتب الفقه استقرار عقود البيع والتجارة في العهد النبوي. ويلتزم التطبيق بالعرض المتحفي النظيف للأدوات دون تجسيد للأشخاص.

القسم الرابع : خلاصة تربوية.
نستخلص من تداول البضائع ثلاث فوائد: أولاها مرونة القوافل في تأمين الإمداد التمويني. وثانيتها دور الميزان الدقيق في إحقاق الحقوق. وثالثتها تشجيع النشاط الاقتصادي العادل الخالي من المكوس والظلم.`
  },
  {
    contentId: "HEG-DOS-11",
    locale: "fr",
    filename: "narration-heg-dos-11-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Compagnonnage et entraide.

Première partie : Repère et périmètre.
L'épopée de l'Hégire illustre au plus haut point la fraternité spirituelle et la solidarité héroïque unissant le Prophète à Abu Bakr al-Siddiq et à un réseau d'entraide familial dévoué.

Deuxième partie : Éléments sourcés.
Dès l'annonce du départ, Abu Bakr consacre ses biens et ses montures à la mission. Dans la grotte du mont Thawr, face au péril des patrouilles ennemies, le Prophète apaise son compagnon par la célèbre parole : Ne t'afflige point, car Dieu est avec nous !
Autour d'eux, Asma apporte les vivres au péril de sa vie, Abd Allah recueille les nouvelles de la cité et Amir efface les traces dans le sable avec son troupeau, scellant une chaîne de solidarité qui préfigure la fraternisation générale de Médine.

Troisième partie : Variantes, silences et limites.
Le Coran immortalise cette amitié dans la sourate al-Tawba en mentionnant le second des deux quand ils étaient dans la grotte. L'atlas restitue ce lien d'âme sans figuration humaine, dans une rigueur documentaire pure.

Quatrième partie : Synthèse pédagogique.
Trois valeurs couronnent ce compagnonnage. Premièrement, la fidélité dans l'épreuve constitue le socle de toute alliance morale. Deuxièmement, le courage des femmes et des jeunes démontre la force collective du dévouement. Troisièmement, la solidarité de l'Hégire fonde une société où le sacrifice fraternel surpasse l'égoïsme tribal.`
  },
  {
    contentId: "HEG-DOS-11",
    locale: "ar",
    filename: "narration-heg-dos-11-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الصحبة والتعاون.

القسم الأول : تحديد الموضوع ونطاقه.
جسدت الهجرة النبوية قمة الوفاء والتآخي في صحبة أبي بكر الصديق لرسول الله صلى الله عليه وسلم، وتكامل شبكة الدعم الأسري في إنجاح الرحلة المباركة.

القسم الثاني : العناصر المسندة إلى المصادر.
بذل أبو بكر ماله ورواحله، وفي ظلمة الغار ثبته النبي بقوله: لا تحزن إن الله معنا. وتكاملت الخلية ببطولة أسماء في حمل الزاد، وعبد الله في نقل الأخبار، وعامر بن فهيرة في تعفية الآثار.
فكانت هذه الصحبة المباركة مقدمة حية للمؤاخاة الكبرى بين المهاجرين والأنصار في المدينة.

القسم الثالث : الاختلافات والحدود.
خلد القرآن هذه الرفقة في قوله: إذ هما في الغار إذ يقول لصاحبه لا تحزن إن الله معنا. ويتحرى الأطلس أعلى درجات التحفظ التراثي المانع لأي تمثيل للأشخاص.

القسم الرابع : خلاصة تربوية.
نستخلص من الصحبة ثلاث عبر: أولاها أن الصداقة الصادقة تظهر في أوقات المحن. وثانيتها شجاعة المرأة والشباب في خدمة المبادئ السامية. وثالثتها أن المجتمع الفاضل يقوم على التضحية والتضامن فوق كل مصلحة دنيوية.`
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
  console.log("Starting generation of 8 narrations for Lot 14...");
  const results = [];
  for (const script of LOT_14_SCRIPTS) {
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
    statusNote: "LOT_14_DEMO_NON_VALIDE",
    results
  };

  fs.writeFileSync("reports/lot-14-narrations-generation.json", JSON.stringify(report, null, 2));
  console.log("\nFinished Lot 14! Report saved to " + path.resolve("reports/lot-14-narrations-generation.json"));
}

main().catch(err => {
  console.error("Fatal in main:", err);
  process.exit(1);
});
