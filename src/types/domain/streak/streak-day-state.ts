/** `today` is the current day while it has not counted yet; `missed` is drawn neutral, never as a fault. */
export type StreakDayState = "done" | "frozen" | "missed" | "today";
