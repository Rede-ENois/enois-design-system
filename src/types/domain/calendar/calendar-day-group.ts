import type { CalendarAgendaItemData } from "./calendar-agenda-item-data.js";

/** A day with its entries, as the list and the day view show them. */
export type CalendarDayGroup = {
  date: string;
  items: CalendarAgendaItemData[];
};
