// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CommentsError } from "../../../types/domain/post/comments-error.js";
import type { PostCommentsProps } from "../../../types/domain/post/post-comments-props.js";

import { PostComments } from "./post-comments.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
// jsdom has no layout: scrolling is a no-op here.
Element.prototype.scrollIntoView = vi.fn();

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const field = vi.fn(({ toolsOpen }: { toolsOpen: boolean }) => (
  <textarea data-tools={toolsOpen ? "open" : "closed"} />
));

const comments = [
  { id: "c1", parentCommentId: null, authorName: "Ana Souza" },
  { id: "c2", parentCommentId: "c1", authorName: "Bruno Lima" },
];

const render = (
  onOpenGifPicker = vi.fn(),
  reply: { replyToId: string | null; onCancelReply?: () => void } = { replyToId: null },
  state: Partial<Pick<PostCommentsProps, "canSend" | "sending" | "onSubmit">> = {},
  error: CommentsError | null = null,
) =>
  act(() =>
    root.render(
      <PostComments
        formId="comments"
        comments={comments}
        loading={false}
        loadingMore={false}
        hasMore={false}
        error={error}
        onRetry={() => undefined}
        onLoadMore={() => undefined}
        renderComment={(comment) => <p data-comment={comment.id}>{comment.authorName}</p>}
        replyToId={reply.replyToId}
        onCancelReply={reply.onCancelReply ?? (() => undefined)}
        media={[]}
        mediaSpoiler={false}
        onToggleMediaSpoiler={() => undefined}
        onRemoveMedia={() => undefined}
        onInsertMedia={() => undefined}
        onAddImages={() => undefined}
        onAddAudio={() => undefined}
        onErrorChange={() => undefined}
        composerField={field}
        canSend={false}
        sending={false}
        onSubmit={async () => true}
        onOpenGifPicker={onOpenGifPicker}
        {...state}
      />,
    ),
  );

const plus = () => container.querySelector<HTMLButtonElement>("button[aria-controls]")!;
const tray = () => document.getElementById(plus().getAttribute("aria-controls")!)!;
const textarea = () => container.querySelector("textarea")!;

describe("PostComments composer", () => {
  it("keeps the extras folded away until the plus opens them", () => {
    render();

    expect(plus().getAttribute("aria-expanded")).toBe("false");
    expect(tray().hasAttribute("inert")).toBe(true);
    expect(textarea().dataset.tools).toBe("closed");

    act(() => plus().click());
    expect(plus().getAttribute("aria-expanded")).toBe("true");
    expect(plus().getAttribute("aria-label")).toBe("Fechar anexos e formatação");
    expect(tray().hasAttribute("inert")).toBe(false);
    expect(textarea().dataset.tools).toBe("open");
  });

  it("owns one submit button and switches its mobile label when the tools open", () => {
    render();
    const send = container.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(container.querySelectorAll('button[type="submit"]')).toHaveLength(1);
    expect(send.getAttribute("aria-label")).toBe("Comentar");
    expect(send.querySelector("span")?.className).toBe("sm:sr-only");
    expect(send.className).toContain("sm:w-9");
    expect(send.disabled).toBe(true);

    act(() => plus().click());
    expect(container.querySelectorAll('button[type="submit"]')).toHaveLength(1);
    expect(container.querySelector('button[type="submit"]')).toBe(send);
    expect(send.querySelector("span")?.className).toBe("sr-only");
    expect(send.getAttribute("aria-label")).toBe("Comentar");

    act(() => plus().click());
    expect(send.querySelector("span")?.className).toBe("sm:sr-only");
  });

  it("uses the same submit and pending state with tools open or closed", async () => {
    const onSubmit = vi.fn().mockResolvedValue(false);
    const state = { canSend: true, sending: false, onSubmit };
    await render(vi.fn(), undefined, state);
    const send = () => container.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    expect(send().disabled).toBe(false);
    await act(async () => send().click());
    expect(onSubmit).toHaveBeenCalledExactlyOnceWith("");

    await render(vi.fn(), undefined, { ...state, sending: true });
    expect(send().disabled).toBe(true);
    expect(send().getAttribute("aria-busy")).toBe("true");
    expect(send().getAttribute("aria-label")).toBe("Enviando...");
    act(() => plus().click());
    expect(send().disabled).toBe(true);
    expect(send().querySelector("span")?.className).toBe("sr-only");
    await act(async () => send().click());
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("folds the tray when a GIF is picked", () => {
    const onOpenGifPicker = vi.fn();
    render(onOpenGifPicker);
    act(() => plus().click());

    const gif = [...tray().querySelectorAll("button")].find((b) => b.textContent === "GIF")!;
    act(() => gif.click());
    expect(onOpenGifPicker).toHaveBeenCalledOnce();
    expect(plus().getAttribute("aria-expanded")).toBe("false");
  });

  it("opens a reply right under the comment it answers, focused, and Esc leaves it", () => {
    const onCancelReply = vi.fn();
    render(vi.fn(), { replyToId: "c2", onCancelReply });

    const forms = container.querySelectorAll("form");
    expect(forms).toHaveLength(1);
    const answered = container.querySelector('[data-comment="c2"]')!;
    expect(answered.nextElementSibling).toBe(forms[0]);
    expect(forms[0].textContent).toContain("respondendo a Bruno Lima");
    expect(document.activeElement).toBe(textarea());

    act(() => {
      textarea().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(onCancelReply).toHaveBeenCalledOnce();
  });

  it("keeps a reply to a comment that is not loaded on top", () => {
    render(vi.fn(), { replyToId: "gone" });

    const form = container.querySelector("form")!;
    expect(form.compareDocumentPosition(container.querySelector('[data-comment="c1"]')!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("keeps the thread when a comment is refused: the send error shows under the field", () => {
    render(vi.fn(), { replyToId: null }, {}, "send");

    // O comentário recusado não é a lista falhando: o que já estava carregado continua visível...
    expect(container.querySelector('[data-comment="c1"]')).not.toBeNull();
    expect(container.querySelector('[data-comment="c2"]')).not.toBeNull();
    // ...e o motivo aparece junto do campo, sem o botão de recarregar a lista.
    expect(container.textContent).toContain("Não foi possível enviar o comentário.");
    expect(container.textContent).not.toContain("Tentar de novo");
  });

  it.each([false, true])("keeps send errors in the field grid with tools open=%s", (open) => {
    render(vi.fn(), undefined, {}, "send");
    if (open) act(() => plus().click());
    const fieldBox = textarea().parentElement!;
    const error = fieldBox.nextElementSibling!;
    const grid = fieldBox.parentElement!;
    expect(error.textContent).toBe("Não foi possível enviar o comentário. Tente de novo.");
    expect(error.parentElement).toBe(grid);
    expect(error.classList.contains("col-span-3")).toBe(true);
    expect(error.classList.contains("sm:col-start-2")).toBe(true);
    expect(error.classList.contains("row-start-2")).toBe(true);
    expect(error.className).not.toContain("pl-");
    expect(plus().classList.contains("row-start-3")).toBe(true);
    expect(tray().classList.contains("row-start-3")).toBe(true);
    expect(container.querySelectorAll('button[type="submit"]')).toHaveLength(1);
  });

  it("replaces the list only when the read itself failed", () => {
    render(vi.fn(), { replyToId: null }, {}, "load");

    expect(container.querySelector('[data-comment="c1"]')).toBeNull();
    expect(container.textContent).toContain("Não foi possível carregar os comentários.");
    expect(container.textContent).toContain("Tentar de novo");
  });
});
