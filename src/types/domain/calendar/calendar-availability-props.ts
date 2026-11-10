import type { CalendarAvailabilityDraft } from "./calendar-availability-draft.js";
import type { CalendarAvailabilityWindowInput } from "./calendar-availability-values.js";

/**
 * The weekly availability editor. Controlled like every calendar view: the week lives with the
 * app, this only draws it and reports what the reader wants to replace it with. It never fetches
 * and never saves (D18), and saving is a whole-week replacement (D24).
 */
export type CalendarAvailabilityProps = {
  /** The week being edited, one draft row per window. */
  drafts: CalendarAvailabilityDraft[];
  /** IANA id new windows start in and every window reads under. */
  timeZoneId: string;
  /** The server rejected the save; shown without clearing what the reader typed. */
  saveError?: string | null;
  savePending?: boolean;
  onChange: (drafts: CalendarAvailabilityDraft[]) => void;
  /** Collects the week in the API shape; only fires when the draft passes validation. */
  onSave: (windows: CalendarAvailabilityWindowInput[]) => void;
};
