import type { CalendarAgendaItemData } from "../../types/domain/calendar/calendar-agenda-item-data.js";
import type { CalendarDayCell } from "../../types/domain/calendar/calendar-day-cell.js";
import type { CalendarDayGroup } from "../../types/domain/calendar/calendar-day-group.js";
import type { CalendarEntryKind } from "../../types/domain/calendar/calendar-entry-kind.js";

import {
  addMonths,
  dayOfMonth,
  monthEnd,
  monthStart,
  pad,
  parseMonth,
  shiftDay,
  sortByStart,
  weekdayOf,
} from "./calendar-dates.js";

/**
 * Day of the reading zone an entry starts on. A midnight entry in another zone lands on the day
 * the reader sees, not on the UTC day.
 */
export function entryDay(instant: string, timeZoneId: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: timeZoneId }).format(new Date(instant));
}

/** Items keyed by the day they start on; entries of unknown days are dropped, not guessed. */
export function itemsByDay(
  items: CalendarAgendaItemData[],
  timeZoneId: string,
): Map<string, CalendarAgendaItemData[]> {
  const grouped = new Map<string, CalendarAgendaItemData[]>();
  for (const item of sortByStart(items)) {
    const startsAt = Date.parse(item.entry.startsAt);
    if (Number.isNaN(startsAt)) continue;
    const day = entryDay(item.entry.startsAt, timeZoneId);
    const bucket = grouped.get(day);
    if (bucket) bucket.push(item);
    else grouped.set(day, [item]);
  }
  return grouped;
}

/**
 * The month grid: whole weeks, Sunday to Saturday, borrowing the neighbour days that complete
 * the first and last rows. Cells carry only the items of the shown month.
 */
export function monthGrid(
  month: string,
  items: CalendarAgendaItemData[],
  timeZoneId: string,
): CalendarDayCell[] {
  const parsed = parseMonth(month);
  const first = monthStart(parsed);
  const byDay = itemsByDay(items, timeZoneId);
  const lead = weekdayOf(first);
  const total =
    Math.round(
      (Date.parse(`${monthEnd(parsed)}T00:00:00Z`) - Date.parse(`${first}T00:00:00Z`)) / 86_400_000,
    ) + 1;
  const cellCount = Math.ceil((lead + total) / 7) * 7;
  const start = shiftDay(first, -lead);

  const cells: CalendarDayCell[] = [];
  for (let index = 0; index < cellCount; index += 1) {
    const date = shiftDay(start, index);
    cells.push({
      date,
      inMonth: date.startsWith(month),
      dayOfMonth: dayOfMonth(date),
      weekday: weekdayOf(date),
      items: byDay.get(date) ?? [],
    });
  }
  return cells;
}

/** The seven days of the grid that hold `day`; `day` outside the month does not move the grid. */
export function weekOf(day: string): string[] {
  const lead = weekdayOf(day);
  const start = shiftDay(day, -lead);
  return Array.from({ length: 7 }, (_, index) => shiftDay(start, index));
}

/** Every day of the month, for the day strip above the month grid. */
export function monthDays(month: string): string[] {
  const parsed = parseMonth(month);
  const first = monthStart(parsed);
  const last = monthEnd(parsed);
  const days: string[] = [];
  for (let day = first; day <= last; day = shiftDay(day, 1)) {
    days.push(day);
  }
  return days;
}

/** Month plus the neighbour days the grid borrows, the window the month view needs from the API. */
export function monthWindow(month: string): { from: string; to: string } {
  const cells = monthGrid(month, [], "UTC");
  const first = cells[0]?.date ?? monthStart(parseMonth(month));
  const last = cells[cells.length - 1]?.date ?? first;
  return { from: first, to: shiftDay(last, 1) };
}

/** Ascending days with their items; days without items are left out. */
export function groupByDay(
  items: CalendarAgendaItemData[],
  timeZoneId: string,
): CalendarDayGroup[] {
  return [...itemsByDay(items, timeZoneId)]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, dayItems]) => ({ date, items: dayItems }));
}

/** Drops the items of the hidden kinds; the rest stays as it was. */
export function withoutKinds(
  items: CalendarAgendaItemData[],
  hiddenKinds: CalendarEntryKind[] = [],
): CalendarAgendaItemData[] {
  if (hiddenKinds.length === 0) return items;
  return items.filter((item) => !hiddenKinds.includes(item.entry.kind));
}

/** Next and previous month as `YYYY-MM`, for the header arrows. */
export function stepMonth(month: string, delta: number): string {
  const next = addMonths(parseMonth(month), delta);
  return `${next.year}-${pad(next.month)}`;
}
