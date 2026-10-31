// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { ReleaseNotesEditorProps } from "../../types/domain/whats-new/release-notes-editor-props.js";

import { ReleaseNotesEditor } from "./release-notes-editor.js";

const messages = defaultMessages.releaseNotesEditor;

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

const done = { id: "a", title: "Par de estudo", description: "Estude junto." };

function render(overrides: Partial<ReleaseNotesEditorProps> = {}) {
  const props: ReleaseNotesEditorProps = {
    items: [done],
    onItemsChange: vi.fn(),
    liveSince: null,
    onPublish: vi.fn(),
    onRetire: vi.fn(),
    ...overrides,
  };
  act(() => root.render(<ReleaseNotesEditor {...props} />));
  return props;
}

const button = (label: string) =>
  [...host.querySelectorAll("button")].find((node) => node.textContent?.includes(label));

describe("ReleaseNotesEditor", () => {
  it("publishes only when every item has a title and a description", () => {
    const props = render({ items: [done, { id: "b", title: "Novo", description: "" }] });
    expect(button(messages.publish)?.disabled).toBe(true);

    render({ items: [done], onPublish: props.onPublish });
    act(() => button(messages.publish)?.click());
    expect(props.onPublish).toHaveBeenCalledOnce();
  });

  it("adds an empty item and stops at the limit", () => {
    const props = render();
    act(() => button(messages.add)?.click());
    expect(props.onItemsChange).toHaveBeenCalledWith([
      done,
      expect.objectContaining({ title: "", description: "" }),
    ]);

    render({ items: [done, { ...done, id: "b" }], maxItems: 2 });
    expect(button(messages.add)?.disabled).toBe(true);
  });

  it("removes an item by its labelled button", () => {
    const props = render({ items: [done, { ...done, id: "b" }] });
    act(() =>
      host.querySelector<HTMLButtonElement>(`[aria-label="${messages.remove(1)}"]`)?.click(),
    );
    expect(props.onItemsChange).toHaveBeenCalledWith([{ ...done, id: "b" }]);
  });

  it("offers to retire only what is on air", () => {
    render();
    expect(button(messages.retire)).toBeUndefined();
    expect(host.textContent).toContain(messages.none);

    const props = render({ liveSince: "31/10/2026" });
    expect(host.textContent).toContain(messages.live("31/10/2026"));
    expect(button(messages.republish)).toBeDefined();
    act(() => button(messages.retire)?.click());
    expect(props.onRetire).toHaveBeenCalledOnce();
  });
});
