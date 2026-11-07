/**
 * Sîra V1.0 — Générateur des sous-illustrations complémentaires pour le Film documentaire de la Sîra
 * Génère illustration-{id}-sub-1.webp et illustration-{id}-sub-2.webp pour les 60 fiches.
 * Modèle : google/gemini-2.5-flash-image via OpenRouter
 * Règles strictes : 16:9 WebP 1280x720, aniconisme absolu (zéro être vivant, personne, silhouette, main, visage).
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
  "Wide 16:9 museum-grade historical landscape or archaeological still-life painting set in 7th-century Hijaz (Arabia). Warm natural lighting, realistic oil and gouache texture, rich geological and architectural detail matching a world-class exhibition catalog. ABSOLUTE STRICT RULE: NO humans, NO people, NO silhouettes, NO faces, NO hands, NO shadows of people, NO animals, NO birds, NO insects, NO calligraphy or text anywhere in the image.";

// Manifest IDs
const manifest = JSON.parse(
  fs.readFileSync("public/content/manifest.v1.json", "utf8"),
);
const allIds = manifest.contents.map((c) => c.id);

// Generate prompts dynamically or from curated dictionary
function getSubPrompt(id, subIndex) {
  const idLower = id.toLowerCase();

  // Curated specific angles per space
  if (id === "CHR-01") {
    return subIndex === 1
      ? "Detailed archaeological close-up of dark granite masonry, sun-dried mud bricks, and palm-wood beams of an ancient Meccan courtyard in the 6th century, warm early morning light."
      : "Atmospheric panoramic sunset over the rugged black granite peaks surrounding the dry valley of Mecca, with twilight shadows stretching across dry wadi beds under an ochre sky.";
  }

  if (id.startsWith("CHR-")) {
    const num = parseInt(id.replace("CHR-", ""), 10);
    if (subIndex === 1) {
      // Closer architectural / archaeological view
      return `Close-up historical still-life or architectural detail in 7th-century Hijaz related to period ${num}: authentic stone masonry, rustic wooden door with iron latch, porous earthenware water jars, woven palm-leaf mats in warm ambient light. Completely empty.`;
    } else {
      // Panoramic / landscape view
      return `Grand atmospheric landscape of the rocky Hijaz mountains during historical epoch ${num}: volcanic basalt ridges, solitary desert acacia, golden sand wadi under a vast dramatic desert sky at sunrise or twilight. Zero figures.`;
    }
  }

  if (id.startsWith("HEG-ETP-")) {
    const num = id.replace("HEG-ETP-", "");
    if (subIndex === 1) {
      return `Detailed close-up of the rugged desert trail and rocky terrain of Hegira step ${num}: weathered stone trail cairns ('alam), dry riverbed pebbles, and leather travel flasks resting on a granite slab under bright desert sun.`;
    } else {
      return `Expansive panoramic vista of the mountainous coastal route between Mecca and Medina at Hegira step ${num}: volcanic basalt plateaus (Harrat), sweeping sand valleys, and distant blue mountain peaks under a radiant desert sky.`;
    }
  }

  if (id.startsWith("HEG-DOS-")) {
    const num = id.replace("HEG-DOS-", "");
    if (subIndex === 1) {
      return `Historical still-life study for Hegira dossier ${num}: braided palm-fiber ropes, carved wooden travel bowls, stitched leather provisions pouch, and ancient parchment resting on a flat stone inside a cool rock shelter.`;
    } else {
      return `Wide atmospheric landscape for Hegira dossier ${num}: endless desert horizon connecting the Hijaz rocky mountains to coastal dunes, bathed in deep amber golden hour light.`;
    }
  }

  if (id.startsWith("VIE-")) {
    const num = id.replace("VIE-", "");
    if (subIndex === 1) {
      return `Archaeological studio still-life of 7th-century Arabian material culture theme ${num}: authentic historical artifacts, crafted pottery, hand-woven textiles, wooden utensils, and stone tools on a sunlit textured earthen floor.`;
    } else {
      return `Authentic domestic or artisan workshop environment of ancient 7th-century Medina or Mecca for theme ${num}: mud-brick walls, palm-trunk roof beams, sunlight filtering through woven palm lattices onto traditional craft objects.`;
    }
  }

  return subIndex === 1
    ? `Historical archaeological view in 7th-century Arabia for ${id}: stone architecture and material culture.`
    : `Atmospheric natural landscape in 7th-century Hijaz for ${id}: desert mountains and open sky.`;
}

// Build generation queue
const queue = [];
for (const id of allIds) {
  for (const subIndex of [1, 2]) {
    const filename = `illustration-${id.toLowerCase()}-sub-${subIndex}.webp`;
    const targetPath = path.join(draftsDir, filename);
    if (!fs.existsSync(targetPath) || fs.statSync(targetPath).size < 15000) {
      queue.push({ id, subIndex, filename, targetPath });
    }
  }
}

console.log(
  `Total sub-images to generate: ${queue.length} (already existing skipped)`,
);

async function generateImage(item) {
  const { id, subIndex, filename, targetPath } = item;
  const promptText = getSubPrompt(id, subIndex);
  const fullPrompt = `${BASE_STYLE} Subject (${id} view ${subIndex}): ${promptText}`;

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
        throw new Error(`HTTP ${response.status}: ${errText.slice(0, 150)}`);
      }

      const data = await response.json();
      const imgEntry = data.choices?.[0]?.message?.images?.[0];
      if (!imgEntry) throw new Error("No image returned");

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
        `[OK ${queue.indexOf(item) + 1}/${queue.length}] ${filename} (${Math.round(webpBuffer.length / 1024)} KB)`,
      );
      return;
    } catch (err) {
      console.warn(
        `[WARN] ${filename} attempt ${attempt} failed: ${err.message}`,
      );
      if (attempt === 3) throw err;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
}

const CONCURRENCY = 5;
let currentIndex = 0;

async function worker() {
  while (currentIndex < queue.length) {
    const item = queue[currentIndex++];
    try {
      await generateImage(item);
    } catch (e) {
      console.error(`[FAIL] ${item.filename}: ${e.message}`);
    }
  }
}

if (queue.length > 0) {
  console.log(
    `Starting generation with ${CONCURRENCY} workers for ${queue.length} images...`,
  );
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
}

console.log("All documentary sub-images generation finished!");
