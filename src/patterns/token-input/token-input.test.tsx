// @vitest-environment jsdom
import { act, createRef, useState } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { TokenInputHandle } from "../../types/patterns/token-input-handle.js";
import type { TokenInputProps } from "../../types/patterns/token-input-props.js";

import { TokenInput } from "./token-input.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;
const ref = createRef<TokenInputHandle>();
const added = vi.fn();
const removed = vi.fn();

function Field(props: Partial<TokenInputProps>) {
  const [values, setValues] = useState(props.values ?? []);
  return (
    <TokenInput
      label="Tecnologias"
      max={10}
      maxLength={40}
      {...props}
      ref={ref}
      values={values}
      onAdd={(token) => {
        added(token);
        setValues((current) => [...current, token]);
      }}
      onRemove={(token) => {
        removed(token);
        setValues((current) => current.filter((value) => value !== token));
      }}
    />
  );
}

const input = () => host.querySelector("input")!;
const tokens = () => [...host.querySelectorAll('button[aria-label^="Remover "]')];
function type(value: string) {
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input(), value);
    input().dispatchEvent(new Event("input", { bubbles: true }));
  });
}
function key(value: string) {
  act(() =>
    input().dispatchEvent(
      new KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true }),
    ),
  );
}
const render = (props: Partial<TokenInputProps> = {}) =>
  act(() => root.render(<Field {...props} />));

