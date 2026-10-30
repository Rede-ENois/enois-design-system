import type { EventRecurrence } from "../domain/events/event-recurrence.js";

export type EventsMessages = {
  eventCard: {
    formats: Record<"ONLINE" | "IN_PERSON" | "HYBRID", string>;
    /** Index 1..12; index 0 is unused. */
    months: string[];
    hostedBy: (host: string) => string;
    watchLive: string;
    attend: string;
    cancelAttend: string;
    youAreGoing: string;
    finished: string;
    attendees: (count: number) => string;
  };
  eventRecurrence: {
    labels: Record<EventRecurrence, string>;
    /** Receives the date already as "dd/mm". */
    next: (dayMonth: string) => string;
    fieldLabel: string;
    fieldHint: string;
    controlLabel: string;
    controlHint: string;
    stop: string;
    stopHint: string;
    saving: string;
    filterLabel: string;
    filterAll: string;
    filterRituals: string;
  };
};
