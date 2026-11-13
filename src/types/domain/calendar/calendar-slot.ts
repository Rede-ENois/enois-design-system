/** One bookable hour the mentor published. The formatter decides how the instant reads. */
export type CalendarSlot = {
  id: string;
  /** ISO instant. */
  startsAt: string;
};
