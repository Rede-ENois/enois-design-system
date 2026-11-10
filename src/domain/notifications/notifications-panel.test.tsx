import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NotificationData } from "../../types/domain/notifications/notification-data.js";

import { NotificationsPanel } from "./notifications-panel.js";

const base: NotificationData = {
  id: "n1",
  kind: "NEW_REACTION",
  actorId: "u1",
  actorName: "Ana",
  actorAvatar: null,
  actorHref: "/perfil/ana",
  title: "Curtiu seu post",
  body: "",
  timeLabel: "há 2 min",
  read: false,
  href: "/post/1",
  ctaLabel: "",
};

const panel = (notifications: NotificationData[], extra = {}) =>
  renderToStaticMarkup(
    <NotificationsPanel
      variant="page"
      notifications={notifications}
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
      {...extra}
    />,
  );

describe("NotificationsPanel (page)", () => {
  it("groups unread notices by day", () => {
    const markup = panel([
      { ...base, id: "a", dayLabel: "Hoje" },
      { ...base, id: "b", dayLabel: "Hoje" },
      { ...base, id: "c", dayLabel: "Ontem" },
    ]);

    expect(markup.match(/>Hoje</g)).toHaveLength(1);
    expect(markup.indexOf(">Hoje<")).toBeLessThan(markup.indexOf(">Ontem<"));
  });

  it("draws the source by contour: community table and event ticket", () => {
    const markup = panel([
      {
        ...base,
        id: "g",
        actorId: null,
        actorName: null,
        actorHref: null,
        place: { name: "Bancos de Dados", color: "#0f766e" },
      },
      { ...base, id: "e", actorName: null, actorHref: null, eventDay: "03" },
    ]);

    expect(markup).toContain("rounded-[34%]");
    expect(markup).toContain(">BD<");
    expect(markup).toContain(">03<");
  });

  it("offers more pages only when there are more", () => {
    expect(panel([base], { hasMore: true, onLoadMore: () => {} })).toContain("Carregar mais");
    expect(panel([base])).not.toContain("Carregar mais");
  });

  it("hides the load-more footer when the active tab has no rows", () => {
    // Histórico inteiro tem mais páginas, mas a aba ativa ("Novas") está vazia:
    // antes o rodapé aparecia sob "Nenhuma notificação nova." sem carregar nada visível.
    const allRead = [{ ...base, read: true }];
    const markup = panel(allRead, { hasMore: true, onLoadMore: () => {} });

    expect(markup).toContain("Nenhuma notificação nova.");
    expect(markup).not.toContain("Carregar mais");
  });
});
