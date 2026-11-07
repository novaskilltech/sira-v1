import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  CheckCircle2,
  Compass,
  Headphones,
  Layers,
  MapPin,
  Orbit,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context";
import { MapArt, ObjectArt } from "../components/Artwork";
import { entryRoute } from "../components/Shared";
import { MediaImage } from "../components/MediaImage";

const ThreeScene = lazy(() => import("../components/ThreeScene"));

interface ShowcaseArtifact {
  id: string;
  inv: string;
  glbUrl: string;
  ficheRoute: string;
  kind: "jar" | "scale" | "lamp" | "calame";
  fr: {
    tab: string;
    title: string;
    room: string;
    period: string;
    material: string;
    dimensions: string;
    provenance: string;
    usage: string;
    note: string;
  };
  ar: {
    tab: string;
    title: string;
    room: string;
    period: string;
    material: string;
    dimensions: string;
    provenance: string;
    usage: string;
    note: string;
  };
}

const SHOWCASE_ARTIFACTS: ShowcaseArtifact[] = [
  {
    id: "OBJ-007",
    inv: "INV · OBJ-007 · GLB",
    glbUrl: "/media/demo/OBJ-007.glb",
    ficheRoute: "/vie/VIE-02",
    kind: "jar",
    fr: {
      tab: "01 · Grande jarre à eau",
      title: "Grande jarre à eau en terre cuite",
      room: "SALLE II · EAU & HOSPITALITÉ",
      period: "VIIᵉ siècle EC (typologie du Hijâz)",
      material: "Terre cuite poreuse à engobe ocre clair",
      dimensions: "Modèle 3D PBR · Panse ovoïde à col évasé",
      provenance: "Usage domestique et haltes du Hijâz (repère éditorial)",
      usage: "Conservation et rafraîchissement de l’eau par évaporation",
      note: "La porosité naturelle de l’argile maintient la fraîcheur de l’eau puisée aux puits. Modèle géométrique de démonstration strictement aniconique.",
    },
    ar: {
      tab: "٠١ · الجرة الفخارية للماء",
      title: "جرة فخارية كبيرة لحفظ الماء",
      room: "القاعة ٢ · الماء والضيافة",
      period: "القرن السابع الميلادي (طراز حجازي)",
      material: "فخار مسامي بطلاء طيني فاتح",
      dimensions: "مجسم ثلاثي الأبعاد PBR · بدن بيضوي وعنق متسع",
      provenance: "الاستعمال المنزلي ومحطات الحجاز (تمثيل تعليمي)",
      usage: "حفظ الماء وتبريده طبيعياً عبر المسام الفخارية",
      note: "تسمح مسامية الفخار بتبريد الماء المستخرج من الآبار في المناخ الحار. نموذج هندسي تجريبي خالٍ تماماً من أي تصاوير لذوات الأرواح.",
    },
  },
  {
    id: "OBJ-014",
    inv: "INV · OBJ-014 · GLB",
    glbUrl: "/media/demo/OBJ-014.glb",
    ficheRoute: "/vie/VIE-04",
    kind: "scale",
    fr: {
      tab: "02 · Balance à deux plateaux",
      title: "Balance de marchand à deux plateaux (Mîzân)",
      room: "SALLE IV · MARCHÉS & MESURES",
      period: "Époque prophétique · Marchés du Hijâz",
      material: "Alliage cuivreux (bronze/laiton) et cordelettes",
      dimensions: "Modèle 3D PBR · Fléau symétrique et 2 plateaux",
      provenance: "Échanges commerciaux de La Mecque et Médine",
      usage: "Pesée loyale des grains, dattes, encens et métaux",
      note: "Évoque l’éthique coranique et prophétique de la juste pesée (al-qist) et la réglementation des marchés dans la jurisprudence malékite.",
    },
    ar: {
      tab: "٠٢ · الميزان ذو الكفتين",
      title: "ميزان تجاري ذو كفتين (الميزان والقسط)",
      room: "القاعة ٤ · الأسواق والمكاييل",
      period: "العهد النبوي · أسواق الحجاز",
      material: "سبيكة نحاسية (برونز) وخيوط تعليق",
      dimensions: "مجسم ثلاثي الأبعاد PBR · عارضة متوازنة وكفتان",
      provenance: "المبادلات التجارية في مكة والمدينة",
      usage: "الوزن بالقسط للحبوب والتمور والطيب والمعادن",
      note: "يجسّد الأمر القرآني والنبوي بإيفاء الكيل والميزان، وضوابط المعاملات والأسواق المقررة في الفقه المالكي.",
    },
  },
  {
    id: "OBJ-001",
    inv: "INV · OBJ-001 · GLB",
    glbUrl: "/media/demo/OBJ-001.glb",
    ficheRoute: "/vie/VIE-01",
    kind: "lamp",
    fr: {
      tab: "03 · Lampe à huile",
      title: "Lampe à huile domestique (Misbâh)",
      room: "SALLE I · ESPACES DOMESTIQUES",
      period: "VIIᵉ siècle EC · Maisons de Médine",
      material: "Terre cuite moulée à bec pincé",
      dimensions: "Modèle 3D PBR · Réservoir ovale et anse annulaire",
      provenance: "Intérieurs domestiques et lieux d’étude",
      usage: "Éclairage nocturne à l’huile végétale et mèche de lin",
      note: "Objet emblématique de la sobriété des demeures médinoises, décoré uniquement de nervures géométriques et végétales stylisées.",
    },
    ar: {
      tab: "٠٣ · المصباح الزيتي",
      title: "مصباح فخاري زيتي للإضاءة المنزلية",
      room: "القاعة ١ · الفضاء المنزلي",
      period: "القرن السابع الميلادي · بيوت المدينة",
      material: "فخار مشكّل ذو فوهة للفتيل",
      dimensions: "مجسم ثلاثي الأبعاد PBR · حوض بيضوي ومقبض حلقي",
      provenance: "البيوت ومجالس العلم الليلية",
      usage: "الإضاءة الليلية بالزيت النباتي وفتيل الكتان",
      note: "قطعة تعكس بساطة البيوت النبوية والمدنية، مزينة حصراً بزخارف هندسية ونباتية مجردة وفق الضوابط الشرعية.",
    },
  },
  {
    id: "OBJ-018",
    inv: "INV · OBJ-018 · GLB",
    glbUrl: "/media/demo/OBJ-018.glb",
    ficheRoute: "/vie/VIE-05",
    kind: "calame",
    fr: {
      tab: "04 · Calame et encrier",
      title: "Calame de roseau taillé et encrier (Qalam & Dawât)",
      room: "SALLE V · ÉCRITURE & TRANSMISSION",
      period: "VIIᵉ siècle EC · Scribes et pactes",
      material: "Roseau taillé (qasab) et récipient à encre",
      dimensions: "Modèle 3D PBR · Bec fendu et encrier cylindrique",
      provenance: "Mise par écrit de la Révélation et des traités",
      usage: "Consignation des versets, lettres diplomatiques et pactes",
      note: "Illustre la culture de l’écrit, la rédaction de la Sahîfa de Médine et la transmission scrupuleuse des textes dès la première génération.",
    },
    ar: {
      tab: "٠٤ · القلم والدواة",
      title: "قلم القصب المبرِيّ والدواة (أدوات الكتابة)",
      room: "القاعة ٥ · الكتابة والتدوين",
      period: "القرن السابع الميلادي · كتّاب الوحي والعهود",
      material: "قصب مبرِيّ ومحبرة تقليدية",
      dimensions: "مجسم ثلاثي الأبعاد PBR · سن مشقوق ودواة أسطوانية",
      provenance: "تدوين الوحي والرسائل النبوية والصحيفة",
      usage: "كتابة الآيات والعهود والكتب إلى الملوك والقبائل",
      note: "يبرز مكانة القلم والكتابة في الحضارة الإسلامية منذ تدوين صحيفة المدينة ورسائل النبي ﷺ.",
    },
  },
];

