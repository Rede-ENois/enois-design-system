// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { PortfolioBlock } from "../../types/domain/portfolio/portfolio-block.js";
import type { PortfolioShowcaseProps } from "../../types/domain/portfolio/portfolio-showcase-props.js";

import { PortfolioShowcase } from "./portfolio-showcase.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.portfolioShowcase;

const block = (overrides: Partial<PortfolioBlock> = {}): PortfolioBlock => ({
  id: "block_1",
  kind: "TEXT",
  title: "Sobre o trabalho",
  text: "Texto da peça",
  linkUrl: null,
  project: null,
  mediaKind: null,
  fileUrl: null,
  imageUrl: null,
  ...overrides,
});

describe("PortfolioShowcase", () => {
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

  const render = (overrides: Partial<PortfolioShowcaseProps> = {}) => {
    act(() =>
      root.render(
        <PortfolioShowcase
          author={{
            username: "ana",
            name: "Ana Souza",
            avatarUrl: null,
            avatarFrame: null,
          }}
          profileHref="/perfil/ana"
          html={null}
          blocks={[]}
          publishedAt="2026-11-25"
          renderHtmlFrame={() => <div data-testid="frame" />}
          {...overrides}
        />,
      ),
    );
  };

  it("desenha a página no quadro isolado que o app entregou", () => {
    render({ html: "<p>Olá</p>" });
    expect(host.querySelector('[data-testid="frame"]')).not.toBeNull();
  });

  it("sem página e sem peças, mostra o estado vazio", () => {
    render();
    expect(host.textContent).toContain(messages.empty);
  });

  it("abre o PDF em outra aba, sem dar acesso à janela de quem lê", () => {
    render({
      blocks: [
        block({
          kind: "PDF",
          mediaKind: "PDF",
          fileUrl: "https://cdn.example.test/p.pdf",
          imageUrl: "https://cdn.example.test/p1.png",
        }),
      ],
    });

    const link = Array.from(host.querySelectorAll("a")).find(
      (anchor) => anchor.textContent === messages.openPdf,
    );
    expect(link?.getAttribute("href")).toBe("https://cdn.example.test/p.pdf");
    expect(link?.getAttribute("target")).toBe("_blank");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
    // O card mostra a página renderizada; o arquivo inteiro só abre pelo botão.
    expect(host.querySelector("img")?.getAttribute("src")).toBe("https://cdn.example.test/p1.png");
  });

  it("peça de mídia sem imagem resolvida diz que a mídia não pode ser mostrada", () => {
    render({ blocks: [block({ kind: "MEDIA", mediaKind: "IMAGE" })] });
    expect(host.textContent).toContain(messages.mediaUnavailable);
  });

  it("peça de projeto mostra o card do projeto e o repositório", () => {
    render({
      blocks: [
        block({
          kind: "PROJECT",
          title: null,
          text: null,
          project: {
            id: "proj_1",
            title: "Sistema de portaria",
            description: "Controle de acesso",
            stack: ["Java", "React"],
            repoUrl: "https://github.com/ana/portaria",
            status: null,
          },
        }),
      ],
    });

    expect(host.textContent).toContain("Sistema de portaria");
    expect(host.textContent).toContain("Java");
    expect(host.textContent).toContain("Controle de acesso");

    const repo = Array.from(host.querySelectorAll("a")).find(
      (anchor) => anchor.getAttribute("href") === "https://github.com/ana/portaria",
    );
    expect(repo?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("vitrine fora do ar não desenha peças", () => {
    render({ unavailable: true, blocks: [block()] });
    expect(host.textContent).toContain(messages.unavailable);
    expect(host.textContent).not.toContain("Sobre o trabalho");
  });
});
