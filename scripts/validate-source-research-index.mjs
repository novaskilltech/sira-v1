import fs from 'node:fs';
const index = JSON.parse(fs.readFileSync('editorial/index-reperages-sources.v1.json', 'utf8'));
const fiches = JSON.parse(fs.readFileSync('editorial/fiches.v1.json', 'utf8'));
const expected = new Set(fiches.entries.map(entry => entry.contentId)); const seen = new Set(); const problems = []; const counts = {};
for (const entry of index.entries ?? []) {
  if (!entry.contentId || seen.has(entry.contentId) || !expected.delete(entry.contentId)) problems.push(`invalid or duplicate research index entry: ${entry.contentId}`);
  seen.add(entry.contentId); counts[entry.status] = (counts[entry.status] ?? 0) + 1;
  if (!['REPERAGE_DISPONIBLE_NON_VALIDE', 'A_RELEVER', 'SOURCES_MATERIELLES_COMPLEMENTAIRES_REQUISES'].includes(entry.status)) problems.push(`${entry.contentId}: invalid research state`);
  if (!entry.note || entry.publicationAllowed !== false || !Array.isArray(entry.claimIds)) problems.push(`${entry.contentId}: incomplete non-publishable research entry`);
  if (entry.claimIds.length) problems.push(`${entry.contentId}: claims belong in the evidence-backed claims register`);
  if (entry.contentId.startsWith('VIE-') && entry.status !== 'SOURCES_MATERIELLES_COMPLEMENTAIRES_REQUISES') problems.push(`${entry.contentId}: material-culture source coverage is unsafe`);
}
if (expected.size) problems.push(`missing research index entries: ${[...expected].join(', ')}`);
if (index.status !== 'INDEX_DE_REPERAGE_NON_PUBLIABLE') problems.push('research index cannot be publishable');
const report = { checkedAt: new Date().toISOString(), passed: !problems.length, entries: index.entries?.length ?? 0, counts, problems };
fs.mkdirSync('reports', { recursive: true }); fs.writeFileSync('reports/source-research-index-validation.json', JSON.stringify(report, null, 2));
console.log(`Source research index: ${report.entries} cards, ${JSON.stringify(counts)}, ${problems.length} issue(s).`);
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
