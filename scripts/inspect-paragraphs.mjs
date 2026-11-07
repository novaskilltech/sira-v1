import fs from 'node:fs';

const scriptFiles = [
  'scripts/generate-pilot-narrations.mjs',
  'scripts/generate-lot-02-narrations.mjs',
  'scripts/generate-lot-06-narrations.mjs',
  'scripts/generate-lot-14-narrations.mjs',
  'scripts/generate-lot-15-narrations.mjs'
];

for (const f of scriptFiles) {
  const content = fs.readFileSync(f, 'utf8');
  const regex = /{\s*(?:contentId|id):\s*["']([^"']+)["'],\s*(?:locale|lang):\s*["']fr["'][\s\S]*?text:\s*`([\s\S]*?)`\s*}/;
  const m = regex.exec(content);
  if (m) {
    console.log(`\n=== SAMPLE FROM ${f} (Card ${m[1]}) ===`);
    const paragraphs = m[2].trim().split(/\n\s*\n/);
    console.log(`Number of paragraphs (split by blank line): ${paragraphs.length}`);
    for (let i = 0; i < paragraphs.length; i++) {
      console.log(`P${i+1} [${paragraphs[i].length} chars]: ${paragraphs[i].substring(0, 80).replace(/\n/g, ' ')}...`);
    }
  }
}
