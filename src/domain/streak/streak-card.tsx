import { Check, CircleCheck, CircleDashed, Moon, Sprout } from "lucide-react";

import { streakWeek } from "../../lib/streak/streak-week.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { StreakCardProps } from "../../types/domain/streak/streak-card-props.js";
import type { StreakDayState } from "../../types/domain/streak/streak-day-state.js";
import { Button } from "../../ui/button.js";
import { Skeleton } from "../../ui/skeleton.js";

const weekdayShort = new Intl.DateTimeFormat("pt-BR", { weekday: "narrow", timeZone: "UTC" });
const weekdayLong = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "2-digit",
  timeZone: "UTC",
});
const asDate = (day: string) => new Date(`${day}T00:00:00Z`);
const dayMonth = (day: string) => `${day.slice(8, 10)}/${day.slice(5, 7)}`;

const DOT: Record<StreakDayState, string> = {
  done: "bg-growth/15 text-growth",
  frozen: "bg-primary-soft text-primary",
  missed: "border border-dashed border-border",
  today: "border border-growth/60",
};

/**
 * Encouraging, forgiving view of the daily habit: modest numbers, no flames, a missed day drawn
 * neutral and the weekly rest day explained. The app fetches `GET /me/streak` and passes it.
 */
export function StreakCard({
  streak,
  today,
  loading = false,
  error = false,
  onRetry,
  variant = "full",
  className,
}: StreakCardProps) {
  const messages = useMessages().streakCard;

  if (variant === "compact") {
    if (loading) {
      return (
        <span role="status" aria-label={messages.loading} className={className}>
          <Skeleton className="h-6 w-12 rounded-full" />
        </span>
      );
    }

    const label = streak
      ? messages.compactLabel(streak.currentDays, streak.todayDone)
      : messages.loadError;

    return (
      <span
        role="img"
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium tabular-nums text-text-strong",
          !streak && "text-text-subtle",
          className,
        )}
      >
        <Sprout aria-hidden className={cn("h-3.5 w-3.5", streak && "text-growth")} />

        {streak && <>{streak.currentDays}</>}

        {streak?.todayDone && <Check aria-hidden className="h-3 w-3 text-growth" />}
      </span>
    );
  }

  const shell = cn(
    "rounded-2xl border border-border-soft bg-surface-card p-5 shadow-soft",
    className,
  );

  if (loading) {
    return (
      <section role="status" aria-label={messages.loading} className={cn(shell, "space-y-4")}>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </section>
    );
  }

  if (error || !streak) {
    return (
      <section role="alert" className={cn(shell, "flex flex-wrap items-center gap-3")}>
        <p className="min-w-0 flex-1 text-sm text-text-subtle">{messages.loadError}</p>

        {onRetry && (
          <Button variant="outline" size="sm" className="rounded-full" onClick={onRetry}>
            {messages.retry}
          </Button>
        )}
      </section>
    );
  }

  const header = (
    <h2 className="flex items-center gap-2 text-sm font-medium text-text-subtle">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-growth/10 text-growth">
        <Sprout aria-hidden className="h-4 w-4" />
      </span>

      <>{messages.title}</>
    </h2>
  );

  if (streak.currentDays === 0 && !streak.todayDone) {
    return (
      <section className={cn(shell, "space-y-3")}>
        {header}

        <div className="space-y-1">
          <p className="text-base font-semibold text-text-strong">{messages.zeroTitle}</p>

          <p className="text-sm text-text-subtle">{messages.zeroHint}</p>
        </div>
      </section>
    );
  }

  const week = streakWeek(streak, today);

  return (
    <section className={cn(shell, "space-y-4")}>
      {header}

      <div className="space-y-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <p className="text-xl font-semibold tabular-nums text-text-strong">
            {messages.days(streak.currentDays)}
          </p>

          <p className="text-xs tabular-nums text-text-subtle">
            {messages.longest(streak.longestDays)}
          </p>
        </div>

        {streak.currentDays >= 7 && (
          <p className="text-sm text-text-strong">{messages.milestone(streak.currentDays)}</p>
        )}
      </div>

      <ol aria-label={messages.weekLabel} className="grid grid-cols-7 gap-1.5">
        {week.map((day) => (
          <li key={day.date} className="flex flex-col items-center gap-1.5">
            <span aria-hidden className="text-[11px] font-medium uppercase text-text-subtle">
              {weekdayShort.format(asDate(day.date))}
            </span>

            <span
              aria-hidden
              className={cn("grid h-7 w-7 place-items-center rounded-full", DOT[day.state])}
            >
              {day.state === "done" && <Check className="h-3.5 w-3.5" />}
              {day.state === "frozen" && <Moon className="h-3.5 w-3.5" />}
            </span>

            <span className="sr-only">
              {`${weekdayLong.format(asDate(day.date))}: ${messages.dayState[day.state]}`}
            </span>
          </li>
        ))}
      </ol>

      <ul className="space-y-2.5 border-t border-border-soft pt-4 text-sm">
        <li className="flex items-start gap-2.5">
          {streak.todayDone ? (
            <CircleCheck aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-growth" />
          ) : (
            <CircleDashed aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-text-subtle" />
          )}

          <p className={cn("min-w-0", streak.todayDone ? "text-text-strong" : "text-text-subtle")}>
            {streak.todayDone ? messages.todayDone : messages.todayHint}
          </p>
        </li>

        <li className="flex items-start gap-2.5">
          <Moon aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

          <div className="min-w-0">
            <p className="text-text-strong">
              {streak.freezesAvailable > 0
                ? messages.freezeAvailable
                : streak.lastFrozenDay
                  ? messages.freezeUsed(dayMonth(streak.lastFrozenDay))
                  : messages.freezeSpent}
            </p>

            <p className="text-xs text-text-subtle">{messages.freezeHint}</p>
          </div>
        </li>
      </ul>
    </section>
  );
}
