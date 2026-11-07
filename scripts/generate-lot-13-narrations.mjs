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

const LOT_13_SCRIPTS = [
  {
    contentId: "CHR-21",
    locale: "fr",
    filename: "narration-chr-21-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Entrée à La Mecque.

Première partie : Repère et périmètre.
En Ramadan de l'an 8 de l'Hégire, en janvier 630, à la suite de la rupture du pacte d'al-Hudaybiyya par des alliés de Quraysh, le Prophète s'avance vers La Mecque à la tête de dix mille compagnons. Cette marche solennelle vise la libération pacifique du sanctuaire de la Kaaba et le pardon des cœurs, sans esprit de revanche ni pillage.

Deuxième partie : Éléments sourcés.
Après avoir accordé l'amnistie générale à quiconque s'abrite chez Abu Sufyan ou dans sa demeure, l'armée musulmane pénètre dans la cité par quatre colonnes sans effusion de sang. Monté sur sa chamelle, la tête inclinée jusqu'à la selle par humilité, le Prophète accomplit les sept tours de la Kaaba.
À l'aide de son bâton de marche, il fait basculer les trois cent soixante idoles dressées autour de l'édifice, proclamant que la Vérité est venue et que le Faux a disparu. S'adressant à la foule des Mecquois qui l'avaient persécuté et boycotté, il leur annonce la parole immortelle : Nul reproche ne vous est fait aujourd'hui. Partez, vous êtes libres !

Troisième partie : Variantes, silences et limites.
Les chroniques de la Sira célèbrent cette victoire sans effusion de sang comme un modèle unique de clémence politique. L'application observe un aniconisme absolu : aucune figuration humaine des foules ni de l'entrée triomphale, l'accent étant mis sur la pureté minérale de la Kaaba restaurée dans son monothéisme abrahamique originel.

Quatrième partie : Synthèse pédagogique.
Trois leçons fondent cet événement. Premièrement, la vraie victoire s'accomplit par l'humilité et le pardon plutôt que par la vengeance. Deuxièmement, la purification du sanctuaire consacre le retour à l'Unicité pure. Troisièmement, la proclamation de liberté accordée aux vaincus brise le cycle des haines tribales et scelle la paix de l'Arabie.`
  },
  {
    contentId: "CHR-21",
    locale: "ar",
    filename: "narration-chr-21-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `دخول مكة.

القسم الأول : تحديد الموضوع ونطاقه.
في شهر رمضان من العام الثامن للهجرة، عقب نقض قريش لصلح الحديبية، توجه النبي صلى الله عليه وسلم في عشرة آلاف من صحابته لفتح مكة. ولم تكن الغاية انتقاماً دنيوياً بل تطهيراً للبيت العتيق وإرساءً لعهد السلام.

القسم الثاني : العناصر المسندة إلى المصادر.
أعلن النبي أمانه الشامل لأهل مكة، ودخلت الجيوش سلماً من أربع جهات. ودخل الرسول خاشعاً يطوف بالكعبة، وأسقط ثلاثمئة وستين صنماً بقضيبه وهو يتلو: جاء الحق وزهق الباطل إن الباطل كان زهوقاً.
ثم وقف أمام سادة مكة الذين آذوه وطردوه، وقال كلمته الخالدة: ما ترون أني فاعل بكم؟ قالوا: أخ كريم وابن أخ كريم. فقال: اذهبوا فأنتم الطلقاء!

القسم الثالث : الاختلافات والحدود.
تجمع كتب السير على عظمة هذا العفو العام وفرادته التاريخية. ويلتزم الأطلس بالتجرد التراثي الكامل المانع لأي تمثيل للأشخاص، مبرزاً المعنى الأخلاقي للفتح الأكبر.

القسم الرابع : خلاصة تربوية.
نستخلص من فتح مكة ثلاث عبر: أولاها سمو العفو عند المقدرة في إخماد الأحقاد. وثانيتها اقتران النصر بالتواضع المطلق لله عز وجل. وثالثتها عودة الكعبة إلى توحيدها الإبراهيمي الخالص.`
  },
  {
    contentId: "CHR-22",
    locale: "fr",
    filename: "narration-chr-22-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Relations et délégations.

Première partie : Repère et périmètre.
L'an 9 de l'Hégire, désigné comme l'Année des délégations, consacre l'unification politique de l'Arabie. Après la prise de La Mecque et les campagnes de Hunayn et Tabuk, les tribus de toutes les régions de la péninsule envoient leurs ambassadeurs à Médine pour conclure des pactes d'alliance et embrasser l'Islam.

Deuxième partie : Éléments sourcés.
La cour de la Mosquée du Prophète accueille des délégations illustres, telles que les chrétiens de Najran, avec lesquels un traité garantit la liberté religieuse de leur communauté contre le versement de la jizya, ou les chefs des confédérations du Yémen, d'Oman et de Bahreïn.
Le Prophète héberge les émissaires avec dignité, charge les lettrés de la Suffa de leur enseigner le Coran et rédige des chartes territoriales scellées garantissant la paix et l'équité fiscale.

Troisième partie : Variantes, silences et limites.
Les recueils archivistiques ont conservé les textes des lettres prophétiques transmises aux tribus. L'application présente cette activité diplomatique dans sa réalité textuelle et juridique, sans reconstitution imagée des assemblées.

Quatrième partie : Synthèse pédagogique.
Trois principes résument cette apogée diplomatique. Premièrement, Médine s'impose comme une fédération souveraine unie par le droit. Deuxièmement, le traité de Najran illustre la protection légale accordée aux minorités monothéistes. Troisièmement, la décentralisation administrative assure le respect des coutumes régionales dans l'unité de la foi.`
  },
  {
    contentId: "CHR-22",
    locale: "ar",
    filename: "narration-chr-22-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `العلاقات والوفود.

القسم الأول : تحديد الموضوع ونطاقه.
عُرف العام التاسع للهجرة بعام الوفود؛ حيث تقاطرت زعامات القبائل العربية من أطراف الجزيرة إلى المدينة المنورة لإعلان إسلامها أو عقد معاهدات السلم والتحالف بعد استقرار السيادة للمسلمين.

القسم الثاني : العناصر المسندة إلى المصادر.
استقبل المسجد النبوي وفود نجران وعمان واليمن والبحرين. وكتب النبي لنصارى نجران عهداً تاريخياً حمى كنائسهم ورهبانهم، كما أرسل المعلمين من أهل الصفة لتعليم القبائل شرائع العدل والزكاة.
وحررت وثائق مكتوبة ضمنت حقوق الأقاليم في إدارة شؤونها تحت مظلة الدولة الموحدة.

القسم الثالث : الاختلافات والحدود.
حفظت مصادر السيرة نصوص كتب النبي إلى الوفود ومواثيقهم. ويعتمد التطبيق العرض الوثائقي الرصين لهذه العهود دون أي محاكاة للأشخاص.

القسم الرابع : خلاصة تربوية.
نستخلص من عام الوفود ثلاث دلالات: أولاها نجاح الرسالة في توحيد قبائل العرب المتناحرة في أمة واحدة. وثانيتها كفالة حرية المعتقد والعدالة في مواثيق الذمة. وثالثتها ترسيخ مبدأ المركزية التشريعية مع المرونة الإدارية للأقاليم.`
  },
  {
    contentId: "VIE-16",
    locale: "fr",
    filename: "narration-vie-16-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Échanges et marchés.

Première partie : Repère et périmètre.
À Médine, l'établissement de la communauté s'est doublé d'une régulation économique novatrice avec la création du Marché du Prophète, Suq al-Madina, libéré des monopoles usuraires et des lourdes taxes coutumières.

Deuxième partie : Éléments sourcés.
Le Prophète décréta la gratuité des emplacements et l'interdiction de toute taxe de place (rapporté par Ibn Majah), instituant un espace public équitable où chaque marchand s'installe librement pour la journée.
Les transactions y étaient encadrées par la prohibition de l'usure (riba), de l'aléa (gharar), de l'interception des caravanes avant leur arrivée au marché (talaqqi al-rukban) et de l'accaparement spéculatif (ihtikar, interdit dans la jurisprudence malékite de référence — al-Muwatta' de l'imam Malik, al-Risala — sur les denrées alimentaires et tout bien dont la rétention nuit au marché). L'équité reposait sur la balance OBJ-014 et les poids de mesure OBJ-015, tandis que le Prophète inspectait lui-même la loyauté des ventes (Sahih Muslim, 102).

Troisième partie : Variantes, silences et limites.
Si le contrôle direct des fraudes par le Prophète est établi dans le Sahih Muslim et que son passage auprès de Samra bint Nuhayk au marché est rapporté par al-Tabarani, la délégation d'une mission de surveillance du marché de Médine à al-Shifa bint Abd Allah est mentionnée par les biographes (Ibn Abd al-Barr dans al-Isti'ab, Ibn Hajar dans al-Isaba) sous le califat d'Umar ibn al-Khattab, l'appellation institutionnelle de Hisba s'étant formalisée ultérieurement. L'application présente ces objets sous un éclairage muséal rigoureux sans personnification.

Quatrième partie : Synthèse pédagogique.
Trois règles gouvernent ce modèle économique. Premièrement, l'abolition des rentes de place stimule le commerce équitable. Deuxièmement, la balance OBJ-014 matérialise l'honnêteté contractuelle. Troisièmement, la régulation vigilante protège la communauté contre l'accaparement et la tromperie.`
  },
  {
    contentId: "VIE-16",
    locale: "ar",
    filename: "narration-vie-16-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `التبادل والأسواق.

القسم الأول : تحديد الموضوع ونطاقه.
أسس النبي صلى الله عليه وسلم في المدينة سوقاً حرة مستقلة كسرت احتكار أسواق الجاهلية القائمة على الربا والمكوس، مؤسساً لنموذج اقتصادي متوازن.

القسم الثاني : العناصر المسندة إلى المصادر.
جعل النبي السوق مشاعاً دون رسوم، وحرم الربا والغش وتلقي الركبان والاحتكار المنهي عنه في الفقه المالكي المعتمد (الموطأ للإمام مالك، والرسالة) في الأقوات وكل ما يضر بالسوق. وضُبطت المعاملات بالميزان OBJ-014 وأوزان القياس OBJ-015 لضمان العدالة، وكان النبي يتفقد السوق بنفسه كما ثبت في صحيح مسلم (102): من غش فليس مني.
فأصبح السوق قبلة تجارية نشطة تجمع بين الربح المشروع والتكافل الاجتماعي.

القسم الثالث : الاختلافات والحدود.
ميزت المصادر بين تفقد النبي للسوق بنفسه ومروره بسمراء بنت نهيك عند الطبراني، وبين ما أورده ابن عبد البر وابن حجر من تقديم عمر بن الخطاب رضي الله عنه للشفاء بنت عبد الله في أمر السوق، قبل تبلور مصطلح الحسبة في العصور اللاحقة. ويلتزم التطبيق بالعرض الوثائقي المجرد للأدوات بعيداً عن التشخيص.

القسم الرابع : خلاصة تربوية.
نستخلص من سوق المدينة ثلاث فوائد: أولاها تشجيع حرية التجارة ورفع الرسوم الجائرة. وثانيتها ضبط المعاملات بأدوات الميزان الصادقة. وثالثتها محاربة الاحتكار والغش لصالح استقرار معيشة الناس.`
  },
  {
    contentId: "VIE-17",
    locale: "fr",
    filename: "narration-vie-17-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Poids et mesures.

Première partie : Repère et périmètre.
Dans les cités d'Arabie, la normalisation des poids et des mesures constituait le fondement de la justice contractuelle et du prélèvement équitable de l'aumône légale de la Zakat.

Deuxième partie : Éléments sourcés.
Le Prophète établit une règle unifiée (Abu Dawud 3340, al-Nasa'i 4595) : le volume de capacité est celui des gens de Médine, spécialistes de l'agriculture oasienne avec le Mudd et le Sa' (quatre amdad), tandis que le poids de masse est celui des gens de La Mecque, grands marchands familiers de l'Uqiya, du Dirham et du Dinar.
La balance à deux plateaux OBJ-014 et les poids en pierre ou bronze OBJ-015 servaient à peser avec minutie les denrées précieuses, tandis que les récipients étalonnés mesuraient les récoltes céréalières. Dans l'école malékite de référence (al-Muwatta' de l'imam Malik), la pratique transmise des gens de Médine ('amal ahl al-Madina) fixe de manière normative la valeur du mudd et du sa' prophétiques pour la zakat al-fitr, les expiations (kaffarat) et le seuil imposable (nisab) de cinq awsaq (soixante sa').

Troisième partie : Variantes, silences et limites.
Les traités de jurisprudence comparent l'étalon médinois retenu par l'école malékite (évalué à cinq artal et un tiers pour le sa') et les écoles chaféite et hanbalite avec l'évaluation irakienne retenue par l'école hanafite (huit artal). L'atlas traite ces témoins matériels dans leur rigueur scientifique et patrimoniale pure.

Quatrième partie : Synthèse pédagogique.
Trois principes résument cette métrologie. Premièrement, l'unification des étalons élimine les litiges commerciaux. Deuxièmement, la balance OBJ-014 incarne la rectitude morale de la foi. Troisièmement, la fidélité aux mesures de Médine et aux poids de La Mecque assure l'équité de la Zakat et des contrats.`
  },
  {
    contentId: "VIE-17",
    locale: "ar",
    filename: "narration-vie-17-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الأوزان والمقاييس.

القسم الأول : تحديد الموضوع ونطاقه.
مثل توحيد المكاييل والموازين في عهد النبوة أساساً للعدل في المعاملات وتقدير الزكوات والكفارات وفق ميزان القسط القرآني.

القسم الثاني : العناصر المسندة إلى المصادر.
وحد النبي المعايير بقوله: المكيال مكيال أهل المدينة، والوزن وزن أهل مكة (أبو داود والنسائي)؛ فاعتمد الصاع والمد لحبوب الواحات وتمورها، والأوقية والدرهم والدينار لفضة التجارة وذهبها.
واستُخدم الميزان OBJ-014 وأوزان القياس OBJ-015 لضبط المعاملات ونفي التطفيف. وفي المذهب المالكي المعتمد (الموطأ للإمام مالك)، يُحتج بعمل أهل المدينة المتوارث في ضبط مقدار المد والصاع النبوي (أربعة أمداد) لإخراج زكاة الفطر والكفارات ونصاب الزروع والثمار المقدر بخمسة أوسق (ستين صاعاً).

القسم الثالث : الاختلافات والحدود.
تذكر كتب الفقه خلاف أهل العراق من الحنفية في تقدير الصاع بالرطل في مقابل معيار أهل المدينة المعتمد عند المالكية وجمهور الفقهاء. ويعتمد التطبيق العرض المتحفي الرصين للأوزان والموازين دون تمثيل للأفراد.

القسم الرابع : خلاصة تربوية.
نستخلص من الموازين ثلاث عبر: أولاها أن العدالة في الكيل والوزن فريضة شرعية ومطلب حضاري. وثانيتها تكامل الخبرة المدنية والمكية في المعايير. وثالثتها أن الصدق في الميزان أساس البركة في الأرزاق.`
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
  console.log("Starting generation of 8 narrations for Lot 13...");
  const results = [];
  for (const script of LOT_13_SCRIPTS) {
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
    statusNote: "LOT_13_DEMO_NON_VALIDE",
    results
  };

  fs.writeFileSync("reports/lot-13-narrations-generation.json", JSON.stringify(report, null, 2));
  console.log("\nFinished Lot 13! Report saved to " + path.resolve("reports/lot-13-narrations-generation.json"));
}

main().catch(err => {
  console.error("Fatal in main:", err);
  process.exit(1);
});
