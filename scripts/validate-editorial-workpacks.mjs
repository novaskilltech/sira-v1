/** Validates the non-public editorial queue without converting pending work into approval. */
import fs from 'node:fs';

const load = name => JSON.parse(fs.readFileSync(`editorial/${name}`, 'utf8'));
const fiches = load('fiches.v1.json');
const narrations = load('narrations.v1.json');
const assets = load('assets.v1.json');
const objects = load('objets-3d.v1.json');
const roles = load('roles.v1.json');
const corpus = load('registre-corpus.v1.json');
const writing = load('redaction-bilingue.v1.json');
const sourceDossiers = load('dossiers-sources.v1.json');
const narrationProduction = load('production-narrations.v1.json');
const cartography = load('cartographie.v1.json');
const researchIndex = load('index-reperages-sources.v1.json');
const problems = [];
const count = (list, predicate = () => true) => list.filter(predicate).length;
if (count(fiches.entries) !== 60) problems.push('60 editorial entries required');
if (count(narrations.entries) !== 120) problems.push('120 narration entries required');
if (count(assets.entries, asset => asset.kind === 'illustration_originale') !== 45) problems.push('45 illustration entries required');
if (count(assets.entries, asset => asset.kind === 'animation_scenarisee') !== 14) problems.push('14 animation entries required');
if (count(assets.entries, asset => asset.kind === 'glb_modele_3d') !== 20) problems.push('20 GLB entries required');
if (count(assets.entries, asset => asset.kind === 'image_fallback_3d') !== 20) problems.push('20 fallback entries required');
if (count(objects.entries) !== 20) problems.push('20 object entries required');
if (count(writing.entries) !== 60) problems.push('60 bilingual writing entries required');
if (count(sourceDossiers.dossiers) !== 60) problems.push('60 source capture dossiers required');
if (count(narrationProduction.entries) !== 120) problems.push('120 narration production records required');
if (count(cartography.dossiers) !== 12) problems.push('12 Hegira cartography dossiers required');
if (count(researchIndex.entries) !== 60) problems.push('60 source research index entries required');
for (const entry of fiches.entries) {
  if (!entry.baselineCorpus?.includes('CORPUS-IBN-HISHAM') || !entry.baselineCorpus?.includes('CORPUS-AR-RAHEEQ')) problems.push(`${entry.contentId}: base corpus missing`);
  if (!['BROUILLON', 'EN_REVUE', 'APPROUVE', 'REFUSE'].includes(entry.state)) problems.push(`${entry.contentId}: invalid editorial state`);
  if (entry.state === 'APPROUVE' && (!entry.references.length || !entry.approvals?.length)) problems.push(`${entry.contentId}: approval has no documentary proof`);
}
for (const role of roles.roles) {
  if (!role.roleId || !role.displayName || !role.status) problems.push('invalid role record');
}
const sourceIds = new Set(['CORPUS-IBN-HISHAM', 'CORPUS-AR-RAHEEQ']);
if (!Array.isArray(corpus.sources) || corpus.sources.length !== sourceIds.size) problems.push('two baseline corpus records required');
let recordedPassages = 0;
let historicalApprovals = 0;
let consultedCopies = 0;
let passageLeads = 0;
for (const source of corpus.sources ?? []) {
  if (!sourceIds.delete(source.sourceId)) problems.push(`unexpected or duplicate corpus record: ${source.sourceId}`);
  if (!Array.isArray(source.bibliographicCandidates) || !source.bibliographicCandidates.length) problems.push(`${source.sourceId}: bibliographic candidate required`);
  for (const candidate of source.bibliographicCandidates ?? []) {
    if (!candidate.candidateId || candidate.status !== 'NOTICE_CANDIDATE_NON_ADOPTEE') problems.push(`${source.sourceId}: invalid candidate notice`);
  }
  const copies = Array.isArray(source.consultedCopies) ? source.consultedCopies : [];
  const copyIds = new Set();
  for (const copy of copies) {
    consultedCopies += 1;
    if (!copy.copyId || copyIds.has(copy.copyId) || !copy.url || !copy.status) problems.push(`${source.sourceId}: invalid consulted copy`);
    copyIds.add(copy.copyId);
  }
  const leads = Array.isArray(source.passageLeads) ? source.passageLeads : [];
  for (const lead of leads) {
    passageLeads += 1;
    if (!lead.leadId || !lead.targetId || !copyIds.has(lead.sourceCopyId) || !lead.location || lead.status !== 'A_CONFIRMER_DANS_EXEMPLAIRE_IDENTIFIE' || lead.publicationAllowed !== false) problems.push(`${source.sourceId}: invalid non-publishable passage lead`);
  }
  for (const decision of source.researchDecisions ?? []) {
    if (decision.decision !== 'CONSERVER_COMME_PISTE_NON_PUBLIABLE' || decision.historicalApproval !== 'NON_OBTENUE') problems.push(`${source.sourceId}: research decision cannot act as historical approval`);
  }
  const passages = Array.isArray(source.passages) ? source.passages : null;
  if (!passages) problems.push(`${source.sourceId}: passages must be an array`);
  recordedPassages += passages?.length ?? 0;
  if (passages?.length && !source.selectedCopy) problems.push(`${source.sourceId}: selected copy required before recording passages`);
  if (source.humanReview) {
    historicalApprovals += 1;
    if (!passages?.length || !source.selectedCopy) problems.push(`${source.sourceId}: review requires a selected copy and localized passage`);
  }
}
if (sourceIds.size) problems.push(`baseline corpus record missing: ${[...sourceIds].join(', ')}`);
if (corpus.publicationGate?.passagesRecorded !== recordedPassages) problems.push('corpus passage count differs from publication gate');
if (corpus.publicationGate?.historicalApprovals !== historicalApprovals) problems.push('corpus approval count differs from publication gate');
if (corpus.publicationGate?.publicationAllowed !== false) problems.push('corpus register cannot enable publication');
const report = { checkedAt: new Date().toISOString(), passed: problems.length === 0, counts: { fiches: fiches.entries.length, narrations: narrations.entries.length, assets: assets.entries.length, objects: objects.entries.length, writing: writing.entries.length, sourceDossiers: sourceDossiers.dossiers.length, sourceResearchIndex: researchIndex.entries.length, narrationProduction: narrationProduction.entries.length, cartography: cartography.dossiers.length, roles: roles.roles.length, corpusSources: corpus.sources?.length ?? 0, consultedCopies, passageLeads, corpusPassages: recordedPassages }, problems };
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/editorial-workpacks-validation.json', JSON.stringify(report, null, 2));
console.log(`Editorial workpacks: ${problems.length} issue(s).`);
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
