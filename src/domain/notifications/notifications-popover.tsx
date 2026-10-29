import { useState } from "react";

import { Bell, CheckCheck, Loader2 } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { NotificationTab } from "../../types/domain/notifications/notification-tab.js";
import type { NotificationsPopoverProps } from "../../types/domain/notifications/notifications-popover-props.js";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover.js";

import { ConnectionRequestItem } from "./connection-request-item.js";
import { NotificationItem } from "./notification-item.js";

export function NotificationsPopover({
  open,
  onOpenChange,
  notifications,
  requests,
  requestsLoading,
  stillPendingActorIds,
  acceptingActorId,
  rejectingActorId,
  markAllPending,
  onMarkAllRead,
  onMarkAsRead,
  onAcceptConnection,
  onRejectConnection,
  onOpenNotification,
}: NotificationsPopoverProps) {
  const messages = useMessages().notificationsPopover;
  const [notificationTab, setNotificationTab] = useState<NotificationTab>("novas");

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const displayedNotifications = notifications.filter((notification) =>
    notificationTab === "novas" ? !notification.read : notification.read,
  );
  const requestCount = requests.length;
  const close = () => onOpenChange(false);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="relative grid h-10 w-10 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-primary"
          aria-label={unreadCount > 0 ? messages.unreadLabel(unreadCount) : messages.title}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-xs font-medium leading-none text-primary-foreground">
              {unreadCount > 9 ? messages.overflowCount : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[min(calc(100vw-2rem),24rem)] overflow-hidden rounded-2xl border-border-soft bg-surface-card p-0 shadow-card"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border-soft px-4 py-3">
          <span className="text-sm font-normal text-text-strong">{messages.title}</span>
          {unreadCount > 0 && notificationTab === "novas" && (
            <button
              type="button"
              disabled={markAllPending}
              onClick={onMarkAllRead}
              className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-normal text-text-subtle transition hover:text-primary disabled:opacity-60"
            >
              <CheckCheck className="h-3 w-3" />

              <>{messages.markAllRead}</>
            </button>
          )}
        </div>

        <div className="flex border-b border-border-soft">
          <button
            type="button"
            onClick={() => setNotificationTab("novas")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-normal transition",
              notificationTab === "novas"
                ? "border-b-2 border-primary text-primary"
                : "text-text-subtle hover:text-text-strong",
            )}
          >
            <>{messages.tabs.new}</>
            {unreadCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setNotificationTab("historico")}
            className={cn(
              "flex-1 py-2.5 text-xs font-normal transition",
              notificationTab === "historico"
                ? "border-b-2 border-primary text-primary"
                : "text-text-subtle hover:text-text-strong",
            )}
          >
            {messages.tabs.history}
          </button>

          <button
            type="button"
            onClick={() => setNotificationTab("solicitacoes")}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-normal transition",
              notificationTab === "solicitacoes"
                ? "border-b-2 border-primary text-primary"
                : "text-text-subtle hover:text-text-strong",
            )}
          >
            <>{messages.tabs.requests}</>
            {requestCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                {requestCount}
              </span>
            )}
          </button>
        </div>

        <div className="max-h-[28rem] overflow-y-auto">
          {notificationTab === "solicitacoes" ? (
            requestsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-text-subtle" />
              </div>
            ) : requests.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm font-normal text-text-subtle">
                {messages.emptyRequests}
              </p>
            ) : (
              requests.map((request) => (
                <ConnectionRequestItem
                  key={request.id}
                  request={request}
                  onAccept={onAcceptConnection}
                  onReject={onRejectConnection}
                  accepting={acceptingActorId === request.fromUserId}
                  rejecting={rejectingActorId === request.fromUserId}
                  onNavigate={close}
                />
              ))
            )
          ) : displayedNotifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm font-normal text-text-subtle">
              {notificationTab === "novas" ? messages.emptyNew : messages.emptyHistory}
            </p>
          ) : (
            displayedNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                onAcceptConnection={onAcceptConnection}
                stillPendingActorIds={stillPendingActorIds}
                acceptingActorId={acceptingActorId}
                onOpen={onOpenNotification}
              />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
