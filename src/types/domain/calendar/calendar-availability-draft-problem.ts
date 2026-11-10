/** Why the week cannot be saved yet; the editor maps each code to its message. */
export type CalendarAvailabilityDraftProblem =
  "day" | "clock" | "endBeforeStart" | "overlaps" | "tooMany";
