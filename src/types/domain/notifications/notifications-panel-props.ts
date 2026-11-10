import type { NotificationsPopoverProps } from "./notifications-popover-props.js";

/** The notifications header, tabs and lists, shared by the bell popover and the full page. */
export type NotificationsPanelProps = Omit<NotificationsPopoverProps, "open" | "onOpenChange"> & {
  variant: "popover" | "page";
  /** Called after any navigation inside the panel (the popover closes itself on it). */
  onNavigate?: () => void;
  /** Full page with every notification; the popover footer links to it when set. */
  allHref?: string;
  /** More pages exist (full page only). */
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
};
