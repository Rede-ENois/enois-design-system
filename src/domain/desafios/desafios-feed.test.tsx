// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { DesafioView } from "../../types/domain/desafios/desafio-view.js";
import type { DesafiosFeedProps } from "../../types/domain/desafios/desafios-feed-props.js";

import { DesafiosFeed } from "./desafios-feed.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.desafiosFeed;

const desafio: DesafioView = {
  id: "desafio_1",
  title: "Um desafio de escrita",
  description: "Escreva um poema.",
  author: {
    id: "user_1",
    name: "Ana Mel",
    username: "mel",
    avatar: null,
    avatarFrame: null,
    nameStyle: null,
  },
  createdAt: "2026-11-15T10:30:00Z",
  endsAt: null,
  status: "ACTIVE",
  destaqueId: null,
  participacoes: 2,
  isMine: false,
};

describe("DesafiosFeed", () => {
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

  const render = (overrides: Partial<DesafiosFeedProps> = {}) => {
    const props: DesafiosFeedProps = {
      desafios: [desafio],
      state: { kind: "ready" },
      hasMore: false,
      loadingMore: false,
      onLoadMore: vi.fn(),
      renderCard: (item) => <article key={item.id} data-card={item.id} />,
      ...overrides,
    };
    act(() => root.render(<DesafiosFeed {...props} />));
    return props;
  };

  it("monta um card por desafio via renderCard", () => {
    render({ desafios: [desafio, { ...desafio, id: "desafio_2" }] });

    expect(host.querySelectorAll("[data-card]")).toHaveLength(2);
  });

  it("estados de carga, falha e vazio são desenhados", () => {
    render({ state: { kind: "loading" } });
    expect(host.textContent).toContain(messages.loading);

    render({ state: { kind: "error" } });
    expect(host.textContent).toContain(messages.error);

    render({ state: { kind: "empty" }, desafios: [] });
    expect(host.textContent).toContain(messages.empty);
  });

  it("com hasMore, desenha o botão de carregar mais — e só ele dispara", () => {
    const props = render({ hasMore: true });

    const botao = Array.from(host.querySelectorAll("button")).find((button) =>
      button.textContent?.includes(messages.loadMore),
    )!;
    act(() => botao.click());
    expect(props.onLoadMore).toHaveBeenCalled();

    render({ hasMore: false });
    expect(host.textContent).not.toContain(messages.loadMore);
  });
});
