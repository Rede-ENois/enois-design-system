/** What the recruiter writes in the bank form. */
export type TalentBankEditorValues = {
  title: string;
  purpose: string;
  description: string;
  handlingConditions: string;
  focusArea: string;
  /** Comma separated in the form; the app maps it to the list the API expects. */
  desiredSkills: string;
  requestedFields: string[];
};
