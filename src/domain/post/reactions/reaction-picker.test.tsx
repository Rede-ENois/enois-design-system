// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ReactionPicker } from "./reaction-picker.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const EMOJIS = {
  LIKE: "👍",
  LOVE: "❤️",
  LAUGH: "😂",
  ROFL: "🤣",
  SKULL: "💀",
  WOW: "😮",
  SAD: "😢",
  SOB: "😭",
  CELEBRATE: "🎉",
  SUPPORT: "💪",
  INSIGHTFUL: "💡",
  ANGRY: "😡",
} as const;

describe("ReactionPicker", () => {
  let root: Root;
  let host: HTMLDivElement;
  let onReact: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    onReact = vi.fn();
    act(() =>
      root.render(
        <ReactionPicker
          emojis={EMOJIS}
          activeType={null}
          onReact={onReact}
          buttonClassName="react"
          buttonTitle="Reagir"
        >
          <span>Reagir</span>
        </ReactionPicker>,
      ),
    );
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    document.body.replaceChildren();
  });

  const trigger = () => host.querySelector<HTMLButtonElement>("button.react");
  const emojiButtons = () => [
    ...document.querySelectorAll<HTMLButtonElement>("[data-reaction-emoji]"),
  ];
  const plus = () =>
    [...document.querySelectorAll<HTMLButtonElement>("button")].find(
      (b) => b.textContent === "+" && b.getAttribute("aria-label") === "+",
    );

  const open = () => act(() => trigger()!.click());

  /**
   * A primeira fileira (5) fica à vista e o resto mora atrás do "+": 22 emojis numa grade só
   * estouram a tela, e no celular ninguém rola um popover para achar a reação.
   */
  it("mostra só a primeira fileira e um sinal de + para o resto", () => {
    open();
    expect(emojiButtons()).toHaveLength(5);
    expect(plus()).toBeDefined();
    // A grade tem seis colunas: cinco emojis e o "+" fecham a fileira.
    const grade = document.querySelector(".grid-cols-6");
    expect(grade).not.toBeNull();
  });

  it("o + revela todos os emojis do sistema", () => {
    open();
    act(() => plus()!.click());
    expect(emojiButtons()).toHaveLength(Object.keys(EMOJIS).length);
    expect(plus()).toBeUndefined();
  });

  it("reagir por um emoji revelado continua funcionando", () => {
    open();
    act(() => plus()!.click());
    const wow = document.querySelector<HTMLButtonElement>('[data-reaction-emoji="WOW"]');
    expect(wow).not.toBeNull();
    act(() => wow!.click());
    expect(onReact).toHaveBeenCalledWith("WOW");
  });
});
