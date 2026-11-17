// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import type { NotificationData } from "../../types/domain/notifications/notification-data.js";
import type { NotificationsPopoverProps } from "../../types/domain/notifications/notifications-popover-props.js";

import { NotificationsPopover } from "./notifications-popover.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

function render(props: Partial<NotificationsPopoverProps> = {}) {
  act(() =>
    root.render(
      <NotificationsPopover
        open
        onOpenChange={() => {}}
        notifications={[]}
        requests={[]}
        requestsLoading={false}
        acceptingActorId={null}
        rejectingActorId={null}
        markAllPending={false}
        onMarkAllRead={() => {}}
        onMarkAsRead={() => {}}
        onAcceptConnection={() => {}}
        onRejectConnection={() => {}}
        onOpenNotification={() => {}}
        {...props}
      />,
    ),
  );
}

const preferencesLink = () =>
  document.body.querySelector<HTMLAnchorElement>('a[aria-label="Preferências de notificação"]');

describe("NotificationsPopover: preferences link", () => {
  it("links to the preferences page when preferencesHref is set", () => {
    render({ preferencesHref: "/configuracoes/notificacoes" });

    expect(preferencesLink()?.getAttribute("href")).toBe("/configuracoes/notificacoes");
  });

  it("renders no link without preferencesHref", () => {
    render();

    expect(document.body.textContent).toContain("Avisos");
    expect(preferencesLink()).toBeNull();
  });
});

describe("NotificationsPopover: all notices link", () => {
  it("links to the full page when allHref is set", () => {
    render({ allHref: "/notificacoes" });

    const link = document.body.querySelector('a[href="/notificacoes"]');
    expect(link?.textContent).toBe("Ver todos os avisos");
  });
});

function notification(id: string, read: boolean): NotificationData {
  return {
    id,
    kind: "POST_LIKE",
    read,
    actorId: null,
    actorName: null,
    actorAvatar: null,
    actorHref: null,
    title: `aviso ${id}`,
    body: "",
    timeLabel: "agora",
    dayLabel: "Hoje",
    href: "/feed",
    ctaLabel: "Abrir",
  };
}

const bell = () => document.body.querySelector<HTMLButtonElement>("button[aria-label*='não lido']");

describe("NotificationsPopover: unread count", () => {
  it("counts the rows in hand when no server total is given (old behavior)", () => {
    render({
      notifications: [notification("a", false), notification("b", false), notification("c", true)],
    });

    expect(bell()?.getAttribute("aria-label")).toBe("2 avisos não lidos");
  });

  it("uses the server total when unreadCount is set (rows may be a partial page)", () => {
    render({
      notifications: [notification("a", false), notification("b", false)],
      unreadCount: 12,
    });

    expect(bell()?.getAttribute("aria-label")).toBe("12 avisos não lidos");
  });

  it("shows no count when the server total is zero", () => {
    render({ notifications: [], unreadCount: 0 });

    expect(bell()).toBeNull();
  });
});
