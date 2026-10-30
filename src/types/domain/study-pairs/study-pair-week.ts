/** One week of check-ins. A note of `""` means a check-in without words; `null` means none. */
export type StudyPairWeek = {
  weekKey: string;
  /** Formatted by the app, e.g. "Semana de 13 out". */
  label: string;
  myNote: string | null;
  partnerNote: string | null;
};
