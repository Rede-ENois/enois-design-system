import type { CalendarParticipation } from "./calendar-participation.js";

/** Um convidado como o organizador o vê: o @ e em que pé está a resposta. */
export type CalendarEntryDetailParticipant = {
  id: string;
  username: string;
  state: CalendarParticipation;
};
