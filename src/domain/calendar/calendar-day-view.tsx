import { CalendarX } from "lucide-react";

import { timeLabel } from "../../lib/calendar/calendar-dates.js";
import { groupByDay } from "../../lib/calendar/calendar-grid.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarDayViewProps } from "../../types/domain/calendar/calendar-day-view-props.js";
import { EmptyState } from "../../ui/empty-state.js";
import { LoadingState } from "../../ui/loading-state.js";

import { CalendarEntryRow } from "./calendar-entry-row.js";
import { CalendarErrorState } from "./calendar-error-state.js";

/** A single day, with the quick answer for invitations still waiting for the reader. */
export function CalendarDayView({
  day,
  items,
  timeZoneId,
  onSelectItem,
  itemHref,
  activeId,
  onRespond,
  respondingId,
  respondError = false,
  onRetry,
  loading = false,
  error = false,
  className,
}: CalendarDayViewProps) {
  const messages = useMessages().calendar;
  const groups = groupByDay(items, timeZoneId);
  const group = groups.find((entry) => entry.date === day) ?? { date: day, items: [] };

  if (loading) {
    return <LoadingState label={messages.loading} className={className} />;
  }

  if (error) {
    return <CalendarErrorState onRetry={onRetry} className={className} />;
  }

  return (
    <section
      aria-label={messages.dayTitle(day)}
      className={cn("flex min-w-0 flex-col gap-2", className)}
    >
      {respondError && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {messages.respondError}
        </p>
      )}

      {group.items.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title={messages.emptyDay}
          description={messages.emptyDayHint}
        />
      ) : (
        group.items.map((item) => (
          <div
            key={item.entry.id}
            onClick={onSelectItem ? () => onSelectItem(item.entry.id) : undefined}
          >
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
              onRespond={onRespond}
              responding={respondingId === item.entry.id}
              showQuickAnswer
            />
          </div>
        ))
      )}
    </section>
  );
}
