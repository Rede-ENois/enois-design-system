// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { PapoIntervaloView } from "../../types/domain/paporeto/papo-intervalo-view.js";
import type { PapoJanela } from "../../types/domain/paporeto/papo-janela.js";
import type { PapoPanelProps } from "../../types/domain/paporeto/papo-panel-props.js";
import type { PapoPublicacaoView } from "../../types/domain/paporeto/papo-publicacao-view.js";
import type { PapoStatus } from "../../types/domain/paporeto/papo-status.js";
import type { PapoSubjectView } from "../../types/domain/paporeto/papo-subject-view.js";

import { PapoPanel } from "./papo-panel.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.papoPanel;
const messagesDaTimeline = defaultMessages.papoTimeline;
const messagesDasPublicacoes = defaultMessages.papoPublicacoes;

const assunto = (nome: string, status: PapoSubjectView["status"]): PapoSubjectView => ({
  subject: nome,
  status,
  pontuacao: 4.2,
  falasPost: 12,
  falasComentario: 8,
  pessoas: 9,
  falasUltimaHora: 3,
  crescimento: 25,
});

const assuntoNovo: PapoSubjectView = {
  ...assunto("pangolim na horta", "EMERGENTE"),
  crescimento: null,
};

const assuntos: PapoSubjectView[] = [
  assunto("inteligencia artificial", "EMERGENTE"),
  assunto("feira de projetos", "HOT"),
  assunto("cansaço", "PERSISTENTE"),
];

const timeline: PapoIntervaloView[] = [
  { hora: "2026-11-18T17:00:00Z", falas: 2 },
  { hora: "2026-11-18T18:00:00Z", falas: 5 },
];

const publicacoes: PapoPublicacaoView[] = [
  {
    id: "post_1",
    fonte: "POST",
    texto: "bora de meetup de rust na sexta?",
    autor: "Ana Lima",
    handle: "ana.lima",
    quando: "há 2 horas",
    href: "/post/post_1",
  },
];

