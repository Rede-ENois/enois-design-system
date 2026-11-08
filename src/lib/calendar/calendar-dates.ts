const LONG_MONTH = /^(\d{4})-(\d{2})$/;
const SHORT_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const partFormatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZoneId: string): Intl.DateTimeFormat {
  const cached = partFormatters.get(timeZoneId);
  if (cached) return cached;
  const created = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZoneId,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  partFormatters.set(timeZoneId, created);
  return created;
}

function requireDay(day: string): number {
  if (!SHORT_DAY.test(day) || Number.isNaN(Date.parse(`${day}T00:00:00Z`))) {
    throw new Error(`day must be YYYY-MM-DD: received ${day}`);
  }
  return Date.parse(`${day}T00:00:00Z`);
}

export function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Current day in the given zone, as `YYYY-MM-DD`. */
export function todayIn(timeZoneId: string, now: Date = new Date()): string {
  const parts = formatterFor(timeZoneId).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

/** `2026-11` as numbers; throws instead of guessing when the string is not a month. */
export function parseMonth(month: string): { year: number; month: number } {
  const match = LONG_MONTH.exec(month);
  if (!match) {
    throw new Error(`month must be YYYY-MM: received ${month}`);
  }
  return { year: Number(match[1]), month: Number(match[2]) };
}

/** Steps a month by `delta`, carrying the year. */
export function addMonths(
  { year, month }: { year: number; month: number },
  delta: number,
): { year: number; month: number } {
  const zeroBased = month - 1 + delta;
  return { year: year + Math.floor(zeroBased / 12), month: (((zeroBased % 12) + 12) % 12) + 1 };
}

/** `YYYY-MM-DD` of the first day of the month. */
export function monthStart({ year, month }: { year: number; month: number }): string {
  return `${year}-${pad(month)}-01`;
}

/** `YYYY-MM-DD` of the last day of the month, without the 0-based month arithmetic. */
export function monthEnd({ year, month }: { year: number; month: number }): string {
  const next = addMonths({ year, month }, 1);
  return shiftDay(`${next.year}-${pad(next.month)}-01`, -1);
}

/** Hour and minute of an instant in the reading zone, as `HH:mm`. */
export function timeLabel(instant: string, timeZoneId: string): string {
  const date = new Date(instant);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZoneId,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${value("hour")}:${value("minute")}`;
}

/** Moves `YYYY-MM-DD` by whole days with UTC arithmetic; the Gregorian calendar is the grid. */
export function shiftDay(day: string, delta: number): string {
  return new Date(requireDay(day) + delta * 86_400_000).toISOString().slice(0, 10);
}

/** 0 for Sunday through 6 for Saturday. */
export function weekdayOf(day: string): number {
  return new Date(requireDay(day)).getUTCDay();
}

/** Day of the month without the leading zero. */
export function dayOfMonth(day: string): string {
  return String(Number(new Date(requireDay(day)).toISOString().slice(8, 10)));
}

export function isDay(day: string): boolean {
  return SHORT_DAY.test(day) && !Number.isNaN(Date.parse(`${day}T00:00:00Z`));
}

/** Sunday first, three letters, the abbreviations the month header shows. */
export const weekdayNames = WEEKDAYS;

/** Earlier first; an unparseable start sorts last instead of scrambling the list. */
export function sortByStart<T extends { entry: { startsAt: string } }>(items: T[]): T[] {
  const at = (item: T) => {
    const parsed = Date.parse(item.entry.startsAt);
    return Number.isNaN(parsed) ? Infinity : parsed;
  };
  return [...items].sort((a, b) => at(a) - at(b));
}
