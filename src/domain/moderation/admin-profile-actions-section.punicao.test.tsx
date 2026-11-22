// @vitest-environment jsdom
import { act, createElement } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { AdminProfileActionsSectionProps } from "../../types/domain/moderation/admin-profile-actions-section-props.js";

import { AdminProfileActionsSection } from "./admin-profile-actions-section.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const props: AdminProfileActionsSectionProps = {
  profile: { username: "alvo", displayName: "Alvo Teste", activeWarnings: 0 },
  history: [],
  onWarn: async () => true,
  onSanction: async () => true,
  onRevokeWarning: async () => true,
};

function render(overrides: Partial<AdminProfileActionsSectionProps> = {}) {
  act(() => root.render(createElement(AdminProfileActionsSection, { ...props, ...overrides })));
}

function preencherMotivo(motivo: string) {
  const campo = container.querySelector<HTMLInputElement>("input");
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    setter?.call(campo, motivo);
    campo?.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

function escrevente(texto: string) {
  return [...document.body.querySelectorAll<HTMLElement>("button")].find(
    (botao) => botao.textContent?.trim() === texto,
  );
}

async function confirmar(textoDoBotao: string) {
  await act(async () => {
    escrevente(textoDoBotao)?.click();
  });
  return abrirDialogo();
}

function dialogoAberto() {
  return document.body.querySelector("[role='dialog']");
}

async function abrirDialogo() {
  const dialogo = dialogoAberto();
  const confirmarNoDialogo = [...(dialogo?.querySelectorAll<HTMLElement>("button") ?? [])].find(
    (botao) => botao.textContent?.trim() === "Confirmar",
  );
  await act(async () => {
    confirmarNoDialogo?.click();
  });
}

describe("AdminProfileActionsSection — uma punição por vez", () => {
  it("escolhe o tipo de punição antes de confirmar, com uma opção marcada", async () => {
    const onSanction = vi.fn(async () => true);
    render({ onSanction });
    preencherMotivo("Golpe contra membros da comunidade");

    expect(container.textContent).toContain("Tipo de punição");
    const opcoes = [...container.querySelectorAll<HTMLElement>("[aria-pressed]")].filter((opcao) =>
      ["Suspender por 7 dias", "Suspender por 30 dias", "Banir permanentemente"].includes(
        opcao.textContent?.trim() ?? "",
      ),
    );
    expect(opcoes).toHaveLength(3);
    expect(opcoes.filter((opcao) => opcao.getAttribute("aria-pressed") === "true")).toHaveLength(1);
    expect(opcoes[0].getAttribute("aria-pressed")).toBe("true");

    await confirmar("Aplicar punição");

    expect(onSanction).toHaveBeenCalledTimes(1);
    expect(onSanction).toHaveBeenCalledWith(
      { type: "BAN", days: 7 },
      "Golpe contra membros da comunidade",
    );
  });

  it("a opção escolhida é a que o diálogo confirma", async () => {
    const onSanction = vi.fn(async () => true);
    render({ onSanction });
    preencherMotivo("Conteúdo sexual em publicação");

    const permanente = [...container.querySelectorAll<HTMLElement>("[aria-pressed]")].find(
      (opcao) => opcao.textContent?.trim() === "Banir permanentemente",
    );
    await act(async () => {
      permanente?.click();
    });
    await act(async () => {
      escrevente("Aplicar punição")?.click();
    });
    expect(dialogoAberto()?.textContent).toContain("PERMANENTEMENTE");

    await confirmar("Aplicar punição");

    expect(onSanction).toHaveBeenCalledWith({ type: "PERMABAN" }, "Conteúdo sexual em publicação");
  });

  it("mostra a falha da punição em vez de fechar em silêncio", async () => {
    const onSanction = vi.fn(async () => false);
    render({ onSanction });
    preencherMotivo("Golpe contra membros da comunidade");

    await confirmar("Aplicar punição");

    expect(
      [...container.querySelectorAll("[role='alert']")].map((alerta) => alerta.textContent),
    ).toContain("Não foi possível registrar a decisão.");
  });

  it("anuncia o motivo curto e some quando o motivo alcança o mínimo", () => {
    render();
    preencherMotivo("curto");

    const aviso = [...container.querySelectorAll<HTMLElement>("[role='alert']")].find((elemento) =>
      elemento.textContent?.includes("pelo menos 10 caracteres"),
    );
    expect(aviso).toBeTruthy();

    preencherMotivo("motivo com dez ou mais letras");

    expect(
      [...container.querySelectorAll<HTMLElement>("[role='alert']")].some((elemento) =>
        elemento.textContent?.includes("pelo menos 10 caracteres"),
      ),
    ).toBe(false);
  });
});
