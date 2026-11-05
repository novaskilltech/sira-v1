/** Builds the empty historical-claim intake for every editorial card. */
import fs from 'node:fs';

const input = 'editorial/fiches.v1.json';
const output = 'editorial/registre-claims.v1.json';
const fiches = JSON.parse(fs.readFileSync(input, 'utf8'));
if (fs.existsSync(output)) {
  const existing = JSON.parse(fs.readFileSync(output, 'utf8'));
  if (existing.entries?.some(entry => entry.claims?.length)) {
    throw new Error('Refusing to overwrite a claim register containing entered claims');
  }
}
const entries = fiches.entries.map(fiche => ({
  contentId: fiche.contentId,
  title: fiche.title,
  space: fiche.space,
  intakeStatus: 'A_RENSEIGNER',
  claimRules: {
    minimumSources: ['CORPUS-IBN-HISHAM', 'CORPUS-AR-RAHEEQ'],
    requiredBeforeHistoricalApproval: [
      'texte projete FR et AR, rattache a une revision',
      'passage localise dans un exemplaire identifie',
      'nature : texte, recit de sira, tradition, synthese, variante ou interpretation',
      'portee et limite explicites',
      'comparaison des deux ouvrages ou motif documente de non-applicabilite',
      'decision humaine historique datee'
    ]
  },
  claims: [],
  comparison: {
    ibnHisham: 'A_RELEVER',
    arRaheeq: 'A_RELEVER',
    variants: [],
    editorialLimit: 'AUCUN_RECIT_OU_ASSERTION_HISTORIQUE_AUTORISE'
  },
  historicalDecision: {
    status: 'NON_OBTENUE',
    reviewerId: null,
    evidenceLink: null,
    targetRevision: null
  }
}));
const register = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  status: 'BROUILLON_SANS_CLAIM',
  purpose: 'Saisir les affirmations historiques seulement apres localisation des passages et revue humaine.',
  claimSchema: {
    claimId: 'ID stable, unique dans la fiche',
    projectedText: { fr: 'texte de la revision', ar: 'texte de la revision' },
    revision: 'revision exacte de la fiche ou du script',
    classification: 'TEXTE | RECIT_SIRA | TRADITION | SYNTHESE | VARIANTE | INTERPRETATION',
    sourceEvidence: [{ sourceId: 'CORPUS-IBN-HISHAM ou CORPUS-AR-RAHEEQ', copyId: 'exemplaire identifie', location: 'tome, chapitre/section, pages', scope: 'ce que le passage etablit', limitation: 'ce qu il ne permet pas de conclure' }],
    comparison: 'CONCORDANCE | DIVERGENCE | ABSENCE | NON_APPLICABLE',
    decision: 'EN_ATTENTE | APPROUVE | REFUSE avec identite humaine et preuve'
  },
  entries
};
fs.writeFileSync(output, `${JSON.stringify(register, null, 2)}\n`);
console.log(`Claim register: ${entries.length} cards, ${entries.reduce((total, entry) => total + entry.claims.length, 0)} recorded claims.`);
