// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { MuraisListaProps } from "../../types/domain/murais/murais-lista-props.js";
import type { MuralContribuicaoCartaoProps } from "../../types/domain/murais/mural-contribuicao-cartao-props.js";
import type { MuralContribuicaoInfo } from "../../types/domain/murais/mural-contribuicao-info.js";
import type { MuralFormularioProps } from "../../types/domain/murais/mural-formulario-props.js";
import type { MuralQuadroProps } from "../../types/domain/murais/mural-quadro-props.js";
import type { MuralResumo } from "../../types/domain/murais/mural-resumo.js";

import { MuraisLista } from "./murais-lista.js";
import { MuralContribuicaoCartao } from "./mural-contribuicao-cartao.js";
import { MuralFormulario } from "./mural-formulario.js";
import { MuralQuadro } from "./mural-quadro.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const lista = defaultMessages.muraisLista;
const formulario = defaultMessages.muraisFormulario;
const quadro = defaultMessages.muraisQuadro;

const autor = {
  id: "u1",
  name: "Maria",
  username: "maria",
  avatar: null,
  avatarFrame: null,
  style: null,
};

const mural = (overrides: Partial<MuralResumo> = {}): MuralResumo => ({
  id: "mural_1",
  title: "Fotografia do interior",
  description: "Retratos e paisagens",
  owner: autor,
  contributions: 3,
  createdAt: new Date().toISOString(),
  ...overrides,
});

const elo = (overrides: Partial<MuralContribuicaoInfo> = {}): MuralContribuicaoInfo => ({
  postId: "post_1",
  addedBy: autor,
  addedAt: new Date().toISOString(),
  ...overrides,
});

