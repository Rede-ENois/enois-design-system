import type { CalendarEntryFormProps } from "./calendar-entry-form-props.js";

/**
 * The dialog body: the form props minus the ones the dialog shell owns, plus the cancel hook and
 * the id helper. Separate so the body cannot reach for `open` or flip it behind the shell.
 */
export type CalendarEntryFormBodyProps = Omit<CalendarEntryFormProps, "open" | "onOpenChange"> & {
  onCancel: () => void;
  /** Builds a stable id from a field name, so each label points at its own input. */
  id: (name: string) => string;
};
