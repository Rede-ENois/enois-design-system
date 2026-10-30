import { useId } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { EventRecurrenceFieldProps } from "../../types/domain/events/event-recurrence-field-props.js";
import type { EventRecurrence } from "../../types/domain/events/event-recurrence.js";
import { Label } from "../../ui/label.js";

import { RECURRENCE_SELECT_CLASS, RECURRING_CADENCES } from "./recurrence.js";

/** Recurrence select of the create event form. A series needs a time, so the hint says so. */
export function EventRecurrenceField({
  value,
  onChange,
  error,
  disabled,
}: EventRecurrenceFieldProps) {
  const messages = useMessages().eventRecurrence;
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {messages.fieldLabel}
      </Label>

      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as EventRecurrence)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${hintId} ${errorId}` : hintId}
        className={RECURRENCE_SELECT_CLASS}
      >
        {(["NONE", ...RECURRING_CADENCES] as const).map((option) => (
          <option key={option} value={option}>
            {messages.labels[option]}
          </option>
        ))}
      </select>

      <p id={hintId} className="text-xs text-text-subtle">
        {messages.fieldHint}
      </p>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
