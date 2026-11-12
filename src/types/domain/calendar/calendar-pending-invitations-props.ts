import type { CalendarAnswer } from "./calendar-answer.js";
import type { CalendarPendingInvitationData } from "./calendar-pending-invitation-data.js";

/**
 * Invitations waiting for an answer, above the agenda. Without it the invitation only shows up if
 * the reader happens to open the period it lands in — next month's invitation would be invisible.
 */
export type CalendarPendingInvitationsProps = {
  invitations: CalendarPendingInvitationData[];
  timeZoneId: string;
  /** Opens the entry, where the reader can read the details before answering. */
  itemHref?: (id: string) => string;
  onRespond?: (entryId: string, answer: CalendarAnswer) => void;
  /** Entry whose answer is being sent; its buttons wait for the server. */
  respondingId?: string | null;
  respondError?: boolean;
  className?: string;
};
