// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { THEME_COLLECTIONS } from "../../lib/theme/theme-collections.js";
import { defaultMessages } from "../../messages/default-messages.js";

import { CollectionGrid } from "./collection-grid.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.collectionGrid;

let host: HTMLDivElement;
let root: Root;

function render(activeId: string | null = null) {
  act(() =>
    root.render(
      <CollectionGrid
        activeId={activeId}
        previewId={null}
        onPreview={() => {}}
        onSelect={() => {}}
      />,
    ),
  );
}

const cards = () => host.querySelectorAll('[aria-label^="Experimentar"]').length;
const button = (label: string) =>
  [...host.querySelectorAll("button")].find((b) => b.textContent === label);

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

/**
 * A galeria cresceu para 85 temas e cada cartão é uma miniatura de perfil. Desenhar
 * tudo de uma vez travava a abertura do diálogo em aparelho fraco — o modo econômico
 * existe justamente para isso não acontecer. O primeiro lote é limitado e o resto
 * entra sob demanda.
 */
describe("CollectionGrid", () => {
  it("desenha um lote por vez, com o botão dizendo quantos temas faltam", () => {
    render();

    const first = cards();
    expect(first).toBeGreaterThan(1);
    expect(first).toBeLessThan(THEME_COLLECTIONS.length);

    const more = button(messages.showMoreThemes(THEME_COLLECTIONS.length - (first - 1)));
    expect(more).toBeDefined();

    act(() => more!.click());
    expect(cards()).toBeGreaterThan(first);
  });

  it("buscar devolve o lote ao começo em vez de herdar o tamanho da lista anterior", () => {
    render();

    act(() => button(messages.showMoreThemes(THEME_COLLECTIONS.length - (cards() - 1)))!.click());
    expect(cards()).toBeGreaterThan(18);

    const input = host.querySelector("input")!;
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      setter.call(input, "terminal");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    // Só o que casa com "terminal" aparece; o lote voltou ao tamanho do primeiro.
    expect(cards()).toBeLessThan(18);
    expect(host.textContent).toContain("Terminal");
  });

  it("o tema em uso aparece mesmo quando fica fora do primeiro lote", () => {
    const last = THEME_COLLECTIONS.at(-1)!;
    render(last.id);

    expect(host.textContent).toContain(last.name);
    expect(
      [...host.querySelectorAll("span")].filter((span) => span.textContent === messages.inUse),
    ).toHaveLength(1);
  });
});
