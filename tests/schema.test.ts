import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { registrySchema, safeMediaUrl, validateRegistry, type Registry } from '../src/schema';

const manifest = registrySchema.parse(JSON.parse(readFileSync('public/content/manifest.v1.json', 'utf8')));
const copy = (): Registry => structuredClone(manifest);

// In-memory validator fixtures only. These records are never saved as evidence
// or attached to the DEMO corpus. Their names deliberately identify test data.
function publicFixture(): Registry {
  const registry = copy();
  const approval = (dimension: Registry['contents'][number]['approvalRecords'][number]['dimension'], revision: string, targetId:string) => ({
    dimension, targetRevision: revision, targetId, reviewerRole: 'TEST FIXTURE ONLY',
    reviewerId: 'TEST-ONLY-NOT-A-REAL-REVIEWER', decision: 'APPROUVE' as const,
    timestamp: '2026-10-25T10:00:00.000Z', evidenceLink: 'https://example.invalid/test-only-evidence',
  });
  registry.channel = 'public';
  registry.references = [{ referenceId: 'TEST-REFERENCE', bibliographicCitation: 'Synthetic test record; no historical claim', locator: 'test fixture', checkedAt: '2026-10-25', reviewerId: 'TEST-ONLY' }];
  registry.operator = { name: 'Test operator', contact: 'test@example.invalid', host: 'example.invalid', privacyReviewed: true };
  for (const entry of registry.contents) {
    entry.status = 'APPROUVE';
    entry.referenceIds = ['TEST-REFERENCE'];
    entry.approvalRecords = ['history', 'fr', 'ar', 'rights', ...(entry.space === 'hegire' ? ['geography'] : [])].map(dimension => approval(dimension as Parameters<typeof approval>[0], entry.revision, entry.id));
    for (const locale of ['fr', 'ar'] as const) entry.localized[locale].audioScript = 'Synthetic unit-test script only.';
    if (entry.geography && entry.geography.kind !== 'not_mappable') entry.geography.sourceIds = ['TEST-REFERENCE'];
  }
  for (const object of registry.objects) object.status = 'APPROUVE';
  for (const asset of registry.assets) {
    asset.status = 'APPROUVE';
    asset.url = `/media/test/${asset.assetId}.${asset.kind === 'audio' ? 'mp3' : asset.kind === 'glb_modele_3d' ? 'glb' : 'webp'}`;
    asset.hash = 'a'.repeat(64);
    asset.size = 1024;
    asset.mimeType = asset.kind === 'audio' ? 'audio/mpeg' : asset.kind === 'glb_modele_3d' ? 'model/gltf-binary' : 'image/webp';
    asset.license = 'Synthetic test license; not valid for publication';
    asset.credit = 'TEST-ONLY';
    asset.referenceIds = ['TEST-REFERENCE'];
    asset.approvalRecords = ['history', 'rights', ...(asset.kind === 'audio' ? ['audio', 'pronunciation'] : ['visual'])].map(dimension => approval(dimension as Parameters<typeof approval>[0], asset.revision, asset.assetId));
    if (asset.kind === 'audio') {
      const content = registry.contents.find(entry => entry.id === asset.contentIds[0])!;
      asset.scriptVersion = content.localized[asset.locale!].revision;
      asset.durationSeconds = 240;
      asset.measuredDurationSeconds = 240;
    }
  }
  return registry;
}

describe('real inventory and registry integrity', () => {
  it('imports 60 bilingual entries, 20 objects and 219 unique media slots without broken links', () => {
    expect(validateRegistry(manifest)).toEqual([]);
    expect(manifest.contents).toHaveLength(60);
    expect(manifest.objects).toHaveLength(20);
    expect(manifest.assets).toHaveLength(219);
    expect(manifest.assets.filter(asset => asset.kind === 'audio')).toHaveLength(120);
    expect(manifest.assets.filter(asset => asset.locale === 'fr' && asset.kind === 'audio')).toHaveLength(60);
    expect(manifest.assets.filter(asset => asset.locale === 'ar' && asset.kind === 'audio')).toHaveLength(60);
    expect(manifest.contents.filter(entry => entry.space === 'chronologie')).toHaveLength(24);
    expect(manifest.contents.filter(entry => entry.space === 'hegire')).toHaveLength(12);
    expect(manifest.contents.filter(entry => entry.space === 'vie_quotidienne')).toHaveLength(24);
    for (const entry of manifest.contents) {
      expect(entry.localized.fr.sections.length).toBeGreaterThanOrEqual(4);
      expect(entry.localized.ar.sections.map(section => section.sectionId)).toEqual(entry.localized.fr.sections.map(section => section.sectionId));
    }
  });

  it('detects duplicates even when the total count is unchanged', () => {
    const registry = copy();
    registry.contents[1].id = registry.contents[0].id;
    registry.objects[1].id = registry.objects[0].id;
    registry.assets[1].assetId = registry.assets[0].assetId;
    expect(validateRegistry(registry)).toEqual(expect.arrayContaining([
      '60 unique content IDs required', '20 unique objects required', '219 unique media slots required',
    ]));
  });

  it('detects broken media, objects, related entries, references and fallbacks', () => {
    const registry = copy();
    const entry = registry.contents[0];
    entry.mediaRefs.push('MISSING-ASSET');
    entry.objectIds.push('MISSING-OBJECT');
    entry.relations.push('MISSING-CONTENT');
    entry.referenceIds.push('MISSING-REFERENCE');
    registry.assets[0].fallbackAssetId = 'MISSING-FALLBACK';
    registry.assets[0].contentIds.push('MISSING-CONTENT');
    const issues = validateRegistry(registry);
    expect(issues).toEqual(expect.arrayContaining([
      `${entry.id}: broken asset MISSING-ASSET`, `${entry.id}: broken object MISSING-OBJECT`,
      `${entry.id}: broken relation MISSING-CONTENT`, `${entry.id}: broken reference MISSING-REFERENCE`,
      `${registry.assets[0].assetId}: broken fallback`, `${registry.assets[0].assetId}: broken content MISSING-CONTENT`,
    ]));
  });

  it('rejects wrong-language audio and prevents dossier map pins', () => {
    const registry = copy();
    const entry = registry.contents[0];
    entry.audioRefs.fr = entry.audioRefs.ar;
    const dossier = registry.contents.find(content => content.kind === 'dossier')!;
    dossier.geography!.kind = 'general_marker';
    expect(validateRegistry(registry)).toEqual(expect.arrayContaining([
      `${entry.id}: invalid fr audio link`, `${dossier.id}: dossier must not have a pin`,
    ]));
  });

  it.each([
    'javascript:alert(1)', 'data:image/svg+xml,<svg/>', 'https://tracking.example/track.mp3',
    '//tracking.example/track.mp3', '/media/../private.wav', '/media/%2e%2e/private.wav',
    '/media/test.mp3?token=secret', '/media/test.mp3#fragment', '/media/test.html',
  ])('rejects an unsafe media URL: %s', url => {
    expect(safeMediaUrl(url)).toBe(false);
    const registry = copy();
    registry.assets[0].url = url;
    expect(registrySchema.safeParse(registry).success).toBe(false);
  });

  it.each(['/media/demo/urn.glb', '/media/demo/signal-fr.wav', '/media/illustrations/image-01.webp'])('accepts an allowed local media path: %s', url => {
    expect(safeMediaUrl(url)).toBe(true);
  });
});

