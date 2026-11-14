import { Bell } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { NotificationsPopoverProps } from "../../types/domain/notifications/notifications-popover-props.js";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover.js";
import { Signal } from "../../ui/signal.js";

import { NotificationsPanel } from "./notifications-panel.js";

/** The bell: its count pill and the notices panel in a popover. */
export function NotificationsPopover({
  open,
  onOpenChange,
  unreadCount,
  ...panel
}: NotificationsPopoverProps) {
  const messages = useMessages().notificationsPopover;
  // Without the server total, the rows in hand are counted (the old behavior); with it, the count
  // covers every unread notice, not only the ones on the loaded page.
  const counted =
    unreadCount ?? panel.notifications.filter((notification) => !notification.read).length;
  const close = () => onOpenChange(false);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="relative grid h-11 w-11 place-items-center rounded-full text-text-strong transition hover:bg-surface-2"
          aria-label={counted > 0 ? messages.unreadLabel(counted) : messages.title}
        >
          <Bell aria-hidden className="h-[22px] w-[22px]" />
          {counted > 0 && (
            <Signal
              signal={{ kind: "count", count: counted }}
              onIcon
              className="absolute -right-0.5 top-0.5"
            />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[min(calc(100vw-2rem),26rem)] overflow-hidden rounded-3xl border-border-soft bg-surface-card p-0 shadow-[0_24px_60px_-16px_rgb(0_0_0/0.55)]"
      >
        <NotificationsPanel {...panel} variant="popover" onNavigate={close} />
      </PopoverContent>
    </Popover>
  );
}
