/**
 * Produces review workpacks from the frozen inventories.
 * This is an editorial queue, not an approval generator: no source, reviewer,
 * licence, narration or historical assertion is invented here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';

const read = file => parse(fs.readFileSync(file, 'utf8'), { columns: true, bom: true, skip_empty_lines: true });
const contents = read('inventaire_contenus.csv');
const media = read('inventaire_medias.csv');
const objects = read('inventaire_objets_3d.csv');
const now = new Date().toISOString();
const pilotIds = new Set(['CHR-01', 'HEG-ETP-03', 'VIE-01']);
const roles = [
  {
    roleId: 'SHEIKH_SALAH',
    displayName: 'Sheikh Salah',
    scope: ['history', 'religious-source-review'],
    responsibilities: ['Vérifier les passages du corpus', 'Distinguer texte, tradition, variante et incertitude', 'Approuver ou refuser la révision historique d’une fiche'],
    cannotApprove: ['droits', 'licences', 'audio-pronunciation', 'performance-device', 'traduction-fr-ar-sans-compétence-linguistique-attestée'],
    status: 'MANDATE_PAR_COMMANDITAIRE_EN_REVUE',
  },
  {
    roleId: 'AHMED_FULLSTACK',
    displayName: 'Ahmed Dev Fullstack',
    scope: ['technical-integration', 'manifest-validation', 'accessibility-automation', 'performance-automation', 'release-engineering'],
    responsibilities: ['Intégrer les contenus approuvés', 'Maintenir le gate de publication', 'Produire les rapports de build et de tests', 'Préparer les recettes appareils et les fallbacks'],
    cannotApprove: ['history', 'religious-source-review', 'droits', 'licences', 'traduction-arabe-sans-relecteur-qualifie'],
    status: 'MANDATE_PAR_COMMANDITAIRE_EN_REVUE',
  },
];
const baselineCorpus = [
  {
    sourceId: 'CORPUS-IBN-HISHAM',
    title: 'Sīrat Ibn Hishām / al-Sīra al-nabawiyya',
    author: 'Ibn Hishām',
    role: 'source classique de sīra à citer avec édition, volume et page',
    editionRequired: ['éditeur', 'année', 'langue', 'traducteur si applicable', 'volume', 'page ou section'],
    status: 'BIBLIOGRAPHIE_A_COMPLETER',
  },
  {
    sourceId: 'CORPUS-AR-RAHEEQ',
    title: 'Ar-Raheeq Al-Makhtoum / al-Raḥīq al-Makhtūm',
    author: 'Safiur Rahman al-Mubarakpuri',
    role: 'synthèse moderne de sīra à attribuer, recouper et distinguer des sources classiques',
    editionRequired: ['éditeur', 'année', 'langue', 'traducteur si applicable', 'ISBN si disponible', 'page ou chapitre'],
    status: 'BIBLIOGRAPHIE_A_COMPLETER',
  },
];
const editorial = contents.map(content => ({
  contentId: content.id,
  title: content.title,
  space: content.space,
  type: content.type,
  priority: pilotIds.has(content.id) ? 'PILOTE_1' : 'LOT_A_PLANIFIER',
  state: 'BROUILLON',
  historicalClaims: [],
  documentedVariants: [],
  references: [],
  baselineCorpus: baselineCorpus.map(source => source.sourceId),
  geography: content.cartography,
  requiredReviews: ['history', 'fr', 'ar', 'rights', ...(content.space === 'hegire' ? ['geography'] : [])],
  reviewAssignments: { history: 'SHEIKH_SALAH', technicalIntegration: 'AHMED_FULLSTACK' },
  requiredNarrations: [content.audio_fr_id, content.audio_ar_id],
  blockingRule: 'Aucune narration ou publication sans références localisées et décisions indépendantes liées à la révision.',
}));
const narration = contents.flatMap(content => [
  { assetId: content.audio_fr_id, contentId: content.id, locale: 'fr', state: 'BROUILLON', targetDurationSeconds: { min: 180, max: 300 }, script: null, scriptRevision: null, reviews: ['history', 'fr', 'rights'], pronunciationReview: 'PENDING', audioFile: null },
  { assetId: content.audio_ar_id, contentId: content.id, locale: 'ar', state: 'BROUILLON', targetDurationSeconds: { min: 180, max: 300 }, script: null, scriptRevision: null, reviews: ['history', 'ar', 'rights'], pronunciationReview: 'PENDING', audioFile: null },
]);
const visual = media.filter(item => ['illustration_originale', 'animation_scenarisee', 'glb_modele_3d', 'image_fallback_3d'].includes(item.type)).map(item => ({
  assetId: item.id,
  kind: item.type,
  contentIds: item.content_ids.split(';').filter(Boolean),
  state: 'BROUILLON',
  source: null,
  rights: null,
  visualReview: 'PENDING',
  historicalReview: 'PENDING',
  humanAndAnimalFreeReview: 'PENDING',
  fallback: item.fallback || null,
  brief: item.role,
}));
const objectQueue = objects.map(object => ({
  objectId: object.id,
  name: object.name,
  state: 'BROUILLON',
  sourceDocumentation: null,
  interpretationNotes: null,
  editableSourceFile: null,
  finalGlb: null,
  finalFallback: null,
  reviews: ['history', 'rights', 'visual', 'device-performance'],
}));
if (editorial.length !== 60 || narration.length !== 120 || visual.filter(item => item.kind === 'illustration_originale').length !== 45 || visual.filter(item => item.kind === 'animation_scenarisee').length !== 14 || objectQueue.length !== 20) throw new Error('Frozen inventory count mismatch. Workpacks were not written.');
const output = path.resolve('editorial');
fs.mkdirSync(output, { recursive: true });
const write = (name, payload) => fs.writeFileSync(path.join(output, name), JSON.stringify({ generatedAt: now, status: 'NON_VALIDE', ...payload }, null, 2) + '\n');
write('fiches.v1.json', { baselineCorpus, roles, entries: editorial });
write('narrations.v1.json', { entries: narration });
write('assets.v1.json', { entries: visual });
write('objets-3d.v1.json', { entries: objectQueue });
write('publication-readiness.v1.json', { checks: { contents: 60, narrations: 120, illustrations: 45, animations: 14, objects: 20 }, assignments: { historicalReligiousReview: 'SHEIKH_SALAH', technicalIntegration: 'AHMED_FULLSTACK' }, completed: { approvedContents: 0, approvedNarrations: 0, approvedIllustrations: 0, approvedAnimations: 0, approvedObjects: 0 }, blockers: ['Historique', 'Linguistique FR', 'Linguistique AR', 'Audio et prononciation', 'Droits', 'Cartographie', 'Recette sur appareils physiques', 'Exploitant et HTTPS'] });
write('roles.v1.json', { roles, unassignedRequiredReviews: ['fr', 'ar', 'rights', 'audio', 'pronunciation', 'geography', 'visual', 'device-performance', 'operator-legal'] });
console.log(`Prepared ${editorial.length} editorial records, ${narration.length} narration records, ${visual.length} visual records and ${objectQueue.length} object records.`);
