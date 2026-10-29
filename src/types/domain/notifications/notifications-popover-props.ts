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
};
