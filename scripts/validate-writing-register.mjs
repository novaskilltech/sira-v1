/** Validates bilingual writing intake without promoting an editorial state. */
import fs from 'node:fs';

const writing = JSON.parse(fs.readFileSync('editorial/redaction-bilingue.v1.json', 'utf8'));
const claims = JSON.parse(fs.readFileSync('editorial/registre-claims.v1.json', 'utf8'));
const researchIndex = JSON.parse(fs.readFileSync('editorial/index-reperages-sources.v1.json', 'utf8'));
const problems = [];
const expectedIds = new Set(claims.entries.map(entry => entry.contentId));
const seen = new Set();
const researchByContentId = new Map(researchIndex.entries.map(entry => [entry.contentId, entry]));
let frenchTexts = 0;
let arabicTexts = 0;
for (const entry of writing.entries ?? []) {
  if (!entry.contentId || seen.has(entry.contentId) || !expectedIds.delete(entry.contentId)) problems.push(`invalid or duplicate writing card: ${entry.contentId}`);
  seen.add(entry.contentId);
  if (entry.publicationAllowed !== false) problems.push(`${entry.contentId}: writing intake cannot permit publication`);
  const research = researchByContentId.get(entry.contentId);
  const brief = entry.authoringBrief;
  if (!research || !brief || brief.sourceResearchStatus !== research.status || !brief.precondition || !Array.isArray(brief.fr?.sections) || !Array.isArray(brief.ar?.sections)) problems.push(`${entry.contentId}: authoring brief is missing or detached from source research`);
  if (brief?.fr?.linguisticRequirement !== 'RELECTURE_HUMAINE_FR_PAR_REVISION' || brief?.ar?.linguisticRequirement !== 'RELECTURE_HUMAINE_AR_NATIF_PAR_REVISION') problems.push(`${entry.contentId}: both human linguistic review requirements are mandatory`);
  if (entry.sourceState === 'AUCUN_CLAIM_APPROUVE' && entry.state !== 'BROUILLON') problems.push(`${entry.contentId}: no-claim card must remain a draft`);
  for (const locale of ['fr', 'ar']) {
    const draft = entry.languages?.[locale];
    if (!draft || draft.locale !== locale || !Array.isArray(draft.sourceClaimIds) || !Array.isArray(draft.notes)) {
      problems.push(`${entry.contentId}/${locale}: incomplete language record`);
      continue;
    }
    if (draft.text !== null && typeof draft.text !== 'string') problems.push(`${entry.contentId}/${locale}: text must be null or a string`);
    if (draft.text) {
      if (locale === 'fr') frenchTexts += 1; else arabicTexts += 1;
      if (!draft.revision || !draft.sourceClaimIds.length) problems.push(`${entry.contentId}/${locale}: a text needs a revision and claim links`);
    }
    if (draft.state === 'APPROUVE') problems.push(`${entry.contentId}/${locale}: approval belongs to the evidence-backed release workflow`);
  }
}
if (expectedIds.size) problems.push(`missing writing cards: ${[...expectedIds].join(', ')}`);
if (writing.status !== 'BROUILLON_SANS_TEXTE') problems.push('writing register must remain non-publishable until the release workflow promotes a reviewed lot');
const report = { checkedAt: new Date().toISOString(), passed: problems.length === 0, cards: writing.entries?.length ?? 0, frenchTexts, arabicTexts, problems };
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/writing-register-validation.json', JSON.stringify(report, null, 2));
console.log(`Writing register: ${report.cards} cards, ${frenchTexts} French texts, ${arabicTexts} Arabic texts, ${problems.length} issue(s).`);
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
