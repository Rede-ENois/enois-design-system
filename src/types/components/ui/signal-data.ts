/**
 * What a signal says, by shape: a pill counts things to handle (requests, notices), a balloon
 * counts unread messages, a dot says "there is something new" and "today" marks a time-bound
 * thing (an event happening today).
 */
export type SignalData =
  | { kind: "count"; count: number }
  | { kind: "messages"; count: number }
  | { kind: "new" }
  | { kind: "today" };
