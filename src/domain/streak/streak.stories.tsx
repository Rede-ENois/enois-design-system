import type { Meta, StoryObj } from "@storybook/react-vite";

import type { StreakData } from "../../types/domain/streak/streak-data.js";

import { StreakCard } from "./streak-card.js";

const meta: Meta = {
  title: "Domain/Streak",
  decorators: [(Story) => <div className="w-full max-w-sm">{Story()}</div>],
};

export default meta;

const TODAY = "2026-10-30";
const streak: StreakData = {
  currentDays: 4,
  longestDays: 9,
  todayDone: true,
  freezesAvailable: 0,
  lastFrozenDay: "2026-10-28",
};

export const Filled: StoryObj = { render: () => <StreakCard today={TODAY} streak={streak} /> };

export const TodayOpen: StoryObj = {
  render: () => (
    <StreakCard
      today={TODAY}
      streak={{
        ...streak,
        currentDays: 2,
        todayDone: false,
        freezesAvailable: 1,
        lastFrozenDay: null,
      }}
    />
  ),
};

export const WeekMilestone: StoryObj = {
  render: () => <StreakCard today={TODAY} streak={{ ...streak, currentDays: 7, longestDays: 7 }} />,
};

export const Zero: StoryObj = {
  render: () => (
    <StreakCard
      today={TODAY}
      streak={{
        currentDays: 0,
        longestDays: 3,
        todayDone: false,
        freezesAvailable: 1,
        lastFrozenDay: null,
      }}
    />
  ),
};

export const Loading: StoryObj = { render: () => <StreakCard today={TODAY} loading /> };

export const LoadError: StoryObj = {
  render: () => <StreakCard today={TODAY} error onRetry={() => {}} />,
};

export const Compact: StoryObj = {
  render: () => (
    <div className="flex items-center gap-3">
      <StreakCard variant="compact" today={TODAY} streak={streak} />
      <StreakCard variant="compact" today={TODAY} streak={{ ...streak, todayDone: false }} />
      <StreakCard variant="compact" today={TODAY} loading />
    </div>
  ),
};
