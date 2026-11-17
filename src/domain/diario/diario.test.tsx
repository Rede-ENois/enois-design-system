// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { DiarioEvento } from "../../types/domain/diario/diario-evento.js";
import type { DiarioLinhaTempoProps } from "../../types/domain/diario/diario-linha-tempo-props.js";

import { DiarioLinhaTempo } from "./diario-linha-tempo.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const rotulos = defaultMessages.diario;

const evento = (overrides: Partial<DiarioEvento> = {}): DiarioEvento => ({
  tipo: "PUBLICACAO",
  quando: "2026-11-15T18:00:00Z",
  postId: "post_1",
  trecho: "primeira publicação",
  contexto: null,
  ...overrides,
});

describe("DiarioLinhaTempo", () => {
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

  const render = (props: Partial<DiarioLinhaTempoProps> = {}) => {
    const completos: DiarioLinhaTempoProps = {
      eventos: props.eventos ?? [evento()],
      temMais: props.temMais ?? false,
      carregandoMais: props.carregandoMais ?? false,
      onCarregarMais: props.onCarregarMais ?? vi.fn(),
      onAbrirEvento: props.onAbrirEvento ?? vi.fn(),
    };
    act(() => {
      root.render(<DiarioLinhaTempo {...completos} />);
    });
    return completos;
  };

  it("agrupa os eventos por dia e rotula cada tipo", () => {
    render({
      eventos: [
        evento({
          tipo: "PUBLICACAO",
          quando: "2026-11-15T18:00:00Z",
          postId: "p1",
          trecho: "publicação hoje",
        }),
        evento({
          tipo: "COMENTARIO",
          quando: "2026-11-15T17:00:00Z",
          postId: "p0",
          trecho: "comentário hoje",
          contexto: { autorNome: "Ana", autorUsername: "ana", trecho: "post original da Ana" },
        }),
        evento({
          tipo: "REPOST",
          quando: "2026-11-14T10:00:00Z",
          postId: "p9",
          trecho: "repost de ontem",
        }),
      ],
    });

    // Um cabeçalho por dia, em ordem decrescente, com o dia por extenso.
    const dias = [...host.querySelectorAll("section")];
    expect(dias).toHaveLength(2);
    expect(dias[0].getAttribute("aria-label")).toContain("novembro");
    expect(dias[0].getAttribute("aria-label")).toContain("2026");

    expect(host.textContent).toContain(rotulos.publicacao);
    expect(host.textContent).toContain(rotulos.comentario);
    expect(host.textContent).toContain(rotulos.repost);
    // Linha de contexto do comentário: autor + trecho do post original.
    expect(host.textContent).toContain(rotulos.contextoDe("Ana"));
    expect(host.textContent).toContain("post original da Ana");
    // A publicação não tem contexto.
    expect(host.textContent).toContain("publicação hoje");
  });

  it("dias diferentes não compartilham cabeçalho e a ordem é do mais novo para o mais velho", () => {
    render({
      eventos: [
        evento({ quando: "2026-11-15T18:00:00Z", postId: "p1", trecho: "de hoje" }),
        evento({ quando: "2026-11-13T09:00:00Z", postId: "p2", trecho: "de anteontem" }),
        evento({ quando: "2026-11-14T09:00:00Z", postId: "p3", trecho: "de ontem" }),
      ],
    });
    const dias = [...host.querySelectorAll("section")];
    expect(dias).toHaveLength(3);
    const textos = dias.map((dia) => dia.querySelector("h4")!.textContent);
    expect(textos[0]).toContain("15");
    expect(textos[1]).toContain("14");
    expect(textos[2]).toContain("13");
  });

  it("o clique no excerto abre o post do evento", () => {
    const onAbrirEvento = vi.fn();
    const alvo = evento({ postId: "post_alvo", trecho: "clique aqui" });
    render({ eventos: [alvo], onAbrirEvento });
    const botao = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === "clique aqui",
    )!;
    act(() => botao.click());
    expect(onAbrirEvento).toHaveBeenCalledWith(alvo);
  });

  it("sem eventos mostra a mensagem de vazio", () => {
    render({ eventos: [] });
    expect(host.textContent).toContain(rotulos.vazio);
    expect(host.querySelectorAll("button")).toHaveLength(0);
  });

  it("com mais eventos mostra o Carregar mais, que dispara onCarregarMais", () => {
    const onCarregarMais = vi.fn();
    render({ eventos: [evento()], temMais: true, onCarregarMais });
    const carregar = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === rotulos.carregarMais,
    )!;
    act(() => carregar.click());
    expect(onCarregarMais).toHaveBeenCalledTimes(1);
  });

  it("carregando mais desabilita o botão e troca o rótulo", () => {
    render({ eventos: [evento()], temMais: true, carregandoMais: true, onCarregarMais: vi.fn() });
    const carregando = [...host.querySelectorAll("button")].find(
      (b) => b.textContent === rotulos.carregandoMais,
    )!;
    expect((carregando as HTMLButtonElement).disabled).toBe(true);
  });

  it("sem mais eventos o Carregar mais não aparece", () => {
    render({ eventos: [evento()], temMais: false, onCarregarMais: vi.fn() });
    expect(host.textContent).not.toContain(rotulos.carregarMais);
  });
});
