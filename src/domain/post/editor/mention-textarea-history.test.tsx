// @vitest-environment jsdom
import { act, createRef, useCallback, useState } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { EditorSticker } from "../../../types/domain/post/editor-sticker.js";
import type { MentionTextareaHandle } from "../../../types/domain/post/mention-textarea-handle.js";
import type { MentionUser } from "../../../types/domain/post/mention-user.js";

import { fieldIn, selectText, typeInto, valueOf } from "./editor.fixture.js";
import { MentionTextarea } from "./mention-textarea.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const stickers: Record<string, EditorSticker> = {
  KEKW: { url: "https://cdn.example.test/kekw.webp", alt: "KEKW laughing" },
};
const noResults: MentionUser[] = [];
const maria: MentionUser = { id: "u1", name: "Maria", username: "maria", avatar: "" };

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);
const changed = vi.fn();
const handle = createRef<MentionTextareaHandle>();

afterEach(() => {
  act(() => root.render(null));
  changed.mockClear();
});

function Field({ maxLength, toolbar = false }: { maxLength?: number; toolbar?: boolean }) {
  const [value, setText] = useState("");
  const [results, setResults] = useState<MentionUser[]>(noResults);
  const search = useCallback(
    (query: string) => setResults(query.length >= 2 ? [maria] : noResults),
    [],
  );
  return (
    <>
      <button type="button" data-testid="clear" onClick={() => setText("")} />
      <MentionTextarea
        ref={handle}
        value={value}
        onChange={(next, ids) => {
          setText(next);
          changed(next, ids);
        }}
        maxLength={maxLength}
        toolbar={toolbar}
        stickers={stickers}
        mentionResults={results}
        onMentionQueryChange={search}
      />
    </>
  );
}

function render(props: Parameters<typeof Field>[0] = {}) {
  act(() => root.render(<Field {...props} />));
  return fieldIn(container);
}

const key = (
  field: HTMLElement,
  name: string,
  modifiers: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean } = {},
) => {
  const event = new KeyboardEvent("keydown", {
    key: name,
    bubbles: true,
    cancelable: true,
    ...modifiers,
  });
  act(() => {
    field.dispatchEvent(event);
  });
  return event;
};
const undo = (field: HTMLElement) => key(field, "z", { ctrlKey: true });
const redo = (field: HTMLElement) => key(field, "z", { ctrlKey: true, shiftKey: true });

const history = (field: HTMLElement, inputType: "historyUndo" | "historyRedo") => {
  const event = new InputEvent("beforeinput", { inputType, bubbles: true, cancelable: true });
  act(() => {
    field.dispatchEvent(event);
  });
  return event;
};

describe("MentionTextarea history", () => {
  it("undoes consecutive typing as one step and redoes it", () => {
    const field = render();
    typeInto(field, "o");
    typeInto(field, "oi");
    typeInto(field, "oi!");

    expect(undo(field).defaultPrevented).toBe(true);
    expect(valueOf(field)).toBe("");
    expect(changed).toHaveBeenLastCalledWith("", []);

    redo(field);
    expect(valueOf(field)).toBe("oi!");
  });

  it("redoes with Ctrl+Y and Cmd+Shift+Z", () => {
    const field = render();
    typeInto(field, "oi");
    undo(field);
    key(field, "y", { ctrlKey: true });
    expect(valueOf(field)).toBe("oi");

    undo(field);
    key(field, "Z", { metaKey: true, shiftKey: true });
    expect(valueOf(field)).toBe("oi");
  });

  it("undoes a sticker insert as its own step, apart from the typing before it", () => {
    const field = render();
    typeInto(field, "oi");
    act(() => {
      handle.current?.insertAtCaret("KEKW");
    });
    expect(valueOf(field)).toBe("oi KEKW");

    undo(field);
    expect(valueOf(field)).toBe("oi");
    expect(field.querySelector("img")).toBeNull();
    undo(field);
    expect(valueOf(field)).toBe("");
    redo(field);
    redo(field);
    expect(valueOf(field)).toBe("oi KEKW");
    expect(field.querySelector("img")).not.toBeNull();
  });

  it("undoes a formatting action, an emoji-style insert and a paste each in one step", () => {
    const field = render({ toolbar: true });
    typeInto(field, "texto");
    selectText(field, 0, 5);
    key(field, "b", { ctrlKey: true });
    expect(valueOf(field)).toBe("**texto**");

    const paste = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(paste, "clipboardData", {
      value: { files: [], getData: () => " colado" },
    });
    selectText(field, 9);
    act(() => {
      field.dispatchEvent(paste);
    });
    expect(valueOf(field)).toBe("**texto** colado");

    undo(field);
    expect(valueOf(field)).toBe("**texto**");
    undo(field);
    expect(valueOf(field)).toBe("texto");
  });

  it("undoes a cut in one step and a sticker deletion in one step", () => {
    const field = render();
    typeInto(field, "abc KEKW");
    selectText(field, 0, 3);
    const cut = new Event("cut", { bubbles: true, cancelable: true });
    Object.defineProperty(cut, "clipboardData", { value: { setData: () => undefined } });
    act(() => {
      field.dispatchEvent(cut);
    });
    expect(valueOf(field)).toBe(" KEKW");
    undo(field);
    expect(valueOf(field)).toBe("abc KEKW");

    selectText(field, 8);
    key(field, "Backspace");
    expect(valueOf(field)).toBe("abc ");
    undo(field);
    expect(valueOf(field)).toBe("abc KEKW");
    expect(field.querySelector("img")).not.toBeNull();
  });

  it("brings back the mentioned people when an undo restores a removed mention", () => {
    const field = render();
    typeInto(field, "@ma");
    const option = Array.from(container.querySelectorAll("button")).find((item) =>
      item.textContent?.includes(maria.name),
    );
    expect(option).toBeDefined();
    act(() => {
      option?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true }));
    });
    expect(changed).toHaveBeenLastCalledWith("@maria ", ["u1"]);

    typeInto(field, "");
    expect(changed).toHaveBeenLastCalledWith("", []);
    undo(field);
    expect(changed).toHaveBeenLastCalledWith("@maria ", ["u1"]);
  });

  it("respects maxLength: a step that would exceed it is refused and kept", () => {
    const field = render({ maxLength: 5 });
    typeInto(field, "abcde");
    selectText(field, 0, 5);
    act(() => {
      handle.current?.insertAtCaret("x");
    });
    expect(valueOf(field)).toBe("x");

    act(() => root.render(<Field maxLength={3} />));
    undo(fieldIn(container));
    expect(valueOf(fieldIn(container))).toBe("x");
  });

  it("does nothing, but still blocks the native undo, when there is no history", () => {
    const field = render();
    expect(undo(field).defaultPrevented).toBe(true);
    expect(changed).not.toHaveBeenCalled();
    expect(redo(field).defaultPrevented).toBe(true);
  });

  it("answers the historyUndo and historyRedo input events (Edit menu, phone)", () => {
    const field = render();
    typeInto(field, "oi");

    expect(history(field, "historyUndo").defaultPrevented).toBe(true);
    expect(valueOf(field)).toBe("");
    history(field, "historyRedo");
    expect(valueOf(field)).toBe("oi");
  });

  it("drops the history when the parent replaces the text", () => {
    const field = render();
    typeInto(field, "rascunho");
    act(() => {
      container.querySelector<HTMLElement>("[data-testid='clear']")?.click();
    });
    expect(valueOf(field)).toBe("");

    undo(field);
    expect(valueOf(field)).toBe("");
  });
});
