import type { TalentBankEnrollmentState } from "./talent-bank-enrollment-state.js";

/** The person's enrollment in one bank: what she authorized and when. */
export type TalentBankEnrollment = {
  id: string;
  state: TalentBankEnrollmentState;
  sharedFields: string[];
  requestedAt: string;
  consentedAt: string | null;
  revokedAt: string | null;
  closedAt: string | null;
};
