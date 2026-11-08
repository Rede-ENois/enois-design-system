import type { CalendarEntryData } from "./calendar-entry-data.js";
import type { CalendarEntryFormValues } from "./calendar-entry-form-values.js";
import type { CalendarScope } from "./calendar-scope.js";

/**
 * Create and edit share one form: an entry to edit makes the dialog open filled in, and saving
 * reports the values in the API shape. The app owns the mutation, the idempotency key and the
 * route; this only collects the fields.
 */
export type CalendarEntryFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Entry being edited; absent to create a new one. */
  entry?: CalendarEntryData | null;
  /** Agenda the new entry starts in. The reader can change it in the form. */
  defaultScope?: CalendarScope;
  /** Day the reader is looking at, used to pre-fill a new entry (`YYYY-MM-DD`). */
  defaultDay?: string | null;
  /** IANA id new entries are written in; the app passes the profile's zone. */
  timeZoneId: string;
  savePending?: boolean;
  /** Shown under the title when the server rejected the save. */
  saveError?: string | null;
  onSave: (values: CalendarEntryFormValues) => void;
};
