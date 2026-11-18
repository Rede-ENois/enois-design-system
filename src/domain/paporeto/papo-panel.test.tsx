// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { PapoIntervaloView } from "../../types/domain/paporeto/papo-intervalo-view.js";
import type { PapoJanela } from "../../types/domain/paporeto/papo-janela.js";
import type { PapoPanelProps } from "../../types/domain/paporeto/papo-panel-props.js";
import type { PapoStatus } from "../../types/domain/paporeto/papo-status.js";
import type { PapoSubjectView } from "../../types/domain/paporeto/papo-subject-view.js";

import { PapoPanel } from "./papo-panel.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.papoPanel;
const messagesDaTimeline = defaultMessages.papoTimeline;

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

const assuntos: PapoSubjectView[] = [
  assunto("inteligencia artificial", "EMERGENTE"),
  assunto("feira de projetos", "HOT"),
  assunto("cansaço", "PERSISTENTE"),
];

const timeline: PapoIntervaloView[] = [
  { hora: "2026-11-18T17:00:00Z", falas: 2 },
  { hora: "2026-11-18T18:00:00Z", falas: 5 },
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
    expect(texto).toContain(messages.pessoas(9));
    expect(texto).toContain(messages.falasPost(12));
    expect(texto).toContain(messages.falasComentario(8));
    expect(texto).toContain(messages.crescimento(25));
    expect(texto).toContain(messages.falasAnalisadas(87));
    expect(texto).not.toContain("@"); // nenhum identificador de pessoa vaza
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
