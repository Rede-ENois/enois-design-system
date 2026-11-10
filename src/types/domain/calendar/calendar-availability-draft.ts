/**
 * One line of the week the reader is editing. The clocks stay as typed (`hh:mm` or whatever is
 * halfway typed) and are validated on save, like the entry form; `day` is the ISO weekday the API
 * speaks (1 = Monday … 7 = Sunday).
 */
export type CalendarAvailabilityDraft = {
  day: number;
  startsAt: string;
  endsAt: string;
};
