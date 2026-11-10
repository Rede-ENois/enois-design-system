import { isDay, parseMonth, shiftDay } from "./calendar-dates.js";
import { monthWindow, stepMonth, weekOf } from "./calendar-grid.js";

/**
 * Title of the period and the arrows around it, one function per view so the header never guesses
 * which string format it got. `dayLabel` and `monthName` come from the caller, which owns locale.
 */
export function periodTitle(
  view: "month" | "week" | "day" | "list",
  period: string,
  labels: { monthName: (month: number) => string; dayLabel: (day: string) => string },
): string {
  if (view === "month") {
    const parsed = parseMonth(period);
    return `${labels.monthName(parsed.month)} ${parsed.year}`;
  }
  if (view === "week") {
    const days = weekOf(period);
    return `${labels.dayLabel(days[0])} a ${labels.dayLabel(days[6])}`;
  }
  return labels.dayLabel(period);
}

/** Moves the period by one step in the direction the view implies. */
export function stepPeriod(
  view: "month" | "week" | "day" | "list",
  period: string,
  delta: number,
): string {
  if (view === "month") {
    return stepMonth(period, delta);
  }
  // A week or a list moves seven days; a single day moves one.
  const step = view === "day" ? delta : delta * 7;
  return shiftDay(period, step);
}

/** Period that contains `today` in the given view. */
export function periodOfToday(view: "month" | "week" | "day" | "list", today: string): string {
  return view === "month" ? today.slice(0, 7) : today;
}

/** Window the view needs from the API, half-open; the app turns it into `from`/`to`. */
export function periodWindow(
  view: "month" | "week" | "day" | "list",
  period: string,
): { from: string; to: string } {
  if (view === "month") {
    // The month grid draws the days it borrows from the neighbours, so the window has to cover them.
    return monthWindow(period);
  }
  if (view === "day") {
    return { from: period, to: shiftDay(period, 1) };
  }
  const days = weekOf(period);
  return { from: days[0], to: shiftDay(days[6], 1) };
}

/** `YYYY-MM-DD` from a `YYYY-MM` period; a list or a day use their own value. */
export function dayOfPeriod(period: string, fallback: string): string {
  return isDay(period) ? period : fallback;
}
