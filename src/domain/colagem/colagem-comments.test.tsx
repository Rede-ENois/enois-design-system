// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { ColagemCommentInput } from "../../types/domain/colagem/colagem-comment-input.js";
import type { ColagemCommentView } from "../../types/domain/colagem/colagem-comment-view.js";
import type { ColagemPhotoDetail } from "../../types/domain/colagem/colagem-photo-detail.js";

import { ColagemComments } from "./colagem-comments.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.colagemComments;

const foto: ColagemPhotoDetail = {
  id: "colagem_1",
  mediaUrl: "https://cdn.example.test/f1.jpg",
  description: "A foto",
  mediaSpoiler: false,
  authorName: "Maria",
  authorAvatar: null,
  authorAvatarFrame: null,
  authorStyle: null,
  reactions: 1,
  reactionSummary: {},
  myReaction: null,
  comments: 2,
  isOwner: false,
};

const comentario = (overrides: Partial<ColagemCommentView> = {}): ColagemCommentView => ({
  id: "c1",
  authorName: "João",
  authorAvatar: null,
  authorStyle: null,
  content: "Que foto boa!",
  mediaUrl: null,
  mediaSpoiler: false,
  isMine: false,
  ...overrides,
});

describe("ColagemComments", () => {
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
    overrides: {
      comments?: ColagemCommentView[];
      state?: { kind: "loading" } | { kind: "error" } | { kind: "ready" };
      onComment?: (input: ColagemCommentInput) => Promise<void>;
      onRemoveComment?: (commentId: string) => void;
    } = {},
  ) => {
    const props = {
      photo: foto,
      comments: overrides.comments ?? [
        comentario(),
        comentario({
          id: "c2",
          authorName: "Ana",
          content: null,
          mediaUrl: "https://cdn.example.test/f2.jpg",
        }),
      ],
      state: overrides.state ?? { kind: "ready" },
      attachment: null,
      onFiles: () => {},
      onRemoveAttachment: () => {},
      onComment: overrides.onComment ?? vi.fn().mockResolvedValue(undefined),
      onRemoveComment: overrides.onRemoveComment ?? vi.fn(),
    };
    act(() => root.render(<ColagemComments {...props} />));
    return props;
  };

  const area = () => host.querySelector<HTMLTextAreaElement>("textarea");
  const porTexto = (texto: string) =>
    [...host.querySelectorAll("button")].find((b) => b.textContent?.includes(texto));
  const digitar = (texto: string) => {
    const campo = area();
    if (!campo) throw new Error("textarea não renderizado");
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    act(() => {
      setter?.call(campo, texto);
      campo.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };

  it("conta as contribuições e desenha texto e nome", () => {
    render();
    expect(host.textContent).toContain(messages.title(2));
    expect(host.textContent).toContain("Que foto boa!");
    expect(host.textContent).toContain("João");
  });

  it("mural de comentário sensível nasce velado e revela no toque", () => {
    render({
      comments: [comentario({ mediaUrl: "https://cdn.example.test/s.jpg", mediaSpoiler: true })],
    });
    const imagem = host.querySelector("img");
    expect(imagem?.className).toContain("blur");
    act(() => imagem?.parentElement?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    const imagemDepois = host.querySelector("img");
    expect(imagemDepois?.className).not.toContain("blur");
  });

  it("só o próprio comentário tem o gesto de remover", () => {
    const remover = vi.fn();
    render({ comments: [comentario({ isMine: true })], onRemoveComment: remover });
    const apagar = [...host.querySelectorAll("button")].find(
      (b) => b.getAttribute("title") === messages.removeComment,
    );
    act(() => apagar?.click());
    expect(remover).toHaveBeenCalledWith("c1");
  });

  it("responder nomeia a pessoa e manda o pai junto", async () => {
    const onComment = vi.fn().mockResolvedValue(undefined);
    render({ onComment });
    act(() => porTexto(messages.reply)?.click());
    expect(host.textContent).toContain(messages.replyPlaceholder("João"));
    digitar(" Concordo");
    await act(async () => {
      porTexto(messages.send)?.click();
    });
    expect(onComment).toHaveBeenCalledWith({ parentCommentId: "c1", content: "Concordo" });
  });

  it("responder comentário fotográfico esconde o anexo de foto", () => {
    render({
      comments: [comentario({ mediaUrl: "https://cdn.example.test/f2.jpg", content: null })],
    });
    act(() => porTexto(messages.reply)?.click());
    expect(host.textContent).toContain(messages.photoBlockedOnReply);
  });

  it("enviar sem texto nem foto não chama nada", async () => {
    const onComment = vi.fn().mockResolvedValue(undefined);
    render({ onComment });
    await act(async () => {
      porTexto(messages.send)?.click();
    });
    expect(onComment).not.toHaveBeenCalled();
  });

  it("contribuição colada limpa o campo; recusada, fica", async () => {
    const onComment = vi
      .fn<() => Promise<void>>()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("recusado"));
    render({ onComment });
    digitar("primeira");
    await act(async () => {
      porTexto(messages.send)?.click();
    });
    expect(area()?.value).toBe("");
    digitar("segunda");
    await act(async () => {
      porTexto(messages.send)?.click();
    });
    expect(area()?.value).toBe("segunda");
  });

  it("o campo de contribuição tem o teto do backend (800)", () => {
    render();
    expect(area()?.maxLength).toBe(800);
  });

  it("sem contribuições, o vazio fala; carregando, idem", () => {
    render({ comments: [], state: { kind: "ready" } });
    expect(host.textContent).toContain(messages.empty);
    render({ comments: [], state: { kind: "loading" } });
    expect(host.textContent).toContain(messages.loading);
  });
});
