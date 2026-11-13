import { Bell, BellOff } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CalendarReminderMinutes } from "../../types/domain/calendar/calendar-reminder-minutes.js";
import type { CalendarReminderSelectorProps } from "../../types/domain/calendar/calendar-reminder-selector-props.js";

const OPTIONS: CalendarReminderMinutes[] = [5, 15, 30, 60, 1440];

/**
 * "Warn me before it starts": one radio group where «não avisar» is a choice like any other, so the
 * reader can turn the reminder off without hunting for a delete. The app owns the request; the
 * component only reports the choice and draws whether it is saving or failed.
 *
 * The option labels come from messages because `1440` is "1 dia" to a person, not "1440 minutos".
 */
export function CalendarReminderSelector({
  value,
  onChange,
  saving = false,
  error = null,
  className,
}: CalendarReminderSelectorProps) {
  const messages = useMessages().calendar.reminder;

  return (
    <section className={cn("flex flex-col gap-2", className)}>
      <h3 className="text-sm font-medium text-text-strong">{messages.title}</h3>

      <div
        role="radiogroup"
        aria-label={messages.title}
        aria-busy={saving || undefined}
        className="flex flex-wrap gap-1.5"
      >
        <button
          type="button"
          role="radio"
          aria-checked={value === null}
          disabled={saving}
          onClick={() => onChange(null)}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-60",
            value === null
              ? "border-border-strong bg-card text-text-strong shadow-sm"
              : "border-border bg-surface-2 text-text-subtle hover:text-text-strong",
          )}
        >
          <BellOff aria-hidden className="size-3.5" />
          {messages.none}
        </button>

        {OPTIONS.map((minutes) => (
          <button
            key={minutes}
            type="button"
            role="radio"
            aria-checked={value === minutes}
            disabled={saving}
            onClick={() => onChange(minutes)}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:cursor-not-allowed disabled:opacity-60",
              value === minutes
                ? "border-border-strong bg-card text-text-strong shadow-sm"
                : "border-border bg-surface-2 text-text-subtle hover:text-text-strong",
            )}
          >
            <Bell aria-hidden className="size-3.5" />
            {messages.minutes(minutes)}
          </button>
        ))}
      </div>

      {saving && <p className="text-xs text-text-subtle">{messages.saving}</p>}
      {error && !saving && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </section>
  );
}
