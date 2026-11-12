// @vitest-environment jsdom
import { act, useState } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { fieldIn, selectText, selectionOf, typeInto } from "./editor.fixture.js";
import { MentionTextarea } from "./mention-textarea.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

function Field({ onSubmitShortcut }: { onSubmitShortcut?: () => void }) {
  const [value, setText] = useState("");
  return (
    <MentionTextarea
      value={value}
      onChange={(next) => setText(next)}
      onSubmitShortcut={onSubmitShortcut}
      mentionResults={[{ id: "u1", username: "ana", name: "Ana", avatar: null }]}
      onMentionQueryChange={() => undefined}
    />
  );
}

function render(onSubmitShortcut?: () => void) {
  act(() => root.render(<Field onSubmitShortcut={onSubmitShortcut} />));
  return fieldIn(container);
}

function type(textarea: HTMLElement, text: string) {
  typeInto(textarea, text);
}

function press(textarea: HTMLElement, init: KeyboardEventInit) {
  const event = new KeyboardEvent("keydown", {
    key: "Enter",
    bubbles: true,
    cancelable: true,
    ...init,
  });
  act(() => {
    textarea.dispatchEvent(event);
  });
  return event;
}

describe("MentionTextarea: Ctrl+Enter", () => {
  it("envia com Ctrl+Enter e com Cmd+Enter", () => {
    const submit = vi.fn();
    const textarea = render(submit);
    type(textarea, "oi");

    expect(press(textarea, { ctrlKey: true }).defaultPrevented).toBe(true);
    press(textarea, { metaKey: true });
    expect(submit).toHaveBeenCalledTimes(2);
  });

  it("Enter puro continua quebrando linha", () => {
    const submit = vi.fn();
    const textarea = render(submit);
    type(textarea, "oi");

    expect(press(textarea, {}).defaultPrevented).toBe(false);
    expect(submit).not.toHaveBeenCalled();
  });

  it("com a lista de menção aberta, Ctrl+Enter envia em vez de escolher a pessoa", () => {
    const submit = vi.fn();
    const textarea = render(submit);
    type(textarea, "@an");
    expect(container.textContent).toContain("Ana");

    press(textarea, { ctrlKey: true });
    expect(submit).toHaveBeenCalledOnce();
    expect(textarea.textContent).toBe("@an");
  });

  it("sem onSubmitShortcut não há atalho", () => {
    const textarea = render();
    type(textarea, "oi");

    expect(press(textarea, { ctrlKey: true }).defaultPrevented).toBe(false);
  });
});
