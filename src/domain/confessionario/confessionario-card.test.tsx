// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { ConfessionarioCardProps } from "../../types/domain/confessionario/confessionario-card-props.js";

import { ConfessionarioCard } from "./confessionario-card.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.confessionarioCard;

const postBase = {
  id: "confissa_1",
  content: "Já dormi no trabalho e ninguém percebeu",
  createdAt: "2026-11-15T10:30:00Z",
  reactions: 3,
  reactionSummary: { LAUGH: 2, WOW: 0, SUPPORT: 1 },
  myReaction: null,
  comments: 1,
  isMine: false,
};

describe("ConfessionarioCard", () => {
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

  const render = (overrides: Partial<ConfessionarioCardProps> = {}) => {
    const props: ConfessionarioCardProps = {
      post: postBase,
      commentsOpen: false,
      comments: [],
      commentsState: { kind: "ready" },
      onToggleComments: vi.fn(),
      onReact: vi.fn(),
      onUnreact: vi.fn(),
      onRemove: vi.fn(),
      onComment: vi.fn().mockResolvedValue(undefined),
      onRemoveComment: vi.fn(),
      ...overrides,
    };
    act(() => root.render(<ConfessionarioCard {...props} />));
    return props;
  };

  const botaoPorRotulo = (rotulo: string) =>
    [...host.querySelectorAll("button")].find((b) => b.getAttribute("aria-label") === rotulo);
  const botaoComentarios = () =>
    [...host.querySelectorAll("button")].find((b) => b.textContent?.includes("comentário"));

  it("desenha a história ANÔNIMA, o texto, as contagens e o convite aos comentários", () => {
    render();
    expect(host.textContent).toContain("Já dormi no trabalho e ninguém percebeu");
    // O anonimato é do contrato: nem nome, nem avatar, nem estilo chegam à view.
    expect(postBase).not.toHaveProperty("authorName");
    expect(host.textContent).toContain(messages.anonymous);
    expect(botaoComentarios()?.textContent).toContain(messages.comments(1));
  });

  it("oferece as três reações do tom de história e conta por tipo", () => {
    render();
    expect(botaoPorRotulo(messages.reactLaugh)?.textContent).toContain("😂");
    expect(botaoPorRotulo(messages.reactWow)?.textContent).toContain("0");
    expect(botaoPorRotulo(messages.reactSupport)?.textContent).toContain("1");
  });

  it("tocar numa reação reage; tocar na minha tira", () => {
    const props = render();
    act(() => botaoPorRotulo(messages.reactWow)?.click());
    expect(props.onReact).toHaveBeenCalledWith("WOW");

    const comMinha = render({
      post: { ...postBase, myReaction: "LAUGH", reactionSummary: { LAUGH: 3, WOW: 0, SUPPORT: 1 } },
    });
    act(() => botaoPorRotulo(messages.reactLaugh)?.click());
    expect(comMinha.onUnreact).toHaveBeenCalledTimes(1);
    expect(botaoPorRotulo(messages.reactLaugh)?.getAttribute("aria-pressed")).toBe("true");
  });

  it("abre e fecha os comentários no próprio card", () => {
    const props = render();
    act(() => botaoComentarios()?.click());
    expect(props.onToggleComments).toHaveBeenCalledTimes(1);
    expect(botaoComentarios()?.getAttribute("aria-expanded")).toBe("false");

    render({ commentsOpen: true, commentsState: { kind: "loading" } });
    expect(botaoComentarios()?.getAttribute("aria-expanded")).toBe("true");
    expect(host.textContent).toContain(defaultMessages.confessionarioComments.loading);
  });

  it("só quem contou vê o gesto de remover a própria história", () => {
    render();
    expect(botaoPorRotulo(messages.remove)).toBeUndefined();

    const props = render({ post: { ...postBase, isMine: true } });
    act(() => botaoPorRotulo(messages.remove)?.click());
    expect(props.onRemove).toHaveBeenCalledTimes(1);
  });

  it("denunciar aparece para quem vê e some na própria história", () => {
    const props = render({ onReport: vi.fn() });
    act(() => botaoPorRotulo(messages.report)?.click());
    expect(props.onReport).toHaveBeenCalledTimes(1);

    render({ post: { ...postBase, isMine: true }, onReport: vi.fn() });
    expect(botaoPorRotulo(messages.report)).toBeUndefined();
  });
});
