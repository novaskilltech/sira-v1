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

const LOT_08_SCRIPTS = [
  {
    contentId: "CHR-11",
    locale: "fr",
    filename: "narration-chr-11-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Année de tristesse et épisode de Taïf.

Première partie : Repère et périmètre.
L'an 619 de l'ère chrétienne s'inscrit dans la mémoire musulmane comme l'Année de la tristesse. À quelques mois d'intervalle, le Prophète est frappé par une double perte dévastatrice : son épouse Khadija, appui moral inébranlable, puis son oncle Abu Talib, doyen protecteur des Banu Hashim. Dépourvu du bouclier clanique ancestral face aux attaques des oligarques mecquois conduits par Abu Lahab, Muhammad entreprend le voyage vers la cité montagneuse d'al-Ta'if, fief des Thaqif, en quête d'un sanctuaire et d'une alliance pour la foi naissante.

Deuxième partie : Éléments sourcés.
Accompagné de son affranchi Zayd ibn Haritha, le Prophète se heurte à l'arrogance méprisante des trois chefs régnant sur al-Ta'if. Non contents de rejeter son message, les notables excitent contre lui les esclaves et la jeunesse désœuvrée. Formant une double haie le long de la route, la foule le lapide sans pitié jusqu'à ensanglanter ses chevilles, tandis que Zayd tente héroïquement de faire écran de son corps. Réfugié dans un verger appartenant aux fils de Rabia, le Prophète prononce sous une treille de vigne une prière d'une intensité spirituelle universelle : Seigneur, c'est à Toi que je me plains de ma faiblesse... Si Tu n'es pas en colère contre moi, peu m'importe ce que j'endure ! Émus, les propriétaires lui font porter du raisin par leur serviteur chrétien Addas, qui s'incline avec vénération en entendant le nom divin. Pour réintégrer La Mecque, le Prophète doit solliciter la protection coutumière de Mut'im ibn Adi, un polythéiste intègre.

Troisième partie : Variantes, silences et limites.
Si la sortie vers al-Ta'if et le refuge dans le verger des fils de Rabia sont établis dans le Sahih al-Bukhari (3231) et le Sahih Muslim (1795, hadith d'A'isha), le texte de l'invocation de Ta'if ainsi que le dialogue avec Addas proviennent des récits biographiques d'Ibn Ishaq et d'al-Tabarani avec une chaîne dont la faiblesse formelle est signalée par les spécialistes du hadith, de même que l'appellation d'Année de la tristesse est une désignation historiographique postérieure. L'application respecte rigoureusement l'aniconisme : aucune scène figurative ni silhouette humaine.

Quatrième partie : Synthèse pédagogique.
Trois enseignements majeurs se dégagent de cet épisode. Premièrement, l'épreuve d'al-Ta'if illustre le renoncement total à l'orgueil et l'endurance absolue face à la violence aveugle. Deuxièmement, la bienveillance manifestée envers Addas témoigne de l'ouverture spirituelle aux cœurs sincères. Troisièmement, le refus d'al-Ta'if prépare l'esprit prophétique à tourner ses regards vers Yathrib, où s'ouvrira l'horizon de l'Hégire.`
  },
  {
    contentId: "CHR-11",
    locale: "ar",
    filename: "narration-chr-11-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `عام الحزن ورحلة الطائف.

القسم الأول : تحديد الموضوع ونطاقه.
اشتهر عام 619 للميلاد في كتب السيرة المتأخرة بعام الحزن؛ حيث تتابعت المحن على النبي صلى الله عليه وسلم بوفاة خديجة رضي الله عنها سند بيته، وأبي طالب كافل صباه ودرع عشيرته. وبانتقال الزعامة إلى أبي لهب رُفعت الحماية عن النبي، فضاقت عليه مكة برحابها، فخرج إلى الطائف يبتغي النصرة من سادة ثقيف لتبليغ كلمة التوحيد.

القسم الثاني : العناصر المسندة إلى المصادر.
ثبت أصل خروج النبي إلى الطائف ولجوئه إلى حائط عتبة وشيبة ابني ربيعة في الصحيحين من حديث عائشة رضي الله عنها (البخاري 3231، ومسلم 1795). وتورد كتب السير كابن إسحاق والطبراني استغراق سفهاء ثقيف في أذاه ووقوف زيد بن حارثة يقيه بنفسه، ومناجاته المشهورة تحت ظل الكرم: اللهم إليك أشكو ضعف قوتي، وقلة حيلتي، وهواني على الناس... إن لم يكن بك علي غضب فلا أبالي، وقصة إرسال ابني ربيعة عنباً مع غلامهما النصراني عداس، ثم عودته إلى مكة في جوار المطعم بن عدي.

القسم الثالث : الاختلافات والحدود.
يميز المحدثون بين أصل رحلة الطائف الثابت في الصحيحين، وبين دعاء الطائف وقصة عداس المرويين عند ابن إسحاق والطبراني بإسناد فيه ضعف لإرساله أو عنعنة ابن إسحاق وإن اشتهرا في كتب السير، كما أن تسمية عام الحزن اصطلاح تاريخي لاحق. ويحرص الأطلس على صون قداسة النص التاريخي بتجريده من أي تشخيص فني أو تصوير حسي للأذى.

القسم الرابع : خلاصة تربوية.
نستخلص من رحلة الطائف ثلاث عبر خالدة: أولاها أن طريق الإصلاح والعدالة محفوف بالتضحية والصبر الجميل. وثانيتها أن الرضا بالله والاستغناء بلطفه هو الحصن المنيع في مواجهة الشدائد. وثالثتها أن انغلاق الأبواب في وجوه المصلحين هو إيذان بفتح آفاق أعظم، كما حدث بانفتاح قلوب أهل يثرب للرسالة.`
  },
  {
    contentId: "CHR-12",
    locale: "fr",
    filename: "narration-chr-12-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Rencontres de Yathrib et engagements d'al-‘Aqaba.

Première partie : Repère et périmètre.
Après la fermeture brutale de La Mecque et d'al-Ta'if, le Prophète consacre les rassemblements des foires caravanières de Mina à prospecter méthodiquement les délégations tribales. En 620, il aborde près du tertre d'al-Aqaba six membres de la tribu des Khazraj de Yathrib. Cette prise de contact inaugure un tournant décisif : en deux années de négociations clandestines, Yathrib, oasis déchirée par la guerre civile fratricide de Bu'ath, s'ouvre à la foi coranique et offre le cadre institutionnel de l'Hégire.

Deuxième partie : Éléments sourcés.
Ayant reconnu dans le message prophétique l'annonce attendue depuis des générations, les pionniers de Yathrib propagent l'Islam au retour dans leur oasis. En 621, douze émissaires prêtent le Premier serment d'al-Aqaba, s'engageant à abandonner l'idolâtrie, le vol, l'infanticide et le mensonge. Le Prophète leur adjoint Mus'ab ibn Umayr, ambassadeur d'une diplomatie admirable, qui convertit par la persuasion les grands chefs Sa'd ibn Mu'adh et Usayd ibn Hudayr.
L'année suivante, en juin 622, soixante-treize hommes et deux femmes de Yathrib concluent de nuit le Second serment d'al-Aqaba, un pacte d'assistance mutuelle et de défense collective. En présence d'al-Abbas, les notables de Yathrib jurent sur la main du Prophète de le protéger lui et les émigrants mecquois comme ils défendraient leurs propres familles, scellant ainsi l'alliance fondatrice qui autorise l'exode et préfigure la création de l'État médinois.

Troisième partie : Variantes, silences et limites.
Les chroniques d'Ibn Ishaq fournissent la liste précise des signataires et des douze représentants choisis lors de cette nuit historique. L'application présente cet engagement comme un pacte politique majeur, sans reconstitution imagée des assemblées, conformément aux préceptes aniconiques stricts.

Quatrième partie : Synthèse pédagogique.
Trois principes fondateurs émergent de ces accords. Premièrement, la réconciliation de l'oasis de Yathrib démontre le pouvoir pacificateur de l'Islam face aux haines tribales. Deuxièmement, la mission éducative de Mus'ab ibn Umayr met en avant le rôle de la transmission sereine du savoir. Troisièmement, le serment d'al-Aqaba substitue au lien du sang une citoyenneté contractuelle fondée sur la justice et la fraternité.`
  },
  {
    contentId: "CHR-12",
    locale: "ar",
    filename: "narration-chr-12-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `لقاءات يثرب وبيعة العقبة.

القسم الأول : تحديد الموضوع ونطاقه.
عقب انسداد سبل الدعوة في مكة والطائف، استثمر النبي صلى الله عليه وسلم مواسم الحج بمِنى ليعرض دعوته على القبائل. وفي عام 620 للميلاد، التقى عند جمرة العقبة بستة نفر من خزرج يثرب. كانت تلك الشرارة الأولى لعهد جديد نقل الإسلام من مرحلة الحصار إلى فضاء الملاذ السياسي الحر بعد سنوات من الصراع القبلي الدامي بين الأوس والخزرج.

القسم الثاني : العناصر المسندة إلى المصادر.
أسلم الرهط الستة وعادوا إلى يثرب يدعون قومهم. وفي موسم 621، بايع اثنا عشر رجلاً بيعة العقبة الأولى على الطاعة ومكارم الأخلاق ونبذ الشرك. وأرسل النبي معهم مصعب بن عمير أول سفير في الإسلام، فاستطاع بحسن بيانه ورفقه أن يهدي كبار الزعماء كسعد بن معاذ، حتى دخل الإسلام كل دار في المدينة.
وفي ذي الحجة من عام 622، اجتمع ثلاثة وسبعون رجلاً وامرأتان في شعب العقبة سراً في جوف الليل، ليعقدوا بيعة العقبة الثانية الكبرى. بايعوا النبي على النصرة والمنعة والجهاد، وأن يمنعوه مما يمنعون منه نساءهم وأبناءهم، فاختار منهم اثني عشر نقيباً. وكان هذا الميثاق التاريخي أعظم حلف سياسي ودفاعي دشن مرحلة تأسيس الدولة ومهد للهجرة المباركة.

القسم الثالث : الاختلافات والحدود.
توثق كتب السير والمغازي أسماء النقباء والبيعة بدقة إسنادية عالية، مع اتفاق تام على طابعها السري المحكم. ويلتزم الأطلس بالوقار التاريخي؛ فلا تصوير للوجوه أو الجموع في الشعب، بل إبراز لقيمة العهد ومغزاه في مسيرة الأمة.

القسم الرابع : خلاصة تربوية.
نستحضر من بيعتي العقبة ثلاث ركائز كبرى: أولاها أن رسالة التوحيد نجحت في إخماد نيران العصبية الجاهلية وتأليف القلوب. وثانيتها أثر الحكمة الدبلوماسية والخطاب التربوي الهادئ في نشر المبادئ. وثالثتها أن قيام الدول والمجتمعات العادلة ينهض على العقود الواضحة والمسؤولية التضامنية.`
  },
  {
    contentId: "VIE-09",
    locale: "fr",
    filename: "narration-vie-09-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Stockage domestique.

Première partie : Repère et périmètre.
Dans l'habitat d'Arabie occidentale, composé de pièces simples en briques crues, moellons et toitures de troncs de palmiers, l'agencement du stockage intérieur déterminait l'hygiène et la sécurité alimentaire des familles. Les foyers devaient organiser la conservation de l'eau, des grains et des denrées grasses dans un environnement exposé aux insectes, aux rongeurs et à la chaleur, imposant un choix judicieux de matériaux stables tels que l'argile cuite et le cuir tanné.

Deuxième partie : Éléments sourcés.
Pour les liquides, la grande jarre en terre cuite poreuse OBJ-007 occupait une place centrale dans les vestibules ombragés, posée sur un trépied ou un socle de pierre qui facilitait la ventilation et permettait à l'eau de s'évaporer lentement pour rafraîchir son contenu. Les outres souples en cuir OBJ-006 étaient quant à elles suspendues aux poutres maîtresses des toits, tenues à distance des poussières du sol et des nuisibles rampants.
Les denrées solides, telles que l'orge, le blé et les fèves sèches, étaient conservées dans des jarres de stockage fermées par des opercules d'argile ou dans de grands paniers tressés en feuilles de palmier doum enduits de terre battue. Les dattes mûres, comprimées dans des céramiques à pâte dense, sécrétaient leur propre sirop protecteur, tandis que le sel gemme, le beurre clarifié et les remèdes séchés étaient rangés dans des récipients secondaires hermétiques.

Troisième partie : Variantes, silences et limites.
L'archéologie islamique primitive met en évidence une typologie variée de récipients selon les strates sociales, allant de poteries grossières communes aux céramiques engobées plus soignées. L'atlas présente ces témoins archéologiques sous un éclairage purement fonctionnel et didactique, excluant toute figuration humaine.

Quatrième partie : Synthèse pédagogique.
Trois principes d'économie domestique résument ces usages. Premièrement, l'élévation des denrées sur socles ou suspentes illustre une prévention sanitaire élémentaire mais efficace contre les parasites. Deuxièmement, la répartition entre jarres sédentaires et outres mobiles répond à une complémentarité pragmatique. Troisièmement, la sobriété du mobilier met en relief une utilisation intégrale et respectueuse des matières premières offertes par le milieu.`
  },
  {
    contentId: "VIE-09",
    locale: "ar",
    filename: "narration-vie-09-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `التخزين المنزلي.

القسم الأول : تحديد الموضوع ونطاقه.
في البيوت الطينية والحجرية البسيطة بالحجاز، شكل تدبير التخزين المنزلي عنصراً حاسماً في حفظ الصحة العامة وتأمين الأقوات من مخاطر التلف والغبار وفساد الحشرات. وفي ظل غياب الخزائن الخشبية المرتفعة، اعتمد المجتمع على تنظيم المساحات الأرضية واستغلال السقوف لترتيب أوعية الفخار والجلود وألياف النخيل.

القسم الثاني : العناصر المسندة إلى المصادر.
احتل تخزين الماء المكانة الأبرز في زوايا الظل؛ حيث استقرت الجرار الفخارية الكبيرة كالقطعة OBJ-007 على حوامل حجرية لتيسير الترشح والتبريد بالتبخر، بينما علقت القرب الجلدية مثل OBJ-006 في أخشاب السقوف العالية لتبقى في مأمن من الدواب والغبار ولتكون سهلة التناول.
وكانت الحبوب كالقمح والشعير تُحفظ في خوابٍ فخارية ضخمة تُسد فوهاتها بأغطية طينية، أو في قفاف من خوص النخيل المحكم. أما التمور فكانت تُكنز في جرار خاصة تفرز الدبس الحافظ، بينما وُضعت الأدهان والتوابل في أوعية جلدية وخزفية أصغر حجماً. وتدل الآثار المادية على أن البيت الحجازي اتسم بنظام بيئي متقن يعزل المؤن عن الرطوبة الأرضية ويوفر التهوية الكافية.

القسم الثالث : الاختلافات والحدود.
تبين الكشوفات الأثرية استقرار هذه النماذج الخزفية عبر العصور مع تفاوت في جودة الحرق ونوعية الطين بين مكة ويثرب. ويلتزم التطبيق بالعرض المتحفي المجرد للقطع، مبرزاً البراعة النفعية دون أي تجسيد شخصي.

القسم الرابع : خلاصة تربوية.
نستخلص من التخزين المنزلي ثلاث فوائد عملية: أولاها حسن استغلال الخواص الفيزيائية للفخار في حفظ الأطعمة وتبريد المياه. وثانيتها الحذر الصحي برفع الأقوات عن الأرض صوناً لها من الهوام. وثالثتها ترشيد المتاح من الموارد وتطويع خامات البيئة لخدمة الاستقرار الأسري.`
  },
  {
    contentId: "HEG-DOS-08",
    locale: "fr",
    filename: "narration-heg-dos-08-fr.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `Préparation et organisation du voyage.

Première partie : Repère et périmètre.
L'Hégire du Prophète et d'Abu Bakr en septembre 622 constitue une opération stratégique d'une remarquable précision logistique, loin de toute fuite désordonnée. Instruit du complot d'assassinat fomenté par les chefs de Quraysh réunis à Dar al-Nadwa, Muhammad conçoit un plan d'évasion rigoureux combinant diversion tactique, réseau de soutien clandestin et choix d'un itinéraire secret pour déjouer les poursuites des cavaliers mecquois.

Deuxième partie : Éléments sourcés.
Le plan s'ouvre par une manœuvre de diversion audacieuse : Ali ibn Abi Talib s'étend dans le lit du Prophète, revêtu de son manteau vert du Yémen, pour tromper les assaillants assiégeant la demeure jusqu'au lever du jour. Pendant ce temps, Muhammad et Abu Bakr s'éclipsent vers le sud et gravissent les pentes abruptes du mont Thawr pour s'isoler trois jours dans sa grotte, prenant le contre-pied de la route normale du nord.
Autour du mont Thawr, une chaîne de soutien familiale coordonnée opère sans faille : Abd Allah, fils d'Abu Bakr, collecte les renseignements politiques à La Mecque et les transmet chaque soir ; le berger Amir ibn Fuhayra conduit son troupeau sur ses pas pour effacer les empreintes dans le sable et fournir du lait frais ; enfin, Asma bint Abi Bakr brave les menaces d'Abu Jahl pour apporter les vivres de nuit, nouant les provisions avec son propre bandeau. Pour guider leur traversée à travers les défilés côtiers inexplorés, Abu Bakr engage Abd Allah ibn Urayqit, un expert bédouin polythéiste mais d'une loyauté absolue, qui conduit les deux montures préparées avec soin.

Troisième partie : Variantes, silences et limites.
L'historiographie confirme que chaque détail logistique fut anticipé pendant plusieurs mois. L'application présente cette épopée dans sa dimension géopolitique et matérielle exacte, sans recours à l'imaginaire figuratif, exaltant la valeur du renseignement et la rigueur de l'organisation.

Quatrième partie : Synthèse pédagogique.
Trois leçons majeures illuminent cette préparation. Premièrement, le recours exhaustif aux moyens humains et stratégiques s'articule parfaitement avec la foi spirituelle la plus pure. Deuxièmement, la participation active des jeunes, des femmes et d'un guide non-musulman illustre la mobilisation solidaire des compétences. Troisièmement, le sang-froid et le secret absolu des opérations posent les bases de la gouvernance prophétique.`
  },
  {
    contentId: "HEG-DOS-08",
    locale: "ar",
    filename: "narration-heg-dos-08-ar.mp3",
    model: "minimax/speech-2.8-hd",
    voice: "onyx",
    text: `إعداد الرحلة وتنظيمها.

القسم الأول : تحديد الموضوع ونطاقه.
لم تكن الهجرة النبوية إلى المدينة المنورة عملاً عفوياً، بل كانت عملية استراتيجية محكمة اتسمت بأعلى درجات التخطيط الأمني والتنظيم اللوجستي. فحين أجمعت قريش في دار الندوة على قتل النبي صلى الله عليه وسلم بسيوف مجتمعة من كل القبائل، وضع المصطفى وصاحبه أبو بكر خطة محكمة أحبطت المخطط المكي وأمنت مسار الرحلة التاريخية.

القسم الثاني : العناصر المسندة إلى المصادر.
اعتمدت الخطة على التمويه الذكي؛ فنام علي بن أبي طالب رضي الله عنه في فراش النبي متلفعاً ببرده الحضرمي الأخضر ليوهم المتربصين ببقاء الرسول حتى الصباح. بينما انطلق النبي وأبو بكر جنوباً في الاتجاه المعاكس لطريق يثرب، ليمكثا ثلاثة أيام في غار ثور الوعر حتى تخف وطأة الطلب.
وتكاملت شبكة الدعم السري بكفاءة نادرة: فكان عبد الله بن أبي بكر ينقل الأخبار من مكة ليلاً، وعامر بن فهيرة يرعى الغنم ليعفي على الآثار ويمدهما باللبن، وأسماء بنت أبي بكر تنقل الزاد مجتازة الصعاب حتى شقت نطاقها لربطه. واستأجر أبو بكر عبد الله بن أريقط، وهو خبير مسالك مشرك عُرف بالأمانة التامة، ليقود الراحلتين في درب ساحلي وعر بعيد عن أعين الرقباء، حتى بلغا قباء بسلام.

القسم الثالث : الاختلافات والحدود.
تجمع كتب السيرة الموثقة على كل تفاصيل هذه الخطة وإحكام مراحلها الزمنية. ويحافظ الأطلس على الرصانة العلمية المانعة لأي تمثيل للأشخاص، مبرزاً الأبعاد القيادية والجغرافية لمسار الهجرة.

القسم الرابع : خلاصة تربوية.
نلخص عبقرية هذا الإعداد في ثلاث ركائز: أولاها المزاوجة الكاملة بين الأخذ بجميع الأسباب المادية الممكنة وصدق التوكل على الله. وثانيتها الدور الحاسم للشباب والمرأة في إنجاح المهام الكبرى. وثالثتها الاستعانة بذوي الخبرة والأمانة بصرف النظر عن انتماءاتهم، تأسيساً لقيم الكفاءة والمهنية في بناء الدولة.`
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
  console.log("Starting generation of 8 narrations for Lot 8...");
  const results = [];
  for (const script of LOT_08_SCRIPTS) {
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
    statusNote: "LOT_08_DEMO_NON_VALIDE",
    results
  };

  fs.writeFileSync("reports/lot-08-narrations-generation.json", JSON.stringify(report, null, 2));
  console.log("\nFinished Lot 8! Report saved to " + path.resolve("reports/lot-08-narrations-generation.json"));
}

main().catch(err => {
  console.error("Fatal in main:", err);
  process.exit(1);
});
