/**
 * Generates visual technical fixtures for every planned illustration and animation.
 * They deliberately make no historical assertion and contain no human or animal form.
 */
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.resolve('public/content/manifest.v1.json');
const registry = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const output = path.resolve('public/media/demo');
const palette = [['#1d514f', '#d7bd85', '#f4eddb'], ['#76502e', '#d5a260', '#fbf4e4'], ['#34495a', '#9fc4bd', '#eff1e7'], ['#714950', '#d9a780', '#f7eee5'], ['#4e5737', '#b7bd81', '#f3f0db'], ['#5e4b7d', '#cbb5df', '#f4eef7']];
const safeText = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const visualAssets = registry.assets.filter(asset => ['illustration_originale', 'animation_scenarisee'].includes(asset.kind));
if (visualAssets.filter(asset => asset.kind === 'illustration_originale').length !== 45 || visualAssets.filter(asset => asset.kind === 'animation_scenarisee').length !== 14) throw new Error('Expected 45 illustration and 14 animation slots.');

for (const [index, asset] of visualAssets.entries()) {
  const isAnimation = asset.kind === 'animation_scenarisee';
  const folder = isAnimation ? 'animations' : 'illustrations';
  const colors = palette[index % palette.length];
  const title = asset.contentIds.map(id => registry.contents.find(entry => entry.id === id)?.localized.fr.title).filter(Boolean).join(' · ') || asset.assetId;
  const seed = index * 19 + 37;
  const arches = Array.from({ length: 4 }, (_, item) => {
    const x = 60 + item * 86 + (seed % 13); const y = 168 - ((seed + item * 11) % 44); const width = 42 + ((seed + item * 7) % 19);
    return `<path d="M${x} 235V${y}a${width / 2} ${width / 2} 0 0 1 ${width} 0v67" fill="none" stroke="${colors[1]}" stroke-width="12" stroke-linecap="round"/>`;
  }).join('');
  const line = isAnimation ? `<path d="M72 235 C140 ${104 + seed % 48}, 266 ${290 - seed % 50}, 448 128" fill="none" stroke="${colors[1]}" stroke-width="5" stroke-dasharray="7 12"/><circle cx="72" cy="235" r="9" fill="${colors[1]}"/><circle cx="448" cy="128" r="9" fill="${colors[1]}"/>` : `<path d="M58 237 Q160 ${132 + seed % 32} 264 201 T462 119" fill="none" stroke="${colors[1]}" stroke-width="4" opacity=".72"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 320" role="img" aria-labelledby="title desc"><title id="title">${safeText(asset.assetId)} — DEMO</title><desc id="desc">Visual technical fixture only. No people, silhouettes, animals, historical claim, geographic claim, or authenticated reconstruction. ${isAnimation ? 'Static fallback for a voluntary animation preview.' : 'Static illustration placeholder.'}</desc><rect width="520" height="320" rx="24" fill="${colors[2]}"/><rect x="24" y="24" width="472" height="272" rx="18" fill="${colors[0]}" opacity=".96"/><g opacity=".9">${arches}</g>${line}<g fill="${colors[2]}" opacity=".42"><circle cx="107" cy="82" r="4"/><circle cx="145" cy="66" r="3"/><circle cx="394" cy="76" r="5"/><circle cx="426" cy="91" r="3"/></g><text x="48" y="58" fill="${colors[2]}" font-family="Arial, sans-serif" font-size="13" letter-spacing="2">${safeText(asset.assetId)}</text><text x="48" y="273" fill="${colors[2]}" font-family="Arial, sans-serif" font-size="12">${isAnimation ? 'APERÇU D’ANIMATION · DÉCLENCHEMENT VOLONTAIRE' : 'ILLUSTRATION TECHNIQUE · NON DOCUMENTAIRE'}</text><text x="48" y="292" fill="${colors[1]}" font-family="Arial, sans-serif" font-size="11">DEMO · NON VALIDÉ · ${safeText(title).slice(0, 50)}</text></svg>`;
  const filename = `${asset.assetId}.svg`; const filePath = path.join(output, folder, filename);
  fs.mkdirSync(path.dirname(filePath), { recursive: true }); fs.writeFileSync(filePath, svg);
  const bytes = Buffer.from(svg);
  Object.assign(asset, { status: 'DEMO', url: `/media/demo/${folder}/${filename}`, hash: createHash('sha256').update(bytes).digest('hex'), size: bytes.length, mimeType: 'image/svg+xml', source: 'Fixture visuelle technique générée localement ; DEMO / NON VALIDE, sans affirmation historique.', alt: { fr: `Visuel technique DEMO pour ${asset.assetId}, sans représentation humaine ni animale.`, ar: `رسم تقني تجريبي للمعرّف ${asset.assetId} دون بشر أو حيوانات.` }, caption: { fr: 'DEMO / NON VALIDE — évocation graphique technique, non documentaire.', ar: 'نموذج تجريبي غير معتمد — تصور تقني غير توثيقي.' }, revision: 'demo-visual-fixture-1' });
}
fs.writeFileSync(manifestPath, JSON.stringify(registry, null, 2) + '\n');
console.log(`Generated ${visualAssets.filter(asset => asset.kind === 'illustration_originale').length} illustration and ${visualAssets.filter(asset => asset.kind === 'animation_scenarisee').length} animation DEMO fixtures.`);
