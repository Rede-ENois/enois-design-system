// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { ProfilePhotoCarouselProps } from "../../types/domain/profile/profile-photo-carousel-props.js";
import type { ProfilePhoto } from "../../types/domain/profile/profile-photo.js";

import { ProfilePhotoCarousel } from "./photo-carousel.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.profileGallery;

const foto = (id: string, overrides: Partial<ProfilePhoto> = {}): ProfilePhoto => ({
  id,
  mediaUrl: `https://cdn.example.test/${id}.jpg`,
  description: `Foto ${id}`,
  mediaSpoiler: false,
  ...overrides,
});

describe("ProfilePhotoCarousel", () => {
  let root: Root;
  let host: HTMLDivElement;

  /** O diálogo do visualizador é portado para o body: é lá que a tela ampliada aparece. */
  const tela = () => document.body;

  /** As setas da tira têm os mesmos rótulos da navegação do visualizador: olhar dentro do diálogo. */
  const dialogo = () => {
    const aberto = document.body.querySelector('[role="dialog"]');
    if (!aberto) throw new Error("visualizador não está aberto");
    return aberto;
  };

  const miniaturas = () =>
    host.querySelectorAll<HTMLButtonElement>(`button[aria-label="${messages.openPhoto}"]`);

  const clicar = async (botao: Element | null | undefined) => {
    if (!botao) throw new Error("botão não renderizado");
    const alvo = botao as HTMLElement;
    await act(async () => alvo.click());
  };

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  const render = (overrides: Partial<ProfilePhotoCarouselProps> = {}) => {
    const props: ProfilePhotoCarouselProps = {
      photos: [foto("a"), foto("b"), foto("c")],
      state: { kind: "ready" },
      hasMore: false,
      loadingMore: false,
      onLoadMore: vi.fn(),
      ...overrides,
    };
    act(() => root.render(<ProfilePhotoCarousel {...props} />));
    return props;
  };

  it("enquanto carrega, o estado de carga fala; sem fotos, a galeria não aparece", () => {
    render({ state: { kind: "loading" } });
    expect(host.textContent).toContain(messages.loading);

    render({ state: { kind: "empty" } });
    expect(host.textContent).toBe("");
  });

  it("a tira mostra as fotos na ordem e abre o visualizador na clicada", async () => {
    render();

    expect(miniaturas()).toHaveLength(3);

    await clicar(miniaturas()[1]);

    expect(tela().textContent).toContain(messages.counter(2, 3));
    expect(dialogo().querySelector("img")?.getAttribute("src")).toContain("b.jpg");
  });

  it("a navegação para no começo e no fim da galeria", async () => {
    render();

    await clicar(miniaturas()[0]);
    const anterior = () =>
      dialogo().querySelector<HTMLButtonElement>(`button[aria-label="${messages.prev}"]`);
    const seguinte = () =>
      dialogo().querySelector<HTMLButtonElement>(`button[aria-label="${messages.next}"]`);

    expect(anterior()?.disabled).toBe(true);

    await clicar(seguinte());
    expect(tela().textContent).toContain(messages.counter(2, 3));

    await clicar(seguinte());
    expect(tela().textContent).toContain(messages.counter(3, 3));
    expect(seguinte()?.disabled).toBe(true);
  });

  it("os botões de zoom andam em degraus e o reset volta ao natural", async () => {
    render();

    await clicar(miniaturas()[0]);

    const reset = () =>
      dialogo().querySelector<HTMLButtonElement>(`button[aria-label="${messages.resetZoom}"]`);
    const ampliar = () =>
      dialogo().querySelector<HTMLButtonElement>(`button[aria-label="${messages.zoomIn}"]`);
    const reduzir = () =>
      dialogo().querySelector<HTMLButtonElement>(`button[aria-label="${messages.zoomOut}"]`);

    // No tamanho natural não há o que resetar; reduzir não tem para onde ir.
    expect(reset()).toBeNull();
    expect(reduzir()?.disabled).toBe(true);

    await clicar(ampliar());
    expect(reduzir()?.disabled).toBe(false);
    expect(reset()).not.toBeNull();

    // O teto do zoom desabilita ampliar (1 -> 1.5 -> 2 -> 2.5 -> 3).
    await clicar(ampliar());
    await clicar(ampliar());
    await clicar(ampliar());
    expect(ampliar()?.disabled).toBe(true);

    await clicar(reset());
    expect(reset()).toBeNull();
    expect(reduzir()?.disabled).toBe(true);
  });

  it("o toque duplo alterna o zoom sem passar pelos botões", async () => {
    render();

    await clicar(miniaturas()[0]);
    const fotoAberta = dialogo().querySelector("img:not([alt=''])");
    if (!fotoAberta) throw new Error("foto aberta não renderizada");

    const reset = () =>
      dialogo().querySelector<HTMLButtonElement>(`button[aria-label="${messages.resetZoom}"]`);
    await act(async () => fotoAberta.dispatchEvent(new MouseEvent("dblclick", { bubbles: true })));
    expect(reset()).not.toBeNull();

    await act(async () => fotoAberta.dispatchEvent(new MouseEvent("dblclick", { bubbles: true })));
    expect(reset()).toBeNull();
  });

  it("trocar de foto volta o zoom ao natural", async () => {
    render();

    await clicar(miniaturas()[0]);
    await clicar(
      dialogo().querySelector<HTMLButtonElement>(`button[aria-label="${messages.zoomIn}"]`),
    );
    expect(dialogo().querySelector(`button[aria-label="${messages.resetZoom}"]`)).not.toBeNull();

    await clicar(
      dialogo().querySelector<HTMLButtonElement>(`button[aria-label="${messages.next}"]`),
    );
    expect(dialogo().querySelector(`button[aria-label="${messages.resetZoom}"]`)).toBeNull();
    expect(tela().textContent).toContain(messages.counter(2, 3));
  });

  it("a foto sensível nasce velada e a pessoa decide revelar", async () => {
    render({ photos: [foto("velada", { mediaSpoiler: true })] });

    // Na tira, a miniatura já nasce desfocada.
    const miniaturaFoto = miniaturas()[0]?.querySelector("img");
    expect(miniaturaFoto?.className).toContain("blur-md");

    await clicar(miniaturas()[0]);
    expect(tela().textContent).toContain(messages.revealPhoto);

    await clicar(dialogo().querySelector(`button[aria-label="${messages.revealPhoto}"]`));
    const revelada = dialogo().querySelector("img:not([alt=''])");
    expect(revelada?.getAttribute("alt")).toBe("Foto velada");
  });

  it("fechar devolve a tela para a galeria", async () => {
    render();

    await clicar(miniaturas()[0]);
    expect(tela().textContent).toContain(messages.counter(1, 3));

    await clicar(
      dialogo().querySelector(`button[aria-label="${defaultMessages.imageLightbox.close}"]`),
    );
    expect(tela().textContent).not.toContain(messages.counter(1, 3));
  });

  it("quando há mais páginas, o botão de carregar aparece e trabalha", async () => {
    const props = render({ hasMore: true });

    const carregar = host.querySelector("button");
    const botaoCarregar = [...host.querySelectorAll("button")].find(
      (item) => item.textContent === messages.loadMore,
    );
    expect(botaoCarregar).not.toBeNull();

    await clicar(botaoCarregar);
    expect(props.onLoadMore).toHaveBeenCalledTimes(1);

    render({ hasMore: true, loadingMore: true });
    const ocupado = [...host.querySelectorAll("button")].find(
      (item) => item.textContent === messages.loadMore,
    );
    expect(ocupado?.disabled).toBe(true);
  });
});
