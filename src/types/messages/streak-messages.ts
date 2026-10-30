import type { StreakDayState } from "../domain/streak/streak-day-state.js";

export type StreakMessages = {
  streakCard: {
    title: string;
    loading: string;
    loadError: string;
    retry: string;
    days: (count: number) => string;
    longest: (count: number) => string;
    zeroTitle: string;
    zeroHint: string;
    todayDone: string;
    todayHint: string;
    milestone: (count: number) => string;
    freezeAvailable: string;
    freezeUsed: (date: string) => string;
    freezeSpent: string;
    freezeHint: string;
    weekLabel: string;
    dayState: Record<StreakDayState, string>;
    compactLabel: (count: number, todayDone: boolean) => string;
  };
};
