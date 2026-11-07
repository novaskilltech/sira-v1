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

const LOT_11_SCRIPTS = [
  {
    contentId: "CHR-17",
    locale: "fr",
    filename: "narration-chr-17-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Badr.

Première partie : Repère et périmètre.
Le 17 Ramadan de l'an 2 de l'Hégire, soit en mars 624, la plaine de Badr devient le théâtre de la première bataille décisive de l'Islam. Sortis initialement pour intercepter une caravane de Quraysh afin de compenser les biens spoliés aux émigrants mecquois, les trois cent treize musulmans se heurtent à une armée de près de mille guerriers menée par Abu Jahl, résolue à écraser définitivement la cité de Médine.

Deuxième partie : Éléments sourcés.
Devant cette disproportion flagrante, le Prophète réunit son conseil de guerre. Les chefs des Muhajirun et des Ansar, par la voix héroïque de Sa'd ibn Mu'adh, scellent leur loyauté indéfectible. Suivant le conseil tactique de Hubab ibn al-Mundhir, les musulmans occupent les puits de Badr, comblent les accès secondaires pour contrôler la ressource en eau, et tiennent leurs rangs serrés.
Après une nuit de prière fervente du Prophète dans sa tente de commandement, la bataille s'ouvre par des duels singuliers où Ali, Hamza et Ubayda terrassent les champions mecquois. Portées par une discipline exemplaire, les lignes musulmanes repoussent l'assaut ennemi et mettent l'armée qurayshite en déroute. Les grands tyrans de La Mecque, dont Abu Jahl et Umayya ibn Khalaf, périssent sur le champ de bataille.

Troisième partie : Variantes, silences et limites.
Le Coran immortalise cette victoire sous le nom de Jour du Discernement. L'application observe un aniconisme absolu : aucune représentation des combats ni des combattants, l'accent reposant sur la stratégie des puits, le courage moral et l'éthique novatrice du traitement bienveillant des prisonniers.

Quatrième partie : Synthèse pédagogique.
Trois principes majeurs résument Badr. Premièrement, la victoire dépend de la solidité morale et de l'unité des rangs plutôt que de la supériorité numérique. Deuxièmement, la délibération militaire prouve l'importance de la concertation (shura). Troisièmement, l'affranchissement des captifs contre l'enseignement de l'écriture aux enfants de Médine place l'éducation au sommet des valeurs civiques.`
  },
  {
    contentId: "CHR-17",
    locale: "ar",
    filename: "narration-chr-17-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `بدر.

القسم الأول : تحديد الموضوع ونطاقه.
في السابع عشر من شهر رمضان للعام الثاني للهجرة، شهدت بدر أول معركة فاصلة أعز الله بها دينه. خرج ثلاثمئة وثلاثة عشر صحابياً لاسترداد أموالهم من قافلة أبي سفيان، ففوجئوا بجيش مكة المحتشد في نحو ألف مقاتل يروم استئصال الإسلام من يثرب.

القسم الثاني : العناصر المسندة إلى المصادر.
استشار النبي أصحابه، فبذل المهاجرون والأنصار أرواحهم، وقال سعد بن معاذ مقولته الخالدة في خوض البحر مع رسول الله. وأخذ النبي برأي الحباب بن المنذر في النزول على أدنى ماء وتغوير ما سواه.
وبعد ليلة من التضرع في العريش، استُهلت المعركة بمبارزة قتل فيها حمزة وعلي وعبيدة فرسان قريش، ثم حمل المسلمون صفاً واحداً متماسكاً، فهُزمت قريش وقُتل قادتها الطغاة كأبي جهل وأمية بن خلف، وعومل الأسرى بأرقى معايير الإنسانية وفُدي الكاتب منهم بتعليم صبيان المدينة.

القسم الثالث : الاختلافات والحدود.
سمى القرآن هذا اليوم بيوم الفرقان توثيقاً لفصل الحق عن الباطل. ويلتزم التطبيق بالرصانة العلمية المانعة لأي تمثيل حسي للقتال، مبرزاً المعنى الاستراتيجي والأخلاقي.

القسم الرابع : خلاصة تربوية.
نستخلص من بدر ثلاث ركائز كبرى: أولاها أن اليقين بالله والانضباط الصارم يغلبان الكثرة المادية. وثانيتها مكانة الشورى العسكرية وتطبيق الخبرة الميدانية. وثالثتها جعل محو الأمية فداءً للأسرى كرس رسالة العلم في بناء الأمة.`
  },
  {
    contentId: "CHR-18",
    locale: "fr",
    filename: "narration-chr-18-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Uhud.

Première partie : Repère et périmètre.
En chawwal de l'an 3 de l'Hégire, un an après Badr, trois mille guerriers mecquois assoiffés de revanche campent au pied du mont Uhud, au nord de Médine. Le Prophète prend position avec sept cents hommes après la défection de trois cents hypocrites, adossant ses lignes aux reliefs basaltiques protecteurs de la montagne.

Deuxième partie : Éléments sourcés.
Muhammad place cinquante archers d'élite sur le monticule de Jabal al-Rumat, sous le commandement d'Abd Allah ibn Jubayr, avec l'ordre formel de ne jamais quitter leur poste afin de protéger les arrières musulmans de toute charge de cavalerie.
Dans un premier temps, l'élan musulman met en déroute les lignes de Quraysh. Mais voyant le camp ennemi abandonné, la majorité des archers désobéit à l'ordre de commandement pour ramasser le butin. Profitant de cette brèche, la cavalerie de Khalid ibn al-Walid contourne le mont Uhud et prend les musulmans à revers. Dans la tourmente, Hamza tombe en martyr, et le Prophète lui-même est blessé avant d'être protégé héroïquement par une poignée de fidèles qui replient l'armée dans les gorges du mont.

Troisième partie : Variantes, silences et limites.
Les récits coraniques de la sourate Al-Imran analysent cet événement comme une leçon spirituelle sur les conséquences de la cupidité et de l'insoumission. L'application exclut toute imagerie des blessures ou des combats, valorisant la rigueur topographique du site d'Uhud.

Quatrième partie : Synthèse pédagogique.
Trois enseignements cruciaux éclairent Uhud. Premièrement, la discipline et le respect scrupuleux des directives priment sur toute considération de gain immédiat. Deuxièmement, l'épreuve forge la résilience et purifie les intentions. Troisièmement, le sacrifice de Hamza et le courage des défenseurs illustrent le sens suprême du devoir moral.`
  },
  {
    contentId: "CHR-18",
    locale: "ar",
    filename: "narration-chr-18-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `أحد.

القسم الأول : تحديد الموضوع ونطاقه.
في شوال من العام الثالث للهجرة، زحف ثلاثة آلاف مقاتل من قريش للأخذ بثأر بدر، فعسكروا عند جبل أحد شمالي المدينة. واجههم النبي بسبعمئة مقاتل بعد انسحاب المنافقين، وأسند ظهور المسلمين إلى شعاب الجبل الوعرة.

القسم الثاني : العناصر المسندة إلى المصادر.
وضع النبي خمسين رامياً على جبل الرماة بقيادة عبد الله بن جبير، وأمرهم أمراً باتاً بحماية الظهور وعدم مغادرة مواضعهم مهما كانت النتيجة. وبدأت المعركة بنصر كاسح للمسلمين وفرار للمشركين.
لكن أغلب الرماة خالفوا أمر القيادة ونزلوا لجمع الغنائم، فاستغل خالد بن الوليد الثغرة وطوق المسلمين بخيله من الخلف. واضطربت الصفوف واستُشهد حمزة بن عبد المطلب وجُرح النبي في وجهه الشريف، حتى استبسل الصحابة في الدفاع عنه وانحازوا إلى قمة الجبل.

القسم الثالث : الاختلافات والحدود.
فصلت سورة آل عمران دروس المعركة وتربية النفوس على الصبر. ويتحرى الأطلس أعلى درجات التحفظ التراثي المانع لأي تمثيل للأشخاص أو الجراح، مبرزاً العبرة القيادية الخالدة.

القسم الرابع : خلاصة تربوية.
نستحضر من معركة أحد ثلاث عبر: أولاها أن مخالفة أمر القيادة والانشغال بالمطامع الدنيوية يحولان النصر إلى ابتلاء. وثانيتها أن الصمود في وجه الهزيمة المؤقتة يربي الأمة على مراجعة الذات. وثالثتها أن الشجاعة الأخلاقية تظهر في أحلك أوقات الشدة.`
  },
  {
    contentId: "VIE-13",
    locale: "fr",
    filename: "narration-vie-13-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Poterie et récipients.

Première partie : Repère et périmètre.
Dans les cités et les oasis du Hedjaz, la poterie et le travail de la terre cuite constituaient l'artisanat domestique de base, assurant l'indépendance matérielle des foyers pour le stockage des vivres, la cuisson des aliments et la préservation de l'eau fraîche sous un climat torride.

Deuxième partie : Éléments sourcés.
Les potiers travaillaient les argiles locales extraites des lits d'oueds à l'aide d'outils de modelage et d'ébauchage manuels en bois dur, répertoriés sous l'objet OBJ-011. Façonnées au tour ou au colombin puis cuites dans des fours à tirage direct alimentés au bois d'acacia, les poteries comprenaient les grandes jarres khabiya pour les dattes et l'eau, les marmites de terre réfractaire qidr pour les bouillons et les grands plats de service qas'a partagés pour le tharid.
Cet artisanat s'articulait avec d'autres savoir-faire spécialisés, comme le tissage illustré par la navette OBJ-012 et le travail des cuirs par l'alêne OBJ-013, formant un écosystème d'ateliers solidaires dans les souks de Médine.

Troisième partie : Variantes, silences et limites.
Les témoins archéologiques attestent de la sobriété fonctionnelle des céramiques omeyyades et abbassides primitives du Hedjaz. L'atlas met en lumière ces témoins matériels sans figuration humaine, dans une rigueur documentaire intégrale.

Quatrième partie : Synthèse pédagogique.
Trois leçons matérielles éclairent cet artisanat. Premièrement, la maîtrise de l'argile locale répond à tous les besoins vitaux sans importation coûteuse. Deuxièmement, les poteries poreuses exploitent le refroidissement thermodynamique passif avec une remarquable efficacité. Troisièmement, le partage des grands plats de terre cuite fortifie les liens de fraternité et de convivialité.`
  },
  {
    contentId: "VIE-13",
    locale: "ar",
    filename: "narration-vie-13-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الفخار والأواني.

القسم الأول : تحديد الموضوع ونطاقه.
شكلت صناعة الخزف والفخار في الحجاز عصب الاستقرار المنزلي؛ حيث وفرت الخامات الطينية المحلية أوعية الطهي وحفظ التمور وتبريد المياه في ظل مناخ شديد الحرارة.

القسم الثاني : العناصر المسندة إلى المصادر.
عالج الخزاف الطين بأدوات التشكيل اليدوية OBJ-011 على دواليب خشبية، ثم أحرقها في أفران السمر لإنتاج الجرار والقدور الثقيلة وقصاع الطعام الواسعة التي يُؤكل فيها الثريد جماعة.
وتكاملت حرفة الفخار مع نسيج المكوك OBJ-012 وخرازة المخرز OBJ-013 في تلبية احتياجات المجتمع المديني المستقل.

القسم الثالث : الاختلافات والحدود.
تؤكد الآثار بساطة الفخار الحجازي وخلوه من الزخارف المعقدة لصالح المتانة الوظيفية. ويلتزم التطبيق بالعرض المتحفي المجرد للقطع دون تجسيد للأشخاص.

القسم الرابع : خلاصة تربوية.
نستخلص من صناعة الفخار ثلاث فوائد: أولاها استثمار خامات الأرض في خدمة المعيشة اليومية. وثانيتها الاستفادة من برودة الفخار المسامي لحفظ الصحة. وثالثتها أن البركة تحف الاجتماع على الطعام في الآنية الواحدة.`
  },
  {
    contentId: "VIE-14",
    locale: "fr",
    filename: "narration-vie-14-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Tissage et fabrication.

Première partie : Repère et périmètre.
À Médine, l'autonomie artisanale reposait sur la complémentarité des métiers de la laine, du bois et du cuir. Dans les ateliers familiaux et les souks, la transformation des toisons animales et l'assemblage des matériaux souples répondaient aux besoins d'équipement des caravanes et de la vie domestique.

Deuxième partie : Éléments sourcés.
La navette de tissage al-makkuk, modélisée sous le code OBJ-012, constituait le cœur du métier à tisser horizontal au sol, glissant entre les fils de chaîne pour confectionner les toiles et les étoffes de laine et de coton.
Dans les ateliers mitoyens, les artisans du cuir employaient l'alêne OBJ-013, outil d'acier à manche d'os poli capable de perforer sans déchirer les cuirs les plus épais pour coudre les outres, les selles et les sandales. Cet outillage s'associait aux spatules de poterie OBJ-011 pour constituer l'arsenal manuel des corporations médinoises régulées par la justice du marché prophétique.

Troisième partie : Variantes, silences et limites.
L'étude ethnographique et archéologique confirme la stabilité de ces outils du néolithique à l'époque classique. L'application restitue ces pièces avec une fidélité fonctionnelle stricte, sans aucune figure vivante.

Quatrième partie : Synthèse pédagogique.
Trois principes se dégagent de cette fabrication. Premièrement, la navette et l'alêne incarnent la précision et l'adresse de l'artisanat préindustriel. Deuxièmement, la valorisation du travail manuel participe de l'élévation éthique de la société. Troisièmement, la réglementation équitable du marché garantit la dignité des artisans et la qualité des productions.`
  },
  {
    contentId: "VIE-14",
    locale: "ar",
    filename: "narration-vie-14-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `النسيج والصناعة.

القسم الأول : تحديد الموضوع ونطاقه.
قامت الصناعات اليدوية في المدينة المنورة على تكامل المهن بين نسج الصوف ودباغة الجلود وصناعة الأدوات الخشبية، لتحقيق الكفاية المعيشية والاستقلال الاقتصادي لعاصمة الإسلام.

القسم الثاني : العناصر المسندة إلى المصادر.
كان المكوك الخشبي OBJ-012 روح النول الأرضي، ينساب بين خيوط السدى لينتج البرود والأكسية والفرش الصوفية والقطنية.
واستخدم الخرازون المخرز المدبب OBJ-013 لثقب الجلود السميكة وخياطة القرب والنعال وأحزمة السفر، مكملاً وظائف ملوق الفخار OBJ-011 في منظومة حرفية حظيت برعاية النبي وتشجيعه على إتقان العمل.

القسم الثالث : الاختلافات والحدود.
تظهر الشواهد استقرار تصاميم هذه الأدوات لقرون طويلة لبراعتها الوظيفية. ويعتمد الأطلس التوثيق الموضوعي المجرد للأدوات بعيداً عن أي محاكاة تصويرية للأفراد.

القسم الرابع : خلاصة تربوية.
نستخلص من فنون الصنعة ثلاث دلالات: أولاها أن العمل اليدوي المتقن عبادة وشرف اجتماعي. وثانيتها أهمية التكامل المهني في بناء اقتصاد قوي ومكتفٍ. وثالثتها التزام العدالة في إعطاء الصانع حقه وصيانة جودة الإنتاج.`
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
  console.log("Starting generation of 8 narrations for Lot 11...");
  const results = [];
  for (const script of LOT_11_SCRIPTS) {
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
    statusNote: "LOT_11_DEMO_NON_VALIDE",
    results
  };

  fs.writeFileSync("reports/lot-11-narrations-generation.json", JSON.stringify(report, null, 2));
  console.log("\nFinished Lot 11! Report saved to " + path.resolve("reports/lot-11-narrations-generation.json"));
}

main().catch(err => {
  console.error("Fatal in main:", err);
  process.exit(1);
});
