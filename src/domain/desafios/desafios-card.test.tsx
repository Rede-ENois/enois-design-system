// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { DesafioView } from "../../types/domain/desafios/desafio-view.js";
import type { DesafiosCardProps } from "../../types/domain/desafios/desafios-card-props.js";

import { DesafiosCard } from "./desafios-card.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.desafiosCard;

const autorBase = {
  id: "user_1",
  name: "Ana Mel",
  username: "mel",
  avatar: null,
  avatarFrame: null,
  nameStyle: null,
};

const desafioBase: DesafioView = {
  id: "desafio_1",
  title: "Um desafio de escrita",
  description: "Escreva um poema de quatro versos sobre o seu bairro.",
  author: autorBase,
  createdAt: "2026-11-15T10:30:00Z",
  endsAt: null,
  status: "ACTIVE",
  destaqueId: null,
  participacoes: 3,
  isMine: false,
};

describe("DesafiosCard", () => {
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

  const render = (overrides: Partial<DesafiosCardProps> = {}, desafio = desafioBase) => {
    const props: DesafiosCardProps = {
      desafio,
      timeLeft: null,
      onOpen: vi.fn(),
      onRemove: vi.fn(),
      onReport: vi.fn(),
      ...overrides,
    };
    act(() => root.render(<DesafiosCard {...props} />));
    return props;
  };

  const botaoPorRotulo = (rotulo: string) =>
    Array.from(host.querySelectorAll("button")).find(
      (button) => button.getAttribute("aria-label") === rotulo,
    );

  it("desenha o convite com a autoria nominal — nunca Alguém", () => {
    render();

    expect(host.textContent).toContain(desafioBase.title);
    expect(host.textContent).toContain("Ana Mel");
    expect(host.textContent).toContain("@mel");
    expect(host.textContent).not.toContain("Alguém");
  });

  it("desenha a contagem de participações e o estado sem prazo", () => {
    render();

    expect(host.textContent).toContain(messages.participacoes(3));
    expect(host.textContent).toContain(messages.noDeadline);
    expect(host.textContent).not.toContain(messages.closed);
  });

  it("com prazo, desenha o fim da janela; encerrado, desenha o estado", () => {
    render({}, { ...desafioBase, endsAt: "2026-11-20T10:30:00Z" });
    expect(host.textContent).toContain("termina");

    const encerrado: DesafioView = {
      ...desafioBase,
      status: "CLOSED",
      destaqueId: "part_9",
    };
    render({}, encerrado);
    expect(host.textContent).toContain(messages.closed);
  });

  it("remover é gesto só de quem convocou", () => {
    const props = render({}, { ...desafioBase, isMine: true });
    const remover = botaoPorRotulo(messages.remove)!;
    act(() => remover.click());
    expect(props.onRemove).toHaveBeenCalled();

    render();
    expect(botaoPorRotulo(messages.remove)).toBeFalsy();
  });

  it("denúncia é gesto de quem vê; quem convocou não denuncia o próprio", () => {
    const props = render();
    const report = botaoPorRotulo(messages.report);
    expect(report).toBeTruthy();
    act(() => report!.click());
    expect(props.onReport).toHaveBeenCalled();

    render({}, { ...desafioBase, isMine: true });
    expect(botaoPorRotulo(messages.report)).toBeFalsy();
  });

  it("abrir o mural dispara onOpen", () => {
    const props = render();

    const abrir = Array.from(host.querySelectorAll("button")).find((button) =>
      button.textContent?.includes(messages.open),
    );
    expect(abrir).toBeTruthy();
    act(() => abrir!.click());
    expect(props.onOpen).toHaveBeenCalled();
  });
});
