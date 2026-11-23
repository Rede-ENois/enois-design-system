/** One education entry, when the person authorized it. */
export type TalentBankEducation = {
  id: string;
  school: string;
  degree: string | null;
  field: string | null;
  startDate: string | null;
  endDate: string | null;
};
