/** Creates 120 production records without creating scripts, voices or approvals. */
import fs from 'node:fs';
const narrations = JSON.parse(fs.readFileSync('editorial/narrations.v1.json', 'utf8'));
const output = 'editorial/production-narrations.v1.json';
if (fs.existsSync(output) && JSON.parse(fs.readFileSync(output, 'utf8')).entries?.some(item => item.script || item.audio?.file)) {
  throw new Error('Refusing to overwrite narration production records containing work.');
}
const entries = narrations.entries.map(item => ({
  assetId: item.assetId, contentId: item.contentId, locale: item.locale, state: 'BROUILLON',
  writingRevision: null, claimIds: [], script: null, scriptRevision: null,
  targetDurationSeconds: item.targetDurationSeconds,
  audio: { file: null, durationSeconds: null, sha256: null, format: null },
  synthesis: { provider: null, model: null, voice: null, generatedAt: null },
  reviews: { historical: null, language: null, pronunciation: null, audio: null, rights: null },
  publicationAllowed: false,
}));
fs.writeFileSync(output, `${JSON.stringify({ version: '1.0.0', generatedAt: new Date().toISOString(), status: 'BROUILLON_SANS_SCRIPT', entries }, null, 2)}\n`);
console.log(`Narration production: ${entries.length} tracks, 0 scripts, 0 audio files.`);
