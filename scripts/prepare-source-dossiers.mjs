/** Creates source-capture dossiers for all cards; no historical content is generated. */
import fs from 'node:fs';
const fiches = JSON.parse(fs.readFileSync('editorial/fiches.v1.json', 'utf8'));
const output = 'editorial/dossiers-sources.v1.json';
if (fs.existsSync(output) && JSON.parse(fs.readFileSync(output, 'utf8')).dossiers?.some(item => item.passages?.length)) {
  throw new Error('Refusing to overwrite source dossiers that contain captured passages.');
}
const coverage = fiche => {
  if (fiche.space === 'vie_quotidienne') return {
    corpusRole: 'CONTEXTE_SIRA_NON_SUFFISANT_POUR_RECONSTITUTION_MATERIELLE',
    requiredAdditionalSourceTypes: ['source archéologique, muséale ou historique documentant l’objet', 'provenance et droits de toute représentation', 'revue spécialisée de la restitution matérielle'],
  };
  if (fiche.space === 'hegire') return {
    corpusRole: 'RECIT_A_RECOUPER_SANS_INFERENCE_CARTOGRAPHIQUE',
    requiredAdditionalSourceTypes: ['source cartographique ou géographique propre au repère', 'revue cartographique indépendante pour toute géométrie, distance ou coordonnée'],
  };
  return { corpusRole: 'RECIT_A_RECOUPER_DANS_LES_DEUX_OUVRAGES', requiredAdditionalSourceTypes: [] };
};
const dossiers = fiches.entries.map(fiche => ({
  contentId: fiche.contentId,
  title: fiche.title,
  state: 'A_RELEVER',
  targetSources: ['CORPUS-IBN-HISHAM', 'CORPUS-AR-RAHEEQ'],
  ...coverage(fiche),
  passages: [],
  requiredForEachPassage: ['sourceId', 'copyId', 'location', 'extractOrReference', 'scope', 'limitation', 'capturedBy', 'capturedAt'],
  historicalDecision: null,
  publicationAllowed: false,
}));
fs.writeFileSync(output, `${JSON.stringify({ version: '1.0.0', generatedAt: new Date().toISOString(), status: 'BROUILLON_SANS_PASSAGE', dossiers }, null, 2)}\n`);
console.log(`Source dossiers: ${dossiers.length} cards, 0 captured passages.`);
