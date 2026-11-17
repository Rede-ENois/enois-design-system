// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";

import { ComposerDraftStatus } from "./composer-draft-status.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("ComposerDraftStatus", () => {
  it("sem rascunho salvo não desenha nada", () => {
    const container = document.createElement("div");
    act(() => createRoot(container).render(<ComposerDraftStatus />));

    expect(container.innerHTML).toBe("");
  });

  it("mostra a hora da última salva em pt-BR", () => {
    const container = document.createElement("div");
    const quando = new Date(2026, 0, 15, 14, 7);
    act(() => createRoot(container).render(<ComposerDraftStatus salvoEm={quando.toISOString()} />));

    const horaEsperada = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(quando);
    expect(container.textContent).toBe(`Rascunho salvo às ${horaEsperada}`);
    expect(container.querySelector("[aria-live='polite']")).not.toBeNull();
  });

  it("data inválida também não desenha nada", () => {
    const container = document.createElement("div");
    act(() => createRoot(container).render(<ComposerDraftStatus salvoEm="not-a-date" />));

    expect(container.innerHTML).toBe("");
  });

  it("descartar só existe com manipulador e repassa o clique", () => {
    const container = document.createElement("div");
    const onDescartar = vi.fn();
    act(() =>
      createRoot(container).render(
        <ComposerDraftStatus salvoEm={new Date().toISOString()} onDescartar={onDescartar} />,
      ),
    );

    const botao = container.querySelector("button")!;
    expect(botao.textContent).toBe("Descartar rascunho");
    act(() => {
      botao.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onDescartar).toHaveBeenCalledTimes(1);
  });

  it("sem manipulador de descarte, só o aviso aparece", () => {
    const container = document.createElement("div");
    act(() =>
      createRoot(container).render(<ComposerDraftStatus salvoEm={new Date().toISOString()} />),
    );

    expect(container.querySelector("button")).toBeNull();
    expect(container.textContent).toContain("Rascunho salvo");
  });
});
