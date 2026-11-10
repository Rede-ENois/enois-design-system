/**
 * Why the draft cannot be saved, by field, in the order the form lists them. An empty list means
 * the draft converts. The form picks the message for each code, so the rule lives in one place.
 */
export type CalendarEntryDraftProblem =
  "title" | "description" | "day" | "clock" | "endBeforeStart" | "tooLong";
