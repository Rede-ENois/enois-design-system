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

  it("o motivo curto só é anunciado ao tentar confirmar, não a cada tecla", async () => {
    const onSanction = vi.fn(async () => true);
    render({ onSanction });

    const alertaCurto = () =>
      [...container.querySelectorAll<HTMLElement>("[role='alert']")].find((elemento) =>
        elemento.textContent?.includes("pelo menos 10 caracteres"),
      );

    // Digitando (9 letras): nada é anunciado — o alerta é do envio, não da tecla.
    preencherMotivo("curto");
    expect(alertaCurto()).toBeFalsy();
    preencherMotivo("123456789");
    expect(alertaCurto()).toBeFalsy();

    // Tenta confirmar com o motivo curto: o alerta aparece, e a punição não é enviada.
    await confirmar("Aplicar punição");
    expect(alertaCurto()).toBeTruthy();
    expect(onSanction).not.toHaveBeenCalled();

    // Com 10 letras, o envio passa e o alerta já não aparece.
    preencherMotivo("1234567890");
    await confirmar("Aplicar punição");
    expect(onSanction).toHaveBeenCalledTimes(1);
    expect(alertaCurto()).toBeFalsy();
  });

  it("a falha da revogação aparece como alerta próprio, sem somar o da punição", async () => {
    const onRevokeWarning = vi.fn(async () => false);
    render({
      onRevokeWarning,
      history: [
        {
          id: "w1",
          kind: "WARNING",
          typeLabel: "Advertência",
          active: true,
          reason: "Primeiro aviso",
          createdAtLabel: "01/11/2026",
        },
      ],
    });

    await act(async () => {
      escrevente("Revogar advertência")?.click();
    });
    const campoRevogacao = container.querySelectorAll<HTMLInputElement>("input")[1];
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(campoRevogacao, "Motivo justo da revisão");
      campoRevogacao?.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await act(async () => {
      escrevente("Revogar")?.click();
    });

    const alertas = [...container.querySelectorAll("[role='alert']")].map((a) => a.textContent);
    expect(alertas).toContain("Não foi possível revogar a advertência.");
    expect(alertas).not.toContain("Não foi possível registrar a decisão.");
  });
});
