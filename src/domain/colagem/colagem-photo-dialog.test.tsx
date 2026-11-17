// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { ColagemPhotoDetail } from "../../types/domain/colagem/colagem-photo-detail.js";
import type { ColagemPhotoDialogProps } from "../../types/domain/colagem/colagem-photo-dialog-props.js";

import { ColagemPhotoDialog } from "./colagem-photo-dialog.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.colagemDialog;

const foto = (overrides: Partial<ColagemPhotoDetail> = {}): ColagemPhotoDetail => ({
  id: "colagem_1",
  mediaUrl: "https://cdn.example.test/f1.jpg",
  description: "O mural de hoje",
  mediaSpoiler: false,
  authorName: "Maria",
  authorAvatar: null,
  authorAvatarFrame: null,
  authorStyle: null,
  reactions: 2,
  reactionSummary: { LIKE: 2 },
  myReaction: null,
  comments: 1,
  isOwner: false,
  ...overrides,
});

const base = (): ColagemPhotoDialogProps => ({
  open: true,
  onOpenChange: vi.fn(),
  photo: foto(),
  photoState: { kind: "ready" },
  comments: [
    {
      id: "c1",
      authorName: "João",
      authorAvatar: null,
      authorStyle: null,
      content: "Linda!",
      mediaUrl: null,
      mediaSpoiler: false,
      isMine: false,
    },
  ],
  commentsState: { kind: "ready" },
  emojis: { LIKE: "👍" },
  reactionPending: false,
  onToggleReaction: vi.fn(),
  onComment: vi.fn().mockResolvedValue(undefined),
  onRemoveComment: vi.fn(),
  onRemovePhoto: vi.fn().mockResolvedValue(undefined),
  commentAttachment: null,
  onCommentFiles: () => {},
  onRemoveCommentAttachment: () => {},
});

describe("ColagemPhotoDialog", () => {
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

  const render = (overrides: Partial<ColagemPhotoDialogProps> = {}) => {
    const props = { ...base(), ...overrides };
    act(() => root.render(<ColagemPhotoDialog {...props} />));
    return props;
  };

  // O Diálogo do Radix portais para o body: o que ele desenha não fica no host.
  const tela = () => document.body;
  const porTexto = (texto: string) =>
    [...tela().querySelectorAll("button")].find((b) => b.textContent?.includes(texto));

  it("enquanto a foto chega, o estado de carga fala", () => {
    render({ photo: null, photoState: { kind: "loading" } });
    expect(tela().textContent).toContain(messages.loading);
  });

  it("foto que saiu do ar avisa quem abriu", () => {
    render({ photo: null, photoState: { kind: "error" } });
    expect(tela().textContent).toContain(messages.missingPhoto);
  });

  it("abre com a autoria, a legenda e as contribuições contadas", () => {
    render();
    expect(tela().textContent).toContain("Maria");
    expect(tela().textContent).toContain("O mural de hoje");
    expect(tela().textContent).toContain(defaultMessages.colagemComments.title(1));
  });

  it("quem não é o autor não vê remoção; o autor vê", () => {
    render({ photo: foto({ isOwner: false }) });
    expect(tela().textContent).not.toContain(messages.removePhoto);
    render({ photo: foto({ isOwner: true }) });
    expect(tela().textContent).toContain(messages.removePhoto);
  });

  it("remover pede confirmação antes de sair", () => {
    const props = render({ photo: foto({ isOwner: true }) });
    act(() => porTexto(messages.removePhoto)?.click());
    expect(tela().textContent).toContain(messages.removeConfirmTitle);
    const confirmar = [...tela().querySelectorAll("button")]
      .reverse()
      .find((b) => b.textContent?.includes(messages.removePhoto));
    act(() => confirmar?.click());
    expect(props.onRemovePhoto).toHaveBeenCalled();
  });

  it("remoção recusada deixa o aviso na tela para tentar de novo", async () => {
    render({
      photo: foto({ isOwner: true }),
      onRemovePhoto: vi.fn().mockRejectedValue(new Error("não")),
    });
    act(() => porTexto(messages.removePhoto)?.click());
    const confirmar = [...tela().querySelectorAll("button")]
      .reverse()
      .find((b) => b.textContent?.includes(messages.removePhoto));
    await act(async () => {
      confirmar?.click();
    });
    expect(tela().textContent).toContain(messages.removeError);
  });

  it("a pílula de reação alterna pelo mesmo gesto do feed", () => {
    const props = render();
    const pilula = tela().querySelector<HTMLButtonElement>("button[aria-pressed]");
    act(() => pilula?.click());
    expect(props.onToggleReaction).toHaveBeenCalledWith("LIKE");
  });

  it("foto sensível nasce velada no detalhe também", () => {
    render({ photo: foto({ mediaSpoiler: true }) });
    expect(tela().textContent).toContain(defaultMessages.colagemGrid.revealPhoto);
  });
});
