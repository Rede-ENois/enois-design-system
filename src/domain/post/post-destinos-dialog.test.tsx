// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PostDestinoItem } from "../../types/domain/post/post-destino-item.js";
import type { PostDestinosDialogProps } from "../../types/domain/post/post-destinos-dialog-props.js";

import { PostDestinosDialog } from "./post-destinos-dialog.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const muralA: PostDestinoItem = {
  id: "mural_a",
  title: "Trabalho",
  description: null,
  count: 3,
  tem: false,
};
const muralB: PostDestinoItem = {
  id: "mural_b",
  title: "Ideias",
  description: null,
  count: 0,
  tem: true,
};
const colecaoA: PostDestinoItem = {
  id: "colecao_a",
  title: "Ler depois",
  description: null,
  count: 7,
  tem: false,
};

function props(overrides: Partial<PostDestinosDialogProps> = {}): PostDestinosDialogProps {
  return {
    open: true,
    onOpenChange: () => {},
    postId: "post_1",
    murais: [muralA, muralB],
    colecoes: [colecaoA],
    pendentes: new Set<string>(),
    erro: null,
    onColarNoMural: () => {},
    onGuardarNaColecao: () => {},
    ...overrides,
  };
}

describe("PostDestinosDialog", () => {
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
    // O Radix porta o diálogo para o body: limpa o que sobrou dele.
    for (const overlay of [...document.body.querySelectorAll("[data-radix-portal] > *")]) {
      overlay.remove();
    }
  });

  const render = (overrides: Partial<PostDestinosDialogProps> = {}) =>
    act(() => root.render(<PostDestinosDialog {...props(overrides)} />));
  const botao = (rotulo: string) =>
    [...document.body.querySelectorAll<HTMLButtonElement>("button")].find(
      (b) => b.textContent === rotulo,
    );
  // As abas do Radix ativam no mousedown, não no click.
  const abrirAba = (rotulo: string) =>
    act(() =>
      botao(rotulo)!.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 })),
    );

  it("lista os murais com a marca de onde o post já está", () => {
    render();

    const texto = document.body.textContent!;
    expect(texto).toContain("Trabalho");
    expect(texto).toContain("Ideias");
    // Onde o post já está, o verbo vira estado…
    expect(texto).toContain("Colado");
    // …e a linha já atendida não oferece a ação de novo.
    expect(botao("Colar")!.textContent).toBe("Colar");
    expect(
      [...document.body.querySelectorAll("button")].filter((b) => b.textContent === "Colar"),
    ).toHaveLength(1);
  });

  it("cola no mural escolhido e trava o clique enquanto pendente", () => {
    const onColarNoMural = vi.fn();
    render({ pendentes: new Set(["mural_a"]), onColarNoMural });
    // A linha pendente não troca o texto pelo rótulo: o spinner ocupa o botão.
    const pendente = [...document.body.querySelectorAll<HTMLButtonElement>("button")].find(
      (b) => b.disabled,
    )!;
    expect(pendente.disabled).toBe(true);

    render({ pendentes: new Set(["mural_b"]), onColarNoMural });

    act(() => botao("Colar")!.click());

    expect(onColarNoMural).toHaveBeenCalledWith("mural_a");
  });

  it("aba de coleções guarda o post na coleção escolhida", () => {
    const onGuardarNaColecao = vi.fn();
    render({ onGuardarNaColecao });

    abrirAba("Coleções");

    act(() => botao("Guardar")!.click());

    expect(onGuardarNaColecao).toHaveBeenCalledWith("colecao_a");
  });

  it("marca o erro na linha do destino que falhou", () => {
    render({ erro: { destinoId: "mural_a", mensagem: "falhou" } });

    expect(document.body.textContent).toContain("Não deu. Tente de novo.");
  });

  it("sem nada carregado mostra carregando, e o vazio quando as listas vieram", () => {
    render({ murais: [], colecoes: [], carregando: true });
    expect(document.body.textContent).toContain("Carregando seus destinos");

    render({ murais: [], colecoes: [], carregando: false });
    expect(document.body.textContent).toContain("Você ainda não tem murais");

    abrirAba("Coleções");

    expect(document.body.textContent).toContain("Você ainda não tem coleções");
  });

  it("o botão de ação da linha tem largura de conteúdo — nunca w-full", () => {
    render();

    const colar = botao("Colar")!;
    // O default do Button traz `w-full`; com `shrink-0` na linha, ele disputava a largura inteira
    // e esmagava o bloco de texto a largura 0 (texto renderizando caractere por caractere).
    expect(colar.className).not.toMatch(/(^|\s)w-full(\s|$)/);
    expect(colar.className).toMatch(/w-auto/);
  });
});
