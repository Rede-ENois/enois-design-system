import { useId } from "react";

import { Repeat } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { EventRecurrenceControlProps } from "../../types/domain/events/event-recurrence-control-props.js";
import type { EventRecurrence } from "../../types/domain/events/event-recurrence.js";
import { Button } from "../../ui/button.js";
import { Label } from "../../ui/label.js";

import { RECURRENCE_SELECT_CLASS, RECURRING_CADENCES } from "./recurrence.js";

/**
 * Lets the creator change or stop a series. No confirmation dialog: every change can be undone
 * by picking a cadence again, and the copy says that stopping keeps the past events.
 */
export function EventRecurrenceControl({
  value,
  onChange,
  pending,
  error,
}: EventRecurrenceControlProps) {
  const messages = useMessages().eventRecurrence;
  const id = useId();
  const hintId = `${id}-hint`;
  const active = value !== "NONE";

  return (
    <div className="min-w-0 space-y-2">
      <Label
        htmlFor={id}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
      >
        <Repeat className="h-3.5 w-3.5" aria-hidden />
        {messages.controlLabel}
      </Label>

      <select
        id={id}
        value={value}
        disabled={pending}
        onChange={(event) => onChange(event.target.value as EventRecurrence)}
        aria-describedby={hintId}
        className={RECURRENCE_SELECT_CLASS}
      >
        {!active && (
          <option value="NONE" disabled>
            {messages.labels.NONE}
          </option>
        )}
        {RECURRING_CADENCES.map((option) => (
          <option key={option} value={option}>
            {messages.labels[option]}
          </option>
        ))}
      </select>

      <p id={hintId} className="text-xs text-text-subtle">
        {active ? messages.controlHint : messages.fieldHint}
      </p>

      {active && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={pending}
            onClick={() => onChange("NONE")}
          >
            {messages.stop}
          </Button>

          <span className="min-w-0 text-xs text-text-subtle">{messages.stopHint}</span>
        </div>
      )}

      <p aria-live="polite" className="text-xs text-text-subtle empty:hidden">
        {pending ? messages.saving : ""}
      </p>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