describe('public release validation', () => {
  it('blocks the shipped DEMO corpus and placeholder assets', () => {
    const issues = validateRegistry(manifest, true);
    expect(issues).toContain('Manifest channel must be public');
    expect(issues).toContain('Operator/legal details missing');
    expect(issues.filter(issue => issue.endsWith('DEMO content forbidden'))).toHaveLength(60);
    expect(issues.filter(issue => issue.endsWith('unapproved asset'))).toHaveLength(219);
    expect(issues).toContain(`${manifest.contents[0].id}: historical references absent`);
  });

  it('accepts structurally complete test records, without treating them as real approval evidence', () => {
    expect(registrySchema.safeParse(publicFixture()).success).toBe(true);
    expect(validateRegistry(publicFixture(), true)).toEqual([]);
  });

  it('invalidates content and asset approvals when their revisions change', () => {
    const registry = publicFixture();
    registry.contents[0].revision = 'new-unreviewed-revision';
    registry.contents[0].localized.fr.revision = 'new-unreviewed-fr';
    registry.assets[0].revision = 'new-unreviewed-asset';
    expect(validateRegistry(registry, true)).toEqual(expect.arrayContaining([
      `${registry.contents[0].id}: history approval absent/stale`,
      `${registry.contents[0].id}: fr approval absent/stale`,
      `${registry.assets[0].assetId}: audio approval absent/stale`,
      `${registry.assets[0].assetId}: rights approval absent/stale`,
    ]));
  });

  it('requires an approved audio version matching the corresponding language script', () => {
    const registry = publicFixture();
    const entry = registry.contents[0];
    entry.localized.ar.revision = 'edited-ar-script';
    expect(validateRegistry(registry, true)).toContain(`${entry.id}: ar audio/script revision mismatch`);
  });

  it.each([[179, 179], [301, 301], [240, 239], [240, null]])('rejects duration %s measured as %s', (duration, measured) => {
    const registry = publicFixture();
    const asset = registry.assets.find(item => item.kind === 'audio')!;
    asset.durationSeconds = duration;
    asset.measuredDurationSeconds = measured;
    expect(validateRegistry(registry, true)).toContain(`${asset.assetId}: invalid measured duration`);
  });

  it('does not accept refused approvals or evidence without a reviewer', () => {
    const registry = publicFixture();
    registry.contents[0].approvalRecords.find(record => record.dimension === 'history')!.decision = 'REFUSE';
    registry.contents[0].approvalRecords.find(record => record.dimension === 'rights')!.reviewerId = ' ';
    expect(validateRegistry(registry, true)).toEqual(expect.arrayContaining([
      `${registry.contents[0].id}: history approval absent/stale`, `${registry.contents[0].id}: rights approval absent/stale`,
    ]));
  });
  it('rejects media type substitution, reused approvals, demo binaries and a later refusal',()=>{
    const registry=publicFixture();
    registry.assets[0].url='/media/demo/test.wav';
    registry.assets[0].kind='glb_modele_3d';
    registry.contents[0].approvalRecords[0].targetId='ANOTHER-CONTENT';
    const refused={...registry.contents[1].approvalRecords[0],decision:'REFUSE' as const,timestamp:'2026-10-26T10:00:00Z'};
    registry.contents[1].approvalRecords.push(refused);
    expect(validateRegistry(registry,true)).toEqual(expect.arrayContaining(['Invalid media count audio','CHR-01: history approval absent/stale','CHR-02: history approval absent/stale',`${registry.assets[0].assetId}: demo file forbidden`]));
  });
});
