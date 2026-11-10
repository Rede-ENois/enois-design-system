// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../../messages/default-messages.js";

import { MediaStage } from "./media-stage.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * O palco abre com som. Onde o navegador recusa autoplay com áudio (iOS/PWA), ele tenta de novo
 * mudo — que é permitido — e a pessoa tem o botão de som para quando quiser ouvir.
 */
describe("MediaStage", () => {
  let root: Root | null = null;
  let container: HTMLDivElement;

  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    // O jsdom não reproduz mídia: sem o mock, cada montagem loga "Not implemented".
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root?.unmount());
    root = null;
    document.body.replaceChildren();
    document.body.style.overflow = "";
    vi.restoreAllMocks();
  });

  it("cai para o autoplay mudo quando o navegador recusa som", async () => {
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockRejectedValueOnce(
        Object.assign(new Error("play() failed because the user didn't interact"), {
          name: "NotAllowedError",
        }),
      )
      .mockResolvedValue(undefined);

    await act(async () =>
      root!.render(<MediaStage src="https://cdn.exemplo/video.mp4" onClose={() => undefined} />),
    );

    const video = document.querySelector("video")!;
    expect(play).toHaveBeenCalledTimes(2);
    expect(video.muted).toBe(true);

    // O controle de som passa a oferecer "ligar o som" — a pessoa escolhe quando ouvir.
    const mute = document.querySelector<HTMLButtonElement>(
      `button[aria-label="${defaultMessages.mediaStage.unmute}"]`,
    );
    expect(mute).not.toBeNull();
  });

  it("mantém o som quando o navegador aceita", async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);

    await act(async () =>
      root!.render(<MediaStage src="https://cdn.exemplo/video.mp4" onClose={() => undefined} />),
    );

    const video = document.querySelector("video")!;
    expect(play).toHaveBeenCalledOnce();
    expect(video.muted).toBe(false);
    expect(
      document.querySelector(`button[aria-label="${defaultMessages.mediaStage.mute}"]`),
    ).not.toBeNull();
  });

  it("monta o palco em portal, fora do container do card", () => {
    // O PostCard usa [content-visibility:auto]: pintura contida prende descendentes `fixed`.
    const card = document.createElement("article");
    card.classList.add("[content-visibility:auto]");
    document.body.appendChild(card);

    const cardRoot = createRoot(card);

    try {
      act(() =>
        cardRoot.render(
          <MediaStage src="https://cdn.exemplo/video.mp4" onClose={() => undefined} />,
        ),
      );

      const stage = document.querySelector('[role="dialog"]');
      expect(stage).not.toBeNull();
      expect(card.contains(stage!)).toBe(false);
      expect(document.body.contains(stage!)).toBe(true);
    } finally {
      act(() => cardRoot.unmount());
      card.remove();
    }
  });

  it("fecha uma vez só quando Escape e o botão de fechar disputam", () => {
    const onClose = vi.fn();
    act(() => root!.render(<MediaStage src="https://cdn.exemplo/video.mp4" onClose={onClose} />));

    act(() => {
      for (let press = 0; press < 2; press += 1) {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      }
    });

    act(() =>
      document
        .querySelector<HTMLButtonElement>(
          `button[aria-label="${defaultMessages.mediaStage.close}"]`,
        )!
        .click(),
    );

    expect(onClose).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledWith(0);
  });

  it("fecha ao clicar no fundo do palco", () => {
    const onClose = vi.fn();
    act(() => root!.render(<MediaStage src="https://cdn.exemplo/video.mp4" onClose={onClose} />));

    act(() => document.querySelector<HTMLElement>('[role="dialog"]')!.click());

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("retoma do ponto em que o palco fechou", () => {
    const onClose = vi.fn();
    act(() => root!.render(<MediaStage src="https://cdn.exemplo/video.mp4" onClose={onClose} />));

    const video = document.querySelector("video")!;
    video.currentTime = 42;

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    // O Radix entrega onOpenChange(false) antes do unmount, então o tempo ainda sai do palco.
    expect(onClose).toHaveBeenCalledWith(42);

    act(() => root!.render(null));
    act(() =>
      root!.render(
        <MediaStage src="https://cdn.exemplo/video.mp4" initialTime={42} onClose={vi.fn()} />,
      ),
    );

    const reopened = document.querySelector("video")!;
    act(() => reopened.dispatchEvent(new Event("loadedmetadata")));

    expect(reopened.currentTime).toBe(42);
  });

  it("começa do zero quando o vídeo nunca carregou metadados", () => {
    const onClose = vi.fn();
    act(() => root!.render(<MediaStage src="https://cdn.exemplo/video.mp4" onClose={onClose} />));

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(onClose).toHaveBeenCalledWith(0);

    act(() => root!.render(null));
    act(() =>
      root!.render(
        <MediaStage src="https://cdn.exemplo/video.mp4" initialTime={0} onClose={vi.fn()} />,
      ),
    );

    const reopened = document.querySelector("video")!;
    act(() => reopened.dispatchEvent(new Event("loadedmetadata")));

    expect(Number.isNaN(reopened.currentTime)).toBe(false);
    expect(reopened.currentTime).toBe(0);
  });

  it("trava a rolagem do body enquanto está aberto e solta ao fechar", () => {
    act(() =>
      root!.render(<MediaStage src="https://cdn.exemplo/video.mp4" onClose={() => undefined} />),
    );

    // O Radix (react-remove-scroll) trava a rolagem pelo atributo no body, não pelo style inline.
    expect(document.body.hasAttribute("data-scroll-locked")).toBe(true);
    expect(document.body.style.overflow).toBe("");

    act(() => root!.unmount());
    root = null;

    expect(document.body.hasAttribute("data-scroll-locked")).toBe(false);
  });
});
