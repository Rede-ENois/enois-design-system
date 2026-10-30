/** Habit streak as `GET /me/streak` returns it; the app can pass the API object as is. */
export type StreakData = {
  /** Consecutive counted days, today included only when `todayDone`. Frozen days do not add. */
  currentDays: number;
  longestDays: number;
  todayDone: boolean;
  /** 0 or 1: one rest day per ISO week, applied automatically when exactly one day is missed. */
  freezesAvailable: number;
  /** `YYYY-MM-DD` of the last rest day used, or `null` when none was ever used. */
  lastFrozenDay: string | null;
};
