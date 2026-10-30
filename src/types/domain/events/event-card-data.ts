import type { EventRecurrence } from "./event-recurrence.js";

/** What the event card reads. Shaped like the API event so the front can pass it directly. */
export type EventCardData = {
  id: string;
  title: string;
  /** Calendar date, `YYYY-MM-DD`. */
  date: string | null;
  format: "ONLINE" | "IN_PERSON" | "HYBRID";
  host: string;
  attendees: number | null;
  cover: string | null;
  streamUrl: string | null;
  location: string | null;
  /** The event already happened: no attendance changes anymore. */
  expired: boolean;
  /** The viewer confirmed attendance. */
  attending: boolean;
  /** Missing means a one-off event (older API payloads). */
  recurrence?: EventRecurrence;
  /** Next date of the series, `YYYY-MM-DD`; null when the series has no upcoming date. */
  nextOccurrenceDate?: string | null;
};
