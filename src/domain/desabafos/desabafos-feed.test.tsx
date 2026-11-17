// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { DesabafoPostView } from "../../types/domain/desabafos/desabafo-post-view.js";

import { DesabafosFeed } from "./desabafos-feed.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.desabafosFeed;

const post: DesabafoPostView = {
  id: "desabafo_1",
  authorName: "Ana",
  authorAvatar: null,
  authorStyle: null,
  content: "primeiro desabafo",
  createdAt: "2026-11-15T10:30:00Z",
  reactions: 0,
  reactionSummary: {},
  myReaction: null,
  comments: 0,
  isMine: false,
};

describe("DesabafosFeed", () => {
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

  const render = (overrides: Partial<Parameters<typeof DesabafosFeed>[0]> = {}) => {
    const props = {
      posts: [post],
      state: { kind: "ready" as const },
      hasMore: false,
      loadingMore: false,
      onLoadMore: vi.fn(),
      renderCard: (p: DesabafoPostView) => p.content,
      ...overrides,
    };
    act(() => root.render(<DesabafosFeed {...props} />));
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

  it("lista na ordem recebida e monta cada card pelo renderCard", () => {
    const segundo = { ...post, id: "desabafo_2", content: "segundo desabafo" };
    render({ posts: [post, segundo] });
    expect(host.textContent).toContain("primeiro desabafo");
    expect(host.textContent).toContain("segundo desabafo");
  });

  it("sem página seguinte não há botão; com ela, carregar mais chama o callback", () => {
    render({ hasMore: false });
    expect(host.textContent).not.toContain(messages.loadMore);

    const props = render({ hasMore: true });
    expect(host.textContent).toContain(messages.loadMore);
    act(() =>
      [...host.querySelectorAll("button")]
        .find((b) => b.textContent?.includes(messages.loadMore))
        ?.click(),
    );
    expect(props.onLoadMore).toHaveBeenCalledTimes(1);
  });
});
