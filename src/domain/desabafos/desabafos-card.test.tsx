// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { DesabafosCardProps } from "../../types/domain/desabafos/desabafos-card-props.js";

import { DesabafosCard } from "./desabafos-card.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.desabafosCard;

const postBase = {
  id: "desabafo_1",
  content: "Estou cansado de fingir que está tudo bem",
  createdAt: "2026-11-15T10:30:00Z",
  reactions: 2,
  reactionSummary: { LOVE: 2, SUPPORT: 0 },
  myReaction: null,
  comments: 1,
  isMine: false,
};

describe("DesabafosCard", () => {
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

  const render = (overrides: Partial<DesabafosCardProps> = {}) => {
    const props: DesabafosCardProps = {
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
    act(() => root.render(<DesabafosCard {...props} />));
    return props;
  };

  const botaoPorRotulo = (rotulo: string) =>
    [...host.querySelectorAll("button")].find((b) => b.getAttribute("aria-label") === rotulo);
  const botaoAcolhidas = () =>
    [...host.querySelectorAll("button")].find((b) => b.textContent?.includes("acolhida"));

  it("desenha o desabafo ANÔNIMO, texto, contagens e o convite às acolhidas", () => {
    render();
    expect(host.textContent).toContain("Estou cansado de fingir que está tudo bem");
    // O anonimato é do contrato: nem nome, nem avatar, nem estilo chegam à view.
    expect(postBase).not.toHaveProperty("authorName");
    expect(host.textContent).toContain(messages.anonymous);
    expect(host.textContent).toContain("2");
    expect(botaoAcolhidas()?.textContent).toContain(messages.acolhidas(1));
  });

  it("oferece as duas reações de apoio e conta por tipo", () => {
    render();
    expect(botaoPorRotulo(messages.reactLove)?.textContent).toContain("❤️");
    expect(botaoPorRotulo(messages.reactSupport)?.textContent).toContain("0");
  });

  it("tocar numa reação apoia; tocar na minha tira", () => {
    const props = render();
    act(() => botaoPorRotulo(messages.reactSupport)?.click());
    expect(props.onReact).toHaveBeenCalledWith("SUPPORT");

    const comMeuApoio = render({
      post: { ...postBase, myReaction: "SUPPORT", reactionSummary: { LOVE: 2, SUPPORT: 1 } },
    });
    act(() => botaoPorRotulo(messages.reactSupport)?.click());
    expect(comMeuApoio.onUnreact).toHaveBeenCalledTimes(1);
    expect(botaoPorRotulo(messages.reactSupport)?.getAttribute("aria-pressed")).toBe("true");
  });

  it("abre e fecha as acolhidas no próprio card", () => {
    const props = render();
    act(() => botaoAcolhidas()?.click());
    expect(props.onToggleComments).toHaveBeenCalledTimes(1);
    expect(botaoAcolhidas()?.getAttribute("aria-expanded")).toBe("false");

    render({ commentsOpen: true, commentsState: { kind: "loading" } });
    expect(botaoAcolhidas()?.getAttribute("aria-expanded")).toBe("true");
    expect(host.textContent).toContain(defaultMessages.desabafosComments.loading);
  });

  it("só quem desabafou vê o gesto de remover o próprio texto", () => {
    render();
    expect(botaoPorRotulo(messages.remove)).toBeUndefined();

    const props = render({ post: { ...postBase, isMine: true } });
    act(() => botaoPorRotulo(messages.remove)?.click());
    expect(props.onRemove).toHaveBeenCalledTimes(1);
  });

  it("denunciar aparece para quem vê e some no próprio desabafo", () => {
    const props = render({ onReport: vi.fn() });
    act(() => botaoPorRotulo(messages.report)?.click());
    expect(props.onReport).toHaveBeenCalledTimes(1);

    render({ post: { ...postBase, isMine: true }, onReport: vi.fn() });
    expect(botaoPorRotulo(messages.report)).toBeUndefined();
  });

  it("o desabafo removido não expõe ninguém que apoiou", () => {
    render({ post: { ...postBase, myReaction: "LOVE" } });
    // A contagem é o teto do que se mostra: nenhum nome ou id de quem apoiou aparece.
    expect(host.textContent).not.toContain("apoiou");
  });
});
