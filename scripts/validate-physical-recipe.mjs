import fs from 'node:fs';
import { parse } from 'csv-parse/sync';
const recipe = JSON.parse(fs.readFileSync('recette-physique.v1.json', 'utf8'));
const source = parse(fs.readFileSync('recette.csv', 'utf8'), { columns: true, skip_empty_lines: true, trim: true });
const expected = new Set(source.map(item => item.id)); const seen = new Set(); const problems = []; const statuses = {};
for (const check of recipe.checks ?? []) {
  if (!check.id || seen.has(check.id) || !expected.delete(check.id)) problems.push(`invalid or duplicate physical check: ${check.id}`);
  seen.add(check.id);
  const status = check.execution?.status; statuses[status] = (statuses[status] ?? 0) + 1;
  if (!['NON_EXECUTE', 'PASS', 'FAIL', 'BLOQUE'].includes(status)) problems.push(`${check.id}: invalid execution status`);
  if (check.publicationAllowed !== false) problems.push(`${check.id}: physical test record cannot allow publication`);
  if (status !== 'NON_EXECUTE') {
    const execution = check.execution;
    for (const field of ['executedAt', 'device', 'osVersion', 'browserOrAssistiveTechnology', 'testerId']) if (!execution[field]) problems.push(`${check.id}: executed check missing ${field}`);
    if (!Array.isArray(execution.evidencePaths) || !execution.evidencePaths.length) problems.push(`${check.id}: executed check needs evidence paths`);
  }
}
if (expected.size) problems.push(`missing physical checks: ${[...expected].join(', ')}`);
const report = { checkedAt: new Date().toISOString(), passed: !problems.length, checks: recipe.checks?.length ?? 0, statuses, problems };
fs.mkdirSync('reports', { recursive: true }); fs.writeFileSync('reports/physical-recipe-validation.json', JSON.stringify(report, null, 2));
console.log(`Physical recipe: ${report.checks} checks, ${JSON.stringify(statuses)}, ${problems.length} issue(s).`);
if (problems.length) { console.error(problems.join('\n')); process.exitCode = 1; }
