import type { CalendarEntryData } from "./calendar-entry-data.js";
import type { CalendarParticipation } from "./calendar-participation.js";

/** An entry plus the reader's place in it. `owner` true is the organizer, `participation` null. */
export type CalendarAgendaItemData = {
  entry: CalendarEntryData;
  owner: boolean;
  participation: CalendarParticipation | null;
};
