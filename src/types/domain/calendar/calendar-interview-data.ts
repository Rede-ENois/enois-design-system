/**
 * An interview already scheduled for an application, as the API returns it. The dialog opens
 * filled in when this is present, so rescheduling starts from the current time instead of a blank
 * form.
 */
export type CalendarInterviewData = {
  id: string;
  /** ISO-8601 instant, UTC. */
  startsAt: string;
  /** ISO-8601 instant, UTC. */
  endsAt: string;
  /** IANA id of whoever scheduled it; the wall clock is read in this zone. */
  timeZoneId: string;
  notes: string | null;
};
