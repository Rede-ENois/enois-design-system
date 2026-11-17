// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { DesabafosCommentView } from "../../types/domain/desabafos/desabafos-comment-view.js";

import { DesabafosComments } from "./desabafos-comments.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.desabafosComments;

const acolhidaAlheia: DesabafosCommentView = {
  id: "desabafo_c_1",
  authorName: "Bia",
  authorAvatar: null,
  authorStyle: null,
  content: "Estou aqui com você",
  isMine: false,
};

describe("DesabafosComments", () => {
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
  });

  const render = (
    overrides: {
      comments?: DesabafosCommentView[];
      state?: { kind: "loading" | "error" | "ready" };
      onComment?: (input: { content: string }) => Promise<void>;
      onRemoveComment?: (commentId: string) => void;
    } = {},
  ) => {
    const props = {
      comments: overrides.comments ?? [],
      state: overrides.state ?? { kind: "ready" as const },
      onComment: overrides.onComment ?? vi.fn().mockResolvedValue(undefined),
      onRemoveComment: overrides.onRemoveComment ?? vi.fn(),
    };
    act(() => root.render(<DesabafosComments {...props} />));
    return props;
  };

  const campo = () => host.querySelector<HTMLTextAreaElement>("textarea");
  const botaoEnviar = () =>
    [...host.querySelectorAll("button")].find((b) => b.textContent?.includes(messages.send));
  const digitar = (texto: string) => {
    const area = campo();
    if (!area) throw new Error("textarea não renderizado");
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    act(() => {
      setter?.call(area, texto);
      area.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };

  it("sem acolhidas ainda, convida a acolher", () => {
    render();
    expect(host.textContent).toContain(messages.empty);
  });

  it("desenha o estado de carga e o de erro com as palavras do DS", () => {
    render({ state: { kind: "loading" } });
    expect(host.textContent).toContain(messages.loading);
    render({ state: { kind: "error" } });
    expect(host.textContent).toContain(messages.error);
  });

  it("acolhe com o texto aparado e limpa o campo quando resolve", async () => {
    const props = render();
    digitar("  você não está sozinho  ");
    await act(async () => {
      botaoEnviar()?.click();
    });
    expect(props.onComment).toHaveBeenCalledWith({ content: "você não está sozinho" });
    expect(campo()?.value).toBe("");
  });

  it("campo vazio mantém o botão de acolher desligado", () => {
    render();
    expect(botaoEnviar()?.disabled).toBe(true);
    digitar("   ");
    expect(botaoEnviar()?.disabled).toBe(true);
  });

  it("a recusa não apaga o rascunho da acolhida", async () => {
    const props = render({ onComment: vi.fn().mockRejectedValue(new Error("400")) });
    digitar("fica firme");
    await act(async () => {
      botaoEnviar()?.click();
    });
    expect(props.onComment).toHaveBeenCalledTimes(1);
    expect(campo()?.value).toBe("fica firme");
  });

  it("só a acolhida minha tem o gesto de remover", () => {
    const remover = vi.fn();
    const minha: DesabafosCommentView = { ...acolhidaAlheia, id: "desabafo_c_2", isMine: true };
    render({ comments: [acolhidaAlheia, minha], onRemoveComment: remover });

    const gestos = [
      ...host.querySelectorAll<HTMLButtonElement>('button[aria-label="' + messages.remove + '"]'),
    ];
    expect(gestos).toHaveLength(1);
    act(() => gestos[0]?.click());
    expect(remover).toHaveBeenCalledWith("desabafo_c_2");
  });
});
