/**
 * What a finished `.ics` import reported, in the shape the API answers. The reader needs the
 * difference between "entered" and "did not enter": a file with a hundred events that created none
 * is not the same as one that created a hundred.
 */
export type CalendarImportResultData = {
  /** How many `VEVENT`s the file carried. */
  received: number;
  /** How many entries were created now. */
  created: number;
  /** How many already existed and moved to a new time. */
  moved: number;
  /** How many cancellations matched a local entry. */
  cancelled: number;
  /** How many lacked the minimum to become a commitment. */
  skipped: number;
};
