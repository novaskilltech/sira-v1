/**
 * Controls locally generated technical fixtures. These assets are intentionally
 * outside the release manifest and must remain DEMO / NON VALIDE.
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const demoDirectory = path.join(root, 'public', 'media', 'demo');
const manifestPath = path.join(root, 'public', 'content', 'manifest.v1.json');
const reportPath = path.join(root, 'reports', 'demo-media-validation.json');
const expectedCounts = { '.glb': 20, '.svg': 79, '.wav': 2, '.mp3': 2, '.webp': 1, '.json': 1 };
const failures = [];
const objectIds = Array.from({ length: 20 }, (_, index) => `OBJ-${String(index + 1).padStart(3, '0')}`);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async entry => entry.isDirectory()
    ? listFiles(path.join(directory, entry.name))
    : [path.join(directory, entry.name)]));
  return nested.flat();
}

function fail(message) { failures.push(message); }

const files = await listFiles(demoDirectory);
const byExtension = Object.fromEntries(Object.keys(expectedCounts).map(extension => [extension, 0]));
for (const file of files) {
  const extension = path.extname(file).toLowerCase();
  if (extension in byExtension) byExtension[extension] += 1;
  else fail(`Unexpected DEMO file extension: ${path.relative(demoDirectory, file)}`);
}
for (const [extension, expected] of Object.entries(expectedCounts)) {
  if (byExtension[extension] !== expected) fail(`${extension}: expected ${expected}, received ${byExtension[extension]}`);
}

function validateStaticSvg(label, svg) {
  if (!svg.includes('<svg') || !svg.includes('DEMO') || !svg.includes('NON VALID')) fail(`${label}: missing explicit DEMO / NON VALIDE label`);
  if (/<(?:image|foreignObject|script|iframe|video|audio|use)\b/i.test(svg) || /\son[a-z]+\s*=/i.test(svg)) fail(`${label}: external, executable or embedded SVG content is forbidden`);
}

for (const id of objectIds) {
  try {
    const glb = await readFile(path.join(demoDirectory, `${id}.glb`));
    if (glb.toString('ascii', 0, 4) !== 'glTF' || glb.readUInt32LE(4) !== 2 || glb.readUInt32LE(8) !== glb.length || glb.readUInt32LE(16) !== 0x4e4f534a) {
      fail(`${id}: invalid GLB 2 header`); continue;
    }
    const jsonLength = glb.readUInt32LE(12);
    const json = JSON.parse(glb.toString('utf8', 20, 20 + jsonLength).trim());
    const markedDemo = json.nodes?.some(node => node.extras?.status === 'DEMO' && node.extras?.historicalStatus === 'NON_VALIDE' && node.extras?.publicationAllowed === false);
    if (!markedDemo) fail(`${id}: missing non-public DEMO GLB metadata`);
  } catch { fail(`${id}: unreadable GLB fixture`); }
  try { validateStaticSvg(`${id} fallback`, await readFile(path.join(demoDirectory, `${id}.svg`), 'utf8')); }
  catch { fail(`${id}: missing SVG fallback`); }
}

for (const locale of ['fr', 'ar']) {
  const filename = `signal-${locale}.wav`;
  try {
    const wav = await readFile(path.join(demoDirectory, filename));
    const sampleRate = wav.readUInt32LE(24); const byteRate = wav.readUInt32LE(28); const dataLength = wav.readUInt32LE(40);
    if (wav.toString('ascii', 0, 4) !== 'RIFF' || wav.toString('ascii', 8, 12) !== 'WAVE' || wav.readUInt16LE(20) !== 1 || wav.readUInt16LE(22) !== 1 || wav.readUInt16LE(34) !== 16 || sampleRate !== 22050 || byteRate !== 44100 || dataLength !== 352800 || wav.length !== 44 + dataLength) fail(`${filename}: expected 8-second mono PCM technical signal`);
  } catch { fail(`${filename}: unreadable WAV technical signal`); }
}

try {
  const hero = await readFile(path.join(demoDirectory, 'atlas-valley.webp'));
  if (hero.length > 1_500_000 || hero.toString('ascii', 0, 4) !== 'RIFF' || hero.toString('ascii', 8, 12) !== 'WEBP') fail('atlas-valley.webp: expected a WebP under the 1.5 MB DEMO budget');
} catch { fail('atlas-valley.webp: missing or unreadable DEMO landscape'); }

const provenanceFile = path.join(demoDirectory, 'tts-demo-openrouter-provenance.json');
let provenance;
try { provenance = JSON.parse(await readFile(provenanceFile, 'utf8')); }
catch { fail('OpenRouter DEMO provenance is missing or invalid JSON'); }

if (provenance) {
  if (!Array.isArray(provenance.samples) || provenance.samples.length !== 2) fail('OpenRouter DEMO provenance must list exactly two samples');
  const mp3Files = new Set(files.filter(file => path.extname(file) === '.mp3').map(file => path.basename(file)));
  for (const sample of provenance.samples ?? []) {
    const sampleFile = typeof sample.file === 'string' ? path.basename(sample.file) : '';
    if (!mp3Files.delete(sampleFile)) fail(`OpenRouter provenance has an unknown or duplicate file: ${sample.file}`);
    if (sample.status !== 'DEMO_NON_VALIDE') fail(`${sampleFile}: status must remain DEMO_NON_VALIDE`);
    if (sample.publicationAllowed !== false) fail(`${sampleFile}: publication must remain forbidden`);
    if (sample.durationSeconds !== null) fail(`${sampleFile}: a MP3 DEMO sample cannot claim a publishable duration`);
    if (sample.provider !== 'openrouter' || typeof sample.model !== 'string' || typeof sample.voice !== 'string') fail(`${sampleFile}: incomplete provider provenance`);
    try {
      const bytes = await readFile(path.join(demoDirectory, sampleFile));
      const hash = createHash('sha256').update(bytes).digest('hex');
      if (hash !== sample.sha256) fail(`${sampleFile}: SHA-256 differs from provenance`);
    } catch { fail(`${sampleFile}: file is unavailable for hash verification`); }
  }
  if (mp3Files.size) fail(`MP3 without OpenRouter DEMO provenance: ${[...mp3Files].join(', ')}`);
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const ttsDemoReference = manifest.assets.some(asset => String(asset.url ?? '').includes('tts-demo-'));
if (ttsDemoReference) fail('A TTS DEMO file must never be referenced by the release manifest');
const visualAssets = manifest.assets.filter(asset => ['illustration_originale', 'animation_scenarisee'].includes(asset.kind));
const illustrations = visualAssets.filter(asset => asset.kind === 'illustration_originale');
const animations = visualAssets.filter(asset => asset.kind === 'animation_scenarisee');
if (illustrations.length !== 45 || animations.length !== 14) fail(`Expected 45 illustrations and 14 animation fallbacks, received ${illustrations.length} and ${animations.length}`);
for (const asset of visualAssets) {
  const expectedFolder = asset.kind === 'illustration_originale' ? 'illustrations' : 'animations';
  if (asset.status !== 'DEMO' || !String(asset.url ?? '').match(new RegExp(`^/media/demo/${expectedFolder}/[A-Z0-9-]+\\.svg$`))) {
    fail(`${asset.assetId}: visual slot must point to a labelled local DEMO SVG`); continue;
  }
  try {
    const file = path.join(root, 'public', String(asset.url).slice(1)); const bytes = await readFile(file); const svg = bytes.toString('utf8');
    validateStaticSvg(asset.assetId, svg);
    if (!svg.includes('No people, silhouettes, animals')) fail(`${asset.assetId}: visual fixture must state the no-human/no-animal constraint`);
    if (asset.size !== bytes.length || asset.hash !== createHash('sha256').update(bytes).digest('hex')) fail(`${asset.assetId}: manifest visual hash or size differs from fixture`);
  } catch { fail(`${asset.assetId}: unavailable visual fixture`); }
}

const report = {
  checkedAt: new Date().toISOString(),
  passed: failures.length === 0,
  demoFileCount: files.length,
  mediaFileCount: files.length - byExtension['.json'],
  byExtension,
  failures
};
await mkdir(path.dirname(reportPath), { recursive: true });
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`DEMO media: ${report.mediaFileCount} media files + ${byExtension['.json']} provenance file. Publication gate intact.`);
}
