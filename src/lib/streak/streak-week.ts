import type { StreakData } from "../../types/domain/streak/streak-data.js";
import type { StreakDay } from "../../types/domain/streak/streak-day.js";

const DAY_MS = 86_400_000;

function shift(date: string, days: number) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

/**
 * The last 7 days (oldest first, ending today) derived from the streak summary alone.
 *
 * Walking back from today: today is `done` or still `today`; then the `currentDays` counted days,
 * while `lastFrozenDay` always shows as `frozen` and never consumes a count (frozen days do not add);
 * anything older is `missed`.
 */
export function streakWeek(streak: StreakData, today: string): StreakDay[] {
  const days: StreakDay[] = [{ date: today, state: streak.todayDone ? "done" : "today" }];
  let left = streak.currentDays - (streak.todayDone ? 1 : 0);

  for (let offset = -1; offset > -7; offset--) {
    const date = shift(today, offset);
    if (date === streak.lastFrozenDay) {
      days.push({ date, state: "frozen" });
    } else if (left > 0) {
      days.push({ date, state: "done" });
      left--;
    } else {
      days.push({ date, state: "missed" });
    }
  }

  return days.reverse();
}
