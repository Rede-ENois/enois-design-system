import type { CalendarScope } from "./calendar-scope.js";
import type { CalendarSubscriptionData } from "./calendar-subscription-data.js";

/**
 * The subscription card: the link the reader pastes into an external calendar.
 *
 * `subscription` is what the settings route reports (no token — the server only keeps a hash).
 * `freshUrl` is the link that just came back from creating or regenerating it, and the only
 * moment it can be copied. The app owns every request; the card draws and reports intent.
 */
export type CalendarSubscriptionCardProps = {
  subscription: CalendarSubscriptionData | null;
  /** Present only right after create/regenerate; the previous URL is dead at this point. */
  freshUrl: string | null;
  /** Scope the next creation will use; `null` is the consolidated agenda. */
  scope: CalendarScope | null;
  onScopeChange: (scope: CalendarScope | null) => void;
  onCreate: () => void;
  /** Replaces the token; the reader's other calendars keep the old, now dead, address. */
  onRegenerate: () => void;
  onRevoke: () => void;
  onCopy: () => void;
  /** The last request failed; shown without dropping the current state. */
  error?: string | null;
  pending?: boolean;
  /** The app wrote the link to the clipboard; the card only confirms it. */
  copied?: boolean;
};
