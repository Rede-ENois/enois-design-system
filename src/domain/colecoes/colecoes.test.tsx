// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { ColecaoFormularioProps } from "../../types/domain/colecoes/colecao-formulario-props.js";
import type { ColecaoPostCartaoProps } from "../../types/domain/colecoes/colecao-post-cartao-props.js";
import type { ColecaoPostInfo } from "../../types/domain/colecoes/colecao-post-info.js";
import type { ColecaoQuadroProps } from "../../types/domain/colecoes/colecao-quadro-props.js";
import type { ColecaoResumo } from "../../types/domain/colecoes/colecao-resumo.js";
import type { ColecoesListaProps } from "../../types/domain/colecoes/colecoes-lista-props.js";

import { ColecaoFormulario } from "./colecao-formulario.js";
import { ColecaoPostCartao } from "./colecao-post-cartao.js";
import { ColecaoQuadro } from "./colecao-quadro.js";
import { ColecoesLista } from "./colecoes-lista.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const lista = defaultMessages.colecoesLista;
const formulario = defaultMessages.colecoesFormulario;
const quadro = defaultMessages.colecoesQuadro;

const colecao = (overrides: Partial<ColecaoResumo> = {}): ColecaoResumo => ({
  id: "colecao_1",
  title: "Receitas da vó",
  description: "Tudo que a comunidade postou",
  postCount: 3,
  createdAt: new Date().toISOString(),
  ...overrides,
});

const elo = (overrides: Partial<ColecaoPostInfo> = {}): ColecaoPostInfo => ({
  postId: "post_1",
  adicionadoAt: new Date().toISOString(),
  ...overrides,
});

describe("ColecoesLista", () => {
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

  const render = (overrides: Partial<ColecoesListaProps> = {}) => {
    const props: ColecoesListaProps = {
      colecoes: [
        colecao(),
        colecao({ id: "colecao_2", title: "Posts que me marcaram", description: null }),
      ],
      state: { kind: "ready" },
      onOpen: vi.fn(),
      hasMore: false,
      loadingMore: false,
      onLoadMore: vi.fn(),
      ...overrides,
    };
    act(() => root.render(<ColecoesLista {...props} />));
    return props;
  };

  it("estados de carga, erro e vazio falam com as palavras do DS", () => {
    render({ state: { kind: "loading" } });
    expect(host.textContent).toContain(lista.loading);
    render({ state: { kind: "error" }, colecoes: [] });
    expect(host.textContent).toContain(lista.error);
    render({ state: { kind: "empty" }, colecoes: [] });
    expect(host.textContent).toContain(lista.empty);
  });

  it("cartões mostram título, descrição e contagem; abrir chama onOpen", async () => {
    const props = render();

    expect(host.textContent).toContain("Receitas da vó");
    expect(host.textContent).toContain("Tudo que a comunidade postou");
    expect(host.textContent).toContain(lista.posts(3));

    const cartoes = host.querySelectorAll<HTMLButtonElement>("button[aria-label]");
    await act(async () => cartoes[1].click());
    expect(props.onOpen).toHaveBeenCalledWith("colecao_2");
  });

  it("com mais páginas, o botão de carregar aparece e trabalha", async () => {
    const props = render({ hasMore: true, loadingMore: false });

    const carregar = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === lista.loadMore,
    );
    expect(carregar).toBeDefined();
    await act(async () => carregar!.click());
    expect(props.onLoadMore).toHaveBeenCalledTimes(1);
  });
});

