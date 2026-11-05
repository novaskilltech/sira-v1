/** Turns the acceptance CSV into a device-test register without fabricating a test run. */
import fs from 'node:fs';
import { parse } from 'csv-parse/sync';
const output = 'recette-physique.v1.json';
if (fs.existsSync(output) && JSON.parse(fs.readFileSync(output, 'utf8')).checks?.some(item => item.execution?.status !== 'NON_EXECUTE')) {
  throw new Error('Refusing to overwrite a physical recipe register that contains test results.');
}
const rows = parse(fs.readFileSync('recette.csv', 'utf8'), { columns: true, skip_empty_lines: true, trim: true });
const checks = rows.map(row => ({
  id: row.id, priority: row.priorite, objective: row.objectif, procedure: row.procedure,
  environment: row.environnement, expectedEvidence: row.preuve_attendue,
  execution: { status: 'NON_EXECUTE', executedAt: null, device: null, osVersion: null, browserOrAssistiveTechnology: null, testerId: null, evidencePaths: [], notes: null },
  publicationAllowed: false,
}));
fs.writeFileSync(output, `${JSON.stringify({ version: '1.0.0', generatedAt: new Date().toISOString(), status: 'A_REALISER_SUR_APPAREILS_REELS', checks }, null, 2)}\n`);
console.log(`Physical recipe: ${checks.length} checks, 0 executed.`);
