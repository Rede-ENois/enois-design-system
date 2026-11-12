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
    /** Invitations still waiting for the reader, shown above the agenda. */
    pendingInvitations: {
      title: string;
      /** `day` is already formatted, e.g. `sex., 14 de nov`; `when` is the time or "Dia inteiro". */
      when: (day: string, when: string) => string;
    };
    /** The create/edit form. */
    /** Opens a blank entry from the agenda header. */
    newEntry: string;
    /** "Warn me before it starts" — the reminder selector. */
    reminder: {
      title: string;
      none: string;
      /** `minutes` is one of 5, 15, 30, 60, 1440. */
      minutes: (minutes: number) => string;
      saving: string;
    };
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
    /** The interview dialog (fase 5): the employer picks when the conversation happens. */
    interviewDialog: {
      createTitle: string;
      /** `name` is the candidate's display name, already readable. */
      editTitle: (name: string) => string;
      description: string;
      dayLabel: string;
      startLabel: string;
      endLabel: string;
      notesLabel: string;
      notesPlaceholder: string;
      zoneHint: (zone: string) => string;
      invalidDay: string;
      invalidClock: string;
      endBeforeStart: string;
      durationTooLong: string;
      save: string;
      saving: string;
      cancel: string;
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
    /** Weekly availability editor (D24): the replaceable week the agenda admits commitments in. */
    availability: {
      title: string;
      hint: string;
      /** `day` is 1 (Monday) … 7 (Sunday); the message decides the word, e.g. "Segunda". */
      dayLabel: (day: number) => string;
      addWindow: string;
      /** Accessible name of the remove button; `label` is the row's own readable name. */
      removeWindow: (label: string) => string;
      /** Accessible name of one row: day and hours, already readable. */
      windowLabel: (day: string, hours: string) => string;
      startLabel: string;
      endLabel: string;
      zoneHint: (zone: string) => string;
      emptyTitle: string;
      emptyHint: string;
      dayProblem: string;
      clockProblem: string;
      endBeforeStartProblem: string;
      overlapsProblem: string;
      tooManyProblem: (max: number) => string;
      save: string;
      saving: string;
    };
  };
};
