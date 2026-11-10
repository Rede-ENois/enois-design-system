import { Bell, Compass, Home, MessageCircle, Plus } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MobileDock } from "./mobile-dock.js";

const markup = renderToStaticMarkup(
  <MobileDock
    items={[
      { href: "/feed", label: "Início", icon: Home, active: true },
      {
        href: "/explorar",
        label: "Explorar",
        icon: Compass,
        active: false,
        signal: { kind: "new" },
      },
      {
        href: "/mensagens",
        label: "Mensagens",
        icon: MessageCircle,
        active: false,
        signal: { kind: "messages", count: 3 },
      },
      {
        href: "/notificacoes",
        label: "Avisos",
        icon: Bell,
        active: false,
        signal: { kind: "count", count: 5 },
      },
    ]}
    action={{ label: "Publicar", icon: Plus, onClick: () => {} }}
  />,
);

describe("MobileDock", () => {
  it("puts the main action between two destinations on each side", () => {
    const order = ["Início", "Explorar", 'aria-label="Publicar"', "Mensagens", "Avisos"].map(
      (text) => markup.indexOf(text),
    );

    expect(order.every((index) => index >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it("marks the current destination and shows each signal by shape", () => {
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain("3 mensagens não lidas");
    expect(markup).toContain("5 pendentes");
    expect(markup).toContain("Tem novidade");
  });

  it("leaves the desktop to the side rail", () => {
    expect(markup).toContain("lg:hidden");
  });
});
