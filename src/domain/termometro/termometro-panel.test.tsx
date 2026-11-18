// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { TermometroEmocaoPainel } from "../../types/domain/termometro/termometro-emocao-painel.js";
import type { TermometroEmocao } from "../../types/domain/termometro/termometro-emocao.js";
import type { TermometroJanelaPainel } from "../../types/domain/termometro/termometro-janela-painel.js";
import type { TermometroPanelProps } from "../../types/domain/termometro/termometro-panel-props.js";

import { TermometroPanel } from "./termometro-panel.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.termometroPanel;

const emocao = (
  nome: TermometroEmocao,
  porcentagem: number,
  contagem: number,
): TermometroEmocaoPainel => ({
  emocao: nome,
  porcentagem,
  contagem,
});

const janelaAmpla = {
  periodo: "ULTIMOS_30D",
  amostraSuficiente: true,
  manifestacoes: 120,
  participantes: 60,
  dominante: "CELEBRANDO",
  emocoes: [
    emocao("CELEBRANDO", 40, 48),
    emocao("ALEGRE", 25, 30),
    emocao("PRECISANDO", 20, 24),
    emocao("CANSADA", 10, 12),
    emocao("PESADA", 3, 4),
    emocao("CURIOSA", 2, 2),
  ],
} satisfies TermometroJanelaPainel;

const janela7d = {
  periodo: "ULTIMOS_7D",
  amostraSuficiente: true,
  manifestacoes: 50,
  participantes: 35,
  dominante: "CELEBRANDO",
  emocoes: [
    emocao("CELEBRANDO", 50, 25),
    emocao("ALEGRE", 20, 10),
    emocao("PRECISANDO", 15, 7),
    emocao("CANSADA", 10, 5),
    emocao("PESADA", 3, 2),
    emocao("CURIOSA", 2, 1),
  ],
} satisfies TermometroJanelaPainel;

const janelaVazia = {
  periodo: "HOJE",
  amostraSuficiente: false,
  manifestacoes: 4,
  participantes: 5,
  dominante: null,
  emocoes: [emocao("ALEGRE", 100, 4)],
} satisfies TermometroJanelaPainel;

describe("TermometroPanel", () => {
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

  const render = (overrides: Partial<TermometroPanelProps> = {}) => {
    const props: TermometroPanelProps = {
      janelas: [janelaVazia, janela7d, janelaAmpla],
      estado: "ready",
      periodo: "ULTIMOS_30D",
      onPeriodoChange: vi.fn(),
      onRetry: vi.fn(),
      ...overrides,
    };
    act(() => root.render(<TermometroPanel {...props} />));
    return props;
  };

  it("mostra as barras por emocao com porcentagem e contagem da janela selecionada", () => {
    render();

    const texto = host.textContent ?? "";
    expect(texto).toContain("40%"); // celebrando domina os 30d
    expect(texto).toContain(messages.manifestacoes(120));
    expect(texto).toContain(messages.participantes(60));
    expect(texto).toContain(messages.emocaoCelebrando);
    expect(texto).not.toContain("CONSEGUI fechar"); // nada de texto de ninguém

    // A barra sai por variável CSS (nada de largura crua): o preenchimento acompanha o número.
    const barras = [...host.querySelectorAll<HTMLElement>("[role=meter] > div")];
    const preenchimentos = barras.map((b) => b.style.getPropertyValue("--preenchimento"));
    expect(preenchimentos).toContain("40%");
    expect(preenchimentos).toContain("25%");
  });

  it("troca de periodo sem inventar dado de outra janela", () => {
    const props = render({ periodo: "ULTIMOS_7D" });

    const texto = host.textContent ?? "";
    expect(texto).toContain(messages.manifestacoes(50));
    expect(texto).not.toContain(messages.manifestacoes(120));

    const aba = [...host.querySelectorAll("[role=tab]")].find(
      (b) => b.textContent === messages.periodoHoje,
    );
    act(() => aba?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(props.onPeriodoChange).toHaveBeenCalledWith("HOJE");
  });

  it("janela com amostra pequena NAO mostra indicador: mostra o aviso honesto", () => {
    render({ periodo: "HOJE" });

    const texto = host.textContent ?? "";
    expect(texto).toContain(messages.amostraInsuficiente);
    expect(texto).not.toContain("100%"); // o indicador da janela não vaza
    expect(texto).not.toContain(messages.manifestacoes(4));
  });

  it("compara com a janela anterior quando as duas tem amostra", () => {
    // CELEBRANDO: 50% nos 7d contra 40% nos 30d = subiu 10 pontos.
    render({ periodo: "ULTIMOS_7D" });

    expect(host.textContent ?? "").toContain(messages.comparacaoComJanelaAnterior(10));
  });

  it("sem comparacao possivel (janela anterior sem amostra), nao compara", () => {
    const hojeComAmostra = {
      ...janelaVazia,
      amostraSuficiente: true,
      manifestacoes: 30,
      participantes: 25,
      dominante: "ALEGRE" as const,
    };
    // 24h sem amostra suficiente: a comparação do HOJE fica sem base.
    render({
      periodo: "HOJE",
      janelas: [hojeComAmostra, janelaVazia, janela7d, janelaAmpla],
    });

    expect(host.textContent ?? "").not.toContain(messages.comparacaoComJanelaAnterior(0));
  });

  it("estado de loading mostra o aviso e nada de janela", () => {
    render({ estado: "loading", janelas: null });

    expect(host.textContent ?? "").toContain(messages.loading);
  });

  it("estado de erro mostra o aviso e o retry dispara o callback", () => {
    const props = render({ estado: "error", janelas: null });

    expect(host.textContent ?? "").toContain(messages.error);
    const retry = [...host.querySelectorAll("button")].find((b) =>
      b.textContent?.includes(messages.retry),
    );
    act(() => retry?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(props.onRetry).toHaveBeenCalledTimes(1);
  });
});
