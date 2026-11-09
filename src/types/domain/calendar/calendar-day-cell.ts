import type { CalendarAgendaItemData } from "./calendar-agenda-item-data.js";

/** One square of the month grid: a day of the shown month or a neighbour it borrows. */
export type CalendarDayCell = {
  /** `YYYY-MM-DD` of the reader's zone. */
  date: string;
  inMonth: boolean;
  /** Day of the month, already formatted for the locale. */
  dayOfMonth: string;
  weekday: number;
  items: CalendarAgendaItemData[];
};
