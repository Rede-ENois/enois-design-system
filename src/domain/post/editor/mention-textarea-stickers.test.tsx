// @vitest-environment jsdom
import { act, createRef, useState } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { EditorSticker } from "../../../types/domain/post/editor-sticker.js";
import type { MentionTextareaHandle } from "../../../types/domain/post/mention-textarea-handle.js";

import { fieldIn, selectText, selectionOf, typeInto, valueOf } from "./editor.fixture.js";
import { MentionTextarea } from "./mention-textarea.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const stickers: Record<string, EditorSticker> = {
  KEKW: { url: "https://cdn.example.test/kekw.webp", alt: "KEKW laughing" },
  Pog: { url: "https://cdn.example.test/pog.webp", alt: "Pog face" },
};

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);
const changed = vi.fn();
const handle = createRef<MentionTextareaHandle>();

afterEach(() => {
  act(() => root.render(null));
  changed.mockClear();
});

function Field({
  initial = "",
  maxLength,
  withStickers = true,
}: {
  initial?: string;
  maxLength?: number;
  withStickers?: boolean;
}) {
  const [value, setText] = useState(initial);
  return (
    <MentionTextarea
      ref={handle}
      value={value}
      onChange={(next, ids) => {
        setText(next);
        changed(next, ids);
      }}
      maxLength={maxLength}
      stickers={withStickers ? stickers : undefined}
      mentionResults={[]}
      onMentionQueryChange={() => undefined}
    />
  );
}

function render(props: Parameters<typeof Field>[0] = {}) {
  act(() => root.render(<Field {...props} />));
  return fieldIn(container);
}

const press = (field: HTMLElement, key: string) => {
  const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
  act(() => {
    field.dispatchEvent(event);
  });
  return event;
};

describe("MentionTextarea stickers", () => {
  it("draws a code that is a whole word as an image, keeping the code as the value", () => {
    const field = render({ initial: "oi KEKW tchau" });

    const image = field.querySelector("img");
    expect(image?.getAttribute("src")).toBe(stickers.KEKW.url);
    expect(image?.getAttribute("alt")).toBe("KEKW laughing");
    expect(field.querySelector("[contenteditable='false']")).not.toBeNull();
    expect(valueOf(field)).toBe("oi KEKW tchau");
  });

  it("leaves a code inside a longer word as text", () => {
    const field = render({ initial: "xKEKW KEKWs" });
    expect(field.querySelector("img")).toBeNull();
  });

  it("shows only text when no stickers are given", () => {
    const field = render({ initial: "oi KEKW", withStickers: false });
    expect(field.querySelector("img")).toBeNull();
    expect(field.textContent).toBe("oi KEKW");
  });

  it("turns a typed code into an image once the word is complete", () => {
    const field = render();
    typeInto(field, "Pog ");
    expect(changed).toHaveBeenLastCalledWith("Pog ", []);
    expect(field.querySelectorAll("img")).toHaveLength(1);
    expect(selectionOf(field)).toEqual({ start: 4, end: 4 });
  });

  it("removes the whole sticker with Backspace and with Delete", () => {
    const field = render({ initial: "a KEKW b" });
    selectText(field, 6);
    expect(press(field, "Backspace").defaultPrevented).toBe(true);
    expect(changed).toHaveBeenLastCalledWith("a  b", []);
    expect(field.querySelector("img")).toBeNull();

    act(() => root.render(<Field initial="a KEKW b" />));
    const again = fieldIn(container);
    selectText(again, 2);
    press(again, "Delete");
    expect(changed).toHaveBeenLastCalledWith("a  b", []);
  });

  it("deletes a single character when the caret is not next to a sticker", () => {
    const field = render({ initial: "a KEKW b" });
    selectText(field, 7);
    expect(press(field, "Backspace").defaultPrevented).toBe(false);
  });

  it("never lets the caret land inside a sticker", () => {
    const field = render({ initial: "KEKW" });
    selectText(field, 2);
    const selection = selectionOf(field)!;
    expect([0, 4]).toContain(selection.start);
  });

  it("copies the code of a selected sticker", () => {
    const field = render({ initial: "a KEKW b" });
    selectText(field, 0, 8);
    const setData = vi.fn();
    const event = new Event("copy", { bubbles: true, cancelable: true });
    Object.assign(event, { clipboardData: { setData } });
    act(() => {
      field.dispatchEvent(event);
    });
    expect(setData).toHaveBeenCalledWith("text/plain", "a KEKW b");
    expect(event.defaultPrevented).toBe(true);
  });

  it("pastes HTML as plain text", () => {
    const field = render({ initial: "ab" });
    selectText(field, 1);
    const event = new Event("paste", { bubbles: true, cancelable: true });
    Object.assign(event, {
      clipboardData: {
        files: [],
        getData: (type: string) => (type === "text/plain" ? "X" : "<b>X</b>"),
      },
    });
    act(() => {
      field.dispatchEvent(event);
    });
    expect(changed).toHaveBeenLastCalledWith("aXb", []);
  });
});

