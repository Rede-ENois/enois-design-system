/** The state of the candidate list while the recruiter's people are being fetched. */
export type TalentBankCandidateListState =
  { kind: "loading" } | { kind: "ready" } | { kind: "error" };
