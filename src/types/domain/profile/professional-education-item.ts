/** One education entry; the app formats the period in its own time zone. */
export type ProfessionalEducationItem = {
  id: string;
  school: string;
  degree?: string | null;
  field?: string | null;
  /** "2019 a 2023", "desde 2024" or `null` without dates. */
  periodLabel: string | null;
};
