// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";

import { BIRTHDAY_CELEBRATION_MS, BirthdayCelebration } from "./birthday-celebration.js";

/**
 * A festa no perfil de quem faz aniversário hoje: figurinhas felizes voando, balões, confete e o
 * tíquete de parabéns. Quem pediu menos movimento, está em modo econômico ou tem um aparelho que
 * não desenha o emoji colorido recebe só o tíquete — a festa é presente, não um pedido.
 */

const stickers = [
  "/emojis/enois/party.webp",
  "/emojis/enois/confetti.webp",
  "/emojis/enois/joy.webp",
  "/emojis/enois/love.webp",
  "/emojis/enois/sparkle.webp",
  "/emojis/enois/starstruck.webp",
];

const messages = defaultMessages.birthdayCelebration;

describe("BirthdayCelebration", () => {
  let root: Root;
  let host: HTMLDivElement;
  let reduced = false;
  let colorEmoji = true;

  const render = async () => {
    await act(async () =>
      root.render(<BirthdayCelebration name="Ana Souza" stickers={stickers} />),
    );
  };

  const advance = async (ms: number) => {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(ms);
    });
  };

  const festa = () => host.querySelector("[data-birthday-festa]");
  /** O jsdom não resolve `var(--color-*)` de verdade: o confete é lido pela classe de cor. */
  const confeteColorido = () =>
    host.querySelectorAll(
      ".birthday-celebration__confetti--love, .birthday-celebration__confetti--oportunidade," +
        ".birthday-celebration__confetti--growth, .birthday-celebration__confetti--primary",
    ).length;
  const voando = () => host.querySelectorAll("img.birthday-celebration__sticker");
  const baloes = () => host.querySelectorAll(".birthday-celebration__balloon");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    reduced = false;
    colorEmoji = true;
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({ matches: query.includes("reduce") && reduced })),
    );
    // O jsdom não desenha em canvas: este é o leitor que responde se o emoji sai colorido.
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      () =>
        ({
          fillText: vi.fn(),
          getImageData: () => ({ data: colorEmoji ? [230, 60, 120, 255] : [18, 18, 18, 255] }),
        }) as unknown as CanvasRenderingContext2D,
    );
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.documentElement.removeAttribute("data-lite");
    document.documentElement.removeAttribute("data-force-motion");
  });

  it("põe as figurinhas do É Nóis voando, balões, confete e o tíquete com o nome", async () => {
    await render();

    expect(host.textContent).toContain(messages.title("Ana Souza"));
    expect(host.textContent).toContain(messages.body);
    expect(voando()).toHaveLength(13);
    for (const figurinha of voando()) {
      const src = figurinha.getAttribute("src") ?? "";
      expect(src.startsWith("/emojis/enois/")).toBe(true);
      expect(stickers).toContain(src);
    }
    expect(baloes().length).toBeGreaterThan(0);
    expect(confeteColorido()).toBeGreaterThan(0);
  });

  it("a festa some sozinha depois de alguns segundos e só o tíquete fica", async () => {
    await render();
    expect(festa()).not.toBeNull();

    await advance(BIRTHDAY_CELEBRATION_MS);

    expect(festa()).toBeNull();
    expect(host.textContent).toContain(messages.title("Ana Souza"));
  });

  it("o visitante fecha os parabéns e nada volta", async () => {
    await render();

    const fechar = host.querySelector("button");
    expect(fechar?.textContent).toContain(messages.dismiss);
    await act(async () => fechar?.dispatchEvent(new MouseEvent("click", { bubbles: true })));

    expect(host.textContent).not.toContain(messages.title("Ana Souza"));
    expect(festa()).toBeNull();
  });

  it("com menos movimento no sistema só o tíquete aparece", async () => {
    reduced = true;
    await render();

    expect(host.textContent).toContain(messages.title("Ana Souza"));
    expect(festa()).toBeNull();
  });

  it("em modo econômico não anima, mesmo com movimento forçado", async () => {
    document.documentElement.setAttribute("data-lite", "");
    document.documentElement.setAttribute("data-force-motion", "");
    await render();

    expect(festa()).toBeNull();
    expect(host.textContent).toContain(messages.title("Ana Souza"));
  });

  it("num aparelho sem emoji de cor a festa não aparece com glifos pretos", async () => {
    colorEmoji = false;
    await render();

    expect(festa()).toBeNull();
    expect(host.textContent).toContain(messages.title("Ana Souza"));
  });
});
