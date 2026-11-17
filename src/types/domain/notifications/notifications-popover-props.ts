import type { ConnectionRequestData } from "./connection-request-data.js";
import type { NotificationData } from "./notification-data.js";

export type NotificationsPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Visible notifications for the "Novas" and "Histórico" tabs. */
  notifications: NotificationData[];
  /** Incoming requests, already filtered (removed or missing senders left out). */
  requests: ConnectionRequestData[];
  requestsLoading: boolean;
  stillPendingActorIds?: ReadonlySet<string>;
  acceptingActorId: string | null;
  rejectingActorId: string | null;
  markAllPending: boolean;
  onMarkAllRead: () => void;
  onMarkAsRead: (id: string) => void;
  onAcceptConnection: (actorId: string) => void;
  onRejectConnection: (actorId: string) => void;
  /** Opens a notification destination; the popover closes itself. */
  onOpenNotification: (href: string) => void;
  /** Notification preferences page; the header shows a settings link only when it is set. */
  preferencesHref?: string;
  /** Full notifications page; the popover footer links to it when set. */
  allHref?: string;
  /**
   * Total unread notices when the app knows it (the server summary). The bell counts only the rows
   * that came in the request, so without this the count stops at the size of the loaded page.
   * Left out, the rows themselves are counted, as before.
   */
  unreadCount?: number;
};