describe("PapoPanel", () => {
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

  const render = (overrides: Partial<PapoPanelProps> = {}) => {
    const props: PapoPanelProps = {
      assuntos,
      estado: "ready",
      falasAnalisadas: 87,
      filtro: null,
      onFiltroChange: vi.fn(),
      subjectAberto: null,
      onSubjectChange: vi.fn(),
      timeline: null,
      janela: "24h" as PapoJanela,
      onJanelaChange: vi.fn(),
      publicacoes: null,
      publicacoesEstado: "loading",
      onPublicacoesRetry: vi.fn(),
      onRetry: vi.fn(),
      ...overrides,
    };
    act(() => root.render(<PapoPanel {...props} />));
    return props;
  };

  it("mostra os assuntos com status, contagens e crescimento", () => {
    render();

    const texto = host.textContent ?? "";
    expect(texto).toContain("inteligencia artificial");
    expect(texto).toContain(messages.statusEmergente);
    expect(texto).toContain(messages.crescimentoCurto(25));
    expect(texto).toContain(messages.crescimento(25));
    expect(texto).toContain(messages.falasAnalisadas(87));
    expect(texto).not.toContain("@"); // nenhum identificador de pessoa vaza
  });

  it("cada metrica fica com o seu rotulo no mesmo item da grade", () => {
    render();

    const card = host.querySelector("ol li") ?? host;
    const grade = card.querySelector("ul.grid");
    expect(grade?.className).toContain("grid-cols-2");
    expect(grade?.className).toContain("min-[380px]:grid-cols-4");

    const metricas = grade ? [...grade.querySelectorAll("li")] : [];
    expect(metricas).toHaveLength(4);
    const numeros = metricas.map((li) => li.querySelector("p")?.textContent);
    expect(numeros).toEqual(["9", "3", "12", "8"]);
    expect(metricas[0]?.textContent).toContain(messages.pessoasRotulo);
    expect(metricas[1]?.textContent).toContain(messages.falasUltimaHoraRotulo);
    expect(metricas[2]?.textContent).toContain(messages.falasPostRotulo);
    expect(metricas[3]?.textContent).toContain(messages.falasComentarioRotulo);
  });

  it("o card nao solta separador solto nem quebra o nome do assunto", () => {
    render();

    const card = host.querySelector("ol li") ?? host;
    // O separador "·" entre métricas virou grade: não sobra ponto solto no card.
    expect(card.textContent?.split("·").length ?? 0).toBeLessThanOrEqual(1);
  });

  it("assunto sem vespera comparavel mostra novo em alta em vez de percentual inventado", () => {
    render({ assuntos: [assuntoNovo] });

    const texto = host.textContent ?? "";
    expect(texto).toContain(messages.novoEmAlta);
    expect(texto).not.toContain("%");
    expect(texto).not.toContain(messages.crescimento(0));
  });

  it("marca o assunto de amostra pequena com o numero de pessoas", () => {
    const pequeno = {
      ...assunto("grupo de estudo", "EMERGENTE"),
      pessoas: 4,
      amostragemMenor: true,
    };
    render({ assuntos: [pequeno] });

    expect(host.textContent ?? "").toContain(messages.amostragemMenor(4));
  });

  it("nao marca amostra pequena quando o assunto nao passou pelo chao da base", () => {
    render();

    expect(host.textContent ?? "").not.toContain("Amostra pequena");
  });

  it("filtra por trajetoria sem mostrar assunto de outra faixa", () => {
    render({ filtro: "EMERGENTE" });

    const texto = host.textContent ?? "";
    expect(texto).toContain("inteligencia artificial");
    expect(texto).not.toContain("feira de projetos");
    expect(texto).not.toContain("cansaço");
  });

  it("o clique no filtro devolve a faixa escolhida", () => {
    const props = render({ filtro: null });

    const aba = [...host.querySelectorAll("[role=tab]")].find(
      (b) => b.textContent === messages.filtroHot,
    );
    act(() => aba?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(props.onFiltroChange).toHaveBeenCalledWith("HOT");
  });

  it("abre a timeline do assunto aberto e troca a janela dela", () => {
    const props = render({ subjectAberto: "inteligencia artificial", timeline });

    expect(host.textContent ?? "").toContain(messagesDaTimeline.eixo);

    const serie = host.querySelectorAll("[role=img]");
    expect(serie).toHaveLength(1);
    expect(serie[0]?.getAttribute("aria-label") ?? "").toContain("inteligencia artificial");

    const aba30d = [...host.querySelectorAll("[role=tab]")].find(
      (b) => b.textContent === messagesDaTimeline.rotuloJanela("30d"),
    );
    act(() => aba30d?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(props.onJanelaChange).toHaveBeenCalledWith("30d");
  });

  it("assunto fechado nao desenha barra de timeline nenhuma", () => {
    render({ subjectAberto: null });

    expect(host.querySelectorAll("[role=img]")).toHaveLength(0);
  });

  it("timeline vazia diz que nao tem falas na janela", () => {
    render({ subjectAberto: "cansaço", timeline: [] });

    expect(host.textContent ?? "").toContain(messagesDaTimeline.semFalas);
  });

  it("assunto aberto lista as publicacoes relacionadas com autor e link", () => {
    render({
      subjectAberto: "inteligencia artificial",
      timeline,
      publicacoes,
      publicacoesEstado: "ready",
    });

    const texto = host.textContent ?? "";
    expect(texto).toContain(messagesDasPublicacoes.titulo);
    expect(texto).toContain("bora de meetup de rust na sexta?");
    expect(texto).toContain("Ana Lima");
    expect(texto).toContain("há 2 horas");

    const link = host.querySelector('a[href="/post/post_1"]');
    expect(link?.textContent).toBe(messagesDasPublicacoes.abrir);
  });

  it("assunto fechado nao desenha publicacoes relacionadas", () => {
    render({ subjectAberto: null, publicacoes, publicacoesEstado: "ready" });

    expect(host.textContent ?? "").not.toContain(messagesDasPublicacoes.titulo);
  });

  it("contem sem as props de publicacoes: so a timeline aparece", () => {
    render({
      subjectAberto: "cansaço",
      timeline,
      publicacoes: undefined,
      publicacoesEstado: undefined,
    });

    const texto = host.textContent ?? "";
    expect(texto).toContain(messagesDaTimeline.eixo);
    expect(host.querySelectorAll("[role=img]")).toHaveLength(1);
    expect(texto).not.toContain(messagesDasPublicacoes.titulo);
  });

  it("o clique no assunto alterna a timeline via callback", () => {
    const props = render({ subjectAberto: null });

    const botao = [...host.querySelectorAll("button")].find((b) =>
      (b.getAttribute("aria-label") ?? "").includes(messages.abrirTimeline("").slice(0, 8)),
    );
    act(() => botao?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(props.onSubjectChange).toHaveBeenCalledWith("inteligencia artificial");
  });

  it("ranking vazio mostra o vazio honesto e nada de filtro", () => {
    render({ assuntos: [] });

    expect(host.textContent ?? "").toContain(messages.semAssuntos);
    expect(host.querySelectorAll("[role=tab]")).toHaveLength(0);
  });

  it("estado de loading mostra o aviso e nada de lista", () => {
    render({ estado: "loading", assuntos: null });

    expect(host.textContent ?? "").toContain(messages.loading);
    expect(host.querySelectorAll("[role=tab]")).toHaveLength(0);
  });

  it("estado de erro mostra o aviso e o retry dispara o callback", () => {
    const props = render({ estado: "error", assuntos: null });

    expect(host.textContent ?? "").toContain(messages.error);
    const retry = [...host.querySelectorAll("button")].find((b) =>
      b.textContent?.includes(messages.retry),
    );
    act(() => retry?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(props.onRetry).toHaveBeenCalledTimes(1);
  });
});

describe("formatação do crescimento", () => {
  it("a pílula curta e a frase longa arredondam o mesmo número", () => {
    for (const percent of [0.4, 12.5, 23.7, 49.9, 99.6, 100]) {
      const arredondado = Math.round(percent);
      expect(messages.crescimentoCurto(percent)).toBe(`+${arredondado}%`);
      expect(messages.crescimento(percent)).toContain(`${arredondado}%`);
      expect(messages.crescimento(percent)).toContain("Subiu");
    }
  });
});