describe("MentionTextarea insertAtCaret", () => {
  it("inserts the code at the caret with spaces around it", () => {
    const field = render({ initial: "ab" });
    selectText(field, 1);
    act(() => {
      expect(handle.current?.insertAtCaret("KEKW")).toBe(true);
    });
    expect(changed).toHaveBeenLastCalledWith("a KEKW b", []);
    expect(field.querySelector("img")).not.toBeNull();
  });

  it("does not add spaces that are already there", () => {
    const field = render({ initial: "a  b" });
    selectText(field, 2);
    act(() => {
      handle.current?.insertAtCaret("Pog");
    });
    expect(changed).toHaveBeenLastCalledWith("a Pog b", []);
    expect(field).toBeTruthy();
  });

  it("replaces the selection and appends at the end without a trailing space", () => {
    render({ initial: "abc" });
    const field = fieldIn(container);
    selectText(field, 0, 3);
    act(() => {
      handle.current?.insertAtCaret("KEKW");
    });
    expect(changed).toHaveBeenLastCalledWith("KEKW", []);
  });

  it("keeps inserting at the last caret after the selection left the field", () => {
    const field = render({ initial: "ab" });
    selectText(field, 1);
    act(() => document.dispatchEvent(new Event("selectionchange")));
    act(() => document.getSelection()?.removeAllRanges());
    act(() => document.dispatchEvent(new Event("selectionchange")));
    act(() => {
      handle.current?.insertAtCaret("Pog");
    });
    expect(changed).toHaveBeenLastCalledWith("a Pog b", []);
    expect(field).toBeTruthy();
  });

  it("appends at the end when the field never had a caret", () => {
    render({ initial: "ab" });
    act(() => document.getSelection()?.removeAllRanges());
    act(() => {
      handle.current?.insertAtCaret("Pog");
    });
    expect(changed).toHaveBeenLastCalledWith("ab Pog", []);
  });

  it("does not insert past maxLength", () => {
    render({ initial: "abcdef", maxLength: 8 });
    let inserted = true;
    act(() => {
      inserted = handle.current?.insertAtCaret("KEKW") ?? true;
    });
    expect(inserted).toBe(false);
    expect(changed).not.toHaveBeenCalled();
  });

  it("inserts exactly at maxLength", () => {
    render({ initial: "ab", maxLength: 7 });
    act(() => {
      handle.current?.insertAtCaret("KEKW");
    });
    expect(changed).toHaveBeenLastCalledWith("ab KEKW", []);
  });
});

describe("MentionTextarea maxLength with stickers", () => {
  it("counts the code, not the image, and restores the text when typing goes over", () => {
    const field = render({ initial: "KEKW", maxLength: 6 });
    typeInto(field, "KEKW abc");
    expect(changed).not.toHaveBeenCalled();
    expect(valueOf(field)).toBe("KEKW");
  });
});

describe("MentionTextarea stickers without a resolvable image", () => {
  function renderUnresolved(initial: string) {
    function Unresolved() {
      const [value, setText] = useState(initial);
      return (
        <MentionTextarea
          value={value}
          onChange={(next, ids) => {
            setText(next);
            changed(next, ids);
          }}
          stickers={{ KEKW: { url: "", alt: "KEKW laughing" } }}
          mentionResults={[]}
          onMentionQueryChange={() => undefined}
        />
      );
    }
    act(() => root.render(<Unresolved />));
    return fieldIn(container);
  }

  it("removes one character with Backspace from a code that is only shown as text", () => {
    const field = renderUnresolved("a KEKW");
    selectText(field, 6);

    press(field, "Backspace");

    expect(field.querySelector("img")).toBeNull();
    expect(changed).not.toHaveBeenCalledWith("a ", []);
  });
});

describe("MentionTextarea copy without a selection", () => {
  it("does not throw when the document has no selection range", () => {
    const field = render({ initial: "oi KEKW" });
    act(() => document.getSelection()?.removeAllRanges());
    const event = new Event("copy", { bubbles: true, cancelable: true });

    expect(() => act(() => void field.dispatchEvent(event))).not.toThrow();
  });
});
