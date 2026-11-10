/**
 * One window in the shape the API takes on `PUT /calendar/availability` and hands back on `GET`
 * (minus the server's `id`). The clocks are wall-clock `hh:mm` in the declared zone (D24): a rule
 * that repeats every week cannot shift when the clock of the city shifts.
 */
export type CalendarAvailabilityWindowInput = {
  /** ISO weekday: 1 = Monday … 7 = Sunday. */
  dayOfWeek: number;
  startsAt: string;
  endsAt: string;
  /** IANA id, e.g. `America/Sao_Paulo`. */
  timezone: string;
};
