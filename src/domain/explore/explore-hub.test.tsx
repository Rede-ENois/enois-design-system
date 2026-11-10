// @vitest-environment jsdom
import { act } from "react";

import { Briefcase, Joystick, ShoppingBag } from "lucide-react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import { ExploreHub } from "./explore-hub.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const sections = [
  {
    id: "play",
    title: "Brincar",
    items: [
      {
        href: "/games",
        label: "Jogos",
        description: "Jogos indie da comunidade",
        icon: Joystick,
        color: "#7c5cf6",
        signal: { kind: "new" as const },
      },
    ],
  },
  {
    id: "build",
    title: "Construir",
    items: [
      {
        href: "/marketplace",
        label: "Loja",
        description: "Cosméticos com faíscas",
        icon: ShoppingBag,
        color: "#b45309",
        keywords: ["marketplace"],
      },
    ],
  },
  {
    id: "work",
    title: "Trabalho",
    items: [
      {
        href: "/vagas",
        label: "Vagas",
        description: "Oportunidades",
        icon: Briefcase,
        color: "#4338ca",
      },
    ],
  },
];

function type(value: string) {
  const input = container.querySelector("input")!;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
  act(() => {
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe("ExploreHub", () => {
  it("lists every room under its section, with its signal", () => {
    act(() => root.render(<ExploreHub sections={sections} />));

    expect(container.textContent).toContain("Brincar");
    expect(container.querySelector('a[href="/vagas"]')).not.toBeNull();
    expect(container.innerHTML).toContain("Tem novidade");
  });

  it("finds a room by keyword, ignoring accents and case", () => {
    act(() => root.render(<ExploreHub sections={sections} />));

    type("MARKETPLACE");
    expect(container.querySelector('a[href="/marketplace"]')).not.toBeNull();
    expect(container.querySelector('a[href="/games"]')).toBeNull();
    expect(container.textContent).not.toContain("Trabalho");

    type("cosmeticos");
    expect(container.querySelector('a[href="/marketplace"]')).not.toBeNull();
  });

  it("says so when nothing matches", () => {
    act(() => root.render(<ExploreHub sections={sections} />));

    type("xyz");
    expect(container.textContent).toContain("Nada com esse nome");
  });
});
