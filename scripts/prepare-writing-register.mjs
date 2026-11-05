/** Builds the empty bilingual writing queue without inventing historical prose. */
import fs from 'node:fs';

const fiches = JSON.parse(fs.readFileSync('editorial/fiches.v1.json', 'utf8'));
const researchIndex = JSON.parse(fs.readFileSync('editorial/index-reperages-sources.v1.json', 'utf8'));
const output = 'editorial/redaction-bilingue.v1.json';
if (fs.existsSync(output)) {
  const existing = JSON.parse(fs.readFileSync(output, 'utf8'));
  if (existing.entries?.some(entry => entry.languages?.fr?.text || entry.languages?.ar?.text)) {
    throw new Error('Refusing to overwrite a writing register containing text.');
  }
}
const language = locale => ({
  locale,
  state: 'BROUILLON',
  revision: null,
  text: null,
  sourceClaimIds: [],
  linguisticReview: null,
  notes: [],
});
const brief = research => ({
  sourceResearchStatus: research.status,
  precondition: research.status === 'SOURCES_MATERIELLES_COMPLEMENTAIRES_REQUISES'
    ? 'COLLECTER_SOURCES_MATERIELLES_AVANT_REDACTION'
    : research.status === 'A_RELEVER'
      ? 'LOCALISER_PASSAGES_AVANT_REDACTION'
      : 'COLLATIONNER_PASSAGES_AVANT_REDACTION',
  fr: {
    sections: ['repère et périmètre', 'éléments sourcés', 'variantes et limites', 'synthèse pédagogique'],
    linguisticRequirement: 'RELECTURE_HUMAINE_FR_PAR_REVISION',
  },
  ar: {
    sections: ['تحديد الموضوع ونطاقه', 'العناصر المسندة إلى المصادر', 'الاختلافات والحدود', 'خلاصة تربوية'],
    linguisticRequirement: 'RELECTURE_HUMAINE_AR_NATIF_PAR_REVISION',
  },
  narrationRule: 'LE_SCRIPT_AUDIO_EST_DISTINCT_DU_RECIT_ET_NE_PEUT_COMMENCER_QU_APRES_REVISION_HISTORIQUE',
});
const indexByContentId = new Map(researchIndex.entries.map(entry => [entry.contentId, entry]));
const entries = fiches.entries.map(fiche => ({
  contentId: fiche.contentId,
  title: fiche.title,
  state: 'BROUILLON',
  sourceState: 'AUCUN_CLAIM_APPROUVE',
  target: {
    frWords: { min: 500, max: 650 },
    narrationDurationSeconds: { min: 180, max: 300 },
    arabicMode: 'REDACTION_NATIVE_SEPAREE_NON_TRADUCTION_AUTOMATIQUE',
  },
  languages: { fr: language('fr'), ar: language('ar') },
  authoringBrief: brief(indexByContentId.get(fiche.contentId)),
  requiredBeforeApproval: [
    'claims localisés et décision historique humaine liée à la révision',
    'texte propre à chaque langue, avec révision distincte',
    'relecture linguistique humaine de la langue concernée',
    'variantes et limites conservées dans les deux langues',
  ],
  publicationAllowed: false,
}));
const register = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  status: 'BROUILLON_SANS_TEXTE',
  purpose: 'Préparer les 60 récits FR/AR sans rédiger ni approuver de contenu historique.',
  entries,
};
fs.writeFileSync(output, `${JSON.stringify(register, null, 2)}\n`);
console.log(`Writing register: ${entries.length} cards, 0 French texts, 0 Arabic texts.`);
