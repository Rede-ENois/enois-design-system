// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EnoisProvider } from "../../messages/enois-provider.js";
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
  act(() =>
    root.render(
      <EnoisProvider>
        <ModeratorWorkspace {...props} />
      </EnoisProvider>,
    ),
  );
}

function search(value: string) {
  const input = host.querySelector("input");
  if (!input) throw new Error("Busca de áreas ausente");
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

function botao(rotulo: string) {
  return [...host.querySelectorAll("button")].find((item) => item.textContent === rotulo);
}

function seletorMovel() {
  const select = host.querySelector("select");
  if (!select) throw new Error("Seletor móvel ausente");
  return select;
}

function escolherNoSeletor(valor: string) {
  const select = seletorMovel();
  act(() => {
    select.value = valor;
    select.dispatchEvent(new Event("change", { bubbles: true }));
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
    const select = seletorMovel();
    expect(host.querySelector(`label[for="${select.id}"]`)?.textContent).toBe("Ir para uma área");
    expect(host.querySelector('[aria-current="page"]')?.textContent).toBe("Denúncias");
    expect(host.querySelector("h1")?.textContent).toBe("Conteúdo fictício da área ativa");
    expect(host.querySelector('[role="tablist"]')).toBeNull();
  });

  it("envia mudança por botão sem assumir o estado controlado", () => {
    render();
    act(() => botao("Recursos")?.click());
    expect(props.onTabChange).toHaveBeenCalledExactlyOnceWith("appeals");
    expect(host.querySelector('[aria-current="page"]')?.textContent).toBe("Denúncias");
    render({ activeTab: "appeals" });
    expect(host.querySelector('[aria-current="page"]')?.textContent).toBe("Recursos");
  });

  it("envia mudança pelo seletor móvel e rejeita destino fora da lista", () => {
    render();
    escolherNoSeletor("monitoring");
    expect(props.onTabChange).toHaveBeenCalledExactlyOnceWith("monitoring");
    escolherNoSeletor("destino-inexistente");
    expect(props.onTabChange).toHaveBeenCalledOnce();
  });

  it("busca nomes de área e de grupo sem distinguir maiúsculas", () => {
    render();
    search("ADMINISTRAÇÃO");
    expect([...host.querySelectorAll("optgroup")].map((group) => group.label)).toEqual([
      "Administração",
    ]);
    search("recursos");
    expect([...host.querySelectorAll("option")].map((option) => option.textContent)).toContain(
      "Recursos",
    );
    expect(host.querySelector('[role="status"]')?.textContent).toBe("1 área encontrada");
    search("  Monitorabilidade  ");
    expect(host.querySelector('[role="status"]')?.textContent).toBe("1 área encontrada");
  });

  it("pesquisa por área mesmo estando em outra área ativa", () => {
    render({ activeTab: "monitoring" });
    search("recurso");
    expect(
      [...host.querySelectorAll("option")].filter((option) => option.value === "appeals"),
    ).toHaveLength(1);
  });

  it("anuncia a ausência de resultados e mantém a área ativa na tela", () => {
    render();
    search("área inexistente");
    expect(host.querySelector('[role="status"]')?.textContent).toBe("Nenhuma área encontrada.");
    expect(host.querySelector("h1")?.textContent).toBe("Conteúdo fictício da área ativa");
    expect(seletorMovel().value).toBe("");
    act(() => botao("Limpar busca")?.click());
    expect(host.querySelectorAll("optgroup")).toHaveLength(2);
    expect(host.querySelector('[role="status"]')).toBeNull();
    expect((host.querySelector("input") as HTMLInputElement).value).toBe("");
  });

  it("preserva a área ativa na busca e limpa o texto ao navegar", () => {
    render({ activeTab: "appeals" });
    search("Recursos");
    expect(seletorMovel().value).toBe("appeals");
    expect(host.querySelector('[aria-current="page"]')?.textContent).toBe("Recursos");
    act(() => botao("Recursos")?.click());
    expect(props.onTabChange).toHaveBeenCalledExactlyOnceWith("appeals");
    expect((host.querySelector("input") as HTMLInputElement).value).toBe("");
  });

  it("marca o destino fora do recorte da busca sem ocultar o conteúdo", () => {
    render({ activeTab: "monitoring" });
    search("Recursos");
    expect(seletorMovel().value).toBe("");
    expect(host.querySelector('[aria-current="page"]')).toBeNull();
    expect(host.querySelector("h1")).not.toBeNull();
  });

  it("navega a partir de um resultado da busca e deixa a busca limpa", () => {
    render();
    search("Monitorabilidade");
    escolherNoSeletor("monitoring");
    expect(props.onTabChange).toHaveBeenCalledExactlyOnceWith("monitoring");
    expect((host.querySelector("input") as HTMLInputElement).value).toBe("");
  });

  it("trata lista de grupos vazia sem perder o conteúdo", () => {
    render({ groups: [], activeTab: "reports" });
    expect(host.querySelectorAll("optgroup")).toHaveLength(0);
    expect(host.querySelector('[role="status"]')).toBeNull();
    expect(host.querySelector("h1")).not.toBeNull();
    expect(seletorMovel().value).toBe("");
  });

  it("trata grupo sem áreas sem inventar destino", () => {
    render({ groups: [{ id: "vazio", label: "Sem áreas", tabs: [] }] });
    expect(host.querySelectorAll("optgroup")).toHaveLength(0);
    expect(host.querySelector('[role="status"]')).toBeNull();
    expect(host.querySelector("h1")).not.toBeNull();
  });
});
