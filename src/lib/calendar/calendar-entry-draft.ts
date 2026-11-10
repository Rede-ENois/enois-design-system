import type { CalendarEntryDraftProblem } from "../../types/domain/calendar/calendar-entry-draft-problem.js";
import type { CalendarEntryFormDraft } from "../../types/domain/calendar/calendar-entry-form-draft.js";
import type { CalendarEntryFormValues } from "../../types/domain/calendar/calendar-entry-form-values.js";

import { instantOf } from "./calendar-clock.js";
import { isDay } from "./calendar-dates.js";

/** The server's own ceilings (`CalendarEntry`: 200 for the title, 2000 for the description). */
export const MAX_TITLE = 200;
export const MAX_DESCRIPTION = 2000;
export const MAX_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
export const MIN_TITLE = 1;

const CLOCK = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function draftProblems(draft: CalendarEntryFormDraft): CalendarEntryDraftProblem[] {
  const problems: CalendarEntryDraftProblem[] = [];
  const title = draft.title.trim();
  if (title.length < MIN_TITLE || title.length > MAX_TITLE) problems.push("title");
  if (draft.description.length > MAX_DESCRIPTION) problems.push("description");

  const validDay = isDay(draft.day);
  if (!validDay) problems.push("day");

  // Without a day there is nothing to put the clocks on, and the interval rules would only repeat
  // the day problem with a code that reads as a clock mistake.
  if (!draft.allDay && validDay) {
    if (!CLOCK.test(draft.startTime) || !CLOCK.test(draft.endTime)) {
      problems.push("clock");
    } else {
      const startsAt = instantOf(draft.day, draft.startTime, draft.timeZoneId);
      const endsAt = instantOf(draft.day, draft.endTime, draft.timeZoneId);
      if (!startsAt || !endsAt) {
        problems.push("clock");
      } else if (Date.parse(endsAt) <= Date.parse(startsAt)) {
        // The clock fields carry no date: an end earlier than the start is a same-day mistake, not
        // an overnight entry. Overnight is written on the next day, which this form does not do.
        problems.push("endBeforeStart");
      } else if (Date.parse(endsAt) - Date.parse(startsAt) > MAX_DURATION_MS) {
        problems.push("tooLong");
      }
    }
  }

  return problems;
}

/**
 * The draft as the API wants it. An all-day entry covers the whole day in the entry's zone: from
 * midnight to the next midnight, which is what "the day, without a time" means when read back in
 * any zone.
 *
 * Returns `null` when the draft has problems, so a caller cannot save a half-valid form by skipping
 * the check.
 */
export function draftToValues(draft: CalendarEntryFormDraft): CalendarEntryFormValues | null {
  if (draftProblems(draft).length > 0) return null;

  const startTime = draft.allDay ? "00:00" : draft.startTime;
  const endsNextDay = draft.allDay;
  const startsAt = instantOf(draft.day, startTime, draft.timeZoneId);
  if (!startsAt) return null;

  const endsAt = endsNextDay
    ? nextMidnight(draft.day, draft.timeZoneId)
    : instantOf(draft.day, draft.endTime, draft.timeZoneId);
  if (!endsAt) return null;

  const description = draft.description.trim();
  return {
    scope: draft.scope,
    kind: draft.kind,
    title: draft.title.trim(),
    description: description.length > 0 ? description : null,
    startsAt,
    endsAt,
    timeZoneId: draft.timeZoneId,
    allDay: draft.allDay,
  };
}

/**
 * Midnight of the day after `day` in the zone. It is computed from the next calendar day instead of
 * adding 24 hours, because a day with a clock change is not 24 hours long and "the day" still ends
 * at its own midnight.
 */
function nextMidnight(day: string, timeZoneId: string): string {
  const [year, month, dayOfMonth] = day.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, dayOfMonth + 1));
  const iso = next.toISOString().slice(0, 10);
  return instantOf(iso, "00:00", timeZoneId);
}
