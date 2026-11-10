import type { CalendarAgendaItemData } from "./calendar-agenda-item-data.js";
import type { CalendarAgendaProps } from "./calendar-agenda-props.js";
import type { CalendarEntryData } from "./calendar-entry-data.js";
import type { CalendarEntryFormValues } from "./calendar-entry-form-values.js";
import type { CalendarScope } from "./calendar-scope.js";

/**
 * The agenda with the entry form already wired: the header gets a button that opens a blank entry,
 * and the dialog closes itself once the app reports the save went through.
 *
 * The surface owns one thing the agenda alone cannot: which entry is in the form. Everything else
 * stays with the app, which fetches the window, answers the invitations and runs the mutation with
 * its idempotency key.
 */
export type CalendarAgendaSurfaceProps = CalendarAgendaProps & {
  /** Agenda a new entry starts in; the reader can change it in the form. */
  newEntryScope?: CalendarScope;
  /** Entry the app opened for editing (e.g. from the detail page). `null` closes the form. */
  editingEntry?: CalendarEntryData | null;
  /** The form closed without saving, or the app should open another entry. */
  onEditingChange?: (entry: CalendarEntryData | null) => void;
  savePending?: boolean;
  /** Message the app got from the server, shown inside the form without clearing the fields. */
  saveError?: string | null;
  /**
   * What already occupies the interval being typed (D23: a read, never a block). The surface hands
   * the list to the form, which picks the entries the draft actually touches.
   */
  conflicts?: CalendarAgendaItemData[] | null;
  /**
   * Runs the mutation. Resolve `true` when it was saved, so the form closes; `false` keeps it open
   * with what the reader typed.
   */
  onSave: (values: CalendarEntryFormValues, entry: CalendarEntryData | null) => Promise<boolean>;
};
