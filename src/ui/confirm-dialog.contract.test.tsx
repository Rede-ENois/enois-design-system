// @vitest-environment jsdom
import { type ComponentProps, act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ConfirmDialog } from "./index.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("ConfirmDialog pelo entrypoint público", () => {
  let host: HTMLDivElement;
  let root: Root;
  const onConfirm = vi.fn();
  const onOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host.appendChild(document.createElement("div")));
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
  });

  async function render(props: Partial<ComponentProps<typeof ConfirmDialog>> = {}) {
    await act(async () => {
      root.render(
        <ConfirmDialog
          open
          title="Confirmar alteração fictícia?"
          description="Revise os dados antes de continuar."
          confirmLabel="Confirmar"
          onConfirm={onConfirm}
          onOpenChange={onOpenChange}
          {...props}
        />,
      );
    });
  }

  function button(label: string) {
    const element = [...document.querySelectorAll<HTMLButtonElement>("[role=dialog] button")].find(
      (candidate) => candidate.textContent === label,
    );
    if (!element) throw new Error(`Botão não encontrado: ${label}`);
    return element;
  }

  it("aceita omitir opcionais e distingue confirmar de cancelar sem fechar sozinho", async () => {
    await render();
    expect(button("Confirmar").disabled).toBe(false);
    expect(document.querySelector("[role=alert]")).toBeNull();
    await act(async () => button("Confirmar").click());
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(document.querySelector("[role=dialog]")).not.toBeNull();
    await act(async () => button("Cancelar").click());
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("respeita rótulos fornecidos sem exigir as novas props", async () => {
    await render({ confirmLabel: "Aplicar", cancelLabel: "Voltar" });
    await act(async () => button("Voltar").click());
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(button("Aplicar").disabled).toBe(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it.each([
    { pending: false, disabled: true, label: "Confirmar", estado: "apenas disabled" },
    { pending: true, disabled: false, label: "Enviando...", estado: "apenas pending" },
    { pending: true, disabled: true, label: "Enviando...", estado: "pending e disabled" },
  ])(
    "bloqueia confirmação em $estado, mantendo o cancelamento",
    async ({ label, pending, disabled }) => {
      await render({ pending, disabled });
      expect(button(label).disabled).toBe(true);
      await act(async () => button(label).click());
      expect(onConfirm).not.toHaveBeenCalled();
      expect(button("Cancelar").disabled).toBe(false);
      await act(async () => button("Cancelar").click());
      expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    },
  );

  it("anuncia somente erro presente e permite recuperação controlada sem erro residual", async () => {
    await render({ error: "Não foi possível salvar o exemplo fictício." });
    expect(document.querySelector("[role=alert]")?.textContent).toBe(
      "Não foi possível salvar o exemplo fictício.",
    );
    expect(button("Confirmar").disabled).toBe(false);
    await act(async () => button("Confirmar").click());
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await render({ pending: true });
    expect(document.querySelector("[role=alert]")).toBeNull();
    await render({ error: "" });
    expect(document.querySelector("[role=alert]")).toBeNull();
    await act(async () => button("Confirmar").click());
    expect(onConfirm).toHaveBeenCalledTimes(2);
  });

  it("encaminha evento cancelável de fechamento e preserva o foco escolhido pelo consumidor", async () => {
    const destination = document.createElement("button");
    destination.textContent = "Destino de foco fictício";
    host.appendChild(destination);
    const onCloseAutoFocus = vi.fn((event: Event) => {
      event.preventDefault();
      destination.focus();
    });
    await render({ onCloseAutoFocus });
    await act(async () => button("Cancelar").click());
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    await render({ open: false, onCloseAutoFocus });
    await vi.waitFor(() => expect(onCloseAutoFocus).toHaveBeenCalledTimes(1));
    const event = onCloseAutoFocus.mock.calls[0][0];
    expect(event).toBeInstanceOf(Event);
    expect(event.cancelable).toBe(true);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(destination);
  });

  it("mantém descrição longa associada ao diálogo com quebra de palavras", async () => {
    const description = `Identificador fictício: ${"exemplo".repeat(80)}`;
    await render({ description });
    const dialog = document.querySelector("[role=dialog]");
    const id = dialog?.getAttribute("aria-describedby");
    const element = id ? document.getElementById(id) : null;
    expect(element?.textContent).toBe(description);
    // jsdom comprova a classe; overflow e geometria exigem a prova no navegador.
    expect(element?.classList.contains("break-words")).toBe(true);
  });
});
