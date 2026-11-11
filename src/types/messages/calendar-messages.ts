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
    /** The create/edit form. */
    /** Opens a blank entry from the agenda header. */
    newEntry: string;
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
      save: string;
      saving: string;
      cancel: string;
    };
    /** The `.ics` import dialog (fase 8, D23): pick a file, choose the agenda, see what entered. */
    importDialog: {
      title: string;
      description: string;
      fileLabel: string;
      /** Shown in the drop area before a file is chosen. */
      chooseFile: string;
      /** The chosen file's name, already readable. */
      chosenFile: (name: string) => string;
      clearFile: string;
      scopeLabel: string;
      /** The consolidated-agenda pill, next to the two scopes. */
      scopeAll: string;
      /** `max` is the server's ceiling in MB. */
      tooLarge: (max: number) => string;
      wrongFormat: string;
      import: string;
      importing: string;
      cancel: string;
      /** The result block after a successful import. */
      resultTitle: string;
      resultReceived: (count: number) => string;
      resultCreated: (count: number) => string;
      resultMoved: (count: number) => string;
      resultCancelled: (count: number) => string;
      resultSkipped: (count: number) => string;
      /** Nothing entered at all: the file had no usable event. */
      resultEmpty: string;
      done: string;
    };
    /** The private `.ics` subscription card (fase 9): the link an external calendar reads. */
    subscription: {
      title: string;
      /** `null` scope is the consolidated agenda; this is its pill, next to the two scopes. */
      scopeAll: string;
      emptyTitle: string;
      emptyHint: string;
      create: string;
      creating: string;
      /** When the link exists but the token is gone (the server keeps only the hash). */
      activeTitle: string;
      activeSince: (date: string) => string;
      activeTokenGone: string;
      regenerate: string;
      regenerateConfirmTitle: string;
      regenerateConfirmDescription: string;
      regenerateConfirmAction: string;
      revoke: string;
      revokeConfirmTitle: string;
      revokeConfirmDescription: string;
      revokeConfirmAction: string;
      /** Accessible name of the copy button. */
      copyLink: string;
      copied: string;
      copyFailed: string;
      /** The fresh link, right after create/regenerate; `url` is the full address. */
      freshTitle: string;
      freshHint: string;
      saving: string;
    };
  };
};
