// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { LiteVideo } from "./lite-video.js";
import { clearMediaBoxes } from "./media-box.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Entrega de mídia do Énóis Storage (brief §13).
 *
 * <p>O player precisa ser `<video>` de verdade: é o elemento que manda `Range` e usa `206` para
 * retomar. Um componente que carregasse o clipe por `fetch` e montasse um `blob:` tocaria o
 * arquivo inteiro do começo e perderia o cache HTTP — funcionaria no upload e falharia no seek.</p>
 *
 * <p>Estes testes guardam a propriedade que torna o `Range` do backend útil, não a aparência.</p>
 */
describe("entrega de mídia do Storage", () => {
  let root: Root;
  let container: HTMLDivElement;

  beforeEach(() => {
    clearMediaBoxes();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    document.body.replaceChildren();
  });

  it("usa <video> nativo com a URL do Storage, sem baixar o arquivo inteiro", () => {
    const src = "https://api.enois.ia.br/api/network/storage/objects/sob_abc/content";

    act(() => root.render(<LiteVideo src={src} />));

    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    // `preload="metadata"` é o que evita baixar o clipe antes de alguém tocar.
    expect(video!.getAttribute("preload")).toBe("metadata");
    // A URL do Storage vai intacta: qualquer parâmetro inventado aqui viraria 404.
    expect(video!.getAttribute("src") ?? "").not.toContain("?tr=");
  });

  it("não troca a fonte por blob: quando trocar, o seek e o cache HTTP morrem", () => {
    const src = "https://api.enois.ia.br/api/network/storage/objects/sob_def/content";

    act(() => root.render(<LiteVideo src={src} />));

    const video = container.querySelector("video");
    expect(video?.getAttribute("src") ?? "").not.toMatch(/^blob:/);
  });
});
