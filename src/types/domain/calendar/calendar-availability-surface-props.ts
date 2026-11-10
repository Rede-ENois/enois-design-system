import type { CalendarAvailabilityWindowInput } from "./calendar-availability-values.js";
import type { CalendarAvailabilityWindowData } from "./calendar-availability-window-data.js";

/**
 * The availability screen's body: the editor wired to the week the server keeps. The surface owns
 * the draft; loading the week, the mutation and the error stay with the app, exactly like
 * `CalendarAgendaSurface`.
 */
export type CalendarAvailabilitySurfaceProps = {
  /** The week the server keeps. A new array (after a save) refills the draft. */
  windows: CalendarAvailabilityWindowData[];
  /** IANA id new windows start in and every window reads under. */
  timeZoneId: string;
  savePending?: boolean;
  /** Message the app got from the server, shown without clearing what the reader typed. */
  saveError?: string | null;
  /** Runs the replacement. Resolve `true` when it was saved, so the draft follows the server. */
  onSave: (windows: CalendarAvailabilityWindowInput[]) => Promise<boolean>;
};
