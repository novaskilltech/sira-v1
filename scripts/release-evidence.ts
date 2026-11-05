export type ReviewerRegistryEntry = {
  reviewerId: string;
  reviewerRole: string;
  identityEvidenceLink: string;
};

type ApprovalLike = {
  reviewerId: string;
  reviewerRole: string;
  evidenceLink: string;
};

const roleOnlyIdentifier = (value: string) => /^[A-Z][A-Z0-9_]{2,}$/.test(value.trim());

export function validateReleaseEvidence(
  reviewers: ReviewerRegistryEntry[],
  approvals: ApprovalLike[],
  evidenceExists: (link: string) => boolean,
): string[] {
  const issues: string[] = [];
  const byId = new Map<string, ReviewerRegistryEntry>();
  for (const reviewer of reviewers) {
    if (!reviewer.reviewerId.trim() || !reviewer.reviewerRole.trim()) issues.push('Reviewer registry contains an incomplete identity.');
    if (roleOnlyIdentifier(reviewer.reviewerId)) issues.push(`Reviewer registry ID cannot be a role label: ${reviewer.reviewerId}`);
    if (byId.has(reviewer.reviewerId)) issues.push(`Reviewer registry contains a duplicate ID: ${reviewer.reviewerId}`);
    if (!evidenceExists(reviewer.identityEvidenceLink)) issues.push(`Reviewer identity evidence is unavailable: ${reviewer.reviewerId}`);
    byId.set(reviewer.reviewerId, reviewer);
  }
  for (const approval of approvals) {
    const reviewer = byId.get(approval.reviewerId);
    if (!reviewer) issues.push(`Approval reviewer is absent from registry: ${approval.reviewerId}`);
    else if (reviewer.reviewerRole !== approval.reviewerRole) issues.push(`Approval reviewer role differs from registry: ${approval.reviewerId}`);
    if (!evidenceExists(approval.evidenceLink)) issues.push(`Approval evidence is unavailable: ${approval.reviewerId}`);
  }
  return issues;
}
