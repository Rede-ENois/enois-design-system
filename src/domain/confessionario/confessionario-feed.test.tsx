// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { ConfissaoPostView } from "../../types/domain/confessionario/confissao-post-view.js";

import { ConfessionarioFeed } from "./confessionario-feed.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.confessionarioFeed;

const historia: ConfissaoPostView = {
  id: "confissa_1",
  content: "primeira história",
  createdAt: "2026-11-15T10:30:00Z",
  reactions: 0,
  reactionSummary: {},
  myReaction: null,
  comments: 0,
  isMine: false,
};

describe("ConfessionarioFeed", () => {
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

  const render = (overrides: Partial<Parameters<typeof ConfessionarioFeed>[0]> = {}) => {
    const props = {
      posts: [historia],
      state: { kind: "ready" as const },
      hasMore: false,
      loadingMore: false,
      onLoadMore: vi.fn(),
      renderCard: (p: ConfissaoPostView) => p.content,
      ...overrides,
    };
    act(() => root.render(<ConfessionarioFeed {...props} />));
    return props;
  };

  it("desenha carga, erro e vazio com as palavras do DS", () => {
    render({ posts: [], state: { kind: "loading" } });
    expect(host.textContent).toContain(messages.loading);
    render({ posts: [], state: { kind: "error" } });
    expect(host.textContent).toContain(messages.error);
    render({ posts: [], state: { kind: "empty" } });
    expect(host.textContent).toContain(messages.empty);
  });

  it("pronta, desenha cada história pelo renderCard de quem usa", () => {
    render({
      posts: [historia, { ...historia, id: "confissa_2", content: "segunda história" }],
    });
    expect(host.textContent).toContain("primeira história");
    expect(host.textContent).toContain("segunda história");
  });

  it("com mais páginas, oferece o carregar mais e avisa enquanto busca", () => {
    const props = render({ hasMore: true });
    const botao = [...host.querySelectorAll("button")].find((b) =>
      b.textContent?.includes(messages.loadMore),
    );
    expect(botao).toBeTruthy();
    act(() => botao?.click());
    expect(props.onLoadMore).toHaveBeenCalledTimes(1);

    render({ hasMore: true, loadingMore: true });
    expect(host.querySelector(".animate-spin")).toBeTruthy();
  });
});
