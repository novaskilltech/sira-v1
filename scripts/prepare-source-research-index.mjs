/** Indexes free, non-publishable source leads without creating historical claims. */
import fs from 'node:fs';
const fiches = JSON.parse(fs.readFileSync('editorial/fiches.v1.json', 'utf8'));
const output = 'editorial/index-reperages-sources.v1.json';
if (fs.existsSync(output) && JSON.parse(fs.readFileSync(output, 'utf8')).entries?.some(item => item.claimIds?.length)) {
  throw new Error('Refusing to overwrite an index that has been linked to claims.');
}
const route = entry => {
  const number = Number(entry.contentId.slice(-2));
  if (entry.contentId === 'CHR-01') return { status: 'REPERAGE_DISPONIBLE_NON_VALIDE', note: 'Bulak/Bulaq bibliographic hypothesis and Ar-Raheeq PDF work location.', researchFile: 'docs/RELEVE_PILOTE_CHR01_BULAK_AR_RAHEEQ.md' };
  if (entry.contentId.startsWith('CHR-') && number <= 8) return { status: 'REPERAGE_DISPONIBLE_NON_VALIDE', note: 'Free online section pointers; edition-to-transcription equivalence is unverified.', researchFile: 'docs/REPERAGE_SOURCES_CHR02_CHR08_NON_PUBLIABLE.md' };
  if (entry.contentId.startsWith('CHR-') && number <= 16) return { status: 'REPERAGE_DISPONIBLE_NON_VALIDE', note: 'Free PDF and transcription pointers, with explicit gaps requiring collation.', researchFile: 'docs/REPERAGE_CHR09_CHR16_SOURCES_GRATUITES.md' };
  if (entry.contentId.startsWith('CHR-') || /^HEG-ETP-0[1-6]$/.test(entry.contentId)) return { status: 'REPERAGE_DISPONIBLE_NON_VALIDE', note: 'Free online section pointers; cartographic and narrative limits remain separate.', researchFile: 'docs/RELEVE_PILOTE_CHR17_24_HEG01_06.md' };
  if (entry.contentId.startsWith('HEG-')) return { status: 'A_RELEVER', note: 'No passage lead yet; use the two books for narrative context only and keep geometry absent.', researchFile: null };
  return { status: 'SOURCES_MATERIELLES_COMPLEMENTAIRES_REQUISES', note: 'The two sira books are context only; an object-specific archaeological, museum or historical source is required.', researchFile: 'docs/COUVERTURE_CORPUS_DEUX_OUVRAGES.md' };
};
const entries = fiches.entries.map(entry => ({ contentId: entry.contentId, title: entry.title, ...route(entry), claimIds: [], publicationAllowed: false }));
fs.writeFileSync(output, `${JSON.stringify({ version: '1.0.0', generatedAt: new Date().toISOString(), status: 'INDEX_DE_REPERAGE_NON_PUBLIABLE', entries }, null, 2)}\n`);
console.log(`Source research index: ${entries.length} cards, 0 linked claims.`);
