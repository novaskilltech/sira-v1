/**
 * Sîra V1.0 — Générateur des 60 illustrations réalistes (paysages historiques & culture matérielle)
 * Modèle : google/gemini-2.5-flash-image via OpenRouter
 * Format : WebP 1280x720 (16:9), strictement aniconique (zéro silhouette, personne, visage, main, animal ou texte).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

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
  console.error("Missing OPENROUTER_API_KEY in .env");
  process.exit(1);
}

const draftsDir = path.resolve("public/media/drafts");
fs.mkdirSync(draftsDir, { recursive: true });

const BASE_STYLE =
  "Wide 16:9 museum-grade historical landscape or archaeological still-life painting set in 7th-century Hijaz (Arabia). Warm natural sunlight, realistic oil and gouache texture, rich geological and architectural detail matching an exhibition catalog (Louvre Abu Dhabi / Institut du Monde Arabe style). ABSOLUTE STRICT RULE: NO humans, NO people, NO silhouettes, NO faces, NO hands, NO shadows of people, NO animals, NO birds, NO insects, NO calligraphy or text anywhere in the image.";

const PROMPTS = {
  "CHR-02":
    "Sunlit pastoral desert valley of the Banu Sa'd near Ta'if in 6th-century Arabia, with rolling granite hills, solitary acacia trees, a traditional goat-hair tent shelter in the distance, earthenware water vessels resting in the cool shade, under a serene clear blue and golden sky.",
  "CHR-03":
    "Ancient caravan trade trail winding through sunlit rocky valleys and sandy wadis of the Hijaz toward Syria, with stone trail markers (a'lam), dry stone walls, acacia trees, and distant mountains under a warm morning sky.",
  "CHR-04":
    " Peaceful courtyard of a traditional 7th-century Meccan stone and mud-brick house before dawn, with wooden beam roof, woven palm-fiber mat, terracotta water jars, and an unlit olive oil lamp in a wall niche.",
  "CHR-05":
    "High rocky summit of Jabal al-Nur (Mount Hira) above the valley of Mecca at dawn, showing the natural granite boulder formation and cave opening overlooking endless mountain ridges bathed in serene golden morning light.",
  "CHR-06":
    "Secluded inner courtyard and study room of a historic hillside house near Mount Safa in 7th-century Mecca (Dar al-Arqam), with stone arches, woven reed mats, a low wooden chest, and soft sunlight filtering through wooden lattice.",
  "CHR-07":
    "Rocky outcrop of Mount al-Safa overlooking the stony valley and earthen houses of ancient Mecca under bright mid-morning light, with rugged granite boulders and stone walls.",
  "CHR-08":
    "Harsh sun-baked volcanic basalt rocks and narrow stony ravines of Mecca under a blazing midday sun, evoking endurance and trial through stark geological textures and parched desert earth.",
  "CHR-09":
    "Coastline of the Red Sea (Tihama shore) at sunrise with calm turquoise and deep blue waters, a traditional wooden dhow boat anchored near a sandy shore with coral rocks, sails furled, completely empty of people.",
  "CHR-10":
    "Narrow, steep mountain gorge and canyon of Shi'b Abi Talib in Mecca at dusk, flanked by high craggy granite cliffs, dry shrubs, and a weathered parchment scroll resting on a flat stone.",
  "CHR-11":
    "Terraced mountain orchards and stone watchtowers of ancient Ta'if in the high Sarat mountains, with pomegranate bushes, grapevine trellises, and mist over distant rocky peaks.",
  "CHR-12":
    "Quiet rocky mountain pass of al-'Aqaba near Mina at night under a starry desert sky and crescent moon, with natural stone ledges and warm lantern glow on the rocks.",
  "CHR-13":
    "Winding desert path leaving the rocky basin of Mecca at twilight toward the southern mountains, with stone walls, desert scrub, and the first stars appearing in a deep indigo sky.",
  "CHR-14":
    "Lush date-palm groves and stone irrigation channels (harra volcanic stone walls) of the oasis of Quba at the southern entrance of Medina, bathed in golden afternoon light.",
  "CHR-15":
    "Courtyard of the early Mosque of Medina built of sun-dried mud-brick walls, palm-trunk columns, and a roof of palm fronds (arish), with clean sand floor and warm sunlight casting rhythmic shadows.",
  "CHR-16":
    "Historical still-life of an unrolled blank parchment treaty scroll (Sahifa) with a reed calamus pen, bronze inkwell, and clay seal resting on a woven mat inside a mud-brick chamber in Medina.",
  "CHR-17":
    "Wide sandy valley of Badr surrounded by high golden sand dunes (al-'Udwatayn) and rocky hills, with ancient stone-lined desert wells and palm trees near a dry wadi bed.",
  "CHR-18":
    "Majestic reddish-brown volcanic and granite massif of Mount Uhud north of Medina under a clear morning sky, with the rocky hillock of al-Rumat in the foreground and desert plain.",
  "CHR-19":
    "Wide defensive trench (al-Khandaq) excavated in the rocky volcanic earth northwest of Medina, bordered by black basalt boulders (Harrat Waqim) and Mount Sal' in the background at sunset.",
  "CHR-20":
    "Broad desert plain of al-Hudaybiyya on the edge of the Meccan sanctuary territory, featuring a large solitary green acacia tree (Samura) beside an ancient stone well under a peaceful sky.",
  "CHR-21":
    "Panoramic view of the valley of Mecca at dawn surrounded by dark craggy mountains, with hundreds of tiny warm campfires glowing peacefully across the surrounding mountain ridges.",
  "CHR-22":
    "Archaeological still-life of diplomatic letters on parchment scrolls, a silver signet ring without figures, a brass inkwell, and reed pens arranged on a wooden table in a sunlit Medina courtyard.",
  "CHR-23":
    "Vast sunlit plain of 'Arafat with the granite hill of Jabal al-Rahma rising in the distance under a radiant afternoon sky, surrounded by the mountain chain of the Hijaz.",
  "CHR-24":
    "Serene view of the mud-brick courtyard and palm-trunk colonnade of the Mosque of Medina at quiet sunset, with warm golden light resting on the earthen walls and palm-frond roof.",
  "HEG-ETP-01":
    "Nightfall over the earthen and stone houses of 7th-century Mecca nestled between steep rocky mountains, with a quiet courtyard gate and travel saddlebags prepared beside a stone wall.",
  "HEG-ETP-02":
    "Rugged southern mountain trail leading out of Mecca toward Mount Thawr at first light, with steep granite boulders, dry wadi bed, and thorny desert shrubs.",
  "HEG-ETP-04":
    "Coastal desert corridor of the Tihama plain between the Red Sea and the Hijaz mountains, showing sandy ridges, volcanic harrat stones, and the wadi of Qudayd under a vast sky.",
  "HEG-ETP-05":
    "First view of the green palm groves and volcanic stone enclosures (utum) of the oasis of Quba south of Yathrib (Medina), with a newly laid stone foundation of a simple mosque.",
  "HEG-ETP-06":
    "Panoramic view of the oasis of Medina (Yathrib) in the 7th century, showing date-palm orchards, black basalt stone walls (Harrat), wadis, and earthen courtyard homes.",
  "HEG-DOS-07":
    "Contrast between the arid rocky canyon of Mecca and a distant horizon of green date-palm oasis, symbolizing the strategic transition of the Hegira across the Hijaz mountains.",
  "HEG-DOS-08":
    "Detailed historical still-life of desert travel provisions: two leather waterskins (qirba) tied with braided palm-fiber ropes, a woven travel pouch, and a wooden water bowl on a flat stone.",
  "HEG-DOS-09":
    "Dramatic geological panorama of the Hijaz route: black basalt lava fields (Harrat), golden sand dunes, dry riverbeds (wadis), and distant coastal mountains under bright desert sun.",
  "HEG-DOS-10":
    "Ancient cartographic still-life: a brass astrolabe, compass dividers, and a blank topographical parchment map of mountain ridges and wadis resting on a carved stone ledge.",
  "HEG-DOS-11":
    "Quiet desert campsite at Qudayd in a sandy wadi bordered by acacia trees, showing an empty woven goat-hair tent (bayt al-sha'r) and wooden milking bowls beside a stone hearth.",
  "HEG-DOS-12":
    "Sunlit mud-brick walls, stone water channels, and date-palm gardens of early Medina, illustrating the founding of a settled oasis community.",
  "VIE-02":
    "Shaded interior courtyard of a 7th-century Hijazi earthen house, with porous terracotta water jars on wooden stands, palm-frond shade pergola (arish), and stone steps.",
  "VIE-03":
    "Evening view of a modest mud-brick room in ancient Medina lit by a small terracotta olive-oil lamp in a wall niche, with a wooden door latch and woven palm-leaf mat.",
  "VIE-04":
    "Archaeological still-life of 7th-century Hijazi food preparation: a circular black basalt rotary hand-quern (raha) for grinding barley, a wooden bowl of dates, and woven baskets.",
  "VIE-05":
    "Traditional stone hearth with a soapstone cooking pot (burma) and terracotta stewpot (qidr), woodenladle, and clay platters arranged in a rustic earthen kitchen.",
  "VIE-06":
    "Sunlit table setting on a woven palm mat featuring wooden bowls (qas'a), clusters of ripe Medina dates, barley flatbread, and a clay water pitcher.",
  "VIE-07":
    "Ancient stone-lined desert well (bi'r) in a palm grove of Medina, with a wooden pulley beam, palm-fiber rope, and leather bucket resting on the stone rim.",
  "VIE-08":
    "Artisanal workshop showing stitched leather waterskins (qirba) and large porous terracotta amphorae and storage jars arranged in a cool shaded stone alcove.",
  "VIE-09":
    "Ancient rainwater harvesting channel and stone cistern (majra) in a Hijazi oasis valley, with basalt stone dikes directing water toward date-palm orchards.",
  "VIE-10":
    "Still-life of unbleached wool, linen, and striped Yemenite woven cloaks (burda) folded neatly on a wooden chest alongside leather sandals with double straps.",
  "VIE-11":
    "Traditional spinning and dyeing craft still-life: wooden drop spindles (mighzal) wound with raw wool yarn, skeins of ochre and indigo dyed threads, and a wooden comb.",
  "VIE-12":
    "Close-up still-life of finely crafted 7th-century Hijazi leather sandals (ni'al) with twin straps, a carved bone comb, and a small glass perfume flask on a woven mat.",
  "VIE-13":
    "Potter's courtyard workshop in the Hijaz showing unglazed terracotta bowls, jugs, and oil lamps drying in the sun beside a low wooden potter's wheel and clay basins.",
  "VIE-14":
    "Horizontal ground loom and wooden weaving shuttle (minwal) with partially woven geometric wool fabric in warm earth tones inside a sunlit mud-brick workshop.",
  "VIE-15":
    "Leatherworker's bench displaying tanned hides, an iron awl (mishfaz), leather straps, saddlebags, and stitched water flasks in a traditional Arabian craft setting.",
  "VIE-16":
    "Open-air market stall in ancient Medina with woven palm baskets of grain and dates, a suspended bronze two-pan balance scale (mizan), and stone measure weights.",
  "VIE-17":
    "Metrological still-life of canonical Hijazi dry volume measures: a wooden Mudd cup and a larger Sa' vessel filled with golden wheat and dates beside a bronze scale.",
  "VIE-18":
    "Caravan trade goods still-life: frankincense resin tears in a brass bowl, folded linen textiles, leather pouches, and bronze balance weights on a stone counter.",
  "VIE-19":
    "Desert travel gear arranged by a stone wall: a wooden pack-saddle frame (rahl) resting on the ground, leather saddlebags (khurj), and coiled palm-fiber ropes.",
  "VIE-20":
    "Ancient desert orientation scene: a stone cairn trail marker ('alam) on a high rocky ridge under a clear night sky filled with bright navigational stars.",
  "VIE-21":
    "Caravan halt station (manzil) in a shaded wadi with a stone water trough, empty woven shelter, and wooden travel chests resting on the sand.",
  "VIE-22":
    "Scribe's desk in 7th-century Arabia featuring a polished wooden writing board (lawh), split-nib reed pens (qalam), a brass and terracotta inkwell (dawat), and parchment sheets.",
  "VIE-23":
    "Natural supports of early Arabic writing: a smooth flat limestone slab (likhaf), a wide dried palm-leaf stalk ('asib), and parchment rolls beside a reed calamus.",
  "VIE-24":
    "Quiet study alcove in a mud-brick mosque with neatly stacked parchment notebooks (suhuf) in leather bindings resting on a carved wooden bookstand (kursi) in warm morning light.",
};

async function generateOne(id, promptText) {
  const filename = `illustration-${id.toLowerCase()}-v1.webp`;
  const targetPath = path.join(draftsDir, filename);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 15000) {
    console.log(`[SKIP] ${filename} already exists.`);
    return;
  }

  const fullPrompt = `${BASE_STYLE} Subject (${id}): ${promptText}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            modalities: ["image", "text"],
            messages: [{ role: "user", content: fullPrompt }],
          }),
        },
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText.slice(0, 200)}`);
      }

      const data = await response.json();
      const msg = data.choices?.[0]?.message;
      const imgEntry = msg?.images?.[0];
      if (!imgEntry) {
        throw new Error("No image returned in response");
      }

      const dataUrl =
        imgEntry.image_url?.url || imgEntry.url || String(imgEntry);
      const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
      const rawBuffer = Buffer.from(base64, "base64");

      const webpBuffer = await sharp(rawBuffer)
        .resize({ width: 1280, height: 720, fit: "cover" })
        .webp({ quality: 78 })
        .toBuffer();

      fs.writeFileSync(targetPath, webpBuffer);
      console.log(
        `[OK] ${filename} (${Math.round(webpBuffer.length / 1024)} KB)`,
      );
      return;
    } catch (err) {
      console.warn(
        `[WARN] ${id} attempt ${attempt} failed: ${err.message}`,
      );
      if (attempt === 3) throw err;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

const entries = Object.entries(PROMPTS);
const CONCURRENCY = 6;
let index = 0;

async function worker() {
  while (index < entries.length) {
    const current = index++;
    const [id, promptText] = entries[current];
    await generateOne(id, promptText);
  }
}

console.log(
  `Starting generation of ${entries.length} realistic WebP illustrations (concurrency=${CONCURRENCY})...`,
);
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
console.log("All 60 draft illustrations are ready in public/media/drafts/!");
