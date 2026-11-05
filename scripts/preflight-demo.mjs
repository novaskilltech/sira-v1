/**
 * CI-friendly, non-publishing delivery preflight. It intentionally does not
 * call build:public: a DEMO corpus must not be promoted merely by running CI.
 */
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('npm_execpath is required to run the preflight checks.');
const checks = [
  ['manifest-demo', ['run', 'validate']],
  ['media-demo', ['run', 'demo:validate']],
  ['editorial-registers', ['run', 'editorial:verify']],
  ['physical-recipe-register', ['run', 'physical:validate']],
  ['types', ['run', 'typecheck']],
  ['lint', ['run', 'lint']],
  ['unit-tests', ['test']],
  ['demo-build', ['run', 'build']],
];
const results = [];
let passed = true;
for (const [name, args] of checks) {
  const startedAt = new Date().toISOString();
  // Execute npm's Node entry point directly: npm.cmd with a shell can detach on Windows.
  const result = spawnSync(process.execPath, [npmCli, ...args], { stdio: 'inherit', windowsHide: true });
  const ok = !result.error && result.status === 0;
  results.push({ name, command: `npm ${args.join(' ')}`, startedAt, passed: ok, exitCode: result.status ?? null, error: result.error?.message ?? null });
  if (!ok) { passed = false; break; }
}
const report = {
  channel: 'demo', checkedAt: new Date().toISOString(), passed, checks: results,
  publicReleaseAttempted: false,
  publicReleaseNote: 'Not attempted: build:public must remain blocked until independent evidence and an approved release lot exist.',
};
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/preflight-demo.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(`DEMO preflight: ${passed ? 'PASS' : 'FAIL'} (${results.length}/${checks.length} checks).`);
if (!passed) process.exitCode = 1;
