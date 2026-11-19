// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { RepostDialogProps } from "../../types/domain/post/repost-dialog-props.js";

import { RepostDialog } from "./repost-dialog.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const comunidades = [
  { id: "comm_a", name: "Fotografia" },
  { id: "comm_b", name: "Ciclismo urbano" },
];

function props(overrides: Partial<RepostDialogProps> = {}): RepostDialogProps {
  return {
    postId: "post_1",
    open: true,
    onOpenChange: () => {},
    onRepost: () => {},
    communities: comunidades,
    onRepostToCommunity: () => {},
    ...overrides,
  };
}

// React lê o valor pelo rastreio nativo: sem o setter do protótipo, o onChange não dispara.
function dispararValor(el: HTMLSelectElement | HTMLTextAreaElement, value: string): void {
  const proto =
    el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLSelectElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

describe("RepostDialog", () => {
  let root: Root;
  let host: HTMLDivElement;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    // O Radix porta o diálogo para o body: limpa o que sobrou dele.
    for (const overlay of [...document.body.querySelectorAll("[data-radix-portal] > *")]) {
      overlay.remove();
    }
  });

  const render = (overrides: Partial<RepostDialogProps> = {}) =>
    act(() => root.render(<RepostDialog {...props(overrides)} />));
  const botao = (rotulo: string) =>
    [...document.body.querySelectorAll<HTMLButtonElement>("button")].find((b) =>
      b.textContent?.includes(rotulo),
    );

  it("sem comunidades o chamador não vê a porta de comunidade", () => {
    render({ communities: undefined });

    const texto = document.body.textContent!;
    expect(texto).toContain("Republicar");
    expect(texto).not.toContain("Republicar na comunidade");
  });

  it("com comunidades, escolhe a comunidade e publica com comentário", () => {
    const onRepostToCommunity = vi.fn();
    render({ onRepostToCommunity });

    act(() => botao("Republicar na comunidade")!.click());

    // Sem comunidade e sem texto o botão de publicar fica travado.
    const publicar = () =>
      [...document.body.querySelectorAll<HTMLButtonElement>("button")].find(
        (b) => b.textContent === "Publicar",
      )!;
    expect(publicar().disabled).toBe(true);

    const select = document.body.querySelector<HTMLSelectElement>("select")!;
    act(() => dispararValor(select, "comm_a"));

    const textarea = document.body.querySelector<HTMLTextAreaElement>("textarea")!;
    act(() => dispararValor(textarea, "Que foto boa!"));

    expect(publicar().disabled).toBe(false);
    act(() => publicar().click());

    expect(onRepostToCommunity).toHaveBeenCalledWith("comm_a", "Que foto boa!");
  });
});
