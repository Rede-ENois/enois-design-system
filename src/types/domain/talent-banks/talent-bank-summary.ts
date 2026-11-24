import type { TalentBankRecruiter } from "./talent-bank-recruiter.js";
import type { TalentBankSharedFieldOption } from "./talent-bank-shared-field-option.js";

/** One bank in the public showcase. */
export type TalentBankSummary = {
  id: string;
  /** Link to the open bank, built by the app. */
  href: string;
  title: string;
  purpose: string;
  focusArea: string | null;
  desiredSkills: string[];
  /** What the bank asks for, already worded for the person who reads it. */
  requestedFields: TalentBankSharedFieldOption[];
  createdAt: string;
  recruiter: TalentBankRecruiter;
};
