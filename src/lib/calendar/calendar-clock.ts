const DAY = /^(\d{4})-(\d{2})-(\d{2})$/;
const CLOCK = /^([01]\d|2[0-3]):([0-5]\d)$/;

const offsetFormatters = new Map<string, Intl.DateTimeFormat>();

function offsetFormatterFor(timeZoneId: string): Intl.DateTimeFormat {
  const cached = offsetFormatters.get(timeZoneId);
  if (cached) return cached;
  const created = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZoneId,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  offsetFormatters.set(timeZoneId, created);
  return created;
}

/** Reads an instant as the wall clock of a zone, without trusting the machine's own zone. */
function wallParts(instant: Date, timeZoneId: string) {
  const parts = offsetFormatterFor(timeZoneId).formatToParts(instant);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return {
    day: `${value("year")}-${value("month")}-${value("day")}`,
    time: `${value("hour")}:${value("minute")}`,
    hour: Number(value("hour")),
    minute: Number(value("minute")),
    second: Number(value("second")),
  };
}

/** How far the zone is from UTC at this instant, in milliseconds (São Paulo: -3h, Lisbon: 0 or 1h). */
function offsetAt(instant: Date, timeZoneId: string): number {
  const parts = wallParts(instant, timeZoneId);
  const asUtc = Date.UTC(
    Number(parts.day.slice(0, 4)),
    Number(parts.day.slice(5, 7)) - 1,
    Number(parts.day.slice(8, 10)),
    parts.hour,
    parts.minute,
    parts.second,
  );
  // The formatter drops milliseconds; compare whole seconds so rounding never leaks into the offset.
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

function isValidDay(day: string): boolean {
  const match = DAY.exec(day);
  if (!match) return false;
  const [, year, month, dayOfMonth] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(dayOfMonth)));
  return (
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(dayOfMonth)
  );
}

/**
 * The day and the time an instant shows in a zone, as `YYYY-MM-DD` and `HH:mm`. This is what the
 * form pre-fills when the reader opens an entry, and what the agenda shows in the organizer's zone.
 */
export function wallClockOf(instant: string, timeZoneId: string): { day: string; time: string } {
  const date = new Date(instant);
  if (Number.isNaN(date.getTime())) return { day: "", time: "" };
  const parts = wallParts(date, timeZoneId);
  return { day: parts.day, time: parts.time };
}

/**
 * The instant a wall clock in a zone stands for, as the ISO string the API expects. The form has a
 * day and a time; the API wants "when", so the conversion happens once, here, with the entry's zone.
 *
 * Two days a year the clock and the zone disagree, and both have an answer:
 *
 * - **Fall back** (the clock repeats an hour): two instants show the same wall clock. The earlier one
 *   wins, the same rule the language uses, so an entry saved at 01:30 does not jump an hour later.
 * - **Spring forward** (the clock skips an hour): the wall clock does not exist that day. The instant
 *   is read with the offset from before the jump, which lands on the hour the zone really uses after
 *   it (New York: 02:30 on 2026-03-08 reads as 03:30). Refusing the form would be the surprise for a
 *   time the day almost has.
 */
export function instantOf(day: string, time: string, timeZoneId: string): string {
  if (!isValidDay(day) || !CLOCK.test(time)) return "";
  const [year, month, dayOfMonth] = day.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const naive = Date.UTC(year, month - 1, dayOfMonth, hour, minute, 0, 0);
  if (Number.isNaN(naive)) return "";

  try {
    // A zone can have two offsets on the same day, so the offset has to be sampled on both sides of
    // the transition, not only at the instant the clock names. A day is enough to enclose it.
    const offsets = new Set([
      offsetAt(new Date(naive - 86_400_000), timeZoneId),
      offsetAt(new Date(naive), timeZoneId),
      offsetAt(new Date(naive + 86_400_000), timeZoneId),
    ]);

    const matches = (candidate: number) => {
      const parts = wallParts(new Date(candidate), timeZoneId);
      return parts.day === day && parts.time === time;
    };
    const candidates = [...offsets]
      .map((offset) => naive - offset)
      .filter((candidate) => Number.isFinite(candidate));
    const valid = candidates.filter(matches);

    if (valid.length > 0) return new Date(Math.min(...valid)).toISOString();
    // No valid candidate: the clock falls inside the skipped hour. The later instant is the one the
    // zone uses after the jump.
    return new Date(Math.max(...candidates)).toISOString();
  } catch {
    return "";
  }
}
