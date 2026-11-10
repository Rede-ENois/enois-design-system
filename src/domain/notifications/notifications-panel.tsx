import { Fragment, useState } from "react";

import { CheckCheck, Loader2, Settings2 } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { NotificationData } from "../../types/domain/notifications/notification-data.js";
import type { NotificationTab } from "../../types/domain/notifications/notification-tab.js";
import type { NotificationsPanelProps } from "../../types/domain/notifications/notifications-panel-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Pill } from "../../ui/pill.js";
import { Signal } from "../../ui/signal.js";

import { ConnectionRequestItem } from "./connection-request-item.js";
import { NotificationItem } from "./notification-item.js";

const TABS: NotificationTab[] = ["novas", "historico", "solicitacoes"];

/** Consecutive rows that share a day label; rows without one form a single unnamed group. */
function byDay(notifications: NotificationData[]) {
  const groups: { label: string | undefined; items: NotificationData[] }[] = [];
  for (const notification of notifications) {
    const last = groups.at(-1);
    if (last && last.label === notification.dayLabel) last.items.push(notification);
    else groups.push({ label: notification.dayLabel, items: [notification] });
  }
  return groups;
}

/**
 * The notices themselves: header (read all, preferences), the New / History / Requests tabs and
 * the lists. The bell popover and the full page render the same panel, so they never disagree.
 */
export function NotificationsPanel({
  variant,
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
  preferencesHref,
  onNavigate = () => {},
  allHref,
  hasMore = false,
  loadingMore = false,
  onLoadMore,
}: NotificationsPanelProps) {
  const messages = useMessages().notificationsPopover;
  const [tab, setTab] = useState<NotificationTab>("novas");
  const page = variant === "page";

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const shown = notifications.filter((notification) =>
    tab === "novas" ? !notification.read : notification.read,
  );
  const counts: Record<NotificationTab, number> = {
    novas: unreadCount,
    historico: 0,
    solicitacoes: requests.length,
  };
  const labels: Record<NotificationTab, string> = {
    novas: messages.tabs.new,
    historico: messages.tabs.history,
    solicitacoes: messages.tabs.requests,
  };

  const rows = (items: NotificationData[]) =>
    items.map((notification) => (
      <NotificationItem
        key={notification.id}
        notification={notification}
        onMarkAsRead={onMarkAsRead}
        onAcceptConnection={onAcceptConnection}
        stillPendingActorIds={stillPendingActorIds}
        acceptingActorId={acceptingActorId}
        onOpen={onOpenNotification}
      />
    ));

  return (
    <div className="flex min-h-0 flex-col">
      <div className={cn("flex items-center gap-2", page ? "px-1 pb-3" : "px-4 pb-2 pt-3.5")}>
        {page ? (
          <h1 className="flex-1 text-2xl font-extrabold tracking-tight text-text-strong">
            {messages.title}
          </h1>
        ) : (
          <h2 className="flex-1 text-base font-extrabold text-text-strong">{messages.title}</h2>
        )}

        {unreadCount > 0 && tab === "novas" && (
          <button
            type="button"
            disabled={markAllPending}
            onClick={onMarkAllRead}
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-primary-text transition hover:bg-surface-2 disabled:opacity-60"
          >
            <CheckCheck aria-hidden className="h-4 w-4" />
            {messages.markAllRead}
          </button>
        )}

        {preferencesHref && (
          <AppLink
            href={preferencesHref}
            onClick={onNavigate}
            aria-label={messages.preferences}
            title={messages.preferences}
            className="grid h-11 w-11 place-items-center rounded-full text-text-subtle transition hover:bg-surface-2 hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Settings2 aria-hidden className="h-[18px] w-[18px]" />
          </AppLink>
        )}
      </div>

      <div className={cn("flex gap-2 overflow-x-auto pb-2", page ? "px-1" : "px-4")}>
        {TABS.map((option) => (
          <Pill key={option} active={tab === option} onClick={() => setTab(option)}>
            {labels[option]}
            {counts[option] > 0 && <Signal signal={{ kind: "count", count: counts[option] }} />}
          </Pill>
        ))}
      </div>

      <div
        className={cn(
          page
            ? "flex flex-col gap-2"
            : "max-h-[28rem] overflow-y-auto overscroll-contain border-t border-border-soft",
        )}
      >
        {tab === "solicitacoes" ? (
          requestsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-text-subtle" />
            </div>
          ) : requests.length === 0 ? (
            <p className="px-4 py-10 text-center text-[15px] text-text-subtle">
              {messages.emptyRequests}
            </p>
          ) : (
            <div
              className={cn(
                page && "overflow-hidden rounded-3xl bg-surface-card shadow-[var(--shadow-table)]",
              )}
            >
              {requests.map((request) => (
                <ConnectionRequestItem
                  key={request.id}
                  request={request}
                  onAccept={onAcceptConnection}
                  onReject={onRejectConnection}
                  accepting={acceptingActorId === request.fromUserId}
                  rejecting={rejectingActorId === request.fromUserId}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )
        ) : shown.length === 0 ? (
          <p className="px-4 py-10 text-center text-[15px] text-text-subtle">
            {tab === "novas" ? messages.emptyNew : messages.emptyHistory}
          </p>
        ) : page ? (
          byDay(shown).map((group, index) => (
            <Fragment key={group.label ?? index}>
              {group.label && (
                <p className="px-2 pt-3 text-[13px] font-bold text-text-date">{group.label}</p>
              )}
              <div className="divide-y divide-border-soft overflow-hidden rounded-3xl bg-surface-card shadow-[var(--shadow-table)]">
                {rows(group.items)}
              </div>
            </Fragment>
          ))
        ) : (
          <div className="divide-y divide-border-soft">{rows(shown)}</div>
        )}

        {/* "Carregar mais" descreve as linhas desta aba, não o histórico inteiro: com a aba
            vazia o botão não aparece — antes ficava "Nenhuma notificação nova." seguido de um
            "Carregar mais" que nada mudava, porque `hasMore` fala do histórico todo. */}
        {page && hasMore && shown.length > 0 && tab !== "solicitacoes" && onLoadMore && (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="mx-auto mt-2 inline-flex h-10 items-center gap-2 rounded-full bg-surface-2 px-5 text-sm font-bold text-text-strong transition hover:bg-primary-soft disabled:opacity-60"
          >
            {loadingMore && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
            {loadingMore ? messages.loadingMore : messages.loadMore}
          </button>
        )}
      </div>

      {!page && allHref && (
        <AppLink
          href={allHref}
          onClick={onNavigate}
          className="block border-t border-border-soft py-3 text-center text-sm font-bold text-primary-text transition hover:bg-surface-2"
        >
          {messages.viewAll}
        </AppLink>
      )}
    </div>
  );
}
