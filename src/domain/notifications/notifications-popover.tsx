import { Bell } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { NotificationsPopoverProps } from "../../types/domain/notifications/notifications-popover-props.js";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover.js";
import { Signal } from "../../ui/signal.js";

import { NotificationsPanel } from "./notifications-panel.js";

/** The bell: its count pill and the notices panel in a popover. */
export function NotificationsPopover({ open, onOpenChange, ...panel }: NotificationsPopoverProps) {
  const messages = useMessages().notificationsPopover;
  const unreadCount = panel.notifications.filter((notification) => !notification.read).length;
  const close = () => onOpenChange(false);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="relative grid h-11 w-11 place-items-center rounded-full text-text-strong transition hover:bg-surface-2"
          aria-label={unreadCount > 0 ? messages.unreadLabel(unreadCount) : messages.title}
        >
          <Bell aria-hidden className="h-[22px] w-[22px]" />
          {unreadCount > 0 && (
            <Signal
              signal={{ kind: "count", count: unreadCount }}
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
