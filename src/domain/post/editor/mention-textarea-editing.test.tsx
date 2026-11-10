// @vitest-environment jsdom
import { act, useState } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { MentionTextareaProps } from "../../../types/domain/post/mention-textarea-props.js";
import type { MentionUser } from "../../../types/domain/post/mention-user.js";

import { fieldIn, selectText, selectionOf, typeInto } from "./editor.fixture.js";
import { MentionTextarea } from "./mention-textarea.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const ana: MentionUser = { id: "user-a", username: "ana-silva", name: "Ana Example", avatar: null };
const bia: MentionUser = { id: "user-b", username: "bia_2", name: "Bia Example", avatar: null };
const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);
const changed = vi.fn();
let replaceValue: (value: string) => void;

afterEach(() => {
  act(() => root.render(null));
  changed.mockClear();
});

function Field({ maxLength }: Pick<MentionTextareaProps, "maxLength">) {
  const [value, setText] = useState("");
  replaceValue = setText;
  return (
    <MentionTextarea
      value={value}
      onChange={(next, ids) => {
        setText(next);
        changed(next, ids);
      }}
      maxLength={maxLength}
      toolbar
      mentionResults={[ana, bia]}
      onMentionQueryChange={() => undefined}
    />
  );
}

function render(maxLength?: number) {
  act(() => root.render(<Field maxLength={maxLength} />));
  return fieldIn(container);
}

function type(textarea: HTMLElement, text: string) {
  typeInto(textarea, text);
}

function pick(user: MentionUser) {
  const button = Array.from(container.querySelectorAll("button")).find((item) =>
    item.textContent?.includes(user.name),
  );
  expect(button).toBeDefined();
  act(() =>
    button!.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true })),
  );
}

function bold(textarea: HTMLElement, keyboard: boolean) {
  act(() => {
    if (keyboard) {
      textarea.dispatchEvent(
        new KeyboardEvent("keydown", { key: "b", ctrlKey: true, bubbles: true, cancelable: true }),
      );
    } else {
      container
        .querySelector('[role="toolbar"] button')!
        .dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });
}

describe("MentionTextarea confirmed mentions", () => {
  it("does not restore recipients after the parent clears a submitted draft", () => {
    const textarea = render();
    type(textarea, "@an");
    pick(ana);
    expect(changed).toHaveBeenLastCalledWith("@ana-silva ", [ana.id]);

    act(() => replaceValue(""));
    type(textarea, "A new draft");

    expect(changed).toHaveBeenLastCalledWith("A new draft", []);
  });

  it.each([
    "No mentions",
    "@ana-silv",
    "@ana-silva2",
    "@ana-silva_extra",
    "@ana-silva-more",
    "mail@ana-silva",
  ])("removes the recipient when the complete token is replaced by %s", (text) => {
    const textarea = render();
    type(textarea, "@an");
    pick(ana);
    type(textarea, text);
    expect(changed).toHaveBeenLastCalledWith(text, []);
  });

  it("retains only selected users still present, without duplicate IDs", () => {
    const textarea = render();
    type(textarea, "@an");
    pick(ana);
    type(textarea, `${textarea.textContent}@bi`);
    pick(bia);
    type(textarea, `${textarea.textContent}@an`);
    pick(ana);
    expect(changed).toHaveBeenLastCalledWith("@ana-silva @bia_2 @ana-silva ", [ana.id, bia.id]);

    type(textarea, "Hello (@ana-silva), @ana-silva!");
    expect(changed).toHaveBeenLastCalledWith("Hello (@ana-silva), @ana-silva!", [ana.id]);
    type(textarea, "@ana-silva and @bia_2");
    expect(changed).toHaveBeenLastCalledWith("@ana-silva and @bia_2", [ana.id]);
  });

  it("reconciles an externally replaced value before the next edit", () => {
    const textarea = render();
    type(textarea, "@an");
    pick(ana);
    act(() => replaceValue("Another draft"));
    type(textarea, "Another draft with @ana-silva typed manually");
    expect(changed).toHaveBeenLastCalledWith("Another draft with @ana-silva typed manually", []);
  });

  it.each(["_@ana-silva_", "__@ana-silva__", "**_@ana-silva_**", "- item\n  - _@ana-silva_"])(
    "retains the selected recipient inside rendered Markdown: %s",
    (text) => {
      const textarea = render();
      type(textarea, "@an");
      pick(ana);
      type(textarea, text);
      expect(changed).toHaveBeenLastCalledWith(text, [ana.id]);
    },
  );

  it.each(["`@ana-silva`", "```\n@ana-silva\n```"])(
    "removes a recipient when its token becomes literal code: %s",
    (text) => {
      const textarea = render();
      type(textarea, "@an");
      pick(ana);
      type(textarea, text);
      expect(changed).toHaveBeenLastCalledWith(text, []);
    },
  );
});

describe("MentionTextarea insertion limits", () => {
  it.each([false, true])(
    "rejects over-limit bold without changing selection (keyboard=%s)",
    (keyboard) => {
      const textarea = render(12);
      type(textarea, "abcdefghijkl");
      selectText(textarea, 2, 6);
      changed.mockClear();

      bold(textarea, keyboard);

      expect(textarea.textContent).toBe("abcdefghijkl");
      expect(selectionOf(textarea)).toEqual({ start: 2, end: 6 });
      expect(changed).not.toHaveBeenCalled();
    },
  );

  it.each([false, true])(
    "allows bold exactly at the limit and below it (keyboard=%s)",
    (keyboard) => {
      const textarea = render(9);
      type(textarea, "short");
      selectText(textarea, 0, 5);
      bold(textarea, keyboard);
      expect(changed).toHaveBeenLastCalledWith("**short**", []);
      type(textarea, "ok");
      selectText(textarea, 0, 2);
      bold(textarea, keyboard);
      expect(changed).toHaveBeenLastCalledWith("**ok**", []);
    },
  );

  it("keeps an over-limit suggestion unselected, including its recipient", () => {
    const textarea = render(10);
    type(textarea, "@an");
    changed.mockClear();
    pick(ana);
    expect(textarea.textContent).toBe("@an");
    expect(changed).not.toHaveBeenCalled();
    type(textarea, "plain");
    expect(changed).toHaveBeenLastCalledWith("plain", []);
  });

  it.each([11, 12, undefined])("allows a complete mention with maxLength=%s", (maxLength) => {
    const textarea = render(maxLength);
    type(textarea, "@an");
    pick(ana);
    expect(changed).toHaveBeenLastCalledWith("@ana-silva ", [ana.id]);
  });

  it("allows formatting when no maximum is supplied", () => {
    const textarea = render();
    type(textarea, "x".repeat(1200));
    selectText(textarea, 0, 1200);
    bold(textarea, true);
    expect(textarea.textContent).toHaveLength(1204);
  });
});
