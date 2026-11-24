/** The state of one enrollment; only "ACTIVE" lets the recruiter read the authorized data. */
export type TalentBankEnrollmentState =
  "PENDING" | "ACTIVE" | "REVOKED_BY_CANDIDATE" | "CLOSED_BY_RECRUITER";