describe("MuraisLista", () => {
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

  const render = (overrides: Partial<MuraisListaProps> = {}) => {
    const props: MuraisListaProps = {
      murais: [
        mural(),
        mural({ id: "mural_2", title: "Receitas da comunidade", description: null }),
      ],
      state: { kind: "ready" },
      onOpen: vi.fn(),
      hasMore: false,
      loadingMore: false,
      onLoadMore: vi.fn(),
      ...overrides,
    };
    act(() => root.render(<MuraisLista {...props} />));
    return props;
  };

  it("estados de carga, erro e vazio falam com as palavras do DS", () => {
    render({ state: { kind: "loading" } });
    expect(host.textContent).toContain(lista.loading);
    render({ state: { kind: "error" }, murais: [] });
    expect(host.textContent).toContain(lista.error);
    render({ state: { kind: "empty" }, murais: [] });
    expect(host.textContent).toContain(lista.empty);
  });

  it("cartões mostram título, descrição, dono e contagem; abrir chama onOpen", async () => {
    const props = render();

    expect(host.textContent).toContain("Fotografia do interior");
    expect(host.textContent).toContain("Retratos e paisagens");
    expect(host.textContent).toContain("Maria");
    expect(host.textContent).toContain(lista.contributions(3));

    const cartoes = host.querySelectorAll<HTMLButtonElement>("button[aria-label]");
    await act(async () => cartoes[1].click());
    expect(props.onOpen).toHaveBeenCalledWith("mural_2");
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

describe("MuralFormulario", () => {
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

  const render = (overrides: Partial<MuralFormularioProps> = {}) => {
    const props: MuralFormularioProps = {
      aberto: true,
      ocupado: false,
      onSalvar: vi.fn(),
      onFechar: vi.fn(),
      ...overrides,
    };
    act(() => root.render(<MuralFormulario {...props} />));
    return props;
  };

  const caixa = () => document.body.querySelector<HTMLInputElement>("#mural-titulo")!;
  const descricao = () => document.body.querySelector<HTMLTextAreaElement>("#mural-descricao")!;
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
    digitar(caixa(), "Fotos da feira");
    expect(salvar().hasAttribute("disabled")).toBe(false);
    digitar(descricao(), "O que a feira tem de bonito");
    await act(async () => salvar().click());
    expect(props.onSalvar).toHaveBeenCalledWith({
      title: "Fotos da feira",
      description: "O que a feira tem de bonito",
    });
  });

  it("na edição os campos chegam preenchidos", () => {
    render({ tituloInicial: "Título atual", descricaoInicial: "Descrição atual" });

    expect(caixa().value).toBe("Título atual");
    expect(descricao().value).toBe("Descrição atual");
  });
});

describe("MuralQuadro", () => {
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
    overrides: Partial<MuralQuadroProps> = {},
    filhos?: MuralQuadroProps["children"],
  ) => {
    const props: MuralQuadroProps = {
      mural: mural(),
      ehDono: false,
      onEditar: vi.fn(),
      onRemover: vi.fn(),
      onColar: vi.fn(),
      colando: false,
      colarErro: null,
      children: filhos ?? null,
      ...overrides,
    };
    act(() => root.render(<MuralQuadro {...props}>{filhos ?? null}</MuralQuadro>));
    return props;
  };

  it("cabeçalho fala título, descrição, dono e contagem; sem dono não há ações", () => {
    render();

    expect(host.textContent).toContain("Fotografia do interior");
    expect(host.textContent).toContain("Retratos e paisagens");
    expect(host.textContent).toContain(quadro.contributions(3));
    expect(host.textContent).not.toContain(quadro.editar);
    expect(host.textContent).not.toContain(quadro.remover);
  });

  it("dono vê as ações e a remoção pede confirmação", async () => {
    const props = render({ ehDono: true });

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

  it("sem publicações o quadro diz que está vazio; com elas, elas aparecem", () => {
    render({}, null);
    expect(host.textContent).toContain(quadro.vazio);
    render({}, <article>publicação do feed</article>);
    expect(host.textContent).toContain("publicação do feed");
    expect(host.textContent).toContain(quadro.coladas);
  });

  it("colar entrega o valor aparado e limpa a linha", async () => {
    const props = render();

    const linha = host.querySelector<HTMLInputElement>("input")!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(
        linha,
        "  https://enois.ia.br/feed/post_9  ",
      );
      linha.dispatchEvent(new Event("input", { bubbles: true }));
    });
    const colar = [...host.querySelectorAll("button")].find((b) => b.textContent === quadro.colar)!;
    await act(async () => colar.click());
    expect(props.onColar).toHaveBeenCalledWith("https://enois.ia.br/feed/post_9");
    expect(linha.value).toBe("");
  });

  it("erro de colagem aparece debaixo da barra", () => {
    render({ colarErro: "Essa publicação já está neste mural." });
    expect(host.textContent).toContain("Essa publicação já está neste mural.");
  });

  it("sem menu de compartilhar não há botão; com ele, o botão abre os itens", async () => {
    render();
    expect(host.querySelector(`button[aria-label="${quadro.compartilhar}"]`)).toBeNull();

    render({
      compartilhar: <button type="button">Copiar link</button>,
    });
    const abrir = host.querySelector<HTMLButtonElement>(
      `button[aria-label="${quadro.compartilhar}"]`,
    )!;
    expect(abrir).not.toBeNull();
    await act(async () => abrir.click());

    // No jsdom não há layout, então o menu abre deslocado e recortado; aqui basta provar que
    // os itens de quem compõe chegam ao documento. O clique neles é do app (teste da rota).
    expect(
      [...document.body.querySelectorAll("button")].filter((b) => b.textContent === "Copiar link")
        .length,
    ).toBe(1);
  });

  it("quem não é dono também compartilha o mural", () => {
    render({ compartilhar: <button type="button">Copiar link</button> });
    expect(host.querySelector(`button[aria-label="${quadro.compartilhar}"]`)).not.toBeNull();
    expect(host.textContent).not.toContain(quadro.editar);
  });
});

describe("MuralContribuicaoCartao", () => {
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

  const render = (overrides: Partial<MuralContribuicaoCartaoProps> = {}) => {
    const props: MuralContribuicaoCartaoProps = {
      info: elo(),
      podeRemover: false,
      onRemover: vi.fn(),
      children: <article>publicação</article>,
      ...overrides,
    };
    act(() =>
      root.render(<MuralContribuicaoCartao {...props}>{props.children}</MuralContribuicaoCartao>),
    );
    return props;
  };

  it("fala quem colou e mostra a publicação de quem compõe", () => {
    render();
    expect(host.textContent).toContain(quadro.coladoPor("Maria"));
    expect(host.textContent).toContain("publicação");
  });

  it("quem não pode remover não vê o gesto; quem pode, confirma antes", async () => {
    render({ podeRemover: false });
    expect(host.textContent).not.toContain(quadro.tirar);

    const props = render({ podeRemover: true });
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
