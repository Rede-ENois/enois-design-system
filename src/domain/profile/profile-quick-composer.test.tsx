// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileQuickComposer } from "./profile-quick-composer.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => "blob:preview");
  URL.revokeObjectURL = vi.fn();
});

function render(onWriteArticle?: () => void) {
  const onPublish = vi.fn(async () => true);
  act(() =>
    root.render(
      <ProfileQuickComposer
        profile={{ name: "Pessoa Teste" }}
        onPublish={onPublish}
        onWriteArticle={onWriteArticle}
      />,
    ),
  );
  return onPublish;
}

function button(label: string) {
  const found = [...container.querySelectorAll("button")].find((candidate) =>
    candidate.textContent?.includes(label),
  );
  if (!found) throw new Error(`button not found: ${label}`);
  return found;
}

function hasButton(label: string) {
  return [...container.querySelectorAll("button")].some((candidate) =>
    candidate.textContent?.includes(label),
  );
}

function selectPhoto() {
  act(() => button("Foto").click());
  const input = container.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) throw new Error("file input not found");
  const file = new File(["x"], "foto.png", { type: "image/png" });
  Object.defineProperty(input, "files", { configurable: true, value: [file] });
  act(() => {
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

function type(text: string) {
  const textarea = container.querySelector("textarea");
  if (!textarea) throw new Error("textarea not found");
  const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
  act(() => {
    setValue?.call(textarea, text);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

describe("ProfileQuickComposer", () => {
  it("hands the article shortcut to the app instead of opening the text field", () => {
    const onWriteArticle = vi.fn();
    render(onWriteArticle);

    act(() => button("Escrever artigo").click());

    expect(onWriteArticle).toHaveBeenCalledOnce();
    expect(container.querySelector("textarea")).toBeNull();
  });

  it("hides the article shortcut when the app has no editor to open", () => {
    render();

    expect(hasButton("Escrever artigo")).toBe(false);
    expect(hasButton("Foto")).toBe(true);
  });

  it("keeps publish disabled for media without text, which the API refuses", () => {
    render();
    selectPhoto();

    expect(container.querySelector("img")).not.toBeNull();
    expect(button("Publicar").disabled).toBe(true);
  });

  it("publishes media once there is text", async () => {
    const onPublish = render();
    selectPhoto();
    type("Legenda");

    expect(button("Publicar").disabled).toBe(false);
    await act(async () => button("Publicar").click());

    expect(onPublish).toHaveBeenCalledWith(
      expect.objectContaining({
        content: "Legenda",
        files: [expect.objectContaining({ name: "foto.png" })],
      }),
    );
  });
});
