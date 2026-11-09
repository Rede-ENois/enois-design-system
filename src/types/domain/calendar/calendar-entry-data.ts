import type { CalendarEntryKind } from "./calendar-entry-kind.js";
import type { CalendarScope } from "./calendar-scope.js";

/**
 * One entry as `GET /calendar/entries` returns it: instants in ISO-8601 UTC plus the zone of the
 * organizer, so "19h" keeps meaning 19h for whoever wrote it. `cancelledAt` set means the entry
 * published a cancellation and stays in the list; nothing is deleted.
 */
export type CalendarEntryData = {
  id: string;
  scope: CalendarScope;
  kind: CalendarEntryKind;
  title: string;
  description: string | null;
  /** `YYYY-MM-DDThh:mm:ss.sssZ`. */
  startsAt: string;
  endsAt: string;
  /** IANA id, e.g. `America/Sao_Paulo`. */
  timeZoneId: string;
  allDay: boolean;
  cancelledAt: string | null;
};
