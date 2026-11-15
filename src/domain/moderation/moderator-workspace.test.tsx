// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ModeratorWorkspaceProps } from "../../types/domain/moderation/moderator-workspace-props.js";
import { ModeratorWorkspace } from "../index.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;
let props: ModeratorWorkspaceProps;

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  props = {
    groups: [
      {
        id: "revisao",
        label: "Revisão",
        tabs: [
          { id: "reports", label: "Denúncias" },
          { id: "appeals", label: "Recursos" },
        ],
      },
      {
        id: "gestao",
        label: "Administração",
        tabs: [{ id: "monitoring", label: "Monitorabilidade" }],
      },
    ],
    activeTab: "reports",
    onTabChange: vi.fn(),
    children: <h1>Conteúdo fictício da área ativa</h1>,
  };
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

function render(overrides: Partial<ModeratorWorkspaceProps> = {}) {
  props = { ...props, ...overrides };
  act(() => root.render(<ModeratorWorkspace {...props} />));
}

function search(value: string) {
  const input = host.querySelector("input");
  if (!input) throw new Error("Busca de áreas ausente");
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe("ModeratorWorkspace", () => {
  it("expõe navegação agrupada, seleção rotulada com optgroup e conteúdo por slot", () => {
    render();
    expect(host.querySelector("nav")?.getAttribute("aria-label")).toBe("Áreas do painel");
    expect([...host.querySelectorAll("optgroup")].map((group) => group.label)).toEqual([
      "Revisão",
      "Administração",
    ]);
    const select = host.querySelector("select");
    expect(host.querySelector(`label[for="${select?.id}"]`)?.textContent).toBe("Ir para uma área");
    expect(host.querySelector('[aria-current="page"]')?.textContent).toBe("Denúncias");
    expect(host.querySelector("h1")?.textContent).toBe("Conteúdo fictício da área ativa");
    expect(host.querySelector('[role="tablist"]')).toBeNull();
  });

  it("envia mudança por botão sem assumir o estado controlado", () => {
    render();
    const button = [...host.querySelectorAll("button")].find(
      (item) => item.textContent === "Recursos",
    );
    act(() => button?.click());
    expect(props.onTabChange).toHaveBeenCalledExactlyOnceWith("appeals");
    expect(host.querySelector('[aria-current="page"]')?.textContent).toBe("Denúncias");
    render({ activeTab: "appeals" });
    expect(host.querySelector('[aria-current="page"]')?.textContent).toBe("Recursos");
  });

  it("envia mudança pelo seletor móvel e rejeita destinos inválidos", () => {
    render();
    const select = host.querySelector("select");
    if (!select) throw new Error("Seletor ausente");
    act(() => {
      select.value = "monitoring";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(props.onTabChange).toHaveBeenCalledExactlyOnceWith("monitoring");
    act(() => {
      select.value = "destino-inexistente";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(props.onTabChange).toHaveBeenCalledOnce();
  });

  it("busca nomes de área e grupo e limpa um resultado vazio sem ocultar conteúdo", () => {
    render();
    search("ADMINISTRAÇÃO");
    expect(host.querySelectorAll("optgroup")).toHaveLength(1);
    expect(host.querySelector('[role="status"]')?.textContent).toContain("1 área(s)");
    search("área inexistente");
    expect(host.querySelector('[role="status"]')?.textContent).toBe("Nenhuma área encontrada.");
    expect(host.querySelector("h1")).not.toBeNull();
    const clear = [...host.querySelectorAll("button")].find(
      (item) => item.textContent === "Limpar busca",
    );
    act(() => clear?.click());
    expect(host.querySelectorAll("optgroup")).toHaveLength(2);
  });

  it("continua navegável ao buscar outro destino e limpa a busca após a mudança", () => {
    render();
    search("Recursos");
    const select = host.querySelector("select");
    expect(select?.value).toBe("");
    act(() => {
      if (select) {
        select.value = "appeals";
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    expect(props.onTabChange).toHaveBeenCalledExactlyOnceWith("appeals");
    expect(host.querySelector("input")?.value).toBe("");
  });

  it("trata lista de grupos vazia sem perder o conteúdo", () => {
    render({ groups: [] });
    expect(host.querySelector('[role="status"]')?.textContent).toBe("Nenhuma área encontrada.");
    expect(host.querySelector("h1")).not.toBeNull();
  });
});
