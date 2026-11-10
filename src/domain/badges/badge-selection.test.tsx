// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import type { BadgeKit } from "../../types/domain/badges/badge-kit.js";

import { BadgeSelection } from "./badge-selection.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const kit = (id: string, badges: string[]): BadgeKit => ({
  id,
  badges,
  createdAtLabel: "05/11/2026",
});

const render = (props: {
  badges?: string[];
  badgeKits?: BadgeKit[];
  kitsLoading?: boolean;
  onApplyBadgeKit?: (kit: BadgeKit) => void;
}) =>
  act(() =>
    root.render(
      <BadgeSelection
        badges={props.badges ?? ["/a.png"]}
        onAddBadge={() => undefined}
        onRemoveBadge={() => undefined}
        badgeKits={props.badgeKits ?? []}
        onApplyBadgeKit={props.onApplyBadgeKit ?? (() => undefined)}
        kitsLoading={props.kitsLoading}
      />,
    ),
  );

const openHistory = async () => {
  const trigger = Array.from(document.body.querySelectorAll<HTMLElement>('[role="tab"]')).find(
    (tab) => tab.textContent?.includes("Histórico"),
  );
  // O Radix troca a aba no mousedown do gatilho, não no click.
  await act(async () => {
    trigger?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }));
  });
};

describe("BadgeSelection", () => {
  it("aceita gif para o emblema ficar animado, junto de png, jpeg e webp", async () => {
    await render({});
    const input = document.body.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input?.accept).toBe("image/png,image/jpeg,image/webp,image/gif");
  });

  it("mostra quantos dos 5 emblemas estão em uso", async () => {
    await render({ badges: ["/a.png", "/b.png"] });
    expect(document.body.textContent).toContain("2 de 5 em uso");
  });

  it("não oferece adicionar além de cinco e diz por quê", async () => {
    await render({ badges: ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png"] });
    expect(document.body.textContent).toContain("5 de 5 em uso");
    expect(document.body.textContent).toContain("Remova um para adicionar outro.");
    expect(document.body.querySelector('[aria-label="Adicionar emblema"]')).toBeNull();
  });

  it("lista os kits salvos com a data e aplica o escolhido", async () => {
    const applied: BadgeKit[] = [];
    await render({
      badgeKits: [kit("bkit_1", ["/x.png", "/y.png"]), kit("bkit_2", ["/z.png"])],
      onApplyBadgeKit: (selected) => applied.push(selected),
    });
    await openHistory();

    expect(document.body.textContent).toContain("05/11/2026");
    expect(document.body.querySelectorAll("li")).toHaveLength(2);

    const apply = Array.from(document.body.querySelectorAll<HTMLButtonElement>("button")).find(
      (button) => button.textContent?.includes("Usar este kit"),
    );
    await act(async () => apply?.click());

    expect(applied).toHaveLength(1);
    expect(applied[0].id).toBe("bkit_1");
  });

  it("explica o histórico vazio e não inventa kits", async () => {
    await render({ badgeKits: [] });
    await openHistory();
    expect(document.body.textContent).toContain("Trocar seus emblemas guarda");
    expect(document.body.querySelectorAll("li")).toHaveLength(0);
  });

  it("avisa que o histórico está carregando em vez de dizer que está vazio", async () => {
    await render({ badgeKits: [], kitsLoading: true });
    await openHistory();
    expect(document.body.textContent).toContain("Carregando...");
    expect(document.body.textContent).not.toContain("Trocar seus emblemas guarda");
  });
});
