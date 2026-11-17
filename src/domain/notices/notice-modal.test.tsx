// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { NoticeModal } from "./notice-modal.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const NOTICE_HTML = "<p>Conteúdo publicado</p>";

function mountNotice() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const onOpenChange = vi.fn();
  act(() => {
    root.render(
      <NoticeModal
        open
        onOpenChange={onOpenChange}
        title="Manutenção na rede"
        html={NOTICE_HTML}
        theme="light"
        publishedAtLabel="publicado em 15/11/2026"
      />,
    );
  });
  const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
  if (!dialog) throw new Error("dialog did not open");
  return { root, dialog, onOpenChange };
}

function mountClosed(): Root {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(
      <NoticeModal
        open={false}
        onOpenChange={vi.fn()}
        title="Aviso"
        html={NOTICE_HTML}
        theme="light"
      />,
    );
  });
  return root;
}

/** The rendered frame does not load srcdoc under jsdom: declare the theme on its document by hand. */
function declareTheme(dialog: HTMLElement, declarations: Record<string, string>): void {
  const frame = dialog.querySelector("iframe");
  if (!frame) throw new Error("frame not rendered");
  const doc = frame.contentDocument;
  if (!doc) throw new Error("frame document unavailable");
  for (const [property, value] of Object.entries(declarations)) {
    doc.documentElement.style.setProperty(property, value);
  }
  act(() => {
    frame.dispatchEvent(new Event("load"));
  });
}

function buttonWithText(container: ParentNode, text: string): HTMLButtonElement | null {
  return [...container.querySelectorAll("button")].find((button) =>
    button.textContent?.includes(text),
  ) as HTMLButtonElement | null;
}

describe("NoticeModal", () => {
  let root: Root | null = null;

  afterEach(() => {
    root?.unmount();
    root = null;
    document.body.replaceChildren();
  });

  it("renders header, frame and footer as parts of one surface", () => {
    const mounted = mountNotice();
    root = mounted.root;

    expect(mounted.dialog.querySelector("iframe")).not.toBeNull();
    expect(mounted.dialog.textContent).toContain("Aviso");
    expect(mounted.dialog.textContent).toContain("Manutenção na rede");
    expect(mounted.dialog.textContent).toContain("publicado em 15/11/2026");
    expect(mounted.dialog.textContent).toContain("Entendi");
  });

  it("does not override any token when the HTML declares no theme", () => {
    const mounted = mountNotice();
    root = mounted.root;

    expect(mounted.dialog.getAttribute("style")).not.toContain("--notice-");
  });

  it("paints the container with the identity the published HTML declares", () => {
    const mounted = mountNotice();
    root = mounted.root;

    declareTheme(mounted.dialog, {
      "--notice-primary": "#7c5cff",
      "--notice-background": "#111015",
      "--notice-button-text": "#f4f2ff",
    });

    expect(mounted.dialog.style.getPropertyValue("--notice-primary")).toBe("#7c5cff");
    expect(mounted.dialog.style.getPropertyValue("--notice-background")).toBe("#111015");
    expect(mounted.dialog.style.getPropertyValue("--notice-button-text")).toBe("#f4f2ff");
  });

  it("computes the confirm button text color when the primary is declared without a button text", () => {
    const mounted = mountNotice();
    root = mounted.root;

    declareTheme(mounted.dialog, { "--notice-primary": "#111015" });

    // The computed color takes the same custom property the declared button text would use.
    expect(mounted.dialog.style.getPropertyValue("--notice-button-text")).toBe("#f4f2ff");
  });

  it("confirms the reading through the app callback and closes", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    const onOpenChange = vi.fn();
    const onConfirm = vi.fn();
    act(() => {
      root!.render(
        <NoticeModal
          open
          onOpenChange={onOpenChange}
          title="Aviso"
          html={NOTICE_HTML}
          theme="light"
          onConfirm={onConfirm}
        />,
      );
    });

    const confirm = buttonWithText(document, "Entendi");
    expect(confirm).not.toBeNull();
    act(() => {
      confirm!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes through the header button without confirming", () => {
    const mounted = mountNotice();
    root = mounted.root;
    const onConfirm = vi.fn();

    const close = mounted.dialog.querySelector<HTMLElement>('button[aria-label="Fechar"]');
    expect(close).not.toBeNull();
    act(() => {
      close!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(mounted.onOpenChange).toHaveBeenCalledWith(false);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("renders nothing while closed", () => {
    root = mountClosed();

    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });
});
