// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { PortfolioBlockValues } from "../../types/domain/portfolio/portfolio-block-values.js";
import type { PortfolioEditorBlock } from "../../types/domain/portfolio/portfolio-editor-block.js";
import type { PortfolioEditorProps } from "../../types/domain/portfolio/portfolio-editor-props.js";

import { PortfolioEditor } from "./portfolio-editor.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.portfolioEditor;

const block = (overrides: Partial<PortfolioEditorBlock> = {}): PortfolioEditorBlock => ({
  id: "block_1",
  kind: "TEXT",
  title: "Primeira",
  text: "Texto",
  projectId: null,
  mediaId: null,
  linkUrl: null,
  unpublished: false,
  ...overrides,
});

describe("PortfolioEditor", () => {
  let root: Root;
  let host: HTMLDivElement;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  const render = (overrides: Partial<PortfolioEditorProps> = {}) => {
    const props: PortfolioEditorProps = {
      state: "ready",
      html: "",
      publishedVersion: 1,
      publishedAt: "2026-11-20",
      blocks: [],
      outros: [],
      error: null,
      pending: false,
      renderHtmlFrame: () => <div data-testid="frame" />,
      onDraftChange: vi.fn(),
      onSaveDraft: vi.fn(),
      onSaveBlock: vi.fn(),
      onRemoveBlock: vi.fn(),
      onReorder: vi.fn(),
      onPublish: vi.fn(),
      ...overrides,
    };
    act(() => root.render(<PortfolioEditor {...props} />));
    return props;
  };

  const click = (label: string) => {
    const button = Array.from(host.querySelectorAll("button")).find(
      (element) => element.textContent === label,
    );
    expect(button).toBeDefined();
    act(() => button?.click());
  };

  it("carregando e com erro não desenham o formulário", () => {
    render({ state: "loading" });
    expect(host.textContent).toContain(messages.loading);
    expect(host.querySelector("form")).toBeNull();

    act(() => root.render(<PortfolioEditor {...baseProps({ state: "error" })} />));
    expect(host.textContent).toContain(messages.error);
    expect(host.querySelector("form")).toBeNull();
  });

  it("diz no cabeçalho se a versão está no ar, mudou ou nunca existiu", () => {
    render({ publishedVersion: 0 });
    expect(host.textContent).toContain(messages.neverPublished);

    act(() =>
      root.render(<PortfolioEditor {...baseProps({ blocks: [block({ unpublished: true })] })} />),
    );
    expect(host.textContent).toContain(messages.unpublished);

    act(() => root.render(<PortfolioEditor {...baseProps({ blocks: [block()] })} />));
    expect(host.textContent).toContain(messages.published);
  });

  it("a ordem das peças vai para quem grava, do topo para o fim", () => {
    const onReorder = vi.fn();
    render({
      blocks: [block(), block({ id: "block_2", title: "Segunda" })],
      onReorder,
    });

    const downs = Array.from(host.querySelectorAll("button")).filter(
      (element) => element.getAttribute("aria-label") === messages.moveDown,
    );
    // A primeira peça desce para o segundo lugar (a segunda já é o fim, sem "descer").
    const [down] = downs;
    act(() => down.click());

    expect(onReorder).toHaveBeenCalledWith(["block_2", "block_1"]);
  });

  it("a peça nova grava só o campo do tipo escolhido", () => {
    const onSaveBlock = vi.fn();
    render({ onSaveBlock });

    act(() => {
      Array.from(host.querySelectorAll("button"))
        .find((element) => element.textContent === messages.addBlock)
        ?.click();
    });

    const kindPill = Array.from(host.querySelectorAll("button")).find(
      (element) => element.textContent === messages.kinds.LINK,
    );
    act(() => kindPill?.click());

    const link = host.querySelector<HTMLInputElement>("#portfolio-block-link");
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(link, "https://exemplo.test/trabalho");
      link?.dispatchEvent(new Event("input", { bubbles: true }));
    });

    act(() => {
      Array.from(host.querySelectorAll("button"))
        .find((element) => element.textContent === messages.saveBlock)
        ?.click();
    });

    expect(onSaveBlock).toHaveBeenCalledWith(
      {
        kind: "LINK",
        title: "",
        text: "",
        projectId: "",
        mediaId: "",
        linkUrl: "https://exemplo.test/trabalho",
      } satisfies PortfolioBlockValues,
      null,
    );
  });

  it("remover pede o id da peça, e publicar fica desligado sem nada para publicar", () => {
    const props = render({ blocks: [block()] });
    const remove = Array.from(host.querySelectorAll("button")).find((element) =>
      element.getAttribute("aria-label")?.startsWith("Remover"),
    );
    act(() => remove?.click());
    expect(props.onRemoveBlock).toHaveBeenCalledWith("block_1");

    render({ blocks: [], html: "" });
    const publish = Array.from(host.querySelectorAll("button")).find(
      (element) => element.textContent === messages.publish,
    );
    expect(publish?.disabled).toBe(true);
  });

  function baseProps(overrides: Partial<PortfolioEditorProps>): PortfolioEditorProps {
    return {
      state: "ready",
      html: "",
      publishedVersion: 1,
      publishedAt: "2026-11-20",
      blocks: [],
      outros: [],
      error: null,
      pending: false,
      renderHtmlFrame: () => null,
      onDraftChange: vi.fn(),
      onSaveDraft: vi.fn(),
      onSaveBlock: vi.fn(),
      onRemoveBlock: vi.fn(),
      onReorder: vi.fn(),
      onPublish: vi.fn(),
      ...overrides,
    };
  }
});
