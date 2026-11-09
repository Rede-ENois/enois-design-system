const CLOCK = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Keeps digits only (up to 4) and inserts the colon: "1930" → "19:30".
 *
 * The hour is capped as it is typed, because a field that accepts "29:70" and only complains on
 * submit makes the reader hunt for the mistake. A single digit over 2 means the reader meant the
 * hour alone ("9" → "09"), which the mask fills in.
 */
export function maskTime(raw: string): string {
  // "9:30" typed with the colon already separates the hour from the minutes, so the hour keeps its
  // place instead of being read as the next digit of a two-digit hour.
  const singleHour = /^(\d):(\d{1,2})$/.exec(raw);
  const digits = singleHour
    ? `0${singleHour[1]}${singleHour[2]}`.slice(0, 4)
    : raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length === 0) return "";
  if (digits.length <= 2) {
    const hour = Number(digits);
    if (digits.length === 2) {
      if (hour > 23) return digits.slice(0, 1);
      return digits;
    }
    return digits > "2" ? `0${digits}` : digits;
  }
  const hour = Number(digits.slice(0, 2));
  if (hour > 23) return digits.slice(0, 1);
  const minutes = digits.slice(2);
  if (minutes.length === 2 && Number(minutes) > 59)
    return `${digits.slice(0, 2)}:${minutes.slice(0, 1)}`;
  return `${digits.slice(0, 2)}:${minutes}`;
}

/** True for a complete `HH:mm` on a 24-hour clock. */
export function isClock(time: string): boolean {
  return CLOCK.test(time);
}
