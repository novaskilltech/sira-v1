import fs from 'node:fs';

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
  'scripts/generate-lot-14-narrations.mjs',
  'scripts/generate-lot-15-narrations.mjs'
];

let totalTracks = 0;
const cardData = {};

for (const f of scriptFiles) {
  const content = fs.readFileSync(f, 'utf8');
  
  // Extract items
  // Pattern 1: { contentId: '...', locale: '...', ... text: `...` }
  // Pattern 2: { id: '...', lang: '...', ... text: `...` }
  
  const entries = [];
  const regex = /{\s*(?:contentId|id):\s*["']([^"']+)["'],\s*(?:locale|lang):\s*["']([^"']+)["'][\s\S]*?text:\s*`([\s\S]*?)`\s*}/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    entries.push({
      id: match[1],
      locale: match[2],
      text: match[3].trim()
    });
  }
  
  console.log(`${f} -> found ${entries.length} items`);
  totalTracks += entries.length;
  
  for (const entry of entries) {
    if (!cardData[entry.id]) cardData[entry.id] = {};
    cardData[entry.id][entry.locale] = entry.text;
  }
}

console.log(`\nTotal tracks extracted: ${totalTracks}`);
console.log(`Total unique cards extracted: ${Object.keys(cardData).length}`);

// Check which cards have both FR and AR
const manifest = JSON.parse(fs.readFileSync('public/content/manifest.v1.json', 'utf8'));
const all60 = manifest.contents.map(c => c.id);

const missing = [];
for (const id of all60) {
  if (!cardData[id] || !cardData[id].fr || !cardData[id].ar) {
    missing.push(id);
  }
}

console.log(`Missing among manifest 60:`, missing);
