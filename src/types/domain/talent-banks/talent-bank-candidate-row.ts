import type { TalentBankEnrollmentState } from "./talent-bank-enrollment-state.js";

/** One enrolled person, as the recruiter sees her in the list. */
export type TalentBankCandidateRow = {
  enrollmentId: string;
  state: TalentBankEnrollmentState;
  userId: string;
  name: string | null;
  username: string | null;
  headline: string | null;
  avatar: string | null;
  location: string | null;
  experienceCount: number;
  sharedFields: string[];
  note: string | null;
  consentedAt: string | null;
  resumeAvailable: boolean;
  resumeName: string | null;
};
