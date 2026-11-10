import type { CalendarEntryData } from "./calendar-entry-data.js";

/**
 * What the surface has in the form: a blank entry or an entry that already exists. The two need
 * different data, and a single nullable entry cannot tell "new" from "nothing open".
 */
export type CalendarAgendaSurfaceDraft =
  { kind: "new" } | { kind: "edit"; entry: CalendarEntryData };
