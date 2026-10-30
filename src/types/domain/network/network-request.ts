import type { AuthorNameStyle } from "../name/author-name-style.js";

/**
 * A pending connection request seen from the viewer's side, with the other person already
 * resolved. `status` carries the row through the action: the row stays in place with its outcome
 * instead of vanishing under the cursor when the list refetches.
 */
export type NetworkRequest = {
  /** The other person (the one to accept, decline or stop inviting). */
  userId: string;
  direction: "INCOMING" | "OUTGOING";
  name: string;
  username: string;
  headline?: string | null;
  avatar?: string | null;
  avatarFrame?: string | null;
  nameStyle?: AuthorNameStyle | null;
  profileHref: string;
  /** Already formatted day of the request ("28 de out."). */
  dateLabel: string;
  status:
    | "pending"
    | "accepting"
    | "declining"
    | "cancelling"
    | "accepted"
    | "declined"
    | "cancelled"
    | "failed";
};
