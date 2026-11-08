import { Check } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { NotificationItemProps } from "../../types/domain/notifications/notification-item-props.js";
import { AppLink } from "../../ui/app-link.js";
import { CommunityMark } from "../../ui/community-mark.js";
import { EventTicket } from "../../ui/event-ticket.js";
import { Signal } from "../../ui/signal.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { StyledName } from "../name/styled-name.js";

import { notificationMeta } from "./notification-meta.js";

/**
 * One notice. Its contour says where it came from before it is read: a circle is a person, a
 * table is a community or group, a ticket is an event, a soft icon is the platform. Unread rows
 * carry a faint violet glow and a dot; reading one only dims it, the row never jumps.
 */
export function NotificationItem({
  notification,
  onMarkAsRead,
  onAcceptConnection,
  stillPendingActorIds,
  acceptingActorId,
  onOpen,
}: NotificationItemProps) {
  const messages = useMessages().notificationItem;
  const kind = notification.kind.toLowerCase();
  const meta = notificationMeta[kind] ?? notificationMeta.connection;
  const Icon = meta.icon;
  const canAcceptConnection = kind === "connection_request" && Boolean(notification.actorId);
  // Já aceito (ou recusado/removido) = não há mais o que aceitar. Sem a lista de pendentes
  // (carregando/erro), mantém o botão como sempre esteve — some só com informação de verdade.
  const stillPending =
    stillPendingActorIds === undefined ||
    (notification.actorId ? stillPendingActorIds.has(notification.actorId) : false);
  const acceptingThis = acceptingActorId != null && acceptingActorId === notification.actorId;

  const markAsRead = () => {
    if (!notification.read) onMarkAsRead(notification.id);
  };

  const handleNavigate = () => {
    markAsRead();
    // The app navigates and closes the popover: left open, it covered the page and the click
    // looked like it only made the notification disappear.
    onOpen(notification.href);
  };

  const handleAcceptConnection = () => {
    if (!notification.actorId) return;

    markAsRead();
    onAcceptConnection(notification.actorId);
  };

  // Every contour sits in the same 44px slot, so the text column lines up row after row.
  const contour = notification.eventDay ? (
    <span className="grid h-11 w-11 place-items-center">
      <EventTicket day={notification.eventDay} size="sm" />
    </span>
  ) : notification.place && !notification.actorName ? (
    <CommunityMark
      name={notification.place.name}
      avatar={notification.place.avatar}
      color={notification.place.color}
      seed={notification.place.id}
      size="md"
    />
  ) : notification.actorAvatar !== null || notification.actorName ? (
    // UserAvatar resolve o caminho do CDN: com <img> cru a foto do usuario nao carregava.
    <UserAvatar
      src={notification.actorAvatar}
      alt={notification.actorName ?? ""}
      className="h-11 w-11"
      fallbackClassName={cn("grid h-11 w-11 place-items-center rounded-full", meta.className)}
    />
  ) : (
    <span className={cn("grid h-11 w-11 place-items-center rounded-full", meta.className)}>
      <Icon className="h-5 w-5" />
    </span>
  );

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3.5 transition-colors",
        notification.read
          ? "bg-transparent"
          : "bg-[linear-gradient(90deg,color-mix(in_oklab,var(--color-primary)_11%,transparent),transparent_70%)]",
      )}
    >
      {notification.actorHref ? (
        <AppLink
          href={notification.actorHref}
          onClick={markAsRead}
          className="shrink-0 rounded-full transition hover:opacity-80"
          aria-label={messages.openActorProfile(notification.actorName ?? "")}
        >
          {contour}
        </AppLink>
      ) : (
        <button
          type="button"
          onClick={handleNavigate}
          className="shrink-0 rounded-full transition hover:opacity-80"
          tabIndex={-1}
          aria-hidden
        >
          {contour}
        </button>
      )}

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={handleNavigate}
          className={cn(
            "block w-full break-words text-left text-[15px] leading-snug transition",
            notification.read ? "text-text-subtle" : "text-text-strong",
          )}
        >
          {notification.actorName && (
            <span className="font-extrabold text-text-strong">
              <StyledName name={notification.actorName} style={notification.actorStyle} />{" "}
            </span>
          )}
          <span>
            {notification.actorName ? notification.title.toLowerCase() : notification.title}
          </span>
          {notification.body && (
            <span className="mt-0.5 block text-text-subtle">{notification.body}</span>
          )}
        </button>

        {notification.preview ? (
          <button
            type="button"
            onClick={handleNavigate}
            className="mt-2 block w-full rounded-[14px_14px_14px_4px] bg-surface-2 px-3 py-2 text-left text-sm leading-snug text-text-subtle transition hover:text-text-strong"
          >
            <span className="line-clamp-2 break-words">{notification.preview}</span>
          </button>
        ) : null}

        {(canAcceptConnection || notification.ctaLabel) && (
          <div className="mt-2.5 flex flex-wrap gap-2">
            {canAcceptConnection ? (
              <button
                type="button"
                onClick={handleAcceptConnection}
                // Já aceito: o botão continua no Histórico, mas desabilitado (não dá para
                // aceitar duas vezes); enquanto aceita, evita o duplo clique.
                disabled={!stillPending || acceptingThis}
                className="h-9 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-default disabled:opacity-60"
              >
                {notification.ctaLabel || messages.accept}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNavigate}
                className="h-9 rounded-full bg-surface-2 px-4 text-sm font-bold text-text-strong transition hover:bg-primary-soft"
              >
                {notification.ctaLabel}
              </button>
            )}
          </div>
        )}

        <p className="mt-1.5 text-[13px] text-text-date">{notification.timeLabel}</p>
      </div>

      {!notification.read && (
        <div className="flex shrink-0 flex-col items-center gap-2 pt-1.5">
          <Signal signal={{ kind: "new" }} />

          <button
            type="button"
            onClick={markAsRead}
            aria-label={messages.markRead}
            title={messages.markRead}
            className="grid h-11 w-11 place-items-center rounded-full text-text-date transition hover:bg-surface-2 hover:text-text-strong"
          >
            <Check aria-hidden className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
