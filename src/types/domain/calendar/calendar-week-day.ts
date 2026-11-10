/** A column of the week grid. `items` on the outer range are counted in the compact day cell. */
export type CalendarWeekDay = {
  date: string;
  weekday: number;
  dayOfMonth: string;
  items: number;
};
