/**
 * What the interview dialog reports when the employer confirms. The app owns the request, the
 * idempotency key and the error; the dialog only collects the fields, in the API shape.
 */
export type CalendarInterviewValues = {
  /** ISO-8601 instant, UTC. */
  startsAt: string;
  /** ISO-8601 instant, UTC. */
  endsAt: string;
  /** IANA id the wall clock was read in. */
  timeZoneId: string;
  notes: string | null;
};
