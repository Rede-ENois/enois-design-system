// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ConfirmDialog } from "./confirm-dialog.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

function abrir(props: Partial<Parameters<typeof ConfirmDialog>[0]> = {}) {
  const onConfirm = vi.fn();
  const onOpenChange = vi.fn();
  act(() =>
    root.render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Excluir post"
        description="Esta acao nao pode ser desfeita."
        confirmLabel="Excluir"
        onConfirm={onConfirm}
        {...props}
      />,
    ),
  );
  const botoes = [...container.ownerDocument.body.querySelectorAll("button")];
  const confirmar = botoes.find((botao) => botao.textContent?.trim() === "Excluir");
  return { onConfirm, onOpenChange, confirmar };
}

describe("ConfirmDialog", () => {
  it("sem as novas props, segue igual: confirma e fecha pelo consumidor", () => {
    const { onConfirm, onOpenChange, confirmar } = abrir();

    expect(confirmar?.disabled).toBe(false);
    act(() => confirmar?.click());

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("disabled bloqueia o confirmar sem mexer no cancelar", () => {
    const { onConfirm, onOpenChange } = abrir({ disabled: true });

    const botoes = [...container.ownerDocument.body.querySelectorAll("button")];
    const confirmar = botoes.find((botao) => botao.textContent?.trim() === "Excluir");
    const cancelar = botoes.find(
      (botao) => botao.textContent?.trim() !== "Excluir" && botao.textContent?.trim(),
    );

    expect(confirmar?.disabled).toBe(true);
    if (cancelar) act(() => cancelar.click());
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("pending e disabled juntos bloqueiam o confirmar", () => {
    abrir({ pending: true, disabled: true });

    const confirmar = [...container.ownerDocument.body.querySelectorAll("button")].find(
      (botao) => botao.textContent?.trim() === "Enviando...",
    );
    expect(confirmar?.disabled).toBe(true);
  });

  it("o erro e anunciado como alerta e some quando a prop muda", () => {
    abrir({ error: "A conexao caiu. Tente de novo." });

    const alerta = container.ownerDocument.body.querySelector('[role="alert"]');
    expect(alerta?.textContent).toBe("A conexao caiu. Tente de novo.");

    abrir({ error: undefined });
    expect(container.ownerDocument.body.querySelector('[role="alert"]')).toBeNull();
  });

  it("o callback cancelavel de foco chega ao dialogo real", async () => {
    const onCloseAutoFocus = vi.fn((evento: Event) => evento.preventDefault());
    const fechar = () =>
      act(() =>
        root.render(
          <ConfirmDialog
            open={false}
            onOpenChange={() => {}}
            title="Excluir post"
            description="Esta acao nao pode ser desfeita."
            confirmLabel="Excluir"
            onConfirm={() => {}}
            onCloseAutoFocus={onCloseAutoFocus}
          />,
        ),
      );

    abrir({ onCloseAutoFocus });
    expect(container.ownerDocument.body.querySelector('[role="dialog"]')).not.toBeNull();

    fechar();
    // O Radix entrega o evento de foco no desmonte seguinte, fora do commit do React.
    await act(async () => {
      await new Promise((resolver) => setTimeout(resolver, 10));
    });

    expect(onCloseAutoFocus).toHaveBeenCalled();
    expect(onCloseAutoFocus.mock.calls[0]?.[0].defaultPrevented).toBe(true);
  });

  it("descricao longa quebra dentro do dialogo", () => {
    abrir({ error: "x".repeat(400) });

    const alerta = container.ownerDocument.body.querySelector('[role="alert"]');
    expect(alerta?.className.split(/\s+/)).toContain("break-words");
  });
});
