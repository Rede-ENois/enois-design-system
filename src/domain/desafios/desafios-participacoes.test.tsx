// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { DesafioParticipacaoView } from "../../types/domain/desafios/desafio-participacao-view.js";
import type { DesafioView } from "../../types/domain/desafios/desafio-view.js";
import type { DesafiosParticipacoesProps } from "../../types/domain/desafios/desafios-participacoes-props.js";

import { DesafiosParticipacoes } from "./desafios-participacoes.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.desafiosParticipacoes;

const autor = {
  id: "user_2",
  name: "Bia Souza",
  username: "bia",
  avatar: null,
  avatarFrame: null,
  nameStyle: null,
};

const desafioAtivoAlheio: DesafioView = {
  id: "desafio_1",
  title: "Um desafio de escrita",
  description: "Escreva um poema.",
  author: { ...autor, id: "user_1", name: "Ana Mel", username: "mel" },
  createdAt: "2026-11-15T10:30:00Z",
  endsAt: null,
  status: "ACTIVE",
  destaqueId: null,
  participacoes: 1,
  isMine: false,
};

const participacao: DesafioParticipacaoView = {
  id: "part_1",
  desafioId: "desafio_1",
  author: autor,
  content: "Um poema sobre o meu bairro, feito na hora.",
  createdAt: "2026-11-15T11:00:00Z",
  cheers: 4,
  cheered: false,
  isMine: false,
};

const participacaoMinha: DesafioParticipacaoView = {
  ...participacao,
  id: "part_2",
  author: { ...autor, id: "user_3", name: "Cris Luz", username: "cris" },
  isMine: true,
};

describe("DesafiosParticipacoes", () => {
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

  const render = (
    overrides: Partial<DesafiosParticipacoesProps> = {},
    desafio = desafioAtivoAlheio,
    lista = [participacao, participacaoMinha],
  ) => {
    const props: DesafiosParticipacoesProps = {
      desafio,
      state: { kind: "ready" },
      participacoes: lista,
      onParticipate: vi.fn().mockResolvedValue(undefined),
      onCheer: vi.fn(),
      onUncheer: vi.fn(),
      onRemoveParticipacao: vi.fn(),
      onClose: vi.fn(),
      ...overrides,
    };
    act(() => root.render(<DesafiosParticipacoes {...props} />));
    return props;
  };

  const botaoPorRotulo = (rotulo: string) =>
    Array.from(host.querySelectorAll("button")).find(
      (button) => button.getAttribute("aria-label") === rotulo,
    );

  const botaoPorTitulo = (titulo: string) =>
    Array.from(host.querySelectorAll("button")).find(
      (button) => button.getAttribute("title") === titulo,
    );

  it("desenha as participações com autoria e a torcida contada", () => {
    render();

    expect(host.textContent).toContain("Bia Souza");
    expect(host.textContent).toContain(participacao.content);
    expect(host.textContent).toContain(messages.cheers(4));
    // A torcida é contada: o id de quem torceu não existe no mural.
    expect(host.textContent).not.toContain("user_");
  });

  it("torcer é um gesto por participação, e o rótulo diz o estado", () => {
    const props = render();

    const torcida = botaoPorRotulo(messages.cheer)!;
    act(() => torcida.click());
    expect(props.onCheer).toHaveBeenCalledWith("part_1");

    const torcidaMinha = botaoPorRotulo(messages.uncheer);
    expect(torcidaMinha).toBeFalsy();
  });

  it("quem vê e não convocou participa; quem convocou não tem campo de resposta", () => {
    render();
    expect(host.querySelector("textarea")).toBeTruthy();

    render({}, { ...desafioAtivoAlheio, isMine: true });
    expect(host.querySelector("textarea")).toBeFalsy();
  });

  it("desafio encerrado: mural de leitura, sem campo e sem gesto de destaque", () => {
    render(
      {},
      {
        ...desafioAtivoAlheio,
        status: "CLOSED" as const,
        destaqueId: "part_1",
        author: { ...desafioAtivoAlheio.author, isMine: false } as typeof desafioAtivoAlheio.author,
      },
      [participacao],
    );

    expect(host.textContent).toContain(messages.closedMural);
    expect(host.querySelector("textarea")).toBeFalsy();
    expect(botaoPorTitulo(messages.escolherDestaque)).toBeFalsy();
  });

  it("quem convocou escolhe o reconhecimento e encerra com ele", () => {
    const meuAtivo = { ...desafioAtivoAlheio, isMine: true };
    const props = render({}, meuAtivo);

    const escolher = botaoPorTitulo(messages.escolherDestaque)!;
    act(() => escolher.click());

    const encerrar = Array.from(host.querySelectorAll("button")).find((button) =>
      button.textContent?.includes(messages.encerrar),
    );
    expect(encerrar).toBeTruthy();
    act(() => encerrar!.click());
    expect(props.onClose).toHaveBeenCalledWith("part_1");
  });

  it("remover é gesto só da participação própria", () => {
    const props = render();

    const remover = botaoPorRotulo(messages.remove)!;
    act(() => remover.click());
    expect(props.onRemoveParticipacao).toHaveBeenCalledWith("part_2");
  });

  it("estados de carga, falha e vazio são desenhados", () => {
    render({ state: { kind: "loading" } });
    expect(host.textContent).toContain(messages.loading);

    render({ state: { kind: "error" } });
    expect(host.textContent).toContain(messages.error);

    render({ state: { kind: "empty" } }, desafioAtivoAlheio, []);
    expect(host.textContent).toContain(messages.empty);
  });
});
