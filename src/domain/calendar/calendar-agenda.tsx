import { ChevronLeft, ChevronRight } from "lucide-react";

import { periodOfToday, periodTitle, stepPeriod } from "../../lib/calendar/calendar-period.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarAgendaProps } from "../../types/domain/calendar/calendar-agenda-props.js";

import { CalendarDayView } from "./calendar-day-view.js";
import { CalendarListView } from "./calendar-list-view.js";
import { CalendarMonthView } from "./calendar-month-view.js";
import { CalendarViewSwitcher } from "./calendar-view-switcher.js";
import { CalendarWeekView } from "./calendar-week-view.js";

const MONTH_FORMAT = new Intl.DateTimeFormat("pt-BR", { month: "long", timeZone: "UTC" });
const DAY_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
});

const monthName = (month: number) => MONTH_FORMAT.format(new Date(Date.UTC(2026, month - 1, 15)));
const dayLabel = (day: string) => DAY_FORMAT.format(new Date(`${day}T12:00:00Z`));

/**
 * The agenda surface: period header with arrows, the view switcher and the chosen view. The app
 * owns the period, the view and the data; this draws and reports what the reader clicked. The
 * agenda entry lives in the "explore" section of the main menu and is always shown.
 */
export function CalendarAgenda({
  view,
  onViewChange,
  period,
  onPeriodChange,
  items,
  timeZoneId,
  today,
  selectedDay,
  onSelectDay,
  onSelectItem,
  itemHref,
  activeId,
  onRespond,
  respondingId,
  respondError = false,
  onRetry,
  loading = false,
  error = false,
  eyebrow,
  hiddenKinds,
  className,
}: CalendarAgendaProps) {
  const messages = useMessages().calendar;
  const title = periodTitle(view, period, { monthName, dayLabel });
  const previous =
    view === "month"
      ? messages.previousMonth
      : view === "week"
        ? messages.previousWeek
        : messages.previousDay;
  const next =
    view === "month" ? messages.nextMonth : view === "week" ? messages.nextWeek : messages.nextDay;

  const shared = {
    items,
    timeZoneId,
    today,
    onSelectItem,
    itemHref,
    activeId,
    loading,
    error,
    onRetry,
  };

  return (
    <section className={cn("flex min-w-0 flex-col gap-3", className)}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onPeriodChange(stepPeriod(view, period, -1))}
            aria-label={previous}
            title={previous}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronLeft aria-hidden className="h-4 w-4" />
          </button>

          <div className="min-w-0 px-1">
            {eyebrow && (
              <p className="truncate text-[11px] font-medium uppercase tracking-wide text-text-subtle">
                {eyebrow}
              </p>
            )}
            <h2 className="min-w-0 truncate text-base font-semibold capitalize text-text-strong">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onPeriodChange(stepPeriod(view, period, 1))}
            aria-label={next}
            title={next}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ChevronRight aria-hidden className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onPeriodChange(periodOfToday(view, today))}
            className="ml-1 h-8 shrink-0 rounded-full border border-border px-3 text-xs font-normal text-text-strong transition hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {messages.today}
          </button>
        </div>

        <CalendarViewSwitcher value={view} onChange={onViewChange} />
      </header>

      {view === "month" && (
        <CalendarMonthView
          {...shared}
          month={period}
          selectedDay={selectedDay}
          onSelectDay={onSelectDay}
          hiddenKinds={hiddenKinds}
        />
      )}

      {view === "week" && (
        <CalendarWeekView
          {...shared}
          week={period}
          selectedDay={selectedDay}
          onSelectDay={onSelectDay}
        />
      )}

      {view === "day" && (
        <CalendarDayView
          {...shared}
          day={period}
          onRespond={onRespond}
          respondingId={respondingId}
          respondError={respondError}
        />
      )}

      {view === "list" && <CalendarListView {...shared} />}
    </section>
  );
}
