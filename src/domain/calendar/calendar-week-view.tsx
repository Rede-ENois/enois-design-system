import { timeLabel, weekdayOf } from "../../lib/calendar/calendar-dates.js";
import { itemsByDay, weekOf } from "../../lib/calendar/calendar-grid.js";
import { KIND_TONE } from "../../lib/calendar/calendar-kind-tone.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarWeekViewProps } from "../../types/domain/calendar/calendar-week-view-props.js";
import { LoadingState } from "../../ui/loading-state.js";

import { CalendarErrorState } from "./calendar-error-state.js";

/** Seven columns, Sunday first. A column scrolls on its own so a busy day never stretches the grid. */
export function CalendarWeekView({
  week,
  items,
  timeZoneId,
  today,
  selectedDay,
  onSelectDay,
  itemHref,
  activeId,
  loading = false,
  error = false,
  onRetry,
  className,
}: CalendarWeekViewProps) {
  const messages = useMessages().calendar;

  if (loading) {
    return <LoadingState label={messages.loading} className={className} />;
  }

  if (error) {
    return <CalendarErrorState onRetry={onRetry} className={className} />;
  }

  const days = weekOf(week);
  const byDay = itemsByDay(items, timeZoneId);

  return (
    <div className={cn("min-w-0 overflow-x-auto", className)}>
      <div className="grid min-w-[42rem] grid-cols-7 gap-2">
        {days.map((day) => {
          const weekday = messages.weekdays[weekdayOf(day)];
          const isToday = day === today;
          const isSelected = day === selectedDay;

          return (
            <section
              key={day}
              data-today={isToday || undefined}
              aria-label={messages.dayTitle(day)}
              className={cn(
                "flex min-h-48 min-w-0 flex-col gap-2 rounded-xl border border-border-soft bg-card p-2",
                isToday && "border-primary/80",
                isSelected && "ring-2 ring-primary/80",
              )}
            >
              {onSelectDay ? (
                <button
                  type="button"
                  onClick={() => onSelectDay(day)}
                  aria-pressed={isSelected}
                  className="flex min-w-0 items-baseline justify-between gap-1 rounded-lg px-1 py-0.5 text-left transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="text-[11px] font-medium uppercase tracking-wide text-text-subtle">
                    {weekday}
                  </span>

                  <span
                    className={cn(
                      "grid h-6 min-w-6 place-items-center rounded-full px-1 text-xs tabular-nums",
                      isToday
                        ? "bg-primary font-semibold text-primary-foreground"
                        : "font-normal text-text-strong",
                    )}
                  >
                    {day.slice(8)}
                  </span>
                </button>
              ) : (
                <div className="flex min-w-0 items-baseline justify-between gap-1 px-1 py-0.5">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-text-subtle">
                    {weekday}
                  </span>

                  <span
                    className={cn(
                      "grid h-6 min-w-6 place-items-center rounded-full px-1 text-xs tabular-nums",
                      isToday
                        ? "bg-primary font-semibold text-primary-foreground"
                        : "font-normal text-text-strong",
                    )}
                  >
                    {day.slice(8)}
                  </span>
                </div>
              )}

              <ul className="flex min-w-0 flex-col gap-1">
                {(byDay.get(day) ?? []).map((item) => {
                  const entry = item.entry;
                  const cancelled = entry.cancelledAt !== null;
                  const time = entry.allDay
                    ? messages.allDay
                    : timeLabel(entry.startsAt, timeZoneId);

                  return (
                    <li key={entry.id} className="min-w-0">
                      <a
                        href={itemHref?.(entry.id)}
                        aria-label={messages.openEntry(entry.title)}
                        data-active={activeId === entry.id || undefined}
                        className={cn(
                          "flex min-w-0 flex-col rounded-lg border-l-2 bg-surface-2 px-1.5 py-1 transition-colors hover:bg-surface-3",
                          KIND_TONE[entry.kind].includes("primary")
                            ? "border-primary"
                            : "border-border",
                          activeId === entry.id && "ring-2 ring-primary/80",
                          cancelled && "opacity-70",
                        )}
                      >
                        <span className="text-[10px] font-normal tabular-nums text-text-subtle">
                          {time}
                        </span>

                        <span
                          className={cn(
                            "min-w-0 truncate text-[11px] font-medium",
                            cancelled ? "text-text-subtle line-through" : "text-text-strong",
                          )}
                        >
                          {entry.title}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
