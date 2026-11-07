import fs from 'node:fs';

const docFiles = [
  'docs/PILOTES_REDACTION_BROUILLON_IA.md',
  'docs/LOT_02_REDACTION_BROUILLON_IA.md',
  'docs/LOT_03_REDACTION_BROUILLON_IA.md',
  'docs/LOT_04_REDACTION_BROUILLON_IA.md',
  'docs/LOT_05_REDACTION_BROUILLON_IA.md',
  'docs/LOT_06_REDACTION_BROUILLON_IA.md',
  'docs/LOT_07_REDACTION_BROUILLON_IA.md',
  'docs/LOT_08_REDACTION_BROUILLON_IA.md',
  'docs/LOT_09_REDACTION_BROUILLON_IA.md',
  'docs/LOT_10_REDACTION_BROUILLON_IA.md',
  'docs/LOT_11_REDACTION_BROUILLON_IA.md',
  'docs/LOT_12_REDACTION_BROUILLON_IA.md',
  'docs/LOT_13_REDACTION_BROUILLON_IA.md',
  'docs/LOT_14_REDACTION_BROUILLON_IA.md',
  'docs/LOT_15_REDACTION_BROUILLON_IA.md'
];

for (const file of docFiles) {
  const text = fs.readFileSync(file, 'utf8');
  console.log(`\n=================== ${file} ===================`);
  // Split on ## (headings 2)
  const parts = text.split(/\n(?=##\s+)/);
  for (const part of parts) {
    const headerMatch = part.match(/^##\s+(?:(?:\d+\.)\s+)?([A-Z]+-(?:[A-Z]+-)?\d+)/);
    if (!headerMatch) continue;
    const id = headerMatch[1];
    
    // Check if it has '#### 1.' or '- **Introduction**' or '### Texte narratif'
    const hasH4 = part.includes('#### 1.') || part.includes('#### 1');
    const hasBulletIntro = part.includes('- **Introduction**') || part.includes('- **مقدمة**');
    const hasNarratif = part.includes('### Texte narratif');
    
    console.log(`Card ${id}: hasH4=${hasH4}, hasBulletIntro=${hasBulletIntro}, hasNarratif=${hasNarratif}`);
  }
}
