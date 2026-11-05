/** Creates map documentation dossiers, deliberately without coordinates or geometry. */
import fs from 'node:fs';
const fiches = JSON.parse(fs.readFileSync('editorial/fiches.v1.json', 'utf8'));
const output = 'editorial/cartographie.v1.json';
if (fs.existsSync(output) && JSON.parse(fs.readFileSync(output, 'utf8')).dossiers?.some(item => item.geometry || item.coordinates)) {
  throw new Error('Refusing to overwrite cartography dossiers containing geometry or coordinates.');
}
const dossiers = fiches.entries.filter(item => item.space === 'hegire').map(item => ({
  contentId: item.contentId, title: item.title, state: 'SANS_REPERE_DOCUMENTE',
  representation: 'SANS_REPERE', geometry: null, coordinates: null, sourceEvidence: [],
  uncertaintyLabel: { fr: 'Repérage non documenté pour publication.', ar: 'لم يوثّق التحديد للنشر.' },
  cartographicReview: null, publicationAllowed: false,
}));
fs.writeFileSync(output, `${JSON.stringify({ version: '1.0.0', generatedAt: new Date().toISOString(), status: 'BROUILLON_SANS_GEOMETRIE', dossiers }, null, 2)}\n`);
console.log(`Cartography dossiers: ${dossiers.length} Hegira cards, 0 geometry, 0 coordinates.`);
