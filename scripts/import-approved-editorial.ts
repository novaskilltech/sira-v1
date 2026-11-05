/**
 * Builds a candidate PUBLIC manifest from a complete, evidence-backed release lot.
 * It never changes public/content/manifest.v1.json and refuses incomplete approval data.
 */
import fs from 'node:fs';
import path from 'node:path';
import { registrySchema, validateRegistry } from '../src/schema';
import { validateReleaseEvidence, type ReviewerRegistryEntry } from './release-evidence';

type Override = Record<string, unknown>;
type ReleaseLot = {
  version: string;
  operator: Override;
  references: Override[];
  contents: Override[];
  assets: Override[];
  objects: Override[];
  reviewerRegistry: ReviewerRegistryEntry[];
};
const argument = (name: string) => { const index = process.argv.indexOf(name); return index >= 0 ? process.argv[index + 1] : undefined; };
const input = argument('--input');
if (!input) throw new Error('Usage: npm run editorial:import -- --input editorial/releases/<lot>.json');
const inputPath = path.resolve(input);
const releaseRoot = path.resolve('editorial/releases') + path.sep;
if (!inputPath.startsWith(releaseRoot)) throw new Error('Input must remain inside editorial/releases/.');
if (!fs.existsSync(inputPath)) throw new Error(`Release lot not found: ${inputPath}`);
const lot = JSON.parse(fs.readFileSync(inputPath, 'utf8')) as Partial<ReleaseLot>;
for (const field of ['version', 'operator', 'references', 'contents', 'assets', 'objects', 'reviewerRegistry'] as const) {
  if (lot[field] === undefined) throw new Error(`Release lot missing ${field}.`);
}
for (const field of ['references', 'contents', 'assets', 'objects'] as const) if (!Array.isArray(lot[field])) throw new Error(`Release lot ${field} must be an array.`);
if (!Array.isArray(lot.reviewerRegistry)) throw new Error('Release lot reviewerRegistry must be an array.');
if (typeof lot.version !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,80}$/.test(lot.version)) throw new Error('Release lot version must be a safe identifier.');
const base = JSON.parse(fs.readFileSync('public/content/manifest.v1.json', 'utf8')) as Override;
const merge = (items: Override[], idField: string, updates: Override[]) => {
  const map = new Map(updates.map(item => [String(item[idField] ?? ''), item]));
  if (map.size !== updates.length || map.has('')) throw new Error(`Duplicate or missing ${idField} in release lot.`);
  const expected = new Set(items.map(item => String(item[idField])));
  if (updates.length !== items.length || [...map.keys()].some(id => !expected.has(id))) throw new Error(`Release lot must provide exactly one update for every ${idField}.`);
  return items.map(item => ({ ...item, ...map.get(String(item[idField])) }));
};
const candidate = {
  ...base,
  version: lot.version,
  channel: 'public',
  updatedAt: new Date().toISOString().slice(0, 10),
  operator: lot.operator,
  references: lot.references,
  contents: merge(base.contents as Override[], 'id', lot.contents as Override[]),
  assets: merge(base.assets as Override[], 'assetId', lot.assets as Override[]),
  objects: merge(base.objects as Override[], 'id', lot.objects as Override[]),
};
const parsed = registrySchema.safeParse(candidate);
if (!parsed.success) throw new Error(`Schema invalid:\n${parsed.error.message}`);
const evidenceRoot = path.resolve('editorial/evidence') + path.sep;
const localEvidenceExists = (link: string) => {
  if (typeof link !== 'string' || !link.startsWith('editorial/evidence/')) return false;
  const resolved = path.resolve(link);
  return resolved.startsWith(evidenceRoot) && fs.existsSync(resolved);
};
const allApprovals = [...parsed.data.contents.flatMap(item => item.approvalRecords), ...parsed.data.assets.flatMap(item => item.approvalRecords)];
const evidenceIssues = validateReleaseEvidence(lot.reviewerRegistry, allApprovals, localEvidenceExists);
if (evidenceIssues.length) throw new Error(`Public release evidence refused (${evidenceIssues.length} issues):\n${evidenceIssues.slice(0, 30).join('\n')}`);
const issues = validateRegistry(parsed.data, true);
if (issues.length) throw new Error(`Public release lot refused (${issues.length} issues):\n${issues.slice(0, 30).join('\n')}`);
const outputDir = path.resolve('editorial/releases/validated');
fs.mkdirSync(outputDir, { recursive: true });
const output = path.join(outputDir, `manifest.${lot.version}.json`);
fs.writeFileSync(output, JSON.stringify(parsed.data, null, 2) + '\n');
console.log(`Validated public candidate written to ${output}.`);
