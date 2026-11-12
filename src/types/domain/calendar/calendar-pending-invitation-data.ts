import type { CalendarEntryKind } from "./calendar-entry-kind.js";
import type { CalendarScope } from "./calendar-scope.js";

/**
 * An invitation still waiting for the reader's answer. It comes from `GET /calendar/invitations`,
 * which knows only the entry — not the organizer, not the reader's place, since there is none yet.
 */
export type CalendarPendingInvitationData = {
  id: string;
  scope: CalendarScope;
  kind: CalendarEntryKind;
  title: string;
  startsAt: string;
  endsAt: string;
  allDay: boolean;
  timeZoneId: string;
};
