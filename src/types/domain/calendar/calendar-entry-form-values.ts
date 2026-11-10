import type { CalendarEntryKind } from "./calendar-entry-kind.js";
import type { CalendarScope } from "./calendar-scope.js";

/**
 * What the form hands back, already converted to the wire format: the reader typed a day and a
 * clock, the app gets instants plus the zone it typed them in. `description` is `null` when the
 * field is empty, which is how the API says "clear the text".
 */
export type CalendarEntryFormValues = {
  scope: CalendarScope;
  kind: CalendarEntryKind;
  title: string;
  description: string | null;
  /** ISO-8601 UTC. */
  startsAt: string;
  endsAt: string;
  /** IANA id the day and the clocks were read in. */
  timeZoneId: string;
  allDay: boolean;
};
