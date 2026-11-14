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
  it("identifies a new community project instead of using the connection fallback", () => {
    const html = render({
      ...notification,
      kind: "NEW_COMMUNITY_PROJECT",
      actorId: null,
      actorName: null,
      actorHref: null,
      title: "Novo projeto da comunidade",
      body: "Pessoa fictícia publicou um projeto de exemplo.",
      href: "/projetos/pessoa-ficticia/projeto-exemplo",
      ctaLabel: "Ver projeto",
    });

    expect(html).toContain("lucide-folder-kanban");
    expect(html).toContain("Novo projeto da comunidade");
    expect(html).toContain("Ver projeto");
  });

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
