// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { NotificationData } from "../../types/domain/notifications/notification-data.js";

import { NotificationItem } from "./notification-item.js";

const notification: NotificationData = {
  id: "n1",
  kind: "NEW_COMMENT",
  actorId: "u1",
  actorName: "Ana Lima",
  actorAvatar: null,
  actorHref: "/perfil/ana",
  title: "Novo comentário",
  body: "Ana Lima comentou no seu post.",
  timeLabel: "há 5 minutos",
  read: false,
  href: "/post/p1",
  ctaLabel: "Ver",
};

function render(data: NotificationData) {
  return renderToString(
    <NotificationItem
      notification={data}
      onMarkAsRead={() => {}}
      onAcceptConnection={() => {}}
      onOpen={() => {}}
    />,
  );
}

describe("NotificationItem: prévia do post", () => {
  it("mostra a prévia abaixo do texto quando ela existe", () => {
    const html = render({ ...notification, preview: "Hoje aprendi query factories" });

    expect(html).toContain("Hoje aprendi query factories");
    expect(html.indexOf("comentou no seu post")).toBeLessThan(
      html.indexOf("Hoje aprendi query factories"),
    );
  });

  it("sem prévia (ausente, nula ou vazia) a linha não ganha o bloco", () => {
    const sem = render(notification);

    expect(render({ ...notification, preview: null })).toBe(sem);
    expect(render({ ...notification, preview: "" })).toBe(sem);
    expect(sem).not.toContain("line-clamp-2");
  });
});

describe("NotificationItem: repost do post", () => {
  it("usa o ícone próprio de repost em vez do genérico de conexão", () => {
    const html = render({ ...notification, kind: "POST_REPOSTED" });

    // O item usa o círculo de iniciais com as cores da meta: repost usa growth (Repeat), não o
    // fallback de conexão (primary-soft).
    expect(html).toContain("bg-growth/15 text-growth");
    expect(html).not.toContain("bg-primary-soft text-primary");
  });
});
