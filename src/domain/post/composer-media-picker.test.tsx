// @vitest-environment jsdom
import { type ComponentProps, act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { EnoisProvider } from "../../messages/enois-provider.js";
import type { ComposerMediaDraft } from "../../types/domain/post/composer-media-draft.js";

import { ComposerMediaPicker } from "./composer-media-picker.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function mount(props: ComponentProps<typeof ComposerMediaPicker>) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  const render = (nextProps: ComponentProps<typeof ComposerMediaPicker>) =>
    act(() => root.render(<ComposerMediaPicker {...nextProps} />));
  render(props);
  return {
    container,
    render,
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

  it("shows a measured byte count only for the attachment that supplied it", () => {
    const { container, unmount } = mount({
      items: [
        { preview: null, transport: { phase: "sending", bytesRemaining: 1024 } },
        { preview: null, transport: { phase: "sending" } },
        { preview: null, transport: { phase: "sending", bytesRemaining: -1 } },
      ],
      onFiles: vi.fn(),
      onRemove: vi.fn(),
    });
    try {
      expect(container.querySelectorAll('[role="status"]')).toHaveLength(3);
      expect(container.textContent).toContain("1.024 bytes restantes");
      expect(container.textContent?.match(/bytes restantes/g)).toHaveLength(1);
      expect(container.querySelector('[role="status"]')?.textContent).not.toContain("1.024");
    } finally {
      unmount();
    }
  });

  it("waits for explicit transfer completion without changing moderation", () => {
    const item: ComposerMediaDraft = { preview: null, status: "checking", id: "first" };
    const sibling: ComposerMediaDraft = {
      preview: null,
      id: "second",
      transport: { phase: "sending" },
    };
    const handlers = { onFiles: vi.fn(), onRemove: vi.fn() };
    const { container, render, unmount } = mount({
      items: [{ ...item, transport: { phase: "sending", bytesRemaining: 0 } }, sibling],
      ...handlers,
    });
    try {
      expect(container.textContent).toContain("0 bytes restantes");
      expect(container.textContent).not.toContain("aguardando resposta");
      render({
        items: [{ ...item, transport: { phase: "awaiting-response" } }, sibling],
        ...handlers,
      });
      expect(container.textContent).toContain("Enviado, aguardando resposta");
      expect(container.textContent).toContain("Verificando imagem");
      expect(container.textContent).toContain("Enviando…");
      expect(container.textContent).not.toMatch(/Processando|Aprovad[oa]|0 bytes restantes/i);
    } finally {
      unmount();
    }
  });

  it("keeps a technical failure separate from a policy refusal with stale transport feedback", () => {
    const retry = vi.fn();
    const refusedRetry = vi.fn();
    const { container, unmount } = mount({
      items: [
        { preview: null, transport: { phase: "failed", onRetry: retry } },
        {
          preview: "blob:2",
          status: "prohibited",
          transport: { phase: "failed", onRetry: refusedRetry },
        },
        { preview: null, transport: { phase: "failed" } },
      ],
      onFiles: vi.fn(),
      onRemove: vi.fn(),
    });
    try {
      expect(container.textContent?.match(/Falha no envio/g)).toHaveLength(2);
      expect(container.textContent).toContain("Imagem ocultada");
      expect(container.querySelector("img")?.classList.contains("blur-lg")).toBe(true);
      const buttons = container.querySelectorAll<HTMLButtonElement>(
        'button[aria-label^="Tentar de novo"]',
      );
      expect(buttons).toHaveLength(1);
      act(() => buttons[0].click());
      expect(retry).toHaveBeenCalledTimes(1);
      expect(refusedRetry).not.toHaveBeenCalled();
    } finally {
      unmount();
    }
  });

  it("keeps cancel bound to a stable item across reorder and still removes by position", () => {
    const cancelFirst = vi.fn();
    const onRemove = vi.fn();
    const onFiles = vi.fn();
    const first: ComposerMediaDraft = {
      id: "first",
      preview: null,
      transport: { phase: "sending", onCancel: cancelFirst },
    };
    const second: ComposerMediaDraft = {
      id: "second",
      preview: null,
      transport: { phase: "sending" },
    };
    const { container, render, unmount } = mount({ items: [first, second], onFiles, onRemove });
    try {
      const cancel = container.querySelector<HTMLButtonElement>(
        'button[aria-label="Cancelar envio: Anexo 1"]',
      );
      expect(cancel).not.toBeNull();
      render({ items: [second, first], onFiles, onRemove });
      expect(container.querySelectorAll('button[aria-label^="Cancelar envio"]')).toHaveLength(1);
      expect(container.querySelector('button[aria-label="Cancelar envio: Anexo 2"]')).toBe(cancel);
      act(() => cancel?.click());
      expect(cancelFirst).toHaveBeenCalledTimes(1);
      expect(onRemove).not.toHaveBeenCalled();
      const buttons = container.querySelectorAll<HTMLButtonElement>(
        'button[aria-label="Remover mídia"]',
      );
      act(() => buttons[1].click());
      expect(onRemove).toHaveBeenCalledExactlyOnceWith(1);
    } finally {
      unmount();
    }
  });

  it("uses the default transport messages with legacy picker copy", () => {
    const markup = renderToStaticMarkup(
      <EnoisProvider
        messages={{
          composerMediaPicker: {
            add: "Escolher imagem",
            remove: "Excluir mídia",
            checking: "Conferindo",
            prohibited: "Ocultada",
          },
        }}
      >
        <ComposerMediaPicker
          items={[{ preview: null, transport: { phase: "awaiting-response" } }]}
          onFiles={vi.fn()}
          onRemove={vi.fn()}
        />
      </EnoisProvider>,
    );
    expect(markup).toContain("Escolher imagem");
    expect(markup).toContain("Enviado, aguardando resposta");
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
