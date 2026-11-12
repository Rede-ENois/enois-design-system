// @vitest-environment jsdom
import { act, useState } from "react";

import { createRoot, hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { EditorSticker } from "../../../types/domain/post/editor-sticker.js";

import { fieldIn, selectText, typeInto, valueOf } from "./editor.fixture.js";
import { MentionTextarea } from "./mention-textarea.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const stickers: Record<string, EditorSticker> = {
  KEKW: { url: "https://cdn.example.test/kekw.webp", alt: "KEKW laughing" },
};
const changed = vi.fn();

function Field({ initial }: { initial: string }) {
  const [value, setText] = useState(initial);
  return (
    <MentionTextarea
      value={value}
      onChange={(next, ids) => {
        setText(next);
        changed(next, ids);
      }}
      stickers={stickers}
      mentionResults={[]}
      onMentionQueryChange={() => undefined}
    />
  );
}

afterEach(() => {
  changed.mockClear();
  vi.restoreAllMocks();
  document.body.replaceChildren();
});

describe("MentionTextarea: server markup", () => {
  it("renders the current text, not an empty field", () => {
    const html = renderToString(<Field initial="hello world" />);

    expect(html).toContain("hello world");
  });

  it("renders a sticker as an image with its alt text", () => {
    const html = renderToString(<Field initial="so funny KEKW lol" />);

    expect(html).toContain('src="https://cdn.example.test/kekw.webp"');
    expect(html).toContain('alt="KEKW laughing"');
    expect(html).toContain('data-sticker-code="KEKW"');
  });

  it("hydrates without warnings and keeps editing working", () => {
    const initial = "so funny KEKW lol\n";
    const host = document.createElement("div");
    document.body.append(host);
    host.innerHTML = renderToString(<Field initial={initial} />);
    const errors = vi.spyOn(console, "error").mockImplementation(() => undefined);

    act(() => {
      hydrateRoot(host, <Field initial={initial} />);
    });
    const field = fieldIn(host);

    expect(errors).not.toHaveBeenCalled();
    expect(valueOf(field)).toBe(initial);
    expect(field.querySelector("img")?.getAttribute("alt")).toBe("KEKW laughing");

    typeInto(field, "so funny KEKW lol\nnext");
    expect(changed).toHaveBeenLastCalledWith("so funny KEKW lol\nnext", []);
    expect(field.querySelectorAll("img")).toHaveLength(1);
  });
});

describe("MentionTextarea: Enter at the end", () => {
  function inputAtEnd(inputType: string, domText: string) {
    const host = document.createElement("div");
    document.body.append(host);
    act(() => {
      createRoot(host).render(<Field initial="oi" />);
    });
    const field = fieldIn(host);
    act(() => {
      field.textContent = domText;
      selectText(field, domText.length);
      field.dispatchEvent(new InputEvent("input", { bubbles: true, inputType }));
    });
    return field;
  }

  it("adds exactly one line break when the browser inserts two", () => {
    const field = inputAtEnd("insertParagraph", "oi\n\n");

    expect(changed).toHaveBeenLastCalledWith("oi\n", []);
    expect(valueOf(field)).toBe("oi\n");
  });

  it("keeps a single line break as it is", () => {
    inputAtEnd("insertParagraph", "oi\n");

    expect(changed).toHaveBeenLastCalledWith("oi\n", []);
  });

  it("does not touch text typed as two breaks by another kind of edit", () => {
    inputAtEnd("insertText", "oi\n\n");

    expect(changed).toHaveBeenLastCalledWith("oi\n\n", []);
  });
});
