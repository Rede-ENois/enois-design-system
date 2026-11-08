import { Bookmark, Calendar, Compass, Home, MessageCircle } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { NavigationLinks } from "./navigation-links.js";

const html = (collapsed = false) =>
  renderToStaticMarkup(
    <NavigationLinks
      collapsed={collapsed}
      items={[
        { href: "/feed", label: "Início", icon: Home, active: true },
        {
          href: "/mensagens",
          label: "Mensagens",
          icon: MessageCircle,
          active: false,
          signal: { kind: "messages", count: 3 },
        },
        { href: "/salvos", label: "Salvos", icon: Bookmark, active: false },
        {
          href: "/comunidades",
          label: "Comunidades",
          icon: Compass,
          active: false,
          section: "community",
          signal: { kind: "new" },
        },
        {
          href: "/eventos",
          label: "Eventos",
          icon: Calendar,
          active: false,
          section: "community",
          signal: { kind: "today" },
        },
      ]}
      myCommunities={[
        { id: "c1", name: "Bancos de Dados", href: "/c/1", color: "#0f766e", hasNews: true },
      ]}
      favoriteCommunities={[]}
    />,
  );

describe("NavigationLinks", () => {
  it("groups entries under their section heading", () => {
    const markup = html();

    expect(markup).toContain(">Comunidade<");
    expect(markup.indexOf("Salvos")).toBeLessThan(markup.indexOf(">Comunidade<"));
    expect(markup.indexOf(">Comunidade<")).toBeLessThan(markup.indexOf("Eventos"));
  });

  it("shows each entry's signal and leaves entries without news quiet", () => {
    const markup = html();

    expect(markup).toContain("3 mensagens não lidas");
    expect(markup).toContain("Tem novidade");
    expect(markup).toContain(">hoje<");
    expect(markup.match(/aria-label="Tem novidade"/g)).toHaveLength(2);
  });

  it("marks the current page and draws communities as colored tables", () => {
    const markup = html();

    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain("rounded-[34%]");
    expect(markup).toContain(">BD<");
  });

  it("draws community avatar image previews when available and falls back to initials", () => {
    const markup = renderToStaticMarkup(
      <NavigationLinks
        items={[]}
        myCommunities={[
          {
            id: "c1",
            name: "Nós axolotes",
            href: "/c/1",
            avatar: "https://example.com/axolote.png",
          },
          { id: "c2", name: "Bancos de Dados", href: "/c/2" },
        ]}
        favoriteCommunities={[]}
      />,
    );

    expect(markup).toContain('src="https://example.com/axolote.png"');
    expect(markup).toContain(">BD<");
  });

  it("keeps the signal on the icon when the rail is collapsed", () => {
    const markup = html(true);

    expect(markup).toContain("3 mensagens não lidas");
    expect(markup).not.toContain("Suas comunidades");
  });
});
