import type { TalentBankEnrollmentState } from "./talent-bank-enrollment-state.js";

/** One row of the person's own enrollments: where she enrolled and how it stands. */
export type TalentBankMyEnrollment = {
  enrollmentId: string;
  bankId: string;
  bankTitle: string;
  bankPurpose: string;
  recruiterName: string | null;
  recruiterUsername: string | null;
  state: TalentBankEnrollmentState;
  sharedFields: string[];
  requestedAt: string;
  consentedAt: string | null;
};
