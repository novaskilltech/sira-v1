/** Validates the non-public claim intake without granting any approval. */
import fs from 'node:fs';

const register = JSON.parse(fs.readFileSync('editorial/registre-claims.v1.json', 'utf8'));
const fiches = JSON.parse(fs.readFileSync('editorial/fiches.v1.json', 'utf8'));
const problems = [];
const expectedIds = new Set(fiches.entries.map(entry => entry.contentId));
const actualIds = new Set();
let claims = 0;
for (const entry of register.entries ?? []) {
  if (!entry.contentId || actualIds.has(entry.contentId) || !expectedIds.delete(entry.contentId)) problems.push(`invalid or duplicate card: ${entry.contentId}`);
  actualIds.add(entry.contentId);
  if (!Array.isArray(entry.claims)) problems.push(`${entry.contentId}: claims must be an array`);
  if (entry.historicalDecision?.status !== 'NON_OBTENUE') problems.push(`${entry.contentId}: card-level historical decision cannot be pre-filled`);
  if (entry.comparison?.editorialLimit !== 'AUCUN_RECIT_OU_ASSERTION_HISTORIQUE_AUTORISE') problems.push(`${entry.contentId}: missing non-publication limit`);
  for (const claim of entry.claims ?? []) {
    claims += 1;
    if (!claim.claimId || !claim.revision || !claim.projectedText?.fr || !claim.projectedText?.ar) problems.push(`${entry.contentId}: incomplete claim`);
    if (!Array.isArray(claim.sourceEvidence) || !claim.sourceEvidence.length) problems.push(`${entry.contentId}/${claim.claimId}: source evidence required`);
    for (const evidence of claim.sourceEvidence ?? []) {
      if (!evidence.sourceId || !evidence.copyId || !evidence.location || !evidence.scope || !evidence.limitation) problems.push(`${entry.contentId}/${claim.claimId}: incomplete evidence`);
    }
    if (claim.decision !== 'EN_ATTENTE') problems.push(`${entry.contentId}/${claim.claimId}: reviewer decision must be entered by a human process`);
  }
}
if (expectedIds.size) problems.push(`missing cards: ${[...expectedIds].join(', ')}`);
if (register.status !== 'BROUILLON_SANS_CLAIM') problems.push('claim register must remain a draft until the review workflow promotes it');
const report = { checkedAt: new Date().toISOString(), passed: problems.length === 0, cards: register.entries?.length ?? 0, claims, problems };
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/claims-register-validation.json', JSON.stringify(report, null, 2));
console.log(`Claim register: ${report.cards} cards, ${claims} recorded claims, ${problems.length} issue(s).`);
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
