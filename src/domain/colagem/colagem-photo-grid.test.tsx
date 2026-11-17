// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SpoilerPreferenceContext } from "../../media/spoiler-preference.js";
import { defaultMessages } from "../../messages/default-messages.js";
import type { ColagemPhotoGridProps } from "../../types/domain/colagem/colagem-photo-grid-props.js";
import type { ColagemPhotoSummary } from "../../types/domain/colagem/colagem-photo-summary.js";

import { ColagemPhotoGrid } from "./colagem-photo-grid.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.colagemGrid;

const foto = (overrides: Partial<ColagemPhotoSummary> = {}): ColagemPhotoSummary => ({
  id: "colagem_1",
  mediaUrl: "https://cdn.example.test/f1.jpg",
  description: "Primeira foto",
  mediaSpoiler: false,
  authorName: "Maria",
  reactions: 3,
  comments: 1,
  ...overrides,
});

describe("ColagemPhotoGrid", () => {
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

  const render = (overrides: Partial<ColagemPhotoGridProps> = {}) => {
    const props: ColagemPhotoGridProps = {
      photos: [foto(), foto({ id: "colagem_2", description: null, mediaSpoiler: true })],
      state: { kind: "ready" },
      onOpen: vi.fn(),
      hasMore: false,
      loadingMore: false,
      onLoadMore: vi.fn(),
      ...overrides,
    };
    act(() => root.render(<ColagemPhotoGrid {...props} />));
    return props;
  };

  it("com a preferência de revelar sensível, a foto velada entra direto na grade", () => {
    act(() =>
      root.render(
        <SpoilerPreferenceContext value={true}>
          <ColagemPhotoGrid
            photos={[foto({ mediaSpoiler: true })]}
            state={{ kind: "ready" }}
            onOpen={vi.fn()}
            hasMore={false}
            loadingMore={false}
            onLoadMore={vi.fn()}
          />
        </SpoilerPreferenceContext>,
      ),
    );
    expect(host.textContent).not.toContain(messages.revealPhoto);
    expect(host.querySelector("img")?.className).not.toContain("blur-md");
  });

  it("enquanto carrega, o estado de carga fala", () => {
    render({ state: { kind: "loading" } });
    expect(host.textContent).toContain(messages.loading);
  });

  it("sem mural, o vazio convida", () => {
    render({ photos: [], state: { kind: "empty" } });
    expect(host.textContent).toContain(messages.empty);
  });

  it("de erro, o aviso assume", () => {
    render({ state: { kind: "error" } });
    expect(host.textContent).toContain(messages.error);
  });

  it("desenha os ladrilhos e abre a foto clicada", () => {
    const props = render();
    const tiles = host.querySelectorAll("button[aria-label]");
    expect(tiles).toHaveLength(2);
    act(() => (tiles[0] as HTMLButtonElement).click());
    expect(props.onOpen).toHaveBeenCalledWith("colagem_1");
  });

  it("foto sensível nasce velada com o convite de revelar", () => {
    render();
    expect(host.textContent).toContain(messages.revealPhoto);
  });

  it("a legenda descreve a imagem; sem legenda, o rótulo abre", () => {
    render();
    const alts = [...host.querySelectorAll("img")].map((img) => img.getAttribute("alt"));
    expect(alts).toContain("Primeira foto");
    expect(alts).toContain(messages.openPhoto);
  });

  it("sem mais páginas, não há botão de carregar", () => {
    render({ hasMore: false });
    expect(host.textContent).not.toContain(messages.loadMore);
  });

  it("com mais páginas, carregar pede a próxima", () => {
    const props = render({ hasMore: true });
    const carregar = [...host.querySelectorAll("button")].find((b) =>
      b.textContent?.includes(messages.loadMore),
    );
    act(() => carregar?.click());
    expect(props.onLoadMore).toHaveBeenCalled();
  });
});
