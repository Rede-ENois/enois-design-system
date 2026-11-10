// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PostActionsProps } from "../../../types/domain/post/post-actions-props.js";
import type { TestReaction } from "../../../types/domain/post/test-reaction.js";

import { PostActions } from "./post-actions.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const emojis = { LOVE: "❤️", ROFL: "🤣", SKULL: "💀", LIKE: "👍", INSIGHTFUL: "💡" };
const REASON = "Páginas ainda não podem ser republicadas: a cópia perderia o conteúdo da página.";

function props(
  overrides: Partial<PostActionsProps<TestReaction>> = {},
): PostActionsProps<TestReaction> {
  return {
    emojis,
    reactionStatus: null,
    onReact: () => {},
    reactionPending: false,
    motionAllowed: () => false,
    reactionCount: 0,
    commentsCount: 0,
    repostsCount: 0,
    savesCount: 0,
    saved: false,
    canRepost: true,
    onShowReactions: () => {},
    onComments: () => {},
    onRepost: () => {},
    onShare: () => {},
    onReport: () => {},
    onSave: () => {},
    ...overrides,
  };
}

describe("PostActions — republicar", () => {
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

  const render = (overrides: Partial<PostActionsProps<TestReaction>>) =>
    act(() => root.render(<PostActions {...props(overrides)} />));
  const button = (label: string) =>
    host.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`);

  it("shows the repost button when the post can be reposted", () => {
    const onRepost = vi.fn();
    render({ onRepost });

    act(() => button("Republicar")!.click());

    expect(onRepost).toHaveBeenCalledOnce();
    expect(button("Republicar indisponível")).toBeNull();
  });

  it("keeps hiding the button when there is no reason, as before", () => {
    render({ canRepost: false });

    expect(button("Republicar")).toBeNull();
    expect(button("Republicar indisponível")).toBeNull();
  });

  it("shows a disabled button that explains why, without reposting", () => {
    const onRepost = vi.fn();
    render({ canRepost: false, repostUnavailableReason: REASON, onRepost });

    const disabled = button("Republicar indisponível")!;
    expect(disabled.getAttribute("aria-disabled")).toBe("true");
    // Continua focável: `disabled` nativo tiraria o botão do teclado e do toque.
    expect(disabled.disabled).toBe(false);
    expect(disabled.title).toBe(REASON);

    act(() => disabled.click());

    expect(onRepost).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain(REASON);
  });
});

describe("PostActions — bolinhas do contador de reações", () => {
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

  const render = (overrides: Partial<PostActionsProps<TestReaction>>) =>
    act(() => root.render(<PostActions {...props(overrides)} />));
  const pills = () => [...host.querySelectorAll<HTMLSpanElement>(".-space-x-1 > span")];

  it("mostra o top real do post, do mais usado para o menos, limitado a 3", () => {
    render({
      reactionCount: 9,
      reactionSummary: { ROFL: 2, LOVE: 5, SKULL: 1, INSIGHTFUL: 1 },
    });

    expect(pills().map((pill) => pill.textContent)).toEqual(["❤️", "🤣", "💀"]);
  });

  it("mostra menos bolinhas quando o post tem menos tipos", () => {
    render({ reactionCount: 2, reactionSummary: { LOVE: 2 } });

    expect(pills().map((pill) => pill.textContent)).toEqual(["❤️"]);
  });

  it("sem summary, mantém o tripé padrão que sempre apareceu", () => {
    render({ reactionCount: 7 });

    expect(pills().map((pill) => pill.textContent)).toEqual(["👍", "❤️", "💡"]);
  });
});
