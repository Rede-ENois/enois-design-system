// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { DesafioParticipacaoView } from "../../types/domain/desafios/desafio-participacao-view.js";
import type { DesafioView } from "../../types/domain/desafios/desafio-view.js";
import type { DesafiosDetalheProps } from "../../types/domain/desafios/desafios-detalhe-props.js";

import { DesafiosDetalhe } from "./desafios-detalhe.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.desafiosCard;

const autor = {
  id: "user_1",
  name: "Ana Mel",
  username: "mel",
  avatar: null,
  avatarFrame: null,
  nameStyle: null,
};

const desafio: DesafioView = {
  id: "desafio_1",
  title: "Um desafio de escrita",
  description: "Escreva um poema de quatro versos sobre o seu bairro.",
  author: autor,
  createdAt: "2026-11-15T10:30:00Z",
  endsAt: "2026-11-20T10:30:00Z",
  status: "ACTIVE",
  destaqueId: null,
  participacoes: 1,
  isMine: false,
};

const participacao: DesafioParticipacaoView = {
  id: "part_1",
  desafioId: "desafio_1",
  author: { ...autor, id: "user_2", name: "Bia Souza", username: "bia" },
  content: "Um poema sobre o meu bairro, feito na hora.",
  createdAt: "2026-11-15T11:00:00Z",
  cheers: 4,
  cheered: false,
  isMine: false,
};

describe("DesafiosDetalhe", () => {
  let root: Root | null = null;
  let host: HTMLDivElement;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root?.unmount());
    root = null;
    document.body.replaceChildren();
  });

  const render = (overrides: Partial<DesafiosDetalheProps> = {}) => {
    const props: DesafiosDetalheProps = {
      open: true,
      onOpenChange: vi.fn(),
      timeLeft: "em 3 dias",
      desafio,
      state: { kind: "ready" },
      participacoes: [participacao],
      onParticipate: vi.fn().mockResolvedValue(undefined),
      onCheer: vi.fn(),
      onUncheer: vi.fn(),
      onRemoveParticipacao: vi.fn(),
      onClose: vi.fn(),
      ...overrides,
    };
    act(() => root!.render(<DesafiosDetalhe {...props} />));
    return props;
  };

  it("abre em tela cheia: a camada ocupa a janela inteira", () => {
    render();

    const dialogo = document.querySelector<HTMLElement>('[role="dialog"]');
    expect(dialogo).not.toBeNull();
    // O card do feed usa [content-visibility:auto]: um overlay embutido ficaria preso ao card.
    expect(dialogo!.className).toContain("h-dvh");
    expect(dialogo!.className).toContain("w-screen");
    expect(dialogo!.className).toContain("max-w-none");
  });

  it("monta no portal, fora do card do feed", () => {
    const card = document.createElement("article");
    card.classList.add("[content-visibility:auto]");
    document.body.appendChild(card);
    const cardRoot = createRoot(card);

    try {
      act(() =>
        cardRoot.render(
          <DesafiosDetalhe
            open
            onOpenChange={vi.fn()}
            timeLeft={null}
            desafio={desafio}
            state={{ kind: "ready" }}
            participacoes={[]}
            onParticipate={vi.fn().mockResolvedValue(undefined)}
            onCheer={vi.fn()}
            onUncheer={vi.fn()}
            onRemoveParticipacao={vi.fn()}
            onClose={vi.fn()}
          />,
        ),
      );

      const dialogo = document.querySelector('[role="dialog"]');
      expect(dialogo).not.toBeNull();
      expect(card.contains(dialogo!)).toBe(false);
      expect(document.body.contains(dialogo!)).toBe(true);
    } finally {
      act(() => cardRoot.unmount());
      card.remove();
    }
  });

  it("desenha o convite inteiro e o mural abaixo", () => {
    render();

    const dialogo = document.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(dialogo.textContent).toContain(desafio.title);
    expect(dialogo.textContent).toContain(desafio.description);
    expect(dialogo.textContent).toContain("Ana Mel");
    expect(dialogo.textContent).toContain(messages.closesAt("em 3 dias"));
    expect(dialogo.textContent).toContain(participacao.content);
  });

  it("rola a coluna inteira: o gesto sobre o convite também desce até as participações", () => {
    render();

    const dialogo = document.querySelector<HTMLElement>('[role="dialog"]')!;
    const coluna = dialogo.querySelector("header")!.parentElement!;

    // Um só contêiner de rolagem, o da coluna (convite + mural). Com o mural rolando sozinho, o
    // gesto sobre o convite parava nele e as participações ficavam fora de alcance — e o convite
    // longo comia a altura da camada, deixando o mural sem espaço para rolar.
    const rolos = Array.from(dialogo.querySelectorAll<HTMLElement>("div")).filter((div) =>
      div.className.includes("overflow-y-auto"),
    );
    expect(rolos).toHaveLength(1);
    expect(rolos[0]).toBe(coluna);
    expect(coluna.className).toContain("overscroll-contain");
    expect(coluna.className).toContain("min-h-0");
  });

  it("fecha pelo X uma vez só", () => {
    const props = render();

    // O X do wrapper traz o rótulo como texto sr-only, não como aria-label.
    const fechar = Array.from(document.querySelectorAll("button")).find((button) =>
      button.textContent?.includes(defaultMessages.dialog.close),
    );
    expect(fechar).toBeTruthy();

    act(() => fechar!.click());

    expect(props.onOpenChange).toHaveBeenCalledTimes(1);
    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });

  it("Escape fecha pela mesma porta", () => {
    const props = render();

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });

    expect(props.onOpenChange).toHaveBeenCalledWith(false);
  });

  it("não desenha nada enquanto está fechado", () => {
    render({ open: false });

    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });
});
