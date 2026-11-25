// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { WrappedEstado } from "../../types/domain/wrapped/wrapped-estado.js";
import type { WrappedRetrospectiva } from "../../types/domain/wrapped/wrapped-retrospectiva.js";

import { WrappedExperience } from "./wrapped-experience.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const m = defaultMessages.wrapped;

const retrospectiva: WrappedRetrospectiva = {
  ano: 2026,
  dadosInsuficientes: false,
  metricas: {
    publicacoes: 3,
    comentarios: 10,
    interacoesFeitas: 20,
    interacoesRecebidas: 15,
    comunidades: 2,
    diasAtivos: 40,
    mesMaisAtivo: 0,
  },
  assuntosPublicados: [{ expressao: "rust", ocorrencias: 3 }],
  assuntosComentados: [],
  publicacoesMarcantes: [],
  tretas: [],
  interacoes: [],
  ritmo: {
    diaSemanaMaisAtivo: 1,
    horaMaisAtiva: 9,
    mesMaisAtivo: 0,
    porMes: Array.from({ length: 12 }, () => 0),
    porDiaSemana: Array.from({ length: 7 }, () => 0),
    porHora: Array.from({ length: 24 }, () => 0),
  },
  perfil: {
    principal: "CRIADOR",
    caracteristicas: [{ chave: "CRIADOR", motivo: "3 publicações" }],
  },
  impacto: {
    publicacoesComConversa: 0,
    interacoesRecebidas: 15,
    comunidades: 2,
    credibilidade: 400,
  },
  comunidades: [],
  encerramento: { temaPrincipal: "rust", caracteristica: "CRIADOR", estatistica: "3 publicações" },
};

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function render(state: WrappedEstado, nome = "Ana") {
  act(() => root.render(<WrappedExperience state={state} nome={nome} />));
}

describe("WrappedExperience", () => {
  it("abre na abertura com o nome e o ano", () => {
    render({ kind: "ready", retrospectiva });
    expect(container.textContent).toContain(m.abertura("Ana", 2026));
  });

  it("avança e volta entre as seções, sem passar do fim", () => {
    render({ kind: "ready", retrospectiva });
    const avancar = () => {
      const botao = [...container.querySelectorAll("button")].find((b) =>
        b.textContent?.includes(m.avancar),
      );
      return botao;
    };
    act(() => avancar()!.click());
    // A sequência é abertura, assuntos, ritmo, perfil, impacto, encerramento (sem posts/tretas aqui).
    expect(container.textContent).toContain(m.assuntosTitulo);

    const voltar = [...container.querySelectorAll("button")].find((b) =>
      b.textContent?.includes(m.voltar),
    );
    act(() => voltar!.click());
    expect(container.textContent).toContain(m.abertura("Ana", 2026));
  });

  it("esconde a seção de tretas quando não há treta", () => {
    render({ kind: "ready", retrospectiva });
    expect(container.textContent).not.toContain(m.tretasTitulo);
  });

  it("mostra o estado sem dados quando a conta não tem histórico", () => {
    render({ kind: "sem-dados" });
    expect(container.textContent).toContain(m.semDadosTitulo);
  });

  it("mostra o aviso de fora da janela", () => {
    render({ kind: "fora-da-janela" });
    expect(container.textContent).toContain(m.foraDaJanelaTitulo);
  });

  it("mostra o aviso de ainda não pronta", () => {
    render({ kind: "nao-pronta" });
    expect(container.textContent).toContain(m.naoProntaTitulo);
  });

  it("mostra o erro em vez de uma retrospectiva vazia", () => {
    render({ kind: "error", message: "Falha de rede" });
    expect(container.textContent).toContain(m.erro);
    expect(container.textContent).toContain("Falha de rede");
  });
});
