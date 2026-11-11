import type { CalendarScope } from "./calendar-scope.js";

/**
 * The active private `.ics` subscription, as the settings route reports it. The token is not part
 * of it: the server keeps a hash and cannot hand the clear value back, so the link only exists in
 * the response that just created or regenerated it.
 */
export type CalendarSubscriptionData = {
  /** `null` is the consolidated agenda, the same contract the agenda read uses. */
  scope: CalendarScope | null;
  /** ISO instant the subscription was created at. */
  createdAt: string;
};
