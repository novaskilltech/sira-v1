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

const LOT_03_SCRIPTS = [
  {
    contentId: "HEG-ETP-04",
    locale: "fr",
    filename: "narration-heg-etp-04-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Itinéraire vers Yathrib.

Première partie : Repère et périmètre.
La traversée entre le mont Thawr et l'oasis de Yathrib constitue le corps géographique de l'Hégire, couvrant un trajet d'environ quatre cents à quatre cent cinquante kilomètres à travers des étendues désertiques et rocailleuses. Loin d'emprunter la route caravanière ordinaire qui reliait directement La Mecque à Yathrib en passant par l'intérieur des terres, les voyageurs ont opté pour une trajectoire atypique, longeant d'abord les abords de la plaine côtière de la mer Rouge avant de bifurquer vers les massifs intérieurs. Cette fiche retrace la logique tactique et humaine de ce déplacement d'une douzaine de jours, en distinguant les étapes nommées dans les chroniques des incertitudes cartographiques contemporaines.

Deuxième partie : Éléments sourcés.
Pour assurer la sécurité du périple, les fugitifs font appel à un éclaireur professionnel d'une fidélité éprouvée : Abdallāh ibn Urayqiṭ, membre du clan des Banū ad-Dīl, encore adepte de la religion traditionnelle de ses ancêtres mais engagé par contrat d'embauche. C'est lui qui amène les deux chamelles au pied de Thawr et conduit la petite troupe de quatre hommes : le Prophète, Abū Bakr, son affranchi Āmir ibn Fuhayra et le guide. La marche s'effectue principalement de nuit ou aux heures fraîches de l'aube pour ménager les bêtes et tromper les patrouilles de recherche. Parmi les événements jalonnant la route, la tradition rapporte l'interception manquée par Surāqa ibn Mālik, cavalier appâté par la forte rançon de cent chamelles promise par les chefs qurayshites, ainsi que la halte reposante auprès de la tente d'Umm Maʿbad dans la localité de Qudayd.

Troisième partie : Variantes, silences et limites.
Les historiens classiques comme Ibn Hishām et aṭ-Ṭabarī énumèrent une suite précise de toponymes traversés : Usfān, Qudayd, Thaniyyat al-Marra, Liqf, Marr aẓ-Ẓahrān, jusqu'aux abords de Wādī al-Aqīq. Néanmoins, aucune carte moderne ne peut prétendre reconstituer le tracé exact de cette piste au mètre près. Les lits d'oueds ont été profondément altérés par quatorze siècles d'érosion, et le désert de basalte offre de multiples passes saisonnières. En conséquence, l'application présente un corridor géographique large et indicatif, sans fausse précision kilométrique ni trace satellitaire anachronique.

Quatrième partie : Synthèse pédagogique.
Retenons trois enseignements majeurs. Premièrement, le succès du trajet repose sur l'exploitation pragmatique des compétences nomades, attestée par l'embauche d'un guide expert extérieur à la communauté musulmane. Deuxièmement, le choix d'un itinéraire côtier détourné démontre la volonté délibérée de contourner les points de contrôle traditionnels de Quraysh. Troisièmement, la rigueur historique commande de respecter le flou topographique inhérent au désert ancien, en considérant ces étapes comme des jalons mémoriels plutôt que comme des coordonnées géodésiques fermées.`
  },
  {
    contentId: "HEG-ETP-04",
    locale: "ar",
    filename: "narration-heg-etp-04-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `المسار نحو يثرب.

القسم الأول : تحديد الموضوع ونطاقه.
تشكل المسافة الفاصلة بين جبل ثور وواحة يثرب المتن الجغرافي للهجرة النبوية، قاطعة مسافة تقدر بنحو أربعمئة إلى أربعمئة وخمسين كيلومترًا عبر بوادٍ قاحلة وتضاريس جبلية وعرة. وخلافًا للمسلك المألوف لقوافل التجارة الذي كان يسير مباشرة في بطن الحجاز، سلك الركب مسارًا غير معتاد؛ حيث انحدر غربًا صوب الساحل المحاذي للبحر الأحمر قبل أن ينعطف مجددًا نحو المرتفعات الداخلية. وتسلط هذه البطاقة الضوء على التخطيط المحكم لهذا الارتحال الذي استغرق زهاء اثني عشر يومًا، مميزة بين المحطات الواردة في الأمهات وحدود التعيين الطبوغرافي المعاصر.

القسم الثاني : العناصر المسندة إلى المصادر.
لضمان سلامة المسير، استعان الركب بدليل خبير بالطرق ومسارب الصحراء، وهو عبد الله بن أريقط من بني الديل، وكان على دين قومه إلا أنه وُثق به وأُجر على دلالته. وهو الذي وافاهم بالراحلتين عند غار ثور، ليقود ركبًا مصغرًا ضم أربعة: النبي صلى الله عليه وسلم، وأبا بكر الصديق، وعامر بن فهيرة، والدليل. وكان السير يقع غالبًا في هدأة الليل وبكور الصباح تفاديًا لقيظ النهار وأعين الطلب. ومن أشهر الوقائع المنقولة في الطريق محاولة سراقة بن مالك اللحاق بهم طمعًا في جائزة قريش المغرية البالغة مئة ناقة، وما جرى من ارتداد خيله، فضلاً عن النزول في خيمة أم معبد الخزاعية في قديد.

القسم الثالث : الاختلافات والحدود.
تسرد كتب السيرة، كابن هشام والطبري، سلسلة متتابعة من أسماء المواضع والآبار كعسفان وقديد وثنية المرة ووادي العقيق. غير أن رسم مسار دقيق بالمقاييس المساحية المعاصرة يظل متعذرًا علميًا؛ إذ تبدلت مجاري الأودية ومسالك الحِرار عبر أربعة عشر قرنًا. وتبعًا لذلك، يكتفي التطبيق بعرض نطاق جغرافي عام وممر تقريبي للمسار، دون ادعاء رسم إحداثيات محكمة لا تسندها الآثار.

القسم الرابع : خلاصة تربوية.
نخلص إلى ثلاث ركائز: أولاها الاعتماد على الخبرة الميدانية وحسن اختيار الكفاءات التخصصية، كما تجلى في الاستعانة بالدليل العارف بدروب الصحراء. وثانيتها براعة المناورة المكانية باتخاذ طريق الساحل تشتيتًا للملاحقة. وثالثتها ضرورة التمييز بين المعالم التاريخية الموثقة في الرواية وحدود الإسقاط الخرائطي الحديث، صونًا للأمانة العلمية.`
  },
  {
    contentId: "CHR-03",
    locale: "fr",
    filename: "narration-chr-03-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Jeunesse et activités.

Première partie : Repère et périmètre.
L'itinéraire de la jeunesse du Prophète, de la fin de l'enfance jusqu'au seuil de la maturité, s'enracine au cœur de la société marchande et clanique de La Mecque à la fin du sixième siècle. Ne disposant pas de fortune personnelle héritée, le jeune homme participe activement aux charges et travaux de son environnement familial sous la tutelle de son oncle Abū Ṭālib. Cette fiche examine les deux activités majeures attestées par la tradition — le pastoralisme périurbain et l'apprentissage du commerce caravanier — ainsi que sa participation à des événements collectifs déterminants pour la cité, en mettant en lumière l'émergence précoce de sa réputation morale.

Deuxième partie : Éléments sourcés.
Plusieurs traditions consignées dans les recueils canoniques rappellent que Muḥammad exerça dans sa prime jeunesse l'activité de berger, gardant les troupeaux des notables mecquois sur les collines arides ceinturant la cuvette, contre une modeste rétribution. Vers l'âge de douze ans, il est initié aux réalités du grand commerce en accompagnant son oncle Abū Ṭālib dans un voyage caravanier vers le sud de la Syrie byzantine, à Boṣrā, voyage au cours duquel la tradition situe la rencontre prémonitoire avec le moine chrétien Baḥīrā. À l'âge d'environ vingt ans, il assiste sans prendre part aux violences directes aux affrontements de la guerre sacrilège opposant Quraysh à la confédération de Qays ʿAylān. Peu après, il assiste à la conclusion solennelle du Hilf al-Fudūl, le Pacte des vertueux, conclu dans la demeure d'Abdallāh ibn Judʿān, par lequel plusieurs clans s'engagent à secourir toute personne victime d'injustice commerciale ou d'abus de pouvoir à La Mecque. Sa rectitude scrupuleuse dans les affaires et sa neutralité dans les litiges lui valent alors parmi ses concitoyens le qualificatif d'al-Amīn, l'homme digne de confiance.

Troisième partie : Variantes, silences et limites.
Si le rôle du Pacte des vertueux est unanimement salué pour sa portée humaniste et éthique, les détails de l'épisode du moine Baḥīrā font l'objet de lectures historiographiques variées : les savants critiques du hadith et les historiens modernes y voient une construction narrative théologique visant à inscrire la mission prophétique dans la continuité des écritures antérieures. Par ailleurs, la documentation textuelle sur ses activités entre l'âge de quinze et vingt-cinq ans demeure discontinue. L'application s'en tient aux repères éthiques et économiques fermement établis.

Quatrième partie : Synthèse pédagogique.
Retenons trois enseignements capitaux. Premièrement, la jeunesse du Prophète est marquée par un ancrage dans le labeur quotidien et l'indépendance acquise par le travail. Deuxièmement, son adhésion au Hilf al-Fudūl illustre un engagement moral précoce en faveur des faibles et des étrangers contre l'arbitraire tribal. Troisièmement, la notoriété d'intégrité dont il bénéficie bien avant l'appel à la prophétie souligne la continuité morale de son parcours humain.`
  },
  {
    contentId: "CHR-03",
    locale: "ar",
    filename: "narration-chr-03-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `الشباب والنشاط المجتمعي.

القسم الأول : تحديد الموضوع ونطاقه.
تتأصل مسيرة الشباب في حياة النبي صلى الله عليه وسلم، من يفعة الصبا إلى مشارف الرجولة، في صميم الواقع التجاري والقبلي لمكة المكرمة في أواخر القرن السادس الميلادي. وإذ لم يكن ذا ثروة موروثة، فقد ساهم بجهده الشخصي في متطلبات العيش تحت كفالة عمه أبي طالب. وتستعرض هذه البطاقة نشاطين رئيسين أثبتتهما الروايات: رعي الأغنام في أطراف مكة، والتمرس على تجارة القوافل، إلى جانب مشاركته في أحداث مجتمعية بارزة أسهمت في ترسيخ مكانته الأخلاقية الرفيعة بين قومه.

القسم الثاني : العناصر المسندة إلى المصادر.
أكدت الأحاديث الصحيحة أن النبي صلى الله عليه وسلم رعى الغنم في مطلع شبابه لأهل مكة على قراريط. وحين ناهز الثانية عشرة من عمره، صحب عمه أبا طالب في رحلة تجارية إلى بُصرى الشام، وهي الرحلة التي تروي الأخبار لقاءه فيها بالراهب بحيرا. وفي نحو العشرين من عمره، شهد حرب الفِجار التي نشبت بين قريش وكنانة من جهة وقيس عيلان من جهة أخرى، مقتصرًا دوره على معاونة أعمامه بنبل دون خوض في الدماء. وعقب ذلك، حضر حلف الفضول المشهود في دار عبد الله بن جدعان، حيث تعاهدت بطون من قريش على نصرة المظلوم ورد الحقوق إلى أهلها بمكة سواء كانوا من قاطنيها أو من الغرباء الوافدين عليها. وقد أكسبته نزاهته وصدق معاملته لقب الأمين بين أهل بلده.

القسم الثالث : الاختلافات والحدود.
في حين يحظى حلف الفضول بإجماع المؤرخين على نبله وعمقه الحقوقي، تخضع روايات لقاء بحيرا الراهب لتدقيق إسنادي وتاريخي واسع، حيث يرى فيها الباحثون تجليًا لعلامات النبوة في الذاكرة الدينية. ومن جهة ثانية، تظل الأخبار المفصلة حول سنوات شبابه بين الخامسة عشرة والخامسة والعشرين مجملة وقليلة. ولذلك يعتمد التطبيق على الثوابت الأخلاقية والاجتماعية التي لا خلاف حولها.

القسم الرابع : خلاصة تربوية.
نلخص هذه المرحلة في ثلاث عبر: أولاها شرف العمل والاعتماد على النفس عبر مهنتي الرعي والتجارة. وثانيتها اليقظة الأخلاقية والانتصار لقيم العدل المطلق من خلال حلف الفضول بعيدًا عن التعصب القبلي. وثالثتها أن صفة الأمانة والسمت الحسن شكلا الأساس الراسخ الذي بنى عليه مجتمعه ثقته فيه قبل مبعثه بسنين.`
  },
  {
    contentId: "VIE-02",
    locale: "fr",
    filename: "narration-vie-02-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Matériaux et construction.

Première partie : Repère et périmètre.
L'architecture vernaculaire du Hedjaz au septième siècle répond avec une efficacité remarquable aux contraintes d'un climat aride caractérisé par des amplitudes thermiques sévères et une rareté chronique des ressources forestières. Loin des modèles monumentaux de brique cuite ou de marbre des empires voisins, les bâtisseurs de La Mecque et des oasis occidentales ont su tirer le meilleur parti des matériaux bruts de leur environnement immédiat. Cette fiche décrit les trois composantes structurelles de l'habitat ancien — le basalte des coulées volcaniques, la brique crue en terre limoneuse et les charpentes en palmier dattier — ainsi que les procédés de mise en œuvre artisanale qui assuraient la stabilité et l'isolation des demeures.

Deuxième partie : Éléments sourcés.
Les données issues de l'archéologie régionale concordent avec les témoignages littéraires anciens. Les habitations s'élèvent sur des fondations et des soubassements composés de blocs informes de basalte noir ou de grès local, assemblés à sec ou liés par un mortier d'argile maigre sur cinquante à quatre-vingts centimètres de hauteur. Cette assise minérale protégeait les parois de l'érosion lors des rares mais violentes crues d'orage dévalant les oueds. Les murs sont ensuite maçonnés en briques d'adobe, confectionnées à partir de terre alluviale fine malaxée avec de la paille hachée faisant office d'armature végétale, moulées dans des cadres en bois et séchées lentement au soleil. La toiture repose sur des troncs de palmier dattier refendus en deux ou en quatre servant de solives, recouverts d'un clayonnage serré de palmes et d'un lit de mortier de terre battue assurant l'étanchéité et l'isolation thermique.

Troisième partie : Variantes, silences et limites.
Une distinction géographique nette s'observe entre La Mecque et les oasis de Yathrib ou de Khaybar. À La Mecque, ville encaissée entre deux massifs rocheux abrupts, la pierre de taille et les moellons de granite ou de schiste occupent une part prépondérante dans l'élévation des murs. À l'inverse, dans les oasis agricoles, l'abondance des limons de crues et des palmeraies fait de l'adobe et du bois de palmier les composants quasi exclusifs. En raison du caractère biodégradable de la terre crue et des reconstructions permanentes sur les mêmes terroirs, aucun vestige d'habitat domestique privé du septième siècle n'est intégralement conservé à ce jour.

Quatrième partie : Synthèse pédagogique.
Retenons trois principes essentiels. Premièrement, la construction traditionnelle du Hedjaz repose sur un recyclage intégral de matériaux géologiques et végétaux locaux. Deuxièmement, l'épaisseur des parois d'argile confère aux habitations une inertie thermique exemplaire, retardant l'entrée de la chaleur le jour et restituant la tiédeur la nuit. Troisièmement, cette architecture sobre et fonctionnelle reflète un idéal de modération matérielle, parfaitement accordé à la vie quotidienne de l'époque de la Sîra.`
  },
  {
    contentId: "VIE-02",
    locale: "ar",
    filename: "narration-vie-02-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `مواد البناء والعمارة التقليدية.

القسم الأول : تحديد الموضوع ونطاقه.
عكست العمارة التقليدية في إقليم الحجاز خلال القرن السابع الميلادي قدرة فائقة على مواجهة قسوة المناخ الصحراوي وندرته الشديدة في الأخشاب ومواد البناء الفاخرة. وبعيدًا عن الأنماط المعمارية المشيدة بالحجر المصقول أو الرخام الشائعة في الإمبراطوريات المجاورة، طوّع أهل مكة وسكان الواحات المجاورة خامات بيئتهم المباشرة لبناء مساكن متينة وملائمة بيئيًا. وتستعرض هذه البطاقة الأركان الثلاثة للعمارة الحجازية: حجارة البازلت البركانية، وطوب اللَّبِن المجفف، وخشب النخيل، كاشفة عن أساليب البناء التي وفرت التماسك والعزل الحراري للمنازل.

القسم الثاني : العناصر المسندة إلى المصادر.
تتطابق المعطيات الميدانية للحفريات الأثرية في الجزيرة العربية مع ما نقلته النصوص الكلاسيكية. فقد تأسست جدران المساكن على قواعد صخرية من صخور البازلت الأسود أو الحجر الرملي، تُرفع بمقدار نصف متر إلى ثمانين سنتيمترًا لتشكيل حاجز وقائي يحمي البناء من نحر السيول الموسمية المباغتة. ثم تُرفع الحوائط بقوالب اللَّبِن المصنوع من طين الغرين الممزوج بالتّبن لزيادة تماسكه، والمجفف تحت أشعة الشمس. وللتسقيف، اعتمد البناؤون على جذوع النخيل المشطورة جسورًا رئيسة، تُبسط فوقها طبقات من جريد النخل المنسوج والحصير، وتُختم بطبقة سميكة من الطين المرصوص للعزل والحماية من الأمطار.

القسم الثالث : الاختلافات والحدود.
يظهر التمايز الإقليمي جليًا بين بيئة مكة الجبلية والواحات الزراعية كيثرب وخيبر؛ ففي مكة حظيت الحجارة الجرانيتية بحضور أكبر في بناء الجدران نظرًا لطبيعتها الصخرية، بينما ساد اللَّبِن وخشب النخيل في الواحات لغزارة الطين والبساتين. وبسبب سرعة اندثار الطين أمام العوامل الجوية وتوالي البناء فوق المواضع ذاتها، لم تصلنا بيوت سكنية مكتملة المعالم من القرن السابع.

القسم الرابع : خلاصة تربوية.
نلخص ذلك في ثلاث خصائص: أولاها الاعتماد التام على المواد الطبيعية المستدامة المتاحة في البيئة المحيطة. وثانيتها الكفاءة الحرارية العالية للجدران الطينية التي تحتفظ باعتدال الهواء وتكسر حدة الهجير. وثالثتها التناغم الوثيق بين بساطة المسكن واحتياجات الإنسان اليومية في عصر التنزيل.`
  }
];

const draftsDir = path.resolve("public/media/drafts");
if (!fs.existsSync(draftsDir)) {
  fs.mkdirSync(draftsDir, { recursive: true });
}

async function generateNarrations() {
  console.log(`Starting generation of ${LOT_03_SCRIPTS.length} narrations for Lot 3...`);
  const results = [];

  for (const item of LOT_03_SCRIPTS) {
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
  const reportPath = path.resolve("reports/lot-03-narrations-generation.json");
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    provider: "OpenRouter",
    model: "minimax/speech-2.8-hd",
    statusNote: "LOT_03_DEMO_NON_VALIDE",
    results
  }, null, 2));

  console.log(`\nFinished Lot 3! Report saved to ${reportPath}`);
}

generateNarrations();
