/**
 * The cadence of a series. `NONE` is a one-off entry; the others make the entry a founder whose
 * siblings the server materializes. A series is started after the entry exists (`POST /series`),
 * never in the create call, so this field is a choice the form reports, not a wire field.
 */
export type CalendarRecurrence = "NONE" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";
