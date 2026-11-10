import type { CalendarEntryKind } from "./calendar-entry-kind.js";
import type { CalendarScope } from "./calendar-scope.js";

/**
 * The form before conversion: what the reader typed. The day and the clocks are wall-clock values
 * in the entry's zone, not instants, because that is what the fields hold. The transition to
 * `CalendarEntryFormValues` happens once, in `draftToValues`.
 */
export type CalendarEntryFormDraft = {
  scope: CalendarScope;
  kind: CalendarEntryKind;
  title: string;
  description: string;
  /** `YYYY-MM-DD` as the day field emits it. */
  day: string;
  /** `hh:mm` as the clock fields emit it. */
  startTime: string;
  endTime: string;
  allDay: boolean;
  timeZoneId: string;
};