interface HegiraWaypoint {
  stepNum: string;
  ficheId: string;
  altitude: string;
  distanceNoteFr: string;
  distanceNoteAr: string;
  titleFr: string;
  titleAr: string;
  descFr: string;
  descAr: string;
  statusFr: string;
  statusAr: string;
}

const HEGIRA_WAYPOINTS: HegiraWaypoint[] = [
  {
    stepNum: "01",
    ficheId: "HEG-ETP-01",
    altitude: "~280 m",
    distanceNoteFr: "Point de départ · Chronologie établie",
    distanceNoteAr: "نقطة الانطلاق · واقعة ثابتة",
    titleFr: "La Mecque — Préparatifs et départ",
    titleAr: "مكة المكرمة — الإعداد والخروج",
    descFr:
      "Organisation méthodique du départ avec Abû Bakr, ‘Alî, Asmâ’ et le guide ‘Abd Allâh ibn Urayqit après le second serment d’al-‘Aqaba.",
    descAr:
      "الترتيب المحكم للخروج مع أبي بكر الصديق وعلي وأسماء والدليل عبد الله بن أريقط بعد بيعة العقبة الثانية.",
    statusFr: "Sources : Sahîh al-Bukhârî · Ibn Hishâm",
    statusAr: "المصادر: صحيح البخاري · سيرة ابن هشام",
  },
  {
    stepNum: "02",
    ficheId: "HEG-ETP-03",
    altitude: "~748 m",
    distanceNoteFr: "Sud de La Mecque · 3 nuits de halte",
    distanceNoteAr: "جنوب مكة · مكث ثلاث ليالٍ",
    titleFr: "Grotte de Thawr — Le refuge au sud",
    titleAr: "غار ثور — اللجوء جنوب مكة",
    descFr:
      "Orientation à contre-pied vers le sud montagneux pendant trois nuits. Le récit coranique (9, 40) est établi ; les détails de l’entrée sont distingués selon leur degré d’authenticité.",
    descAr:
      "الاتجاه جنوباً عكس طريق القوافل المعتاد والمكث ثلاث ليالٍ؛ النص القرآني (التوبة: ٤٠) قطعي مع بيان درجات الروايات التفصيلية.",
    statusFr: "Coran 9, 40 · Sahîh al-Bukhârî",
    statusAr: "القرآن الكريم (التوبة: ٤٠) · صحيح البخاري",
  },
  {
    stepNum: "03",
    ficheId: "HEG-ETP-04",
    altitude: "~50–140 m",
    distanceNoteFr: "Corridor côtier · Tracé général indicatif",
    distanceNoteAr: "الممر الساحلي · مسار إجمالي تقريبي",
    titleFr: "Voie côtière de la Tihâma & Qudayd",
    titleAr: "طريق الساحل وتهامة وقديد",
    descFr:
      "Bifurcation vers le littoral de la mer Rouge par des sentiers peu fréquentés (épisode de Surâqa ibn Mâlik et halte d’Umm Ma‘bad à Qudayd).",
    descAr:
      "سلوك الطريق الساحلي غير المألوف بمحاذاة البحر الأحمر (خبر سراقة بن مالك والتوقف عند خيمة أم معبد في قديد).",
    statusFr: "Repères toponymiques · Tracé au mètre non fixé",
    statusAr: "معالم اسمية محفوظة · المسار التفصيلي تقريبي",
  },
  {
    stepNum: "04",
    ficheId: "HEG-ETP-05",
    altitude: "~610 m",
    distanceNoteFr: "Périphérie sud de Yathrib · Rabî‘ al-Awwal",
    distanceNoteAr: "جنوب المدينة · ربيع الأول",
    titleFr: "Oasis de Qubâ’ — Première mosquée",
    titleAr: "واحة قباء — تأسيس أول مسجد",
    descFr:
      "Arrivée sur les hauteurs sud de l’oasis médinoise chez les Banû ‘Amr ibn ‘Awf et pose des fondations de la mosquée de Qubâ’.",
    descAr:
      "الوصول إلى ظاهر المدينة الجنوبي في بني عمرو بن عوف وتأسيس مسجد قباء على التقوى.",
    statusFr: "Sources : Sahîh al-Bukhârî · Sahîh Muslim",
    statusAr: "المصادر: صحيح البخاري · صحيح مسلم",
  },
  {
    stepNum: "05",
    ficheId: "HEG-ETP-06",
    altitude: "~625 m",
    distanceNoteFr: "Terme du parcours · Fondation de la Cité",
    distanceNoteAr: "ختام المسار · تأسيس المجتمع المدني",
    titleFr: "Médine (Al-Madîna) — La cité du Prophète ﷺ",
    titleAr: "المدينة المنورة — دار الهجرة ومجتمع العهد",
    descFr:
      "Entrée au cœur de Médine, édification de la Mosquée prophétique, fraternisation (mu’âkhât) et rédaction de la Sahîfa (Pacte de Médine).",
    descAr:
      "الدخول إلى قلب المدينة، وبناء المسجد النبوي الشريف، والمؤاخاة، وكتابة وثيقة المدينة (الصحيفة).",
    statusFr: "Sources canoniques & corpus biographique",
    statusAr: "الصحاح وكتب السيرة المعتمدة",
  },
];

