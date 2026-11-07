import fs from 'node:fs';
import path from 'node:path';

// 1. Read manifest
const manifestPath = path.resolve('public/content/manifest.v1.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// 2. Read all script files for Lots 1 to 14
const scriptFiles = [
  'scripts/generate-pilot-narrations.mjs',
  'scripts/generate-lot-02-narrations.mjs',
  'scripts/generate-lot-03-narrations.mjs',
  'scripts/generate-lot-04-narrations.mjs',
  'scripts/generate-lot-05-narrations.mjs',
  'scripts/generate-lot-06-narrations.mjs',
  'scripts/generate-lot-07-narrations.mjs',
  'scripts/generate-lot-08-narrations.mjs',
  'scripts/generate-lot-09-narrations.mjs',
  'scripts/generate-lot-10-narrations.mjs',
  'scripts/generate-lot-11-narrations.mjs',
  'scripts/generate-lot-12-narrations.mjs',
  'scripts/generate-lot-13-narrations.mjs',
  'scripts/generate-lot-14-narrations.mjs'
];

const cardRaw = {};

for (const f of scriptFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /{\s*contentId:\s*["']([^"']+)["'],\s*locale:\s*["']([^"']+)["'][\s\S]*?text:\s*`([\s\S]*?)`\s*}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    const loc = match[2];
    const text = match[3].trim();
    if (!cardRaw[id]) cardRaw[id] = {};
    cardRaw[id][loc] = text;
  }
}

