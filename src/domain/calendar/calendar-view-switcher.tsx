import { type KeyboardEvent, useRef } from "react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarViewSwitcherProps } from "../../types/domain/calendar/calendar-view-switcher-props.js";
import type { CalendarView } from "../../types/domain/calendar/calendar-view.js";

const ORDER: CalendarView[] = ["month", "week", "day", "list"];

/**
 * The four look modes, as a radio group: arrows move the selection and the focus together,
 * Home/End jump to the ends. A radio group has ONE tab stop — Tab leaves the group instead
 * of walking through four buttons — so the roving focus is what makes the roles honest.
 */
export function CalendarViewSwitcher({ value, onChange, className }: CalendarViewSwitcherProps) {
  const messages = useMessages().calendar;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (from: number, step: number) => {
    const next = (from + step + ORDER.length) % ORDER.length;
    onChange(ORDER[next]);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = refs.current.findIndex((element) => element === document.activeElement);
    if (current < 0) return;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        move(current, 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        move(current, -1);
        break;
      case "Home":
        event.preventDefault();
        move(current, -current);
        break;
      case "End":
        event.preventDefault();
        move(current, ORDER.length - 1 - current);
        break;
      default:
        break;
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={messages.viewSwitcherLabel}
      onKeyDown={onKeyDown}
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-full bg-surface-2 p-0.5",
        className,
      )}
    >
      {ORDER.map((view, index) => (
        <button
          key={view}
          ref={(element) => {
            refs.current[index] = element;
          }}
          type="button"
          role="radio"
          aria-checked={value === view}
          tabIndex={value === view ? 0 : -1}
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
