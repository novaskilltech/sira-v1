import fs from 'node:fs';
import path from 'node:path';

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

const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY) {
  console.error("OPENROUTER_API_KEY is not defined in .env");
  process.exit(1);
}

const outDir = path.resolve('public/media/drafts');
fs.mkdirSync(outDir, { recursive: true });

const items = [
  // VIE-19
  {
    id: 'VIE-19',
    lang: 'fr',
    filename: 'narration-vie-19-fr.mp3',
    voice: 'alloy',
    text: `Voyage et équipements : Préparatifs matériels.
Voyager dans les étendues arides d'Arabie imposait une préparation minutieuse où chaque équipement répondait à des impératifs stricts de légèreté, d'étanchéité et de résistance aux chaleurs extrêmes.
Les caravaniers et voyageurs s'équipaient de sacoches en cuir robuste, de bâts adaptés aux bêtes de somme et de contenants de transport protégeant les denrées contre le sable et la chaleur.
La préparation du déplacement impliquait le graissage des lanières de cuir, le contrôle minutieux des coutures des outres d'eau et le calage soigné des fardeaux pour équilibrer la charge. Tout déséquilibre ou défaillance matérielle en plein désert pouvait mettre en péril l'ensemble de la caravane.
À retenir : les préparatifs matériels du voyage reposaient sur un savoir-faire artisanal rigoureux, assurant la sécurité des charges et la préservation vitale des ressources en eau et vivres.`
  },
  {
    id: 'VIE-19',
    lang: 'ar',
    filename: 'narration-vie-19-ar.mp3',
    voice: 'alloy',
    text: `السفر والتجهيزات: التجهيزات المادية للسفر.
تطلبت الرحلات عبر المسالك الصحراوية في الجزيرة العربية استعداداً دقيقاً واختياراً صارماً للعتاد الخفيف والمتين.
اعتمد المسافرون على حقائب جلدية متينة ورحال مخصصة للدواب وصناديق نقل تحمي المؤن من حرارة الشمس وغبار الرمال.
شملت التجهيزات فحص خياطة القِرَب ودهن السيور الجلدية وتوزيع الأحمال بدقة على جانبي الدابة لتفادي اختلال التوازن في الطرق الوعرة.
خلاصة: كانت دقة التجهيز المادي ضمانة أساسية للحفاظ على المياه والمؤن وتأمين سلامة القوافل في بيئة صحراوية قاسية.`
  },

  // VIE-20
  {
    id: 'VIE-20',
    lang: 'fr',
    filename: 'narration-vie-20-fr.mp3',
    voice: 'alloy',
    text: `Voyage et équipements : Transport des effets.
Le transport des effets personnels, des marchandises et des provisions nécessitait des méthodes d'arrimage éprouvées pour stabiliser les fardeaux sur les reliefs escarpés du Hedjaz.
À l'aide de cordages en fibres végétales et de sangles en cuir, les sacoches doubles et coffres de transport étaient solidement fixés de part et d'autre des bâts.
Lors des étapes quotidiennes, les charges étaient descendues pour ménager les bêtes, puis réarrimées avant l'aube. La répartition symétrique du poids évitait les blessures aux animaux et assurait un rythme de marche régulier le long des pistes caravanières.
À retenir : l'art du bât et de l'arrimage assurait l'intégrité des cargaisons et la continuité des déplacements à travers les déserts et passages montagneux.`
  },
  {
    id: 'VIE-20',
    lang: 'ar',
    filename: 'narration-vie-20-ar.mp3',
    voice: 'alloy',
    text: `السفر والتجهيزات: نقل الأمتعة.
اعتمد نقل الأمتعة والبضائع على أساليب شد وحزم محكمة تضمن ثبات الأحمال فوق الدواب في الممرات الجبلية والدروب الصحراوية.
استُخدمت حبال ليف النخيل وسيور الجلد لربط الحقائب المزدوجة والصناديق الخشبية على جانبي الرحال بتوازن تام.
كان تفريغ الأحمال وإعادة شدها عند كل محطة استراحة عملاً دقيقاً يمنع إجهاد الركائب ويحافظ على سلامة المتاع طوال مسار السفر.
خلاصة: شكّلت مهارة حزم الأمتعة وتوزيع الأثقال ركيزة في استمرارية الحركة التجارية والتنقل بأمان عبر الجزيرة.`
  },

  // VIE-21
  {
    id: 'VIE-21',
    lang: 'fr',
    filename: 'narration-vie-21-fr.mp3',
    voice: 'alloy',
    text: `Voyage et équipements : Orientation et provisions.
S'orienter et subsister dans les étendues arides reposait sur une lecture fine des constellations célestes, des repères géographiques naturels et une stricte économie des vivres.
Les voyageurs marchaient souvent de nuit pour fuir les ardeurs du soleil, se guidant sur les étoiles et les silhouettes montagneuses, tout en puisant avec mesure dans leurs outres d'eau fraîche.
Les provisions de voyage se composaient principalement de dattes séchées, de farine d'orge rôtie et de graisse préparée, denrées imputrescibles faciles à transporter dans les sacoches. Chaque point d'eau connu dictait la cadence de la marche.
À retenir : la science de l'orientation astronomique et la frugalité de l'alimentation rendaient possible la traversée des solitudes désertiques les plus hostiles.`
  },
  {
    id: 'VIE-21',
    lang: 'ar',
    filename: 'narration-vie-21-ar.mp3',
    voice: 'alloy',
    text: `السفر والتجهيزات: الاهتداء والتزوّد.
اعتمد التنقل في الفيافي على معرفة دقيقة بالنجوم والتضاريس، مع إدارة صارمة للمياه والأغذية المحفوظة.
فضّل المسافرون السير ليلاً اتقاءً للحر الشديد، مهتدين بمواقع النجوم وسمات الجبال، ومقتصدين في شرب الماء من القِرَب.
اقتصر الزاد على أطعمة مجففة غير قابلة للتلف كالتمر وسويق الشعير، وتحددت مراحل السير بمواقع الآبار والواحات المعروفة.
خلاصة: مكنت الخبرة الفلكية والزاد البسيط القوافل من اجتياز المفاوز الصحراوية الشاسعة بنجاح وثبات.`
  },

  // VIE-22
  {
    id: 'VIE-22',
    lang: 'fr',
    filename: 'narration-vie-22-fr.mp3',
    voice: 'alloy',
    text: `Écriture et transmission : Supports d'écriture.
À l'aube de l'Islam, l'écriture s'exerçait sur des supports variés issus de l'environnement immédiat et du travail artisanal local ou régional.
Faute de papier encore inconnu en Arabie, on employait des tablettes de bois, des parchemins fins préparés à partir de peaux d'animaux, des côtes et omoplates osseuses ainsi que des folioles de palmier lissées.
Ces supports rigides ou souples recevaient l'encre noire indélébile préparée à base de suie. Les feuillets de parchemin étaient conservés roulés ou assemblés, assurant une pérennité remarquable aux actes administratifs et aux textes mémorisés.
À retenir : la diversité des supports d'écriture témoigne d'une adaptation ingénieuse aux ressources disponibles pour fixer durablement les paroles et les traités.`
  },
  {
    id: 'VIE-22',
    lang: 'ar',
    filename: 'narration-vie-22-ar.mp3',
    voice: 'alloy',
    text: `الكتابة والنقل: حوامل الكتابة.
تنوعت أدوات التدوين في صدر الإسلام بحسب ما وفرته البيئة المحلية من جلود وأخشاب وعظام صلبة.
قبل انتشار الورق، كُتبت النصوص على الرقاق الجلدية والألواح الخشبية وعظام الأكتاف وعُسب النخل المشذبة.
استقبلت هذه الحوامل الحبر الكربوني الثابت، وحُفظت الصحائف ملفوفة أو مجمعة بعناية لتوثيق العهود والرسائل والنصوص المنقولة.
خلاصة: عكست حوامل الكتابة تكيفاً مبدعاً مع الموارد المتاحة لتثبيت الكلمة المكتوبة وحفظ الوثائق التاريخية.`
  },

  // VIE-23
  {
    id: 'VIE-23',
    lang: 'fr',
    filename: 'narration-vie-23-fr.mp3',
    voice: 'alloy',
    text: `Écriture et transmission : Outils et matériaux.
La pratique de l'écriture reposait sur des instruments précis : le calame de roseau fendu et l'encre au noir de fumée conservée dans des encriers protecteurs.
Les scribes taillaient des tiges de roseau séché selon un biseau spécifique pour obtenir un tracé net, et conservaient leur encre fluide dans des encriers en terre cuite, en métal ou en corne.
L'encre était broyée avec de la gomme végétale pour fixer le pigment sur les tablettes et les parchemins. Un tampon de laine ou de fil placé dans l'encrier évitait les éclaboussures et régulait la charge d'encre à chaque trempe du calame.
À retenir : la maîtrise des encres et la taille fine du calame ont permis l'éclosion d'une écriture arabe monumentale et cursive d'une remarquable élégance.`
  },
  {
    id: 'VIE-23',
    lang: 'ar',
    filename: 'narration-vie-23-ar.mp3',
    voice: 'alloy',
    text: `الكتابة والنقل: الأدوات والمواد.
قامت صناعة الكتابة على أدوات دقيقة شملت أقلام القصب المشذوبة والأحبار الكربونية المحفوظة في محابر محكمة.
بَرى الكُتّاب قصب البردي بزاوية مائلة للحصول على خط متناسق، واحتفظوا بالحبر في محابر خزفية ومعدنية ملائمة.
مُزج السناج بالصمغ العربي لتثبيت السواد، ووُضعت خيوط الصوف داخل المحبرة لضبط كمية الحبر ومنع تدفقه أثناء غمس القلم.
خلاصة: وفّرت دقة صنع الأقلام والمحابر أساساً متيناً لتطور الخط العربي وتدوين المعاملات والرسائل بوضوح وثبات.`
  },

  // VIE-24
  {
    id: 'VIE-24',
    lang: 'fr',
    filename: 'narration-vie-24-fr.mp3',
    voice: 'alloy',
    text: `Écriture et transmission : Usages de la transmission écrite.
Bien que la société d'Arabie fût éminemment de tradition orale, l'écrit jouait un rôle pivot dans la formalisation des traités, des correspondances d'État et des contrats commerciaux.
Les scribes de Médine rédigeaient les missives adressées aux tribus et aux souverains voisins, ainsi que les pactes d'alliance et les relevés de partages scellés de manière solennelle.
La lettre ou l'accord consigné sur parchemin était lu publiquement puis confié à un messager, servant de preuve matérielle incontestable. L'écrit venait ainsi doubler et certifier la parole donnée et la mémoire partagée.
À retenir : la transmission écrite s'est affirmée comme un vecteur institutionnel décisif, renforçant la clarté juridique et l'organisation politique de la société médinoise.`
  },
  {
    id: 'VIE-24',
    lang: 'ar',
    filename: 'narration-vie-24-ar.mp3',
    voice: 'alloy',
    text: `الكتابة والنقل: استخدامات النقل الكتابي.
إلى جانب قوة الرواية الشفوية، شكّلت الكتابة أداة حاسمة في توثيق العهود والرسائل الدبلوماسية والمعاملات المالية.
تولى كُتّاب الوحي والرسائل في المدينة تحرير الكتب الموجهة إلى القبائل والملوك وصياغة بنود المعاهدات الرسمية.
كانت الوثيقة المكتوبة تُتلى جهراً وتُسلّم للمبعوث كحجة رسمية تعضد الكلمة الشفوية وتضمن حفظ الالتزامات المشتركة.
خلاصة: جسدت الكتابة أداة تنظيمية وسياسية رسخت الاستقرار القانوني وبناء العلاقات المجتمعية والدولية.`
  },

  // HEG-DOS-12
  {
    id: 'HEG-DOS-12',
    lang: 'fr',
    filename: 'narration-heg-dos-12-fr.mp3',
    voice: 'alloy',
    text: `Dossiers de l'Hégire : Portée et conséquences de l'Hégire.
L'Hégire ne fut pas un simple exil géographique, mais une rupture historique fondatrice qui transforma une communauté spirituelle éprouvée en une société organisée et solidaire.
À Médine, la mise en place de la fraternisation entre Émigrés et Auxiliaires, l'élaboration de la Constitution de Médine et l'édification de la mosquée communautaire posèrent les bases d'un nouvel ordre social.
L'importance de cet événement fut si manifeste qu'il fut choisi ultérieurement sous le califat d'Omar pour marquer le point de départ du calendrier musulman. L'Hégire symbolise ainsi l'avènement d'une ère d'autonomie, de justice partagée et de rayonnement civilisationnel.
À retenir : par ses dimensions spirituelle, politique et chronologique, l'Hégire constitue l'axe charnière de l'histoire musulmane et la genèse d'un modèle communautaire durable.`
  },
  {
    id: 'HEG-DOS-12',
    lang: 'ar',
    filename: 'narration-heg-dos-12-ar.mp3',
    voice: 'alloy',
    text: `ملفات الهجرة: أبعاد الهجرة ونتائجها.
لم تكن الهجرة مجرد انتقال مكاني، بل مثلت تحولاً تاريخياً أسس لقيام مجتمع منظم قائم على العدالة والتكافل.
أرست الهجرة في المدينة قواعد المؤاخاة بين المهاجرين والأنصار، ووثيقة المدينة الدستورية، وبناء المسجد كمركز للحياة الجامعة.
تجلت مكانة هذا الحدث في اعتماده مبدأً للتقويم الهجري، مؤذناً ببداية عصر جديد من البناء الحضاري والاستقلال السياسي والاجتماعي.
خلاصة: شكلت الهجرة النبوية المفصل الأساسي في التاريخ الإسلامي وركيزة بناء المجتمع ونظامه الحضاري المستمر.`
  }
];

