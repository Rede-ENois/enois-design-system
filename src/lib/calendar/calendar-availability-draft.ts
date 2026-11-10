import type { CalendarAvailabilityDraftProblem } from "../../types/domain/calendar/calendar-availability-draft-problem.js";
import type { CalendarAvailabilityDraft } from "../../types/domain/calendar/calendar-availability-draft.js";
import type { CalendarAvailabilityWindowInput } from "../../types/domain/calendar/calendar-availability-values.js";

/** The server's own ceilings (`CalendarAvailabilityService`: 50 windows, days 1–7). */
export const MAX_WINDOWS = 50;
export const MIN_DAY = 1;
export const MAX_DAY = 7;

const CLOCK = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function validDay(day: number): boolean {
  return Number.isInteger(day) && day >= MIN_DAY && day <= MAX_DAY;
}

/** Same rules as the server: `hh:mm` real, start strictly before end (D24 forbids crossing midnight). */
export function draftProblems(
  drafts: CalendarAvailabilityDraft[],
): CalendarAvailabilityDraftProblem[] {
  const problems: CalendarAvailabilityDraftProblem[] = [];

  for (const draft of drafts) {
    if (!validDay(draft.day)) problems.push("day");

    if (!CLOCK.test(draft.startsAt) || !CLOCK.test(draft.endsAt)) {
      problems.push("clock");
    } else if (draft.startsAt >= draft.endsAt) {
      // String clocks in `hh:mm` sort in time order: "22:00" < "23:00". An end at or before the
      // start is the midnight-crossing the server also refuses.
      problems.push("endBeforeStart");
    }
  }

  // Overlap is judged on the valid clocks only: half-open (`start < otherEnd && end > otherStart`),
  // the same rule as the server — a window that ends at 12h and one that starts at 12h do not clash.
  const placed = drafts.filter(
    (draft) => validDay(draft.day) && CLOCK.test(draft.startsAt) && CLOCK.test(draft.endsAt),
  );
  for (let i = 0; i < placed.length && !problems.includes("overlaps"); i += 1) {
    for (let j = i + 1; j < placed.length; j += 1) {
      const a = placed[i];
      const b = placed[j];
      if (a.day === b.day && a.startsAt < b.endsAt && a.endsAt > b.startsAt) {
        problems.push("overlaps");
        break;
      }
    }
  }

  if (drafts.length > MAX_WINDOWS) problems.push("tooMany");

  return problems;
}

/** The week in the API shape; `null` when it has problems, so a caller cannot save half of it. */
export function draftsToWindows(
  drafts: CalendarAvailabilityDraft[],
  timezone: string,
): CalendarAvailabilityWindowInput[] | null {
  if (draftProblems(drafts).length > 0) return null;

  return drafts.map((draft) => ({
    dayOfWeek: draft.day,
    startsAt: draft.startsAt,
    endsAt: draft.endsAt,
    timezone,
  }));
}

/** The week the server keeps, back into editable rows (the server's `id` has no place in the form). */
export function windowsToDrafts(
  windows: { id?: string; dayOfWeek: number; startsAt: string; endsAt: string }[],
): CalendarAvailabilityDraft[] {
  return windows.map((window) => ({
    day: window.dayOfWeek,
    startsAt: window.startsAt,
    endsAt: window.endsAt,
  }));
}

/** A blank window starting at a working hour, what "add a window" means before the reader types. */
export function emptyDraft(): CalendarAvailabilityDraft {
  return { day: MIN_DAY, startsAt: "09:00", endsAt: "12:00" };
}
