// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EMOJI_CATEGORIES } from "../constants/emoji-catalog.js";

import { EmojiPicker } from "./emoji-picker.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("EmojiPicker", () => {
  let root: Root;
  let host: HTMLDivElement;
  let picked: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    picked = vi.fn();
    act(() =>
      root.render(
        <EmojiPicker
          onPick={(emoji) => picked(emoji)}
          buttonTitle="Emoji"
          buttonClassName="emoji"
        />,
      ),
    );
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    document.body.replaceChildren();
  });

  const trigger = () => host.querySelector<HTMLButtonElement>('button[title="Emoji"]');
  /** Os botões de emoji são os que têm nome no `title` (o gatilho e o "+" não estão nesse formato). */
  const grid = () =>
    [...document.querySelectorAll<HTMLButtonElement>("button[title]")].filter(
      (b) =>
        b.getAttribute("title") !== "Emoji" && b.getAttribute("title") !== "Ver todos os emojis",
    );
  const more = () =>
    [...document.querySelectorAll<HTMLButtonElement>("button")].find(
      (b) => b.getAttribute("aria-label") === "Ver todos os emojis",
    );

  /**
   * A grade completa de uma categoria é longa, e no celular ninguém rola popover: a primeira
   * fileira fica à vista e o "+" revela o resto (o mesmo gesto do seletor de reações).
   */
  it("abre com cinco emojis da categoria (o + ocupa a sexta casa da fileira)", () => {
    act(() => trigger()!.click());
    const primeira = EMOJI_CATEGORIES[0].emojis.slice(0, 5).map((e) => e.emoji);
    expect(grid().map((b) => b.textContent)).toEqual(primeira);
    expect(more()).toBeDefined();
  });

  it("o + revela todos os emojis da categoria", () => {
    act(() => trigger()!.click());
    act(() => more()!.click());
    const esperado = EMOJI_CATEGORIES[0].emojis.length;
    expect(grid().length).toBe(esperado);
    expect(more()).toBeUndefined();
  });

  it("trocar de categoria volta à primeira fileira", () => {
    act(() => trigger()!.click());
    act(() => more()!.click());
    const categorias = [...document.querySelectorAll<HTMLButtonElement>("button")].filter((b) =>
      EMOJI_CATEGORIES.some(
        (c) => c.label === b.textContent && c.label !== EMOJI_CATEGORIES[0].label,
      ),
    );
    act(() => categorias[0].click());
    expect(more()).toBeDefined();
  });

  it("escolher um emoji chama onPick com o caractere", () => {
    act(() => trigger()!.click());
    const primeiro = grid()[0];
    act(() => primeiro.click());
    expect(picked).toHaveBeenCalledWith(EMOJI_CATEGORIES[0].emojis[0].emoji);
  });
});

describe("EmojiPicker — recentes primeiro", () => {
  let root: Root;
  let host: HTMLDivElement;

  beforeEach(() => {
    localStorage.clear();
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    document.body.replaceChildren();
    localStorage.clear();
  });

  const renderPicker = () =>
    act(() =>
      root.render(<EmojiPicker onPick={() => {}} buttonTitle="Emoji" buttonClassName="e" />),
    );
  const trigger = () => host.querySelector<HTMLButtonElement>('button[title="Emoji"]');
  const grid = () =>
    [...document.querySelectorAll<HTMLButtonElement>("button[title]")].filter(
      (b) =>
        b.getAttribute("title") !== "Emoji" && b.getAttribute("title") !== "Ver todos os emojis",
    );

  /** O último escolhido abre a fileira: quem usa sempre os mesmos não os procura de novo. */
  it("o emoji escolhido passa a abrir a primeira fileira", () => {
    const escolhido = EMOJI_CATEGORIES[0].emojis[20].emoji;
    localStorage.setItem("enois-emoji-recents", JSON.stringify([escolhido]));
    renderPicker();
    act(() => trigger()!.click());
    expect(grid()[0].textContent).toBe(escolhido);
  });

  it("ordena pelos mais recentes, o último primeiro, sem repetir", () => {
    const [a, b] = [EMOJI_CATEGORIES[0].emojis[10].emoji, EMOJI_CATEGORIES[0].emojis[12].emoji];
    localStorage.setItem("enois-emoji-recents", JSON.stringify([b, a]));
    renderPicker();
    act(() => trigger()!.click());
    const primeiros = grid()
      .slice(0, 2)
      .map((n) => n.textContent);
    expect(primeiros).toEqual([b, a]);
    // Nenhum emoji aparece duas vezes na lista expandida.
    act(() =>
      [...document.querySelectorAll<HTMLButtonElement>("button")]
        .find((b2) => b2.getAttribute("aria-label") === "Ver todos os emojis")!
        .click(),
    );
    const todos = grid().map((n) => n.textContent);
    expect(new Set(todos).size).toBe(todos.length);
  });

  it("toda categoria fecha em múltiplo de 6 (grade quadrada)", () => {
    for (const categoria of EMOJI_CATEGORIES) {
      expect(categoria.emojis.length % 6, categoria.id).toBe(0);
    }
  });
});
