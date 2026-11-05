import fs from 'node:fs';
const dossiers = JSON.parse(fs.readFileSync('editorial/dossiers-sources.v1.json', 'utf8'));
const claims = JSON.parse(fs.readFileSync('editorial/registre-claims.v1.json', 'utf8'));
const expected = new Set(claims.entries.map(entry => entry.contentId));
const seen = new Set(); const problems = []; let passageCount = 0;
for (const dossier of dossiers.dossiers ?? []) {
  if (!dossier.contentId || seen.has(dossier.contentId) || !expected.delete(dossier.contentId)) problems.push(`invalid or duplicate dossier: ${dossier.contentId}`);
  seen.add(dossier.contentId);
  if (dossier.publicationAllowed !== false) problems.push(`${dossier.contentId}: source dossier cannot allow publication`);
  if (!Array.isArray(dossier.targetSources) || dossier.targetSources.length !== 2) problems.push(`${dossier.contentId}: two target sources required`);
  if (!dossier.corpusRole || !Array.isArray(dossier.requiredAdditionalSourceTypes)) problems.push(`${dossier.contentId}: source coverage requirements missing`);
  if (dossier.contentId.startsWith('VIE-') && dossier.corpusRole !== 'CONTEXTE_SIRA_NON_SUFFISANT_POUR_RECONSTITUTION_MATERIELLE') problems.push(`${dossier.contentId}: material culture cannot rely on the two sira works alone`);
  if (dossier.contentId.startsWith('HEG-') && dossier.corpusRole !== 'RECIT_A_RECOUPER_SANS_INFERENCE_CARTOGRAPHIQUE') problems.push(`${dossier.contentId}: Hegira dossier needs cartographic safeguards`);
  for (const passage of dossier.passages ?? []) {
    passageCount += 1;
    for (const field of ['sourceId', 'copyId', 'location', 'extractOrReference', 'scope', 'limitation', 'capturedBy', 'capturedAt']) if (!passage[field]) problems.push(`${dossier.contentId}: passage missing ${field}`);
  }
  if (dossier.historicalDecision) problems.push(`${dossier.contentId}: decisions belong to evidence-backed release review`);
}
if (expected.size) problems.push(`missing dossiers: ${[...expected].join(', ')}`);
if (dossiers.status !== 'BROUILLON_SANS_PASSAGE') problems.push('source dossiers must remain non-publishable intake records');
const report = { checkedAt: new Date().toISOString(), passed: !problems.length, dossiers: dossiers.dossiers?.length ?? 0, capturedPassages: passageCount, problems };
fs.mkdirSync('reports', { recursive: true }); fs.writeFileSync('reports/source-dossiers-validation.json', JSON.stringify(report, null, 2));
console.log(`Source dossiers: ${report.dossiers} cards, ${passageCount} captured passages, ${problems.length} issue(s).`);
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
