import { type KeyboardEvent, useRef } from "react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarSlotPickerProps } from "../../types/domain/calendar/calendar-slot-picker-props.js";
import type { CalendarSlot } from "../../types/domain/calendar/calendar-slot.js";

const dayFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "2-digit",
  month: "short",
});
const timeFormatter = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" });

function label(startsAt: string, slot: (day: string, time: string) => string): string {
  const instant = new Date(startsAt);
  if (Number.isNaN(instant.getTime())) return startsAt;
  return slot(dayFormatter.format(instant), timeFormatter.format(instant));
}

/**
 * The mentor's published hours as one radio group: the choice is announced as checked, keyboard
 * arrows walk the options and the booking error renders inside the group, where the action
 * happened. The app owns the request; the picker only reports the chosen id.
 */
export function CalendarSlotPicker({
  slots,
  value,
  onChange,
  disabled = false,
  error = null,
  className,
}: CalendarSlotPickerProps) {
  const messages = useMessages().calendar.slotPicker;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const move = (from: number, step: number) => {
    const next = (from + step + slots.length) % slots.length;
    onChange(slots[next].id);
    refs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled || slots.length === 0) return;
    const current = refs.current.findIndex((element) => element === document.activeElement);
    if (current < 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      move(current, 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      move(current, -1);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        role="radiogroup"
        aria-label={messages.title}
        aria-busy={disabled || undefined}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-1.5"
      >
        {slots.map((slot: CalendarSlot, index) => {
          const checked = value === slot.id;
          return (
            <button
              key={slot.id}
              ref={(element) => {
                refs.current[index] = element;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              disabled={disabled}
              onClick={() => onChange(checked ? null : slot.id)}
              className={cn(
                "w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-60",
                checked
                  ? "border-border-strong bg-card text-text-strong shadow-sm"
                  : "border-border bg-surface-2 text-text-subtle hover:text-text-strong",
              )}
            >
              {label(slot.startsAt, messages.slot)}
            </button>
          );
        })}
      </div>

      {error && !disabled && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