beforeEach(() => {
  added.mockClear();
  removed.mockClear();
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("TokenInput", () => {
  describe.each([
    { name: "project stacks", max: 10, allowMultiple: true },
    { name: "onboarding skills", max: 20, allowMultiple: false },
  ])("removal focus for $name", ({ max, allowMultiple }) => {
    it("returns focus to the input when the focused remove button is unmounted", () => {
      render({ values: ["React", "TypeScript"], max, allowMultiple });
      const removeButton = tokens()[0] as HTMLButtonElement;
      act(() => removeButton.focus());
      expect(document.activeElement).toBe(removeButton);
      act(() => removeButton.click());
      expect(removeButton.isConnected).toBe(false);
      expect(removed).toHaveBeenLastCalledWith("React");
      expect(document.activeElement).toBe(input());
      expect(tokens()).toHaveLength(1);
    });

    it("focuses the input after removal enables it at the item limit", () => {
      render({
        values: Array.from({ length: max }, (_, index) => `Tool ${index}`),
        max,
        allowMultiple,
      });
      expect(input().disabled).toBe(true);
      const removeButton = tokens()[0] as HTMLButtonElement;
      act(() => removeButton.focus());
      act(() => removeButton.click());
      expect(input().disabled).toBe(false);
      expect(document.activeElement).toBe(input());
      type("Rust");
      key("Enter");
      expect(added).toHaveBeenLastCalledWith("Rust");
      expect(tokens()).toHaveLength(max);
    });
  });

  it("confirms one token per action in single-item mode and preserves rejected batches", () => {
    render({ allowMultiple: false, max: 20, maxLength: 60 });
    type("React, TypeScript,");
    expect(added).not.toHaveBeenCalled();
    expect(input().value).toBe("React, TypeScript,");
    expect(host.querySelector('[role="alert"]')!.textContent).toBe(
      defaultMessages.tokenInput.singleItem,
    );
    let result: string[] | null = [];
    act(() => {
      result = ref.current!.commit();
    });
    expect(result).toBeNull();
    expect(added).not.toHaveBeenCalled();
    type("React,");
    expect(added.mock.calls).toEqual([["React"]]);
    expect(input().value).toBe("");
    type("TypeScript");
    key("Enter");
    expect(added.mock.calls).toEqual([["React"], ["TypeScript"]]);
    expect(tokens()).toHaveLength(2);
  });

  it("keeps action buttons in place until their click commits the draft", () => {
    render({ suggestions: ["React", "Redis"] });
    const action = document.createElement("button");
    host.append(action);
    act(() => input().focus());
    type("Node");
    act(() => action.focus());
    expect(added).not.toHaveBeenCalled();
    expect(input().value).toBe("Node");
    act(() => {
      ref.current!.commit();
    });
    expect(added).toHaveBeenCalledWith("Node");
  });

  it("commits Android input commas and pasted lists without empty or duplicate tokens", () => {
    render();
    type(" React, TypeScript, react, , TypeScript, Node,");
    expect(added.mock.calls.map(([value]) => value)).toEqual(["React", "TypeScript", "Node"]);
    expect(tokens()).toHaveLength(3);
    expect(input().value).toBe("");
    type("REACT,");
    expect(tokens()).toHaveLength(3);
    expect(input().value).toBe("");
  });

  it("commits Enter and desktop commas and removes by Backspace or button", () => {
    render();
    type(" React ");
    key("Enter");
    type("Go");
    key(",");
    expect(tokens()).toHaveLength(2);
    key("Backspace");
    expect(removed).toHaveBeenLastCalledWith("Go");
    act(() => (tokens()[0] as HTMLButtonElement).click());
    expect(tokens()).toHaveLength(0);
    type(" ");
    key("Enter");
    expect(added).toHaveBeenCalledTimes(2);
  });

  it("keeps the unfinished pasted token and exposes it synchronously to Save", () => {
    render();
    type("React, TypeScript");
    expect(tokens()).toHaveLength(1);
    expect(input().value).toBe(" TypeScript");
    let result: string[] | null = null;
    act(() => {
      result = ref.current!.commit();
    });
    expect(result).toEqual(["React", "TypeScript"]);
    expect(tokens()).toHaveLength(2);
    expect(input().value).toBe("");
  });

  it("commits when leaving the field but keeps suggestion clicks from adding the draft twice", () => {
    render({ suggestions: ["React", "Redis"] });
    act(() => input().focus());
    type("Re");
    const suggestion = [...host.querySelectorAll("button")].find(
      (item) => item.textContent === "React",
    )!;
    act(() => {
      suggestion.focus();
      suggestion.click();
    });
    expect(added.mock.calls.map(([value]) => value)).toEqual(["React"]);
    act(() => input().focus());
    type("Node");
    act(() => input().blur());
    expect(added).toHaveBeenLastCalledWith("Node");
  });

  it("enforces 10/40, rejects oversized batches without dropping text and allows correction", () => {
    render();
    type("a".repeat(41));
    key("Enter");
    expect(added).not.toHaveBeenCalled();
    expect(input().value).toHaveLength(41);
    expect(host.querySelector('[role="alert"]')!.textContent).toBe(
      defaultMessages.tokenInput.tooLong(40),
    );
    type(Array.from({ length: 11 }, (_, index) => `Tech${index}`).join(",") + ",");
    expect(added).not.toHaveBeenCalled();
    expect(host.querySelector('[role="alert"]')!.textContent).toBe(
      defaultMessages.tokenInput.tooMany(10),
    );
    type(
      ["a".repeat(40), ...Array.from({ length: 9 }, (_, index) => `Tech${index}`)].join(",") + ",",
    );
    expect(tokens()).toHaveLength(10);
    expect(input().disabled).toBe(true);
    act(() => (tokens()[0] as HTMLButtonElement).click());
    expect(input().disabled).toBe(false);
  });

  it("honors 20/60 for onboarding and filters/caps suggestions", () => {
    render({
      max: 20,
      maxLength: 60,
      values: ["React"],
      suggestions: ["React", ...Array.from({ length: 10 }, (_, index) => `Tool ${index}`)],
    });
    expect(host.querySelector('[role="group"]')!.querySelectorAll("button")).toHaveLength(8);
    type("Tool 9");
    expect(host.querySelector('[role="group"]')!.textContent).toBe("Tool 9");
    type("a".repeat(60));
    key("Enter");
    expect(added).toHaveBeenLastCalledWith("a".repeat(60));
    expect(host.textContent).toContain("2 de 20");
  });

  it("does not tokenize or delete during IME composition", () => {
    render();
    act(() => input().dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true })));
    type("React,");
    key("Enter");
    key("Backspace");
    expect(added).not.toHaveBeenCalled();
    expect(removed).not.toHaveBeenCalled();
    act(() => input().dispatchEvent(new CompositionEvent("compositionend", { bubbles: true })));
    expect(added).toHaveBeenCalledWith("React");
    expect(input().value).toBe("");
  });

  it("disables input, removals and suggestions while pending", () => {
    render({ disabled: true, values: ["React"], suggestions: ["Go"] });
    expect(input().disabled).toBe(true);
    expect((tokens()[0] as HTMLButtonElement).disabled).toBe(true);
    expect(host.querySelector('[role="group"]')).toBeNull();
  });
});
