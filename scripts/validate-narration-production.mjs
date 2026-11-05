import fs from 'node:fs';
const production = JSON.parse(fs.readFileSync('editorial/production-narrations.v1.json', 'utf8'));
const narrations = JSON.parse(fs.readFileSync('editorial/narrations.v1.json', 'utf8'));
const expected = new Map(narrations.entries.map(item => [item.assetId, item])); const seen = new Set(); const problems = [];
let scripts = 0; let audioFiles = 0;
for (const item of production.entries ?? []) {
  const expectedItem = expected.get(item.assetId);
  if (!expectedItem || seen.has(item.assetId)) problems.push(`invalid or duplicate track: ${item.assetId}`);
  seen.add(item.assetId);
  if (!expectedItem || item.contentId !== expectedItem.contentId || item.locale !== expectedItem.locale) problems.push(`${item.assetId}: immutable content/locale mismatch`);
  if (item.publicationAllowed !== false) problems.push(`${item.assetId}: production record cannot allow publication`);
  if (item.script !== null && typeof item.script !== 'string') problems.push(`${item.assetId}: script must be null or text`);
  if (item.script) { scripts += 1; if (!item.writingRevision || !item.scriptRevision || !item.claimIds?.length) problems.push(`${item.assetId}: script needs writing revision, script revision and claim links`); }
  if (item.audio?.file) { audioFiles += 1; if (!item.script || !item.audio.durationSeconds || !item.audio.sha256 || !item.audio.format) problems.push(`${item.assetId}: audio needs script, measured duration, hash and format`); }
  if (item.state === 'APPROUVE') problems.push(`${item.assetId}: approval belongs to the evidence-backed release workflow`);
}
if (expected.size !== seen.size || [...expected.keys()].some(key => !seen.has(key))) problems.push('production records must cover exactly the 120 narration tracks');
if (production.status !== 'BROUILLON_SANS_SCRIPT') problems.push('narration production must remain non-publishable intake');
const report = { checkedAt: new Date().toISOString(), passed: !problems.length, tracks: production.entries?.length ?? 0, scripts, audioFiles, problems };
fs.mkdirSync('reports', { recursive: true }); fs.writeFileSync('reports/narration-production-validation.json', JSON.stringify(report, null, 2));
console.log(`Narration production: ${report.tracks} tracks, ${scripts} scripts, ${audioFiles} audio files, ${problems.length} issue(s).`);
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
