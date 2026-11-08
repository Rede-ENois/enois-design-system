import { CalendarX } from "lucide-react";

import { timeLabel } from "../../lib/calendar/calendar-dates.js";
import { groupByDay } from "../../lib/calendar/calendar-grid.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarListViewProps } from "../../types/domain/calendar/calendar-list-view-props.js";
import { EmptyState } from "../../ui/empty-state.js";
import { LoadingState } from "../../ui/loading-state.js";

import { CalendarEntryRow } from "./calendar-entry-row.js";
import { CalendarErrorState } from "./calendar-error-state.js";

const DAY_FORMAT = new Map<string, Intl.DateTimeFormat>();

function dayLabel(day: string, timeZoneId: string): string {
  const key = timeZoneId;
  let formatter = DAY_FORMAT.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: timeZoneId,
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
    DAY_FORMAT.set(key, formatter);
  }
  // Noon UTC keeps the label on the intended day for every zone the reader may be in.
  return formatter.format(new Date(`${day}T12:00:00Z`));
}

/**
 * The agenda as a chronological list: one heading per day, cancelled entries kept and marked.
 * Long windows are cut by the app, which owns the query.
 */
export function CalendarListView({
  items,
  timeZoneId,
  today,
  itemHref,
  activeId,
  loading = false,
  error = false,
  onRetry,
  className,
}: CalendarListViewProps) {
  const messages = useMessages().calendar;

  if (loading) {
    return <LoadingState label={messages.loading} className={className} />;
  }

  if (error) {
    return <CalendarErrorState onRetry={onRetry} className={className} />;
  }

  const groups = groupByDay(items, timeZoneId);

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={CalendarX}
        title={messages.emptyList}
        description={messages.emptyListHint}
      />
    );
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-5", className)}>
      {groups.map((group) => {
        const isToday = group.date === today;

        return (
          <section key={group.date} className="flex min-w-0 flex-col gap-2">
            <h3 className="flex min-w-0 items-baseline gap-2">
              <span
                className={cn(
                  "text-xs font-medium uppercase tracking-wide",
                  isToday ? "text-primary" : "text-text-subtle",
                )}
              >
                {dayLabel(group.date, timeZoneId)}
              </span>

              {isToday && (
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-normal text-primary">
                  {messages.today}
                </span>
              )}
            </h3>

            <ul className="flex min-w-0 flex-col gap-2">
              {group.items.map((item) => (
                <li key={item.entry.id} className="min-w-0">
                  <CalendarEntryRow
                    item={item}
                    href={itemHref?.(item.entry.id)}
                    active={activeId === item.entry.id}
                    time={
                      item.entry.allDay
                        ? null
                        : {
                            start: timeLabel(item.entry.startsAt, timeZoneId),
                            end: timeLabel(item.entry.endsAt, timeZoneId),
                          }
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
