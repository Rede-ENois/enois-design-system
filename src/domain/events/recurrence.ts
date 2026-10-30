import type { EventRecurrence } from "../../types/domain/events/event-recurrence.js";

/** Cadences of a series, in the order the selects show them. */
export const RECURRING_CADENCES: readonly EventRecurrence[] = ["WEEKLY", "BIWEEKLY", "MONTHLY"];

/** Native select styled like the event form inputs. */
export const RECURRENCE_SELECT_CLASS =
  "flex h-10 w-full rounded-md border border-transparent bg-muted px-3 py-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive md:text-sm";

/**
 * "2026-11-06" -> "06/11". A calendar date has no time zone, so it is read as text instead of
 * going through `Date` (which would shift it to the previous day west of UTC).
 */
export function formatDayMonth(date: string): string {
  const [, month, day] = date.split("-");
  return month && day ? `${day}/${month}` : "";
}
