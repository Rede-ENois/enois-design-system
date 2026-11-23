import type { TalentBankEnrollmentState } from "./talent-bank-enrollment-state.js";
import type { TalentBankRecruiter } from "./talent-bank-recruiter.js";
import type { TalentBankSharedFieldOption } from "./talent-bank-shared-field-option.js";

/** The open bank: what the recruiter is, why the bank exists and what it asks for. */
export type TalentBankDetail = {
  id: string;
  title: string;
  purpose: string;
  description: string | null;
  handlingConditions: string;
  focusArea: string | null;
  desiredSkills: string[];
  /** What the bank asks for, already worded for the person who reads it. */
  requestedFields: TalentBankSharedFieldOption[];
  consentVersion: string;
  createdAt: string;
  recruiter: TalentBankRecruiter;
  /** The person's own state in this bank, when there is one. */
  myState: TalentBankEnrollmentState | null;
};
