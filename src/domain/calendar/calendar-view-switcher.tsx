import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarViewSwitcherProps } from "../../types/domain/calendar/calendar-view-switcher-props.js";
import type { CalendarView } from "../../types/domain/calendar/calendar-view.js";

const ORDER: CalendarView[] = ["month", "week", "day", "list"];

/** The four look modes. A radio group so arrow keys move between them, as tabs would. */
export function CalendarViewSwitcher({ value, onChange, className }: CalendarViewSwitcherProps) {
  const messages = useMessages().calendar;

  return (
    <div
      role="radiogroup"
      aria-label={messages.viewSwitcherLabel}
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-full bg-surface-2 p-0.5",
        className,
      )}
    >
      {ORDER.map((view) => (
        <button
          key={view}
          type="button"
          role="radio"
          aria-checked={value === view}
          onClick={() => onChange(view)}
          className={cn(
            "h-8 rounded-full px-3 text-xs font-normal transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === view
              ? "bg-card text-text-strong shadow-sm"
              : "text-text-subtle hover:text-text-strong",
          )}
        >
          {messages.views[view]}
        </button>
      ))}
    </div>
  );
}
