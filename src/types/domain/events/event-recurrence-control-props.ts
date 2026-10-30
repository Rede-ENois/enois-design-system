import type { EventRecurrence } from "./event-recurrence.js";

export type EventRecurrenceControlProps = {
  /** Current recurrence of the series. */
  value: EventRecurrence;
  /** Fires right away; `NONE` stops the series. The app runs the update and reports back. */
  onChange: (value: EventRecurrence) => void;
  pending: boolean;
  error?: string | null;
};
