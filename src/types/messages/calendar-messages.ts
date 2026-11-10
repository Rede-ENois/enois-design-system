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
    /** Opens a blank entry from the agenda header. */
    newEntry: string;
    /** The detail page of one entry. */
    detail: {
      back: string;
      edit: string;
      cancel: string;
      cancelling: string;
      cancelledAt: string;
      descriptionEmpty: string;
      zoneHint: (zone: string) => string;
      /** Both clocks already formatted as `HH:mm`; null means all day. */
      whenAllDay: string;
      when: (start: string, end: string) => string;
      participantsTitle: (count: number) => string;
      participantEmpty: string;
      inviteLabel: string;
      invitePlaceholder: string;
      inviteAction: string;
      inviting: string;
      /** `username` is the @ that was accepted. */
      invitedOk: (username: string) => string;
      yourAnswer: string;
      removeParticipant: (username: string) => string;
      loadError: string;
    };
    form: {
      createTitle: string;
      editTitle: string;
      scopeLabel: string;
      kindLabel: string;
      titleLabel: string;
      titlePlaceholder: string;
      descriptionLabel: string;
      descriptionPlaceholder: string;
      dayLabel: string;
      startLabel: string;
      endLabel: string;
      allDayLabel: string;
      allDayHint: string;
      zoneLabel: string;
      /** `zone` is the IANA id; the message decides how to wrap it, e.g. "Horário de {zone}". */
      zoneHint: (zone: string) => string;
      /** `max` is the same ceiling the API enforces, so the message cannot drift from the rule. */
      titleProblem: (max: number) => string;
      descriptionProblem: (max: number) => string;
      invalidDay: string;
      invalidClock: string;
      endBeforeStart: string;
      durationTooLong: string;
      /** `count` is how many entries the typed interval already touches (D23). */
      conflictWarning: (count: number) => string;
      save: string;
      saving: string;
      cancel: string;
    };
  };
};
