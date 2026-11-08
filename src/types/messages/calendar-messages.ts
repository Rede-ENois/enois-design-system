import type { CalendarEntryKind } from "../domain/calendar/calendar-entry-kind.js";
import type { CalendarParticipation } from "../domain/calendar/calendar-participation.js";
import type { CalendarScope } from "../domain/calendar/calendar-scope.js";
import type { CalendarView } from "../domain/calendar/calendar-view.js";

export type CalendarMessages = {
  calendar: {
    /** `views` names the four look modes; the switcher reads them in this order. */
    views: Record<CalendarView, string>;
    viewSwitcherLabel: string;
    scopes: Record<CalendarScope, string>;
    kinds: Record<CalendarEntryKind, string>;
    participations: Record<CalendarParticipation, string>;
    /** Month header, e.g. `novembro de 2026`. */
    monthTitle: (monthName: string, year: number) => string;
    weekTitle: (from: string, to: string) => string;
    /** Receives the day already formatted, e.g. `sábado, 8 de novembro`. */
    dayTitle: (day: string) => string;
    today: string;
    previousMonth: string;
    nextMonth: string;
    previousWeek: string;
    nextWeek: string;
    previousDay: string;
    nextDay: string;
    /** Weekday headings, Sunday first, used by both grids. */
    weekdays: string[];
    allDay: string;
    /** Both times already formatted as `HH:mm`; the view never builds the separator. */
    timeRange: (start: string, end: string) => string;
    cancelled: string;
    invited: string;
    owner: string;
    /** Counter on a month cell that holds more entries than fit. */
    moreEntries: (count: number) => string;
    emptyDay: string;
    emptyDayHint: string;
    emptyList: string;
    emptyListHint: string;
    loading: string;
    loadError: string;
    retry: string;
    respondError: string;
    accept: string;
    decline: string;
    tentative: string;
    responding: string;
    /** Opens the entry detail; used as the accessible name of the row link. */
    openEntry: (title: string) => string;
  };
};