export default function Home() {
  const { t, prefs, registry } = useApp();
  const isAr = prefs.locale === "ar";
  const last = registry.contents.find((c) => c.id === prefs.lastContentId);

  const [selectedArtifactIdx, setSelectedArtifactIdx] = useState(0);
  const [turntableAngle, setTurntableAngle] = useState(0);
  const [liveWebGlOpen, setLiveWebGlOpen] = useState(false);
  const [webGlError, setWebGlError] = useState(false);
  const [activeWaypointIdx, setActiveWaypointIdx] = useState(1);

  const activeArtifact = SHOWCASE_ARTIFACTS[selectedArtifactIdx];
  const activeWaypoint = HEGIRA_WAYPOINTS[activeWaypointIdx];

  const handleSelectArtifact = (index: number) => {
    setSelectedArtifactIdx(index);
    setWebGlError(false);
  };

  return (
    <div className="stitch-landing">
      {/* =====================================================================
          1. MONUMENTAL BILINGUAL HERO (FR & AR) + 3D ASTROLABE HORIZON
         ===================================================================== */}
      <section className="hero stitch-hero">
        <div className="hero-top-ribbon">
          <span className="hero-coords">
            <Compass size={14} aria-hidden="true" />
            <span>
              21°25′N ➔ 24°28′N · AXE MAKKAH — AL-MADÎNA · ATLAS HISTORIQUE &amp;
              CULTURE MATÉRIELLE
            </span>
          </span>
          <span
            className="hero-ribbon-ar"
            lang="ar"
            dir="rtl"
          >
            أطلس السيرة النبوية الشريفة · عرض تفاعلي ثنائي اللغة خالٍ من التجسيم
          </span>
        </div>

        <div className="hero-main-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="tiny-line" />
              {t("tagline")}
            </div>

            <h1 tabIndex={-1} className="stitch-display-title">
              {t("headline")
                .split("\n")
                .map((line, i) => (
                  <span key={i}>{line}</span>
                ))}
            </h1>

            {/* Bilingual Mirror Title so both FR and AR shine on the Landing Page */}
            <div
              className="hero-bilingual-mirror"
              lang={isAr ? "fr" : "ar"}
              dir={isAr ? "ltr" : "rtl"}
            >
              <span className="mirror-kicker">
                {isAr
                  ? "ÉDITION BILINGUE FR / AR · SOURCES VÉRIFIÉES"
                  : "إصدار علمي مزدوج اللغة (عربي / فرنسي) · تحقيق المصادر"}
              </span>
              <p className="mirror-headline">
                {isAr
                  ? "Une histoire à explorer, à votre rythme : Chronologie, Hégire et Culture matérielle du Hijâz."
                  : "سيرة تستكشفها على مهل: التسلسل الزمني، مسار الهجرة، وثقافة المادة في الحجاز."}
              </p>
            </div>

            <p className="hero-lead">{t("intro")}</p>

            <div className="hero-cta-cluster">
              <a className="button primary btn-animated-primary" href="#explorer">
                <span>{t("explore")}</span>
                <ArrowRight size={19} />
              </a>
              <a
                className="button secondary btn-animated-secondary"
                href="#cabinet-3d"
              >
                <Box size={18} />
                <span>
                  {isAr
                    ? "خزانة الآثار ثلاثية الأبعاد (3D)"
                    : "Cabinet des Objets 3D"}
                </span>
              </a>
              <a
                className="button secondary btn-animated-secondary"
                href="#corridor-hegire"
              >
                <MapPin size={18} />
                <span>
                  {isAr ? "مسار الهجرة التفاعلي" : "Corridor de l’Hégire"}
                </span>
              </a>
            </div>

            <div className="hero-note">
              <Compass size={18} />
              <span>{t("noTracking")}</span>
            </div>
          </div>

          <figure className="hero-image stitch-hero-stage">
            <MediaImage
              src="/media/demo/atlas-valley.webp"
              alt=""
              fetchPriority="high"
            />

            {/* Animated 3D Astrolabe & Cartographic Graticule Overlay (100% Aniconic) */}
            <div className="hero-3d-astrolabe" aria-hidden="true">
              <div className="astrolabe-ring astrolabe-ring-outer" />
              <div className="astrolabe-ring astrolabe-ring-middle" />
              <div className="astrolabe-ring astrolabe-ring-inner" />
              <svg
                className="astrolabe-svg"
                viewBox="0 0 360 360"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="180"
                  cy="180"
                  r="152"
                  stroke="#FAF7F0"
                  strokeOpacity="0.35"
                  strokeWidth="1.2"
                  strokeDasharray="4 6"
                />
                <circle
                  cx="180"
                  cy="180"
                  r="116"
                  stroke="#E4D6BD"
                  strokeOpacity="0.45"
                  strokeWidth="1.2"
                />
                <circle
                  cx="180"
                  cy="180"
                  r="76"
                  stroke="#FAF7F0"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
                <line
                  x1="20"
                  y1="180"
                  x2="340"
                  y2="180"
                  stroke="#FAF7F0"
                  strokeOpacity="0.25"
                />
                <line
                  x1="180"
                  y1="20"
                  x2="180"
                  y2="340"
                  stroke="#FAF7F0"
                  strokeOpacity="0.25"
                />
                {/* 8-Pointed Khatam Star */}
                <polygon
                  points="180,52 204,156 308,180 204,204 180,308 156,204 52,180 156,156"
                  stroke="#E4D6BD"
                  strokeOpacity="0.55"
                  strokeWidth="1.4"
                  fill="#A66C2D"
                  fillOpacity="0.12"
                />
                {/* Topographical Horizon Curve */}
                <path
                  d="M 42 238 Q 112 182 180 206 T 318 164"
                  stroke="#FAF7F0"
                  strokeWidth="2.2"
                  strokeOpacity="0.8"
                />
                <circle cx="78" cy="218" r="4.5" fill="#E4D6BD" />
                <circle cx="180" cy="206" r="4.5" fill="#E4D6BD" />
                <circle cx="286" cy="174" r="5.5" fill="#A66C2D" stroke="#FAF7F0" strokeWidth="1.5" />
              </svg>
            </div>

            <span className="image-index" aria-hidden="true">
              SÎRA / 01 · 3D ATLAS
            </span>

            <div className="hero-stage-badges" aria-hidden="true" dir="ltr">
              <span className="stage-pill">
                <Sparkles size={13} />
                <span>60 FICHES FR / AR</span>
              </span>
              <span className="stage-pill">
                <Orbit size={13} />
                <span>20 MODÈLES 3D GLB</span>
              </span>
            </div>

            <figcaption>{t("imageCaption")}</figcaption>
          </figure>
        </div>

        {/* Monumental Museum Accession Metrics Ribbon */}
        <div className="stitch-metrics-ribbon" aria-label={isAr ? "إحصائيات الأطلس" : "Chiffres clés de l’atlas"}>
          <div className="metric-cell">
            <span className="metric-value">60</span>
            <span className="metric-label">
              {isAr ? "بطاقة علمية (FR / AR)" : "Monographies FR / AR"}
            </span>
            <span className="metric-sub" lang={isAr ? "fr" : "ar"} dir={isAr ? "ltr" : "rtl"}>
              {isAr ? "24 CHR · 12 HEG · 24 VIE" : "٢٤ زمنية · ١٢ هجرة · ٢٤ حياة يومية"}
            </span>
          </div>
          <div className="metric-cell">
            <span className="metric-value">120</span>
            <span className="metric-label">
              {isAr ? "سرداً صوتياً ثنائي اللغة" : "Narrations Audio Bilingues"}
            </span>
            <span className="metric-sub" lang={isAr ? "fr" : "ar"} dir={isAr ? "ltr" : "rtl"}>
              {isAr ? "Écoute volontaire FR & AR" : "استماع اختياري بالعربية والفرنسية"}
            </span>
          </div>
          <div className="metric-cell">
            <span className="metric-value">20</span>
            <span className="metric-label">
              {isAr ? "مجسماً ثلاثي الأبعاد GLB" : "Objets 3D Numérisés (GLB)"}
            </span>
            <span className="metric-sub" lang={isAr ? "fr" : "ar"} dir={isAr ? "ltr" : "rtl"}>
              {isAr ? "Rotation 360° & secours 2D" : "معاينة ثلاثية الأبعاد ٣٦٠°"}
            </span>
          </div>
          <div className="metric-cell">
            <span className="metric-value">12</span>
            <span className="metric-label">
              {isAr ? "مرحلة وملفاً للهجرة" : "Étapes & Dossiers Hégire"}
            </span>
            <span className="metric-sub" lang={isAr ? "fr" : "ar"} dir={isAr ? "ltr" : "rtl"}>
              {isAr ? "6 étapes + 6 dossiers" : "٦ مراحل مسار + ٦ ملفات"}
            </span>
          </div>
          <div className="metric-cell metric-highlight">
            <span className="metric-value">100 %</span>
            <span className="metric-label">
              {isAr ? "ضابط شرعي صارم (بلا تجسيم)" : "Charte Aniconique Stricte"}
            </span>
            <span className="metric-sub" lang={isAr ? "fr" : "ar"} dir={isAr ? "ltr" : "rtl"}>
              {isAr ? "Zéro silhouette ou figure" : "خالٍ تماماً من ذوات الأرواح"}
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. TROIS REGARDS SUR L'ARABIE / ثلاث زوايا للاستكشاف (#explorer)
         ===================================================================== */}
      <section className="explore-section stitch-triptych-section" id="explorer">
        <div className="section-heading stitch-section-header">
          <div>
            <span className="eyebrow">{t("discovery")}</span>
            <h2>{t("choose")}</h2>
            <p>{t("chooseIntro")}</p>
          </div>
          <div
            className="section-bilingual-aside"
            lang={isAr ? "fr" : "ar"}
            dir={isAr ? "ltr" : "rtl"}
          >
            <span className="bilingual-aside-title">
              {isAr
                ? "Trois Regards Complémentaires"
                : "ثلاث زوايا متكاملة للاستكشاف"}
            </span>
            <span className="section-number" aria-hidden="true">
              01 — 03 · VOL. I–III
            </span>
          </div>
        </div>

        <div className="feature-grid">
          {(["chronology", "hegira", "life"] as const).map((key, i) => {
            const arSubtitles = [
              "المدى الزمني والفترات الكبرى للسيرة النبوية",
              "المسار الجغرافي والمراحل من مكة إلى المدينة",
              "ثقافة المادة والأدوات اليومية في الحجاز",
            ];
            const frSubtitles = [
              "VOL. I · 6 PÉRIODES & REPÈRES CHRONOLOGIQUES",
              "VOL. II · CARTE INTERACTIVE, ÉTAPES & DOSSIERS",
              "VOL. III · 8 THÈMES & 20 MODÈLES 3D (GLB)",
            ];
            return (
              <Link
                to={["/chronologie", "/hegire", "/vie"][i]}
                className={`feature-card feature-${key} stitch-feature-card`}
                key={key}
              >
                <div className="feature-art">
                  {i === 0 ? (
                    <>
                      <img src="/media/demo/atlas-valley.webp" alt="" />
                      <div className="timeline-lines" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                        <span />
                      </div>
                    </>
                  ) : i === 1 ? (
                    <MapArt />
                  ) : (
                    <ObjectArt />
                  )}
                  <span className="feature-number">0{i + 1}</span>
                  <span className="feature-vol-tag" aria-hidden="true">
                    {frSubtitles[i]}
                  </span>
                </div>
                <div className="feature-body">
                  <span className="eyebrow">{t(`${key}Meta`)}</span>
                  <h3>
                    {t(key)}
                    <ArrowUpRight size={24} />
                  </h3>
                  <p
                    className="feature-bilingual-sub"
                    lang={isAr ? "fr" : "ar"}
                    dir={isAr ? "ltr" : "rtl"}
                  >
                    {isAr ? frSubtitles[i] : arSubtitles[i]}
                  </p>
                  <p>{t(`${key}Desc`)}</p>
                  <span className="feature-link">
                    {t("discover")}
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {last && (
        <Link className="resume-panel" to={entryRoute(last)}>
          <BookOpen size={28} />
          <div>
            <span className="eyebrow">{t("resume")}</span>
            <h3>{last.localized[prefs.locale].title}</h3>
            <p>{t("resumeDetail")}</p>
          </div>
          <ArrowRight />
        </Link>
      )}

      {/* =====================================================================
          3. CABINET DES OBJETS EN 3D / خزانة الآثار ثلاثية الأبعاد (#cabinet-3d)
         ===================================================================== */}
      <section className="stitch-cabinet-section" id="cabinet-3d">
        <div className="section-heading stitch-section-header">
          <div>
            <span className="eyebrow">
              {isAr
                ? "المتحف الرقمي التفاعلي · ٢٠ مجسماً ثلاثي الأبعاد"
                : "CONSERVATOIRE NUMÉRIQUE · 20 MODÈLES 3D GLB ANICONIQUES"}
            </span>
            <h2>
              {isAr
                ? "خزانة الآثار ثلاثية الأبعاد"
                : "Cabinet des Objets en 3D"}
            </h2>
            <p>
              {isAr
                ? "عاين نماذج ثلاثية الأبعاد لأدوات الحياة اليومية والمكاييل في الحجاز، مع بطاقة توثيقية مزدوجة اللغة."
                : "Inspectez les objets de la culture matérielle du Hijâz sous tous les angles, avec rotation 360°, vue WebGL GLB à la demande et cartel bilingue."}
            </p>
          </div>
          <div
            className="section-bilingual-aside"
            lang={isAr ? "fr" : "ar"}
            dir={isAr ? "ltr" : "rtl"}
          >
            <span className="bilingual-aside-title">
              {isAr
                ? "Cabinet des Objets en 3D"
                : "خزانة الآثار ثلاثية الأبعاد"}
            </span>
            <span className="section-number" aria-hidden="true">
              GLTF / GLB · PBR
            </span>
          </div>
        </div>

        {/* Artifact Selector Tabs */}
        <div
          className="cabinet-tabs"
          role="tablist"
          aria-label={
            isAr
              ? "اختيار القطعة الثلاثية الأبعاد"
              : "Sélection de l’objet 3D à inspecter"
          }
        >
          {SHOWCASE_ARTIFACTS.map((item, idx) => {
            const isSelected = idx === selectedArtifactIdx;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`cabinet-tab-btn ${isSelected ? "active" : ""}`}
                onClick={() => handleSelectArtifact(idx)}
              >
                <span className="tab-main-label">
                  {isAr ? item.ar.tab : item.fr.tab}
                </span>
                <span
                  className="tab-secondary-label"
                  lang={isAr ? "fr" : "ar"}
                  dir={isAr ? "ltr" : "rtl"}
                >
                  {isAr ? item.fr.tab : item.ar.tab}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3D Stage + Museum Accession Cartel */}
        <div className="cabinet-grid">
          <div className="cabinet-stage-card dual-rule">
            <div className="cabinet-hud-top">
              <span className="hud-pulse-dot" aria-hidden="true" />
              <span className="hud-code">{activeArtifact.inv}</span>
              <span className="hud-room">
                {isAr ? activeArtifact.ar.room : activeArtifact.fr.room}
              </span>
            </div>

            {liveWebGlOpen && !webGlError ? (
              <div className="cabinet-webgl-wrapper">
                <Suspense
                  fallback={
                    <div className="viewer-loading" role="status">
                      {t("loading")}
                    </div>
                  }
                >
                  <ThreeScene
                    url={activeArtifact.glbUrl}
                    onError={() => setWebGlError(true)}
                  />
                </Suspense>
              </div>
            ) : (
              <div className="cabinet-turntable-stage" dir="ltr">
                <div
                  className="turntable-3d-rig"
                  style={{
                    transform: `rotateY(${turntableAngle}deg)`,
                  }}
                >
                  {/* Orbital 3D Brass & Emerald Calibration Rings */}
                  <div className="orbital-ring orbital-ring-1" aria-hidden="true" />
                  <div className="orbital-ring orbital-ring-2" aria-hidden="true" />
                  <div className="orbital-pedestal" aria-hidden="true" />

                  {/* Sculptural Multi-Layer 3D Artifact Illustration */}
                  <svg
                    className="turntable-artifact-svg"
                    viewBox="0 0 320 280"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label={
                      isAr ? activeArtifact.ar.title : activeArtifact.fr.title
                    }
                  >
                    <defs>
                      <radialGradient id="stageGlow" cx="50%" cy="48%" r="48%">
                        <stop offset="0%" stopColor="#A66C2D" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#173D36" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="terracottaGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#C87D4B" />
                        <stop offset="55%" stopColor="#99583A" />
                        <stop offset="100%" stopColor="#5E331E" />
                      </linearGradient>
                      <linearGradient id="bronzeGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#DFB66C" />
                        <stop offset="50%" stopColor="#A66C2D" />
                        <stop offset="100%" stopColor="#633E14" />
                      </linearGradient>
                    </defs>

                    <circle cx="160" cy="138" r="118" fill="url(#stageGlow)" />
                    <ellipse
                      cx="160"
                      cy="238"
                      rx="92"
                      ry="18"
                      fill="#173D36"
                      fillOpacity="0.18"
                      stroke="#A66C2D"
                      strokeWidth="1.5"
                    />
                    <ellipse
                      cx="160"
                      cy="234"
                      rx="76"
                      ry="12"
                      fill="none"
                      stroke="#84541C"
                      strokeDasharray="4 4"
                    />

                    {activeArtifact.kind === "jar" && (
                      <g className="artifact-vector-group">
                        {/* Twin Archaic Handles */}
                        <path
                          d="M 122 86 C 84 82, 82 142, 108 152"
                          stroke="url(#terracottaGrad)"
                          strokeWidth="10"
                          strokeLinecap="round"
                          fill="none"
                        />
                        <path
                          d="M 198 86 C 236 82, 238 142, 212 152"
                          stroke="url(#terracottaGrad)"
                          strokeWidth="10"
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Amphora Body */}
                        <path
                          d="M 132 58 L 188 58 L 180 86 C 216 112, 218 182, 184 222 L 136 222 C 102 182, 104 112, 140 86 Z"
                          fill="url(#terracottaGrad)"
                          stroke="#FAF7F0"
                          strokeOpacity="0.4"
                          strokeWidth="1.5"
                        />
                        {/* Rim & Geometric Incised Bands */}
                        <ellipse
                          cx="160"
                          cy="58"
                          rx="30"
                          ry="7"
                          fill="#7A4228"
                          stroke="#E4D6BD"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M 111 136 Q 160 148 209 136"
                          stroke="#FAF7F0"
                          strokeOpacity="0.65"
                          strokeWidth="2"
                          strokeDasharray="5 4"
                        />
                        <path
                          d="M 109 154 Q 160 166 211 154"
                          stroke="#E4D6BD"
                          strokeOpacity="0.8"
                          strokeWidth="2.5"
                        />
                      </g>
                    )}

                    {activeArtifact.kind === "scale" && (
                      <g className="artifact-vector-group">
                        {/* Base & Central Column */}
                        <path
                          d="M 118 228 L 202 228 L 188 214 L 132 214 Z"
                          fill="url(#bronzeGrad)"
                        />
                        <rect
                          x="155"
                          y="66"
                          width="10"
                          height="150"
                          rx="4"
                          fill="url(#bronzeGrad)"
                        />
                        <circle
                          cx="160"
                          cy="62"
                          r="12"
                          stroke="url(#bronzeGrad)"
                          strokeWidth="5"
                          fill="none"
                        />
                        {/* Balance Beam */}
                        <rect
                          x="68"
                          y="84"
                          width="184"
                          height="7"
                          rx="3.5"
                          fill="url(#bronzeGrad)"
                        />
                        {/* Left Pan & Suspension Chains */}
                        <line x1="82" y1="90" x2="62" y2="176" stroke="#84541C" strokeWidth="1.8" />
                        <line x1="82" y1="90" x2="82" y2="176" stroke="#84541C" strokeWidth="1.8" />
                        <line x1="82" y1="90" x2="102" y2="176" stroke="#84541C" strokeWidth="1.8" />
                        <path
                          d="M 54 176 Q 82 198 110 176 Z"
                          fill="url(#bronzeGrad)"
                        />
                        {/* Right Pan & Suspension Chains */}
                        <line x1="238" y1="90" x2="218" y2="176" stroke="#84541C" strokeWidth="1.8" />
                        <line x1="238" y1="90" x2="238" y2="176" stroke="#84541C" strokeWidth="1.8" />
                        <line x1="238" y1="90" x2="258" y2="176" stroke="#84541C" strokeWidth="1.8" />
                        <path
                          d="M 210 176 Q 238 198 266 176 Z"
                          fill="url(#bronzeGrad)"
                        />
                      </g>
                    )}

                    {activeArtifact.kind === "lamp" && (
                      <g className="artifact-vector-group">
                        {/* Ring Handle */}
                        <path
                          d="M 92 146 C 58 122, 62 178, 98 174"
                          stroke="url(#terracottaGrad)"
                          strokeWidth="11"
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Oil Lamp Body & Pinched Nozzle */}
                        <path
                          d="M 88 154 C 88 118, 178 114, 244 142 C 258 148, 258 164, 240 170 C 182 198, 88 194, 88 154 Z"
                          fill="url(#terracottaGrad)"
                          stroke="#FAF7F0"
                          strokeOpacity="0.45"
                          strokeWidth="1.5"
                        />
                        {/* Filling Rim */}
                        <ellipse
                          cx="154"
                          cy="148"
                          rx="26"
                          ry="12"
                          fill="#5E331E"
                          stroke="#E4D6BD"
                          strokeWidth="2"
                        />
                        {/* Warm Stylized Flame Glow (Geometric) */}
                        <path
                          d="M 248 142 C 240 120, 256 106, 252 92 C 266 108, 268 126, 254 142 Z"
                          fill="#DFB66C"
                        />
                      </g>
                    )}

                    {activeArtifact.kind === "calame" && (
                      <g className="artifact-vector-group">
                        {/* Cylindrical Inkwell (Dawât) */}
                        <rect
                          x="86"
                          y="128"
                          width="64"
                          height="88"
                          rx="8"
                          fill="url(#bronzeGrad)"
                          stroke="#FAF7F0"
                          strokeOpacity="0.4"
                        />
                        <ellipse
                          cx="118"
                          cy="128"
                          rx="32"
                          ry="9"
                          fill="#5E331E"
                          stroke="#DFB66C"
                          strokeWidth="2"
                        />
                        <line
                          x1="86"
                          y1="158"
                          x2="150"
                          y2="158"
                          stroke="#FAF7F0"
                          strokeOpacity="0.55"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        />
                        {/* Reed Calamus (Qalam) with Split Nib */}
                        <path
                          d="M 146 208 L 238 72 L 248 79 L 156 215 L 136 224 Z"
                          fill="url(#terracottaGrad)"
                          stroke="#FAF7F0"
                          strokeOpacity="0.5"
                          strokeWidth="1.2"
                        />
                        <line
                          x1="136"
                          y1="224"
                          x2="151"
                          y2="211"
                          stroke="#FAF7F0"
                          strokeWidth="1.8"
                        />
                      </g>
                    )}
                  </svg>
                </div>

                {webGlError && (
                  <p className="small-note" role="alert">
                    {t("modelError")}
                  </p>
                )}
              </div>
            )}

            {/* Interactive Controls Bar for 3D Stage */}
            <div className="cabinet-controls-bar">
              <div className="toolbar">
                <button
                  type="button"
                  aria-label={t("rotateLeft")}
                  onClick={() => setTurntableAngle((a) => a - 35)}
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  type="button"
                  aria-label={t("rotateRight")}
                  onClick={() => setTurntableAngle((a) => a + 35)}
                >
                  <RotateCw size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setTurntableAngle(0)}
                >
                  {t("reset3d")}
                </button>
              </div>

              <button
                type="button"
                className="button secondary btn-animated-secondary cabinet-webgl-toggle"
                onClick={() => {
                  setWebGlError(false);
                  setLiveWebGlOpen((v) => !v);
                }}
              >
                <Box size={18} />
                <span>
                  {liveWebGlOpen
                    ? t("close3d")
                    : isAr
                      ? "تفعيل المجسم الثلاثي التفاعلي (GLB)"
                      : "Manipuler le modèle 3D temps réel (GLB)"}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Bilingual Museum Accession Cartel */}
          <div className="cabinet-cartel dual-rule">
            <div>
              <div className="cartel-header">
                <span className="cartel-inv-code">{activeArtifact.inv}</span>
                <span className="cartel-status-badge">
                  {isAr ? "نموذج هندسي بلا تجسيم" : "MODÈLE DÉMO ANICONIQUE"}
                </span>
              </div>

              <h3 className="cartel-title-primary">
                {isAr ? activeArtifact.ar.title : activeArtifact.fr.title}
              </h3>
              <p
                className="cartel-title-secondary"
                lang={isAr ? "fr" : "ar"}
                dir={isAr ? "ltr" : "rtl"}
              >
                {isAr ? activeArtifact.fr.title : activeArtifact.ar.title}
              </p>

              <dl className="cartel-specs">
                <div>
                  <dt>{isAr ? "الحقبة التاريخية" : "Période / Repère"}</dt>
                  <dd>
                    {isAr ? activeArtifact.ar.period : activeArtifact.fr.period}
                  </dd>
                </div>
                <div>
                  <dt>{isAr ? "المادة والصناعة" : "Matière & Technique"}</dt>
                  <dd>
                    {isAr
                      ? activeArtifact.ar.material
                      : activeArtifact.fr.material}
                  </dd>
                </div>
                <div>
                  <dt>{isAr ? "النموذج الثلاثي" : "Spécification 3D"}</dt>
                  <dd>
                    {isAr
                      ? activeArtifact.ar.dimensions
                      : activeArtifact.fr.dimensions}
                  </dd>
                </div>
                <div>
                  <dt>{isAr ? "السياق والاستعمال" : "Usage documenté"}</dt>
                  <dd>
                    {isAr ? activeArtifact.ar.usage : activeArtifact.fr.usage}
                  </dd>
                </div>
              </dl>

              <div className="cartel-note-box">
                <strong>
                  {isAr
                    ? "ملاحظة منهجية وأثرية"
                    : "Notice matérielle & méthodologique"}
                </strong>
                <p>{isAr ? activeArtifact.ar.note : activeArtifact.fr.note}</p>
              </div>
            </div>

            <div className="cartel-actions">
              <Link
                to={activeArtifact.ficheRoute}
                className="button primary btn-animated-primary cartel-cta"
              >
                <span>
                  {isAr
                    ? "افتح بطاقة الموضوع الكاملة"
                    : "Ouvrir la fiche thématique"}
                </span>
                <ArrowUpRight size={18} />
              </Link>
              <Link to="/vie" className="text-link">
                <span>
                  {isAr
                    ? "استكشف جميع الأشياء الـ ٢٠ في فضاء الحياة اليومية"
                    : "Explorer les 20 objets dans Vie quotidienne"}
                </span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. SUR LES PAS DE L'HÉGIRE / على خطى الهجرة (#corridor-hegire)
         ===================================================================== */}
      <section className="stitch-corridor-section" id="corridor-hegire">
        <div className="section-heading stitch-section-header">
          <div>
            <span className="eyebrow">
              {isAr
                ? "المسار الجغرافي والتضاريسي · ٦ مراحل و٦ ملفات"
                : "ITINÉRAIRE COMMENTÉ & GÉOGRAPHIE HISTORIQUE · 6 ÉTAPES & 6 DOSSIERS"}
            </span>
            <h2>
              {isAr
                ? "على خطى الهجرة النبوية المباركة"
                : "Sur les Pas de l’Hégire"}
            </h2>
            <p>
              {isAr
                ? "من شعاب مكة وغار ثور جنوباً إلى طريق الساحل وقباء فالمدينة المنورة: قراءة تاريخية تميّز بين المعالم الثابتة والمسارات التقريبية."
                : "De La Mecque et la grotte de Thawr jusqu’à l’oasis de Qubâ’ et Médine : un parcours interactif distinguant rigoureusement les repères établis des tracés approximatifs."}
            </p>
          </div>
          <div
            className="section-bilingual-aside"
            lang={isAr ? "fr" : "ar"}
            dir={isAr ? "ltr" : "rtl"}
          >
            <span className="bilingual-aside-title">
              {isAr
                ? "Sur les Pas de l’Hégire"
                : "على خطى الهجرة النبوية"}
            </span>
            <span className="section-number" aria-hidden="true">
              MAKKAH ➔ AL-MADÎNA
            </span>
          </div>
        </div>

        {/* Animated Topographical Elevation Profile */}
        <div className="corridor-elevation-card dual-rule">
          <div className="elevation-header">
            <span className="elevation-caption">
              {isAr
                ? "مخطط الارتفاعات التوضيحي لمحطات الهجرة الخمس الكبرى (رسم تعليمي غير مساحي)"
                : "PROFIL ALTIMÉTRIQUE SCHÉMATIQUE DES 5 GRANDES HALTES DE L’HÉGIRE (SCHÉMA PÉDAGOGIQUE)"}
            </span>
            <Link to="/hegire" className="text-link">
              <span>
                {isAr
                  ? "فتح الخريطة التفاعلية الكاملة"
                  : "Ouvrir la carte interactive complète"}
              </span>
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <svg
            className="corridor-elevation-svg"
            direction="ltr"
            viewBox="0 0 920 165"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={
              isAr
                ? "مخطط مراحل الهجرة من مكة إلى المدينة"
                : "Schéma des étapes de l’Hégire de La Mecque à Médine"
            }
          >
            <defs>
              <linearGradient id="corridorFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#235A55" stopOpacity="0.26" />
                <stop offset="100%" stopColor="#FAF7F0" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <line
              x1="40"
              y1="30"
              x2="880"
              y2="30"
              stroke="#B9AC96"
              strokeDasharray="3 5"
            />
            <line
              x1="40"
              y1="75"
              x2="880"
              y2="75"
              stroke="#B9AC96"
              strokeDasharray="3 5"
            />
            <line
              x1="40"
              y1="115"
              x2="880"
              y2="115"
              stroke="#B9AC96"
              strokeDasharray="3 5"
            />

            {/* Area Fill */}
            <path
              d="M 80,82 C 155,78 210,28 275,28 C 350,28 420,108 490,104 C 575,98 635,54 705,52 C 770,50 815,48 855,46 L 855,132 L 80,132 Z"
              fill="url(#corridorFill)"
            />
            {/* Animated Route Polyline */}
            <path
              className="corridor-animated-path"
              d="M 80,82 C 155,78 210,28 275,28 C 350,28 420,108 490,104 C 575,98 635,54 705,52 C 770,50 815,48 855,46"
              stroke="#173D36"
              strokeWidth="3.2"
              fill="none"
            />

            {/* 5 Interactive Waypoint Nodes on the SVG */}
            {[
              { cx: 80, cy: 82, label: "1. Makkah", alt: "~280 m" },
              { cx: 275, cy: 28, label: "2. Thawr", alt: "~748 m" },
              { cx: 490, cy: 104, label: "3. Tihâma / Qudayd", alt: "~50–140 m" },
              { cx: 705, cy: 52, label: "4. Qubâ’", alt: "~610 m" },
              { cx: 855, cy: 46, label: "5. Al-Madîna", alt: "~625 m" },
            ].map((pt, i) => {
              const selected = i === activeWaypointIdx;
              return (
                <g key={pt.label}>
                  {selected && (
                    <circle
                      cx={pt.cx}
                      cy={pt.cy}
                      r="14"
                      fill="#A66C2D"
                      fillOpacity="0.22"
                    />
                  )}
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r={selected ? "7.5" : "5.5"}
                    fill={selected ? "#235A55" : "#84541C"}
                    stroke="#FAF7F0"
                    strokeWidth="2.2"
                  />
                  <text
                    x={pt.cx}
                    y="148"
                    textAnchor="middle"
                    fill="#203331"
                    fontSize="12"
                    fontWeight={selected ? "700" : "500"}
                  >
                    {pt.label}
                  </text>
                  <text
                    x={pt.cx}
                    y="162"
                    textAnchor="middle"
                    fill="#546661"
                    fontSize="10"
                  >
                    {pt.alt}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 5 Key Waypoint Cards */}
        <div className="corridor-waypoints-grid">
          {HEGIRA_WAYPOINTS.map((wp, idx) => {
            const isSelected = idx === activeWaypointIdx;
            return (
              <article
                key={wp.ficheId}
                className={`waypoint-card dual-rule ${isSelected ? "active" : ""}`}
              >
                <div>
                  <div className="waypoint-top">
                    <span className="waypoint-step">
                      {isAr ? `المرحلة ${wp.stepNum}` : `ÉTAPE ${wp.stepNum}`}
                    </span>
                    <span className="waypoint-alt">{wp.altitude}</span>
                  </div>
                  <h3>{isAr ? wp.titleAr : wp.titleFr}</h3>
                  <p
                    className="waypoint-bilingual-title"
                    lang={isAr ? "fr" : "ar"}
                    dir={isAr ? "ltr" : "rtl"}
                  >
                    {isAr ? wp.titleFr : wp.titleAr}
                  </p>
                  <p className="waypoint-desc">
                    {isAr ? wp.descAr : wp.descFr}
                  </p>
                </div>

                <div className="waypoint-footer">
                  <span className="waypoint-source">
                    {isAr ? wp.statusAr : wp.statusFr}
                  </span>
                  <div className="waypoint-actions">
                    <button
                      type="button"
                      className="waypoint-focus-btn"
                      aria-pressed={isSelected}
                      onClick={() => setActiveWaypointIdx(idx)}
                    >
                      <MapPin size={15} />
                      <span>{isAr ? "تحديد" : "Cibler"}</span>
                    </button>
                    <Link
                      to={`/hegire/${wp.ficheId}`}
                      className="waypoint-link"
                    >
                      <span>{t("discover")}</span>
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Selected Waypoint Spotlight Banner */}
        <div className="corridor-spotlight-bar">
          <div>
            <span className="eyebrow">
              {isAr
                ? activeWaypoint.distanceNoteAr
                : activeWaypoint.distanceNoteFr}
            </span>
            <h3>
              {isAr ? activeWaypoint.titleAr : activeWaypoint.titleFr}
            </h3>
          </div>
          <div className="corridor-spotlight-ctas">
            <Link
              to={`/hegire/${activeWaypoint.ficheId}`}
              className="button primary btn-animated-primary"
            >
              <span>
                {isAr ? "اقرأ بطاقة المرحلة" : "Lire la fiche de l’étape"}
              </span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/hegire" className="button secondary btn-animated-secondary">
              <Compass size={18} />
              <span>{t("map")}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. ÉCOUTER, LIRE & RÉFÉRENTIEL SUNNITE / MALÉKITE (#codex-manuscrits)
         ===================================================================== */}
      <section className="stitch-rigor-section" id="codex-manuscrits">
        <div className="rigor-grid">
          {/* Left Column: Bilingual Audio Narration Showcase */}
          <div className="rigor-audio-card dual-rule">
            <div className="eyebrow">
              <Headphones size={15} />
              <span>
                {isAr
                  ? "السرد الصوتي ثنائي اللغة · ١٢٠ تسجيلاً"
                  : "NARRATIONS AUDIO BILINGUES · 120 PISTES FR & AR"}
              </span>
            </div>
            <h2>{t("invitation")}</h2>
            <p
              className="rigor-bilingual-sub"
              lang={isAr ? "fr" : "ar"}
              dir={isAr ? "ltr" : "rtl"}
            >
              {isAr
                ? "Écouter et Comprendre — Lecture volontaire, bilingue et mémorisée par langue"
                : "السرد الصوتي والمنهج العلمي — استماع اختياري مستقل بالعربية والفرنسية"}
            </p>
            <p>{t("invitationText")}</p>

            {/* Animated Visual Soundwave & Direct Track Links */}
            <div className="audio-showcase-box">
              <div className="audio-wave-bars" aria-hidden="true">
                {[38, 68, 92, 54, 84, 46, 96, 62, 76, 42, 88, 58, 74, 48, 82, 64, 40, 70].map(
                  (h, idx) => (
                    <span
                      key={idx}
                      style={{
                        height: `${h}%`,
                        animationDelay: `${idx * 0.08}s`,
                      }}
                    />
                  ),
                )}
              </div>

              <div className="audio-track-links">
                <Link to="/chronologie/CHR-05" className="audio-track-pill">
                  <Play size={16} />
                  <div>
                    <strong>
                      {isAr
                        ? "CHR-05 · نزول الوحي الأول في غار حراء"
                        : "CHR-05 · Premières révélations à Hirâ’"}
                    </strong>
                    <span>
                      {isAr
                        ? "استمع واقرأ باللغتين (عربي / فرنسي)"
                        : "Écouter & lire la fiche (FR / AR)"}
                    </span>
                  </div>
                  <ArrowUpRight size={16} />
                </Link>

                <Link to="/hegire/HEG-ETP-03" className="audio-track-pill">
                  <Play size={16} />
                  <div>
                    <strong>
                      {isAr
                        ? "HEG-ETP-03 · غار ثور والرفيق في الهجرة"
                        : "HEG-ETP-03 · La grotte de Thawr"}
                    </strong>
                    <span>
                      {isAr
                        ? "تحقيق تاريخي وسرد صوتي"
                        : "Récit historique & narration audio"}
                    </span>
                  </div>
                  <ArrowUpRight size={16} />
                </Link>

                <Link to="/chronologie/CHR-13" className="audio-track-pill">
                  <Play size={16} />
                  <div>
                    <strong>
                      {isAr
                        ? "CHR-13 · صحيفة المدينة والعهد التأسيسي"
                        : "CHR-13 · La Sahîfa (Pacte de Médine)"}
                    </strong>
                    <span>
                      {isAr
                        ? "توثيق المصادر والسياق"
                        : "Sources primaires & contexte"}
                    </span>
                  </div>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            <div className="editorial-options">
              <span>
                <BookOpen size={19} />
                {t("read")}
              </span>
              <span>
                <Headphones size={19} />
                {t("listen")}
              </span>
              <span>
                <Pause size={19} />
                {isAr
                  ? "حفظ مستقل لموضع القراءة (FR / AR)"
                  : "Positions FR & AR mémorisées séparément"}
              </span>
            </div>
          </div>

          {/* Right Column: Sunni, Hadith & Maliki Methodological Charter */}
          <div className="rigor-charter-card dual-rule">
            <div className="eyebrow">
              <Scale size={15} />
              <span>
                {isAr
                  ? "المنهج العلمي والشرعي المعتمد"
                  : "ÉPISTÉMOLOGIE & RÉFÉRENTIEL SCIENTIFIQUE"}
              </span>
            </div>
            <h2>{t("referentielTitle")}</h2>
            <p
              className="rigor-bilingual-sub"
              lang={isAr ? "fr" : "ar"}
              dir={isAr ? "ltr" : "rtl"}
            >
              {isAr
                ? "Cadre Sunnite · Jurisprudence Malékite de référence & Critique des Sources"
                : "أهل السنة والجماعة · مرجعية الفقه المالكي وتحقيق أسانيد السيرة"}
            </p>

            <ul className="rigor-pillars-list">
              <li>
                <CheckCircle2 size={20} />
                <div>
                  <strong>
                    {isAr
                      ? "تمييز درجات الثبوت التاريخي والحديثي"
                      : "Distinction rigoureuse des degrés d’établissement"}
                  </strong>
                  <p>{t("referentielText")}</p>
                </div>
              </li>
              <li>
                <Layers size={20} />
                <div>
                  <strong>
                    {isAr
                      ? "مرجعية المذهب المالكي والقول الراجح المعلّل"
                      : "Référentiel malékite & attribution explicite d’al-qawl ar-râjih"}
                  </strong>
                  <p>{t("referentielFiqh")}</p>
                </div>
              </li>
              <li>
                <ShieldCheck size={20} />
                <div>
                  <strong>{t("sourcePromise")}</strong>
                  <p>{t("sourceText")}</p>
                </div>
              </li>
            </ul>

            <div className="rigor-charter-footer">
              <Link to="/aide" className="button secondary btn-animated-secondary">
                <span>
                  {isAr
                    ? "اقرأ الميثاق المنهجي وإمكانية الوصول"
                    : "Consulter la charte & l’accessibilité"}
                </span>
                <ArrowUpRight size={17} />
              </Link>
              <Link to="/mentions" className="text-link">
                <span>{t("legal")}</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <aside className="trust-note">
        <ShieldCheck size={26} />
        <div>
          <strong>{t("sourcePromise")}</strong>
          <p>{t("sourceText")}</p>
        </div>
        <Link to="/aide" className="text-link">
          {t("discover")}
          <ArrowUpRight size={16} />
        </Link>
      </aside>
    </div>
  );
}
