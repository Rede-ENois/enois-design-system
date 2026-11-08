import { CalendarX } from "lucide-react";

import { timeLabel } from "../../lib/calendar/calendar-dates.js";
import { monthGrid, withoutKinds } from "../../lib/calendar/calendar-grid.js";
import { KIND_TONE } from "../../lib/calendar/calendar-kind-tone.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarAgendaItemData } from "../../types/domain/calendar/calendar-agenda-item-data.js";
import type { CalendarMonthViewProps } from "../../types/domain/calendar/calendar-month-view-props.js";
import { EmptyState } from "../../ui/empty-state.js";
import { LoadingState } from "../../ui/loading-state.js";

import { CalendarErrorState } from "./calendar-error-state.js";

/** How many entries fit in a cell before the counter takes over. */
const CELL_LIMIT = 3;

/**
 * Month grid, Sunday first, borrowing the neighbour days that close the first and last rows.
 * Each cell is a button when the app wants the day opened; entries are links to the detail.
 */
export function CalendarMonthView({
  month,
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
  showKindIcon = true,
  hiddenKinds,
  className,
}: CalendarMonthViewProps) {
  const messages = useMessages().calendar;

  if (loading) {
    return <LoadingState label={messages.loading} className={className} />;
  }

  if (error) {
    return <CalendarErrorState onRetry={onRetry} className={className} />;
  }

  const cells = monthGrid(month, withoutKinds(items, hiddenKinds), timeZoneId);

  return (
    <div className={cn("min-w-0", className)}>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl bg-border-soft">
        {messages.weekdays.map((weekday) => (
          <div
            key={weekday}
            className="bg-surface-2 px-1 py-2 text-center text-[11px] font-medium uppercase tracking-wide text-text-subtle"
          >
            {weekday}
          </div>
        ))}

        {cells.map((cell) => {
          const isToday = cell.date === today;
          const isSelected = cell.date === selectedDay;
          const overflow = cell.items.length - CELL_LIMIT;

          return (
            <div
              key={cell.date}
              data-today={isToday || undefined}
              data-outside={!cell.inMonth || undefined}
              className={cn(
                "flex min-h-24 min-w-0 flex-col gap-1 bg-card p-1.5",
                !cell.inMonth && "bg-surface-1 text-text-subtle",
                isSelected && "ring-2 ring-inset ring-primary/50",
              )}
            >
              {onSelectDay ? (
                <button
                  type="button"
                  onClick={() => onSelectDay(cell.date)}
                  aria-pressed={isSelected}
                  aria-label={messages.dayTitle(cell.date)}
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-normal tabular-nums transition",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isToday
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "text-text-strong hover:bg-surface-2",
                    !cell.inMonth && "text-text-subtle",
                  )}
                >
                  {cell.dayOfMonth}
                </button>
              ) : (
                <span
                  className={cn(
                    "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-normal tabular-nums",
                    isToday && "bg-primary font-semibold text-primary-foreground",
                    !cell.inMonth && "text-text-subtle",
                  )}
                >
                  {cell.dayOfMonth}
                </span>
              )}

              <ul className="flex min-w-0 flex-col gap-0.5">
                {cell.items.slice(0, CELL_LIMIT).map((item) => (
                  <MonthEntry
                    key={item.entry.id}
                    item={item}
                    timeZoneId={timeZoneId}
                    href={itemHref?.(item.entry.id)}
                    active={activeId === item.entry.id}
                    showKindIcon={showKindIcon}
                  />
                ))}
              </ul>

              {overflow > 0 && (
                <span className="mt-auto text-[11px] font-normal text-text-subtle">
                  {messages.moreEntries(overflow)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {cells.every((cell) => cell.items.length === 0) && (
        <EmptyState
          icon={CalendarX}
          title={messages.emptyList}
          description={messages.emptyListHint}
        />
      )}
    </div>
  );
}

function MonthEntry({
  item,
  timeZoneId,
  href,
  active,
  showKindIcon,
}: {
  item: CalendarAgendaItemData;
  timeZoneId: string;
  href?: string;
  active: boolean;
  showKindIcon: boolean;
}) {
  const messages = useMessages().calendar;
  const entry = item.entry;
  const cancelled = entry.cancelledAt !== null;
  const time = entry.allDay ? "" : `${timeLabel(entry.startsAt, timeZoneId)} `;
  const label = `${messages.kinds[entry.kind]}${
    entry.allDay
      ? ""
      : `, ${messages.timeRange(
          timeLabel(entry.startsAt, timeZoneId),
          timeLabel(entry.endsAt, timeZoneId),
        )}`
  }: ${entry.title}`;

  const body = (
    <>
      {showKindIcon && (
        <span
          aria-hidden
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", KIND_TONE[entry.kind])}
        />
      )}
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[11px] font-normal",
          cancelled ? "text-text-subtle line-through" : "text-text-strong",
        )}
      >
        {time}
        {entry.title}
      </span>
    </>
  );

  const className = cn(
    "flex min-w-0 items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-surface-2",
    active && "bg-primary-soft",
    cancelled && "opacity-70",
  );

  return (
    <li className="min-w-0">
      {href ? (
        <a href={href} aria-label={label} className={className}>
          {body}
        </a>
      ) : (
        <span aria-label={label} className={className}>
          {body}
        </span>
      )}
    </li>
  );
}