async function generateTTS(item) {
  const destPath = path.join(outDir, item.filename);
  console.log(`\n--- [${item.id} ${item.lang.toUpperCase()}] -> ${item.filename} ---`);
  console.log(`Script length: ${item.text.length} characters`);

  const startTime = Date.now();
  const resp = await fetch('https://openrouter.ai/api/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://sira-atlas.local',
      'X-Title': 'Sira Atlas V1 TTS Generation'
    },
    body: JSON.stringify({
      model: 'minimax/speech-2.8-hd',
      input: item.text,
      voice: item.voice,
      response_format: 'mp3'
    })
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`OpenRouter TTS failed (${resp.status}): ${errText}`);
  }

  const arrayBuffer = await resp.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(destPath, buffer);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✓ Success! Saved ${item.filename} (${buffer.length} bytes in ${elapsed}s)`);

  return {
    id: item.id,
    lang: item.lang,
    filename: item.filename,
    bytes: buffer.length,
    elapsedSeconds: parseFloat(elapsed),
    timestamp: new Date().toISOString()
  };
}

async function main() {
  console.log(`Starting generation of ${items.length} narrations for Lot 15 (Final lot!)...`);
  const report = [];

  for (const item of items) {
    try {
      const res = await generateTTS(item);
      report.push({ ...res, status: 'SUCCESS' });
    } catch (err) {
      console.error(`✗ Error generating ${item.filename}:`, err.message);
      report.push({
        id: item.id,
        lang: item.lang,
        filename: item.filename,
        status: 'ERROR',
        error: err.message
      });
    }
  }

  const reportPath = path.resolve('reports/lot-15-narrations-generation.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nFinished Lot 15! Report saved to ${reportPath}`);
}

main();
