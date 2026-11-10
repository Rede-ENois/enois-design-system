// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../../messages/default-messages.js";

import { LiteVideo } from "./lite-video.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * No Modo lite o vídeo do feed não toca no meio da lista: o card convida ("assistir em tela
 * cheia") e o palco abre com som, pausando o resto. Fechar devolve a pessoa para a mesma tela.
 */
describe("LiteVideo no Modo lite", () => {
  let root: Root | null = null;
  let container: HTMLDivElement;

  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root?.unmount());
    root = null;
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it("oferece o palco, abre com som e fecha de volta ao mesmo lugar", async () => {
    await act(async () => root!.render(<LiteVideo src="https://cdn.exemplo/video.mp4" lite />));

    // O player da página fica sem controles (quem manda é o convite) e o quadro não toca.
    const inline = container.querySelector("video")!;
    // O iOS só pinta o primeiro quadro com o fragmento de mídia.
    expect(inline.getAttribute("src")).toBe("https://cdn.exemplo/video.mp4#t=0.001");
    expect(inline.controls).toBe(false);
    expect(inline.muted).toBe(true);

    const open = container.querySelector<HTMLButtonElement>(
      `button[aria-label="${defaultMessages.liteVideo.open}"]`,
    );
    expect(open).not.toBeNull();

    await act(async () => open!.click());

    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    // O palco toca com som: o toque foi um pedido explícito para assistir.
    const stageVideo = dialog!.querySelector("video")!;
    expect(stageVideo.controls).toBe(true);
    expect(stageVideo.muted).toBe(false);
    // A página atrás não rola enquanto o palco está aberto (lock do Radix, não style inline).
    expect(document.body.hasAttribute("data-scroll-locked")).toBe(true);

    const close = dialog!.querySelector<HTMLButtonElement>(
      `button[aria-label="${defaultMessages.mediaStage.close}"]`,
    );
    expect(close).not.toBeNull();

    await act(async () => close!.click());

    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.hasAttribute("data-scroll-locked")).toBe(false);
  });
});
