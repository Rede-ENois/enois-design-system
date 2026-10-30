import type { EventRecurrence } from "./event-recurrence.js";

export type EventRecurrenceFieldProps = {
  value: EventRecurrence;
  onChange: (value: EventRecurrence) => void;
  /** Validation message from the form (e.g. a recurring event without a time). */
  error?: string | null;
  disabled?: boolean;
};
