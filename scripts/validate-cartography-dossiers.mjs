import fs from 'node:fs';
const map = JSON.parse(fs.readFileSync('editorial/cartographie.v1.json', 'utf8'));
const fiches = JSON.parse(fs.readFileSync('editorial/fiches.v1.json', 'utf8'));
const expected = new Set(fiches.entries.filter(item => item.space === 'hegire').map(item => item.contentId));
const seen = new Set(); const problems = []; let mapped = 0;
for (const item of map.dossiers ?? []) {
  if (!item.contentId || seen.has(item.contentId) || !expected.delete(item.contentId)) problems.push(`invalid or duplicate map dossier: ${item.contentId}`);
  seen.add(item.contentId);
  if (item.publicationAllowed !== false) problems.push(`${item.contentId}: map dossier cannot allow publication`);
  if (item.geometry || item.coordinates) { mapped += 1; if (!item.sourceEvidence?.length || !item.cartographicReview) problems.push(`${item.contentId}: geometry/coordinates require sources and a cartographic review`); }
  if (item.state === 'APPROUVE') problems.push(`${item.contentId}: cartographic approval belongs to the evidence-backed release workflow`);
}
if (expected.size) problems.push(`missing Hegira map dossiers: ${[...expected].join(', ')}`);
if (map.status !== 'BROUILLON_SANS_GEOMETRIE') problems.push('cartography must remain a non-publishable intake while undocumented');
const report = { checkedAt: new Date().toISOString(), passed: !problems.length, dossiers: map.dossiers?.length ?? 0, mapped, problems };
fs.mkdirSync('reports', { recursive: true }); fs.writeFileSync('reports/cartography-validation.json', JSON.stringify(report, null, 2));
console.log(`Cartography dossiers: ${report.dossiers} cards, ${mapped} geometry/coordinate entries, ${problems.length} issue(s).`);
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
