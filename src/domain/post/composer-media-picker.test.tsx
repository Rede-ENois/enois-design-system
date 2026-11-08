// @vitest-environment jsdom
import { type ComponentProps, act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ComposerMediaPicker } from "./composer-media-picker.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function mount(props: ComponentProps<typeof ComposerMediaPicker>) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  act(() => root.render(<ComposerMediaPicker {...props} />));
  return {
    container,
    input: container.querySelector<HTMLInputElement>('input[type="file"]')!,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

describe("ComposerMediaPicker", () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it("offers the picker and hides it once the limit is reached", () => {
    const open = renderToStaticMarkup(
      <ComposerMediaPicker items={[]} onFiles={() => {}} onRemove={() => {}} />,
    );
    const full = renderToStaticMarkup(
      <ComposerMediaPicker
        items={[{ preview: "blob:1", status: "allowed" }]}
        onFiles={() => {}}
        onRemove={() => {}}
        canAddMore={false}
      />,
    );

    expect(open).toContain('aria-label="Adicionar imagem"');
    expect(full).not.toContain('aria-label="Adicionar imagem"');
  });

  it("shows where each upload stands and how to drop it", () => {
    const markup = renderToStaticMarkup(
      <ComposerMediaPicker
        items={[
          { preview: "blob:1", status: "checking" },
          { preview: "blob:2", status: "prohibited" },
        ]}
        onFiles={() => {}}
        onRemove={() => {}}
      />,
    );

    expect(markup).toContain("Verificando imagem");
    expect(markup).toContain("Imagem ocultada");
    expect(markup.match(/aria-label="Remover mídia"/g)).toHaveLength(2);
  });

  it("owns the file input and hands the chosen files to the app", () => {
    const onFiles = vi.fn();
    const { input, unmount } = mount({ items: [], onFiles, onRemove: () => {} });
    const file = new File(["x"], "foto.png", { type: "image/png" });

    expect(input.accept).toBe("image/*");
    expect(input.multiple).toBe(true);

    Object.defineProperty(input, "files", { value: [file], configurable: true });
    act(() => input.dispatchEvent(new Event("change", { bubbles: true })));

    expect(onFiles).toHaveBeenCalledWith([file]);
    // Cleared right away: picking the same file again has to fire the change again.
    expect(input.value).toBe("");
    unmount();
  });

  it("takes a single file when the composer does not accept many", () => {
    const onFiles = vi.fn();
    const { input, unmount } = mount({
      items: [],
      onFiles,
      onRemove: () => {},
      multiple: false,
      accept: "image/png",
    });
    const files = [
      new File(["x"], "a.png", { type: "image/png" }),
      new File(["y"], "b.png", { type: "image/png" }),
    ];

    expect(input.accept).toBe("image/png");
    Object.defineProperty(input, "files", { value: files, configurable: true });
    act(() => input.dispatchEvent(new Event("change", { bubbles: true })));

    expect(onFiles).toHaveBeenCalledWith([files[0]]);
    unmount();
  });
});
