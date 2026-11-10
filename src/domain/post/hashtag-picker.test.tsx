// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { HashtagPickerProps } from "../../types/domain/post/hashtag-picker-props.js";

import { HashtagPicker } from "./hashtag-picker.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// The popover positions itself with floating-ui, which asks for a ResizeObserver.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  globalThis.ResizeObserver ??= ResizeObserverStub as unknown as typeof ResizeObserver;
});

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const options = [
  { value: "TECH", label: "Tecnologia" },
  { value: "CAREER", label: "Carreira e mercado" },
];

function render(props: Partial<HashtagPickerProps> = {}) {
  const onChange = vi.fn();

  act(() =>
    root.render(
      <HashtagPicker
        options={options}
        value={null}
        onChange={onChange}
        placeholder="tópico"
        label="Tópico"
        {...props}
      />,
    ),
  );

  return onChange;
}

const trigger = () =>
  document.body.querySelector<HTMLButtonElement>('button[aria-label^="Tópico"]');
const optionElements = () =>
  Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'));

function openList() {
  const button = trigger();

  if (!button) throw new Error("trigger not found");

  act(() => button.click());
}

function press(key: string) {
  const target = document.activeElement;

  if (!(target instanceof HTMLElement)) throw new Error("nothing focused");

  act(() => {
    target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  });
}

describe("HashtagPicker", () => {
  it("shows the chosen option as a hashtag", () => {
    render({ value: "CAREER" });

    expect(trigger()?.textContent).toBe("#CarreiraEMercado");
  });

  it("asks for a choice with the placeholder tag while empty and required", () => {
    render({ required: true });

    expect(trigger()?.textContent).toBe("#tópico");
    expect(trigger()?.className).toContain("decoration-dashed");
    expect(trigger()?.getAttribute("aria-label")).toBe("Tópico (obrigatório)");
  });

  it("tells the screen reader it opens a list, not a dialog", () => {
    render();

    expect(trigger()?.getAttribute("aria-haspopup")).toBe("listbox");
    expect(trigger()?.getAttribute("aria-expanded")).toBe("false");
  });

  it("opens the list and chooses on click, once, closing after", () => {
    const onChange = render();

    openList();

    expect(optionElements()).toHaveLength(2);

    act(() => optionElements()[1]?.click());

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("CAREER");
    expect(optionElements()).toHaveLength(0);
  });

  it("moves focus with the arrow keys and chooses with Enter", () => {
    const onChange = render();

    openList();

    expect(document.activeElement).toBe(optionElements()[0]);

    press("ArrowDown");

    expect(document.activeElement).toBe(optionElements()[1]);

    press("Enter");

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("CAREER");
  });

  it("jumps to the first and last option with Home and End", () => {
    render();

    openList();
    press("End");

    expect(document.activeElement).toBe(optionElements()[1]);

    press("Home");

    expect(document.activeElement).toBe(optionElements()[0]);
  });

  it("chooses with Space too", () => {
    const onChange = render();

    openList();
    press(" ");

    expect(onChange).toHaveBeenCalledWith("TECH");
  });

  it("does not steal focus when the mouse passes over an option", () => {
    render();

    openList();

    expect(document.activeElement).toBe(optionElements()[0]);

    act(() => {
      optionElements()[1]?.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
    });

    expect(document.activeElement).toBe(optionElements()[0]);
  });

  it("opens on the option already chosen", () => {
    render({ value: "CAREER" });

    openList();

    expect(document.activeElement).toBe(optionElements()[1]);
  });
});
