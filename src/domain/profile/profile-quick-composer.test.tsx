// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileQuickComposer } from "./profile-quick-composer.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function render(onWriteArticle?: () => void) {
  const handlers = { onCompose: vi.fn(), onComposeWithMedia: vi.fn() };
  act(() =>
    root.render(
      <ProfileQuickComposer
        profile={{ name: "Pessoa Teste" }}
        {...handlers}
        onWriteArticle={onWriteArticle}
      />,
    ),
  );
  return handlers;
}

function button(label: string) {
  const found = [...container.querySelectorAll("button")].find((candidate) =>
    candidate.textContent?.includes(label),
  );
  if (!found) throw new Error(`button not found: ${label}`);
  return found;
}

function fileInput() {
  const input = container.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) throw new Error("file input not found");
  return input;
}

function pick(files: File[]) {
  const input = fileInput();
  Object.defineProperty(input, "files", { configurable: true, value: files });
  act(() => {
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

describe("ProfileQuickComposer", () => {
  it("never publishes inline: starting a post opens the full composer", () => {
    const { onCompose } = render();

    act(() => button("Começar publicação").click());

    expect(onCompose).toHaveBeenCalledOnce();
    expect(container.querySelector("textarea")).toBeNull();
  });

  it("hands the picked photos to the full composer", () => {
    const { onComposeWithMedia } = render();
    const click = vi.spyOn(fileInput(), "click").mockImplementation(() => undefined);

    act(() => button("Foto").click());
    expect(click).toHaveBeenCalledOnce();
    expect(fileInput().accept).toBe("image/*");
    expect(fileInput().multiple).toBe(true);

    const photo = new File(["x"], "foto.png", { type: "image/png" });
    pick([photo]);

    expect(onComposeWithMedia).toHaveBeenCalledWith([photo]);
  });

  it("asks for a single video", () => {
    render();
    vi.spyOn(fileInput(), "click").mockImplementation(() => undefined);

    act(() => button("Vídeo").click());

    expect(fileInput().accept).toBe("video/*");
    expect(fileInput().multiple).toBe(false);
  });

  it("does nothing when the picker is dismissed", () => {
    const { onComposeWithMedia } = render();

    pick([]);

    expect(onComposeWithMedia).not.toHaveBeenCalled();
  });

  it("hands the article shortcut to the app", () => {
    const onWriteArticle = vi.fn();
    render(onWriteArticle);

    act(() => button("Escrever artigo").click());

    expect(onWriteArticle).toHaveBeenCalledOnce();
  });

  it("draws the dividers on square cells, not on the rounded buttons", () => {
    render(() => undefined);

    const row = button("Foto").closest("div.divide-x");
    expect(row).not.toBeNull();
    for (const cell of row?.children ?? []) {
      expect(cell.tagName).toBe("DIV");
      expect(cell.className).not.toMatch(/rounded/);
    }
  });

  it("hides the article shortcut when the app has no editor to open", () => {
    render();

    expect(container.textContent).not.toContain("Escrever artigo");
    expect(container.textContent).toContain("Foto");
  });
});
