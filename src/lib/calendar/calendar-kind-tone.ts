import type { CalendarEntryKind } from "../../types/domain/calendar/calendar-entry-kind.js";

/**
 * Colour per kind. Professional entries use the primary tone, personal ones the neutral surface,
 * so the two agendas stay distinguishable in the consolidated view.
 */
export const KIND_TONE: Record<CalendarEntryKind, string> = {
  PERSONAL: "bg-surface-3 text-text-strong",
  EVENT: "bg-primary-soft text-primary",
  MENTORING: "bg-primary-soft text-primary",
  INTERVIEW: "bg-primary-soft text-primary",
  MEETING: "bg-surface-3 text-text-strong",
  CALL: "bg-surface-3 text-text-strong",
  WORKSHOP: "bg-primary-soft text-primary",
};
