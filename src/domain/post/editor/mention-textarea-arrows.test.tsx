// @vitest-environment jsdom
import { act, useState } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { EditorSticker } from "../../../types/domain/post/editor-sticker.js";

import { stepOverSticker } from "./editor-dom.js";
import { fieldIn, selectText, selectionOf, valueOf } from "./editor.fixture.js";
import { MentionTextarea } from "./mention-textarea.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const stickers: Record<string, EditorSticker> = {
  KEKW: { url: "https://cdn.example.test/kekw.webp", alt: "KEKW laughing" },
};
const resolve = (url: string) => url;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);
const changed = vi.fn();

afterEach(() => {
  act(() => root.render(null));
  changed.mockClear();
});

function Field({ initial, maxLength }: { initial: string; maxLength?: number }) {
  const [value, setText] = useState(initial);
  return (
    <MentionTextarea
      value={value}
      onChange={(next) => {
        setText(next);
        changed(next);
      }}
      maxLength={maxLength}
      stickers={stickers}
      mentionResults={[]}
      onMentionQueryChange={() => undefined}
    />
  );
}

function render(initial: string, maxLength?: number) {
  act(() => root.render(<Field initial={initial} maxLength={maxLength} />));
  return fieldIn(container);
}

const arrow = (field: HTMLElement, name: "ArrowLeft" | "ArrowRight", shiftKey = false) => {
  const event = new KeyboardEvent("keydown", {
    key: name,
    shiftKey,
    bubbles: true,
    cancelable: true,
  });
  act(() => {
    field.dispatchEvent(event);
  });
  return event;
};

const typeNative = (field: HTMLElement, data: string) => {
  const event = new InputEvent("beforeinput", {
    inputType: "insertText",
    data,
    bubbles: true,
    cancelable: true,
  });
  act(() => {
    field.dispatchEvent(event);
  });
  return event;
};

describe("stepOverSticker", () => {
  it("jumps across the whole code in either direction and ignores plain text", () => {
    expect(stepOverSticker("a KEKW b", 2, "forward", stickers, resolve)).toBe(6);
    expect(stepOverSticker("a KEKW b", 6, "backward", stickers, resolve)).toBe(2);
    expect(stepOverSticker("a KEKW b", 1, "forward", stickers, resolve)).toBeNull();
    expect(stepOverSticker("a KEKW b", 7, "backward", stickers, resolve)).toBeNull();
    expect(stepOverSticker("KEKW", 0, "backward", stickers, resolve)).toBeNull();
    expect(stepOverSticker("KEKW", 4, "forward", stickers, resolve)).toBeNull();
  });
});

describe("MentionTextarea arrows around a sticker", () => {
  it.each([
    ["start", "KEKW tchau", 0, 4],
    ["middle", "oi KEKW tchau", 3, 7],
    ["end", "oi KEKW", 3, 7],
  ])("ArrowRight crosses a sticker at the %s as one character", (_, text, from, to) => {
    const field = render(text);
    selectText(field, from);
    expect(arrow(field, "ArrowRight").defaultPrevented).toBe(true);
    expect(selectionOf(field)).toEqual({ start: to, end: to });
  });

  it.each([
    ["start", "KEKW tchau", 4, 0],
    ["middle", "oi KEKW tchau", 7, 3],
    ["end", "oi KEKW", 7, 3],
  ])("ArrowLeft crosses a sticker at the %s as one character", (_, text, from, to) => {
    const field = render(text);
    selectText(field, from);
    expect(arrow(field, "ArrowLeft").defaultPrevented).toBe(true);
    expect(selectionOf(field)).toEqual({ start: to, end: to });
  });

  it("leaves arrows to the browser when no sticker is next", () => {
    const field = render("oi KEKW");
    selectText(field, 1);
    expect(arrow(field, "ArrowRight").defaultPrevented).toBe(false);
  });

  it("types after crossing a sticker at the end: the text lands at the end of the value", () => {
    const field = render("oi KEKW");
    selectText(field, 7);
    arrow(field, "ArrowLeft");
    arrow(field, "ArrowRight");
    expect(selectionOf(field)).toEqual({ start: 7, end: 7 });

    // The caret stands between nodes, next to the sticker: typing is handled by the field.
    expect(typeNative(field, "x").defaultPrevented).toBe(true);
    expect(changed).toHaveBeenLastCalledWith("oi KEKWx");
    expect(valueOf(field)).toBe("oi KEKWx");
    expect(selectionOf(field)).toEqual({ start: 8, end: 8 });
  });

  it("leaves typing to the browser when the caret ends up inside a text node", () => {
    const field = render("KEKW tchau");
    selectText(field, 0);
    arrow(field, "ArrowRight");
    expect(selectionOf(field)).toEqual({ start: 4, end: 4 });
    expect(typeNative(field, "!").defaultPrevented).toBe(false);
  });

  it("types right before a sticker that starts the text", () => {
    const field = render("KEKW tchau");
    selectText(field, 4);
    arrow(field, "ArrowLeft");
    expect(selectionOf(field)).toEqual({ start: 0, end: 0 });
    expect(typeNative(field, "x").defaultPrevented).toBe(true);
    expect(valueOf(field)).toBe("xKEKW tchau");
    expect(selectionOf(field)).toEqual({ start: 1, end: 1 });
  });

  it("keeps a sticker at the end typeable: the field keeps a place for the caret after it", () => {
    const field = render("oi KEKW");
    expect(field.lastElementChild?.hasAttribute("data-trailing-break")).toBe(true);
    expect(valueOf(field)).toBe("oi KEKW");
  });

  it("lets the browser type inside a text node", () => {
    const field = render("oi KEKW");
    selectText(field, 1);
    expect(typeNative(field, "x").defaultPrevented).toBe(false);
  });

  it("honours maxLength when typing next to a sticker", () => {
    const field = render("KEKW", 4);
    selectText(field, 4);
    typeNative(field, "x");
    expect(valueOf(field)).toBe("KEKW");
    expect(changed).not.toHaveBeenCalled();
  });

  it("Shift+ArrowRight and Shift+ArrowLeft select the sticker as one character", () => {
    const field = render("oi KEKW tchau");
    selectText(field, 3);
    expect(arrow(field, "ArrowRight", true).defaultPrevented).toBe(true);
    expect(selectionOf(field)).toEqual({ start: 3, end: 7 });

    selectText(field, 7);
    arrow(field, "ArrowLeft", true);
    expect(selectionOf(field)).toEqual({ start: 3, end: 7 });
  });

  it("collapses a selection to its edge with a plain arrow", () => {
    const field = render("oi KEKW tchau");
    selectText(field, 3, 7);
    arrow(field, "ArrowRight");
    expect(selectionOf(field)).toEqual({ start: 7, end: 7 });

    selectText(field, 3, 7);
    arrow(field, "ArrowLeft");
    expect(selectionOf(field)).toEqual({ start: 3, end: 3 });
  });
});