// 3. Read Lot 15 from docs/LOT_15_REDACTION_BROUILLON_IA.md
const lot15Doc = fs.readFileSync('docs/LOT_15_REDACTION_BROUILLON_IA.md', 'utf8').replace(/\r\n/g, '\n');
const lot15Blocks = lot15Doc.split(/\n(?=##\s+)/);

for (const block of lot15Blocks) {
  const m = block.match(/^##\s+(?:(?:\d+\.)\s+)?([A-Z0-9-]+)/);
  if (!m) continue;
  const id = m[1];

  const frIntroM = block.match(/- \*\*Introduction\*\* : ([^\n\r]+)/);
  const frCtxM = block.match(/- \*\*Le contexte\*\* : ([^\n\r]+)/);
  const frRecM = block.match(/- \*\*Le récit\*\* : ([^\n\r]+)/);
  const frRetM = block.match(/- \*\*À retenir\*\* : ([^\n\r]+)/);

  const arIntroM = block.match(/- \*\*مقدمة\*\* : ([^\n\r]+)/);
  const arCtxM = block.match(/- \*\*السياق\*\* : ([^\n\r]+)/);
  const arRecM = block.match(/- \*\*الرواية\*\* : ([^\n\r]+)/);
  const arRetM = block.match(/- \*\*خلاصة\*\* : ([^\n\r]+)/);

  if (!cardRaw[id]) cardRaw[id] = {};

  cardRaw[id].lot15_fr = {
    intro: frIntroM ? frIntroM[1].trim() : '',
    contexte: frCtxM ? frCtxM[1].trim() : '',
    recit: frRecM ? frRecM[1].trim() : '',
    synthese: frRetM ? frRetM[1].trim() : ''
  };
  cardRaw[id].lot15_ar = {
    intro: arIntroM ? arIntroM[1].trim() : '',
    contexte: arCtxM ? arCtxM[1].trim() : '',
    recit: arRecM ? arRecM[1].trim() : '',
    synthese: arRetM ? arRetM[1].trim() : ''
  };
}

// 4. Function to clean section text
function cleanFrPrefix(p) {
  return p
    .replace(/^Première partie\s*:\s*[^.]+\.\s*/i, '')
    .replace(/^Deuxième partie\s*:\s*[^.]+\.\s*/i, '')
    .replace(/^Troisième partie\s*:\s*[^.]+\.\s*/i, '')
    .replace(/^Quatrième partie\s*:\s*[^.]+\.\s*/i, '')
    .replace(/^Introduction\s*:\s*/i, '')
    .replace(/^Le contexte\s*:\s*/i, '')
    .replace(/^Le récit\s*:\s*/i, '')
    .replace(/^À retenir\s*:\s*/i, '')
    .trim();
}

function cleanArPrefix(p) {
  return p
    .replace(/^القسم الأول\s*:\s*[^.]+\.\s*/i, '')
    .replace(/^القسم الثاني\s*:\s*[^.]+\.\s*/i, '')
    .replace(/^القسم الثالث\s*:\s*[^.]+\.\s*/i, '')
    .replace(/^القسم الرابع\s*:\s*[^.]+\.\s*/i, '')
    .replace(/^مقدمة\s*:\s*/i, '')
    .replace(/^السياق\s*:\s*/i, '')
    .replace(/^السرد\s*:\s*/i, '')
    .replace(/^الرواية\s*:\s*/i, '')
    .replace(/^خلاصة\s*:\s*/i, '')
    .trim();
}

let updatedCount = 0;

for (const entry of manifest.contents) {
  const id = entry.id;
  const raw = cardRaw[id];
  if (!raw) {
    console.warn(`No raw text found for ${id}`);
    continue;
  }

  // --- FRENCH ---
  let frSecs = [];
  let frIntro = '';
  let frAudioScript = raw.fr || '';

  if (raw.lot15_fr) {
    frIntro = raw.lot15_fr.intro;
    frSecs = [
      { sectionId: 'introduction', heading: 'Introduction', body: raw.lot15_fr.intro },
      { sectionId: 'contexte', heading: 'Le contexte', body: raw.lot15_fr.contexte },
      { sectionId: 'recit', heading: 'Le récit', body: raw.lot15_fr.recit },
      { sectionId: 'synthese', heading: 'À retenir', body: raw.lot15_fr.synthese }
    ];
  } else if (raw.fr) {
    const paras = raw.fr.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    // Usually paras[0] is Title, paras[1..4] are 4 sections
    const secParas = paras.length >= 5 ? paras.slice(1, 5) : paras;
    const body1 = cleanFrPrefix(secParas[0] || '');
    const body2 = cleanFrPrefix(secParas[1] || '');
    const body3 = cleanFrPrefix(secParas[2] || '');
    const body4 = cleanFrPrefix(secParas[3] || '');

    frIntro = body1.length > 250 ? body1.substring(0, body1.lastIndexOf('.', 250) + 1) || body1 : body1;

    frSecs = [
      { sectionId: 'introduction', heading: 'Introduction', body: body1 },
      { sectionId: 'contexte', heading: 'Le contexte', body: body2 },
      { sectionId: 'recit', heading: 'Le récit', body: body3 },
      { sectionId: 'synthese', heading: 'À retenir', body: body4 }
    ];
  }

  // --- ARABIC ---
  let arSecs = [];
  let arIntro = '';
  let arAudioScript = raw.ar || '';

  if (raw.lot15_ar) {
    arIntro = raw.lot15_ar.intro;
    arSecs = [
      { sectionId: 'introduction', heading: 'مقدمة', body: raw.lot15_ar.intro },
      { sectionId: 'contexte', heading: 'السياق', body: raw.lot15_ar.contexte },
      { sectionId: 'recit', heading: 'السرد', body: raw.lot15_ar.recit },
      { sectionId: 'synthese', heading: 'خلاصة', body: raw.lot15_ar.synthese }
    ];
  } else if (raw.ar) {
    const paras = raw.ar.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const secParas = paras.length >= 5 ? paras.slice(1, 5) : paras;
    const body1 = cleanArPrefix(secParas[0] || '');
    const body2 = cleanArPrefix(secParas[1] || '');
    const body3 = cleanArPrefix(secParas[2] || '');
    const body4 = cleanArPrefix(secParas[3] || '');

    arIntro = body1.length > 200 ? body1.substring(0, body1.lastIndexOf('.', 200) + 1) || body1 : body1;

    arSecs = [
      { sectionId: 'introduction', heading: 'مقدمة', body: body1 },
      { sectionId: 'contexte', heading: 'السياق', body: body2 },
      { sectionId: 'recit', heading: 'السرد', body: body3 },
      { sectionId: 'synthese', heading: 'خلاصة', body: body4 }
    ];
  }

  // Update manifest entry
  entry.localized.fr.intro = frIntro;
  entry.localized.fr.sections = frSecs;
  entry.localized.fr.audioScript = frAudioScript;

  entry.localized.ar.intro = arIntro;
  entry.localized.ar.sections = arSecs;
  entry.localized.ar.audioScript = arAudioScript;

  updatedCount++;
}

console.log(`Updated ${updatedCount} / ${manifest.contents.length} content entries with full drafted texts.`);

// Save back
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('Successfully wrote updated public/content/manifest.v1.json !');
