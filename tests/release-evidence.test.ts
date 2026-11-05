import { describe, expect, it } from 'vitest';
import { validateReleaseEvidence } from '../scripts/release-evidence';

const evidenceExists = (link: string) => link.startsWith('editorial/evidence/approved-');

describe('release evidence gate', () => {
  it('accepts a registered reviewer with two local evidence records', () => {
    expect(validateReleaseEvidence([
      { reviewerId: 'reviewer-8412', reviewerRole: 'SHEIKH_SALAH', identityEvidenceLink: 'editorial/evidence/approved-identity.json' },
    ], [
      { reviewerId: 'reviewer-8412', reviewerRole: 'SHEIKH_SALAH', evidenceLink: 'editorial/evidence/approved-history.json' },
    ], evidenceExists)).toEqual([]);
  });

  it('rejects a role label, unregistered reviewer, missing proof and mismatched role', () => {
    const issues = validateReleaseEvidence([
      { reviewerId: 'SHEIKH_SALAH', reviewerRole: 'SHEIKH_SALAH', identityEvidenceLink: 'editorial/evidence/missing.json' },
      { reviewerId: 'reviewer-8412', reviewerRole: 'SHEIKH_SALAH', identityEvidenceLink: 'editorial/evidence/approved-identity.json' },
    ], [
      { reviewerId: 'unknown-reviewer', reviewerRole: 'SHEIKH_SALAH', evidenceLink: 'editorial/evidence/approved-history.json' },
      { reviewerId: 'reviewer-8412', reviewerRole: 'OTHER', evidenceLink: 'editorial/evidence/missing.json' },
    ], evidenceExists);
    expect(issues).toEqual(expect.arrayContaining([
      'Reviewer registry ID cannot be a role label: SHEIKH_SALAH',
      'Reviewer identity evidence is unavailable: SHEIKH_SALAH',
      'Approval reviewer is absent from registry: unknown-reviewer',
      'Approval reviewer role differs from registry: reviewer-8412',
      'Approval evidence is unavailable: reviewer-8412',
    ]));
  });
});
