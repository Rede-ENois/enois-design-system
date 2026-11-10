/** One window as the server hands it back on `GET /calendar/availability`. */
export type CalendarAvailabilityWindowData = {
  id: string;
  /** ISO weekday: 1 = Monday … 7 = Sunday. */
  dayOfWeek: number;
  /** Wall-clock `hh:mm` in `timezone` (D24). */
  startsAt: string;
  endsAt: string;
  /** IANA id. */
  timezone: string;
};