describe("ColecaoFormulario", () => {
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

  const render = (overrides: Partial<ColecaoFormularioProps> = {}) => {
    const props: ColecaoFormularioProps = {
      aberto: true,
      ocupado: false,
      onSalvar: vi.fn(),
      onFechar: vi.fn(),
      ...overrides,
    };
    act(() => root.render(<ColecaoFormulario {...props} />));
    return props;
  };

  const caixa = () => document.body.querySelector<HTMLInputElement>("#colecao-titulo")!;
  const descricao = () => document.body.querySelector<HTMLTextAreaElement>("#colecao-descricao")!;
  const salvar = () =>
    [...document.body.querySelectorAll("button")].find((b) => b.textContent === formulario.salvar)!;

  const digitar = (elemento: HTMLInputElement | HTMLTextAreaElement, valor: string) => {
    act(() => {
      Object.getOwnPropertyDescriptor(
        elemento instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype,
        "value",
      )!.set!.call(elemento, valor);
      elemento.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };

  it("na criação o botão só liga com título; salvar entrega título e descrição", async () => {
    const props = render();

    expect(salvar().hasAttribute("disabled")).toBe(true);
    digitar(caixa(), "Leituras de domingo");
    expect(salvar().hasAttribute("disabled")).toBe(false);
    digitar(descricao(), "Textos longos para reler com calma");
    await act(async () => salvar().click());
    expect(props.onSalvar).toHaveBeenCalledWith({
      title: "Leituras de domingo",
      description: "Textos longos para reler com calma",
    });
  });

  it("na edição os campos chegam preenchidos", () => {
    render({ tituloInicial: "Título atual", descricaoInicial: "Descrição atual" });

    expect(caixa().value).toBe("Título atual");
    expect(descricao().value).toBe("Descrição atual");
  });
});

describe("ColecaoQuadro", () => {
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
    document.body.querySelector("[role='dialog']")?.remove();
  });

  const render = (
    overrides: Partial<ColecaoQuadroProps> = {},
    filhos?: ColecaoQuadroProps["children"],
  ) => {
    const props: ColecaoQuadroProps = {
      colecao: colecao(),
      onEditar: vi.fn(),
      onRemover: vi.fn(),
      onGuardar: vi.fn(),
      guardando: false,
      guardarErro: null,
      children: filhos ?? null,
      ...overrides,
    };
    act(() => root.render(<ColecaoQuadro {...props}>{filhos ?? null}</ColecaoQuadro>));
    return props;
  };

  it("cabeçalho fala título, descrição e contagem; coleção é sua, então as ações estão lá", () => {
    render();

    expect(host.textContent).toContain("Receitas da vó");
    expect(host.textContent).toContain("Tudo que a comunidade postou");
    expect(host.textContent).toContain(quadro.posts(3));
    expect(host.textContent).toContain(quadro.editar);
    expect(host.textContent).toContain(quadro.remover);
  });

  it("a remoção da pasta pede confirmação", async () => {
    const props = render();

    const remover = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === quadro.remover,
    )!;
    await act(async () => remover.click());
    const dialogo = document.body.querySelector("[role='dialog']")!;
    expect(dialogo.textContent).toContain(quadro.removerConfirmTitle);
    await act(async () =>
      [...dialogo.querySelectorAll("button")]
        .find((b) => b.textContent === quadro.remover)!
        .click(),
    );
    expect(props.onRemover).toHaveBeenCalledTimes(1);
  });

  it("sem posts guardados a pasta diz que está vazia; com eles, eles aparecem", () => {
    render({}, null);
    expect(host.textContent).toContain(quadro.vazio);
    render({}, <article>post salvo do feed</article>);
    expect(host.textContent).toContain("post salvo do feed");
    expect(host.textContent).toContain(quadro.guardados);
  });

  it("guardar entrega o valor aparado e limpa a linha", async () => {
    const props = render();

    const linha = host.querySelector<HTMLInputElement>("input")!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(
        linha,
        "  https://enois.ia.br/feed/post_9  ",
      );
      linha.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const guardar = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === quadro.guardar,
    )!;
    await act(async () => guardar.click());
    expect(props.onGuardar).toHaveBeenCalledWith("https://enois.ia.br/feed/post_9");
    expect(linha.value).toBe("");
  });

  it("erro de guardar aparece debaixo da barra", () => {
    render({ guardarErro: "Essa publicação já está nesta coleção." });
    expect(host.textContent).toContain("Essa publicação já está nesta coleção.");
  });
});

describe("ColecaoPostCartao", () => {
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
    document.body.querySelector("[role='dialog']")?.remove();
  });

  const render = (overrides: Partial<ColecaoPostCartaoProps> = {}) => {
    const props: ColecaoPostCartaoProps = {
      info: elo(),
      onRemover: vi.fn(),
      children: <article>post salvo</article>,
      ...overrides,
    };
    act(() => root.render(<ColecaoPostCartao {...props}>{props.children}</ColecaoPostCartao>));
    return props;
  };

  it("fala quando o post entrou na pasta e mostra a publicação de quem compõe", () => {
    const props = render({ info: elo({ adicionadoAt: "2026-11-12T12:00:00Z" }) });

    expect(host.textContent).toContain(quadro.guardadoEm("12 de nov."));
    expect(host.textContent).toContain("post salvo");
    expect(props.onRemover).not.toHaveBeenCalled();
  });

  it("tirar da pasta confirma antes", async () => {
    const props = render();

    const tirar = [...host.querySelectorAll("button")].find((b) => b.textContent === quadro.tirar)!;
    await act(async () => tirar.click());
    const dialogo = document.body.querySelector("[role='dialog']")!;
    expect(dialogo.textContent).toContain(quadro.tirarConfirmTitle);
    await act(async () =>
      [...dialogo.querySelectorAll("button")].find((b) => b.textContent === quadro.tirar)!.click(),
    );
    expect(props.onRemover).toHaveBeenCalledTimes(1);
  });
});
