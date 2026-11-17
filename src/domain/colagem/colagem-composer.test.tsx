// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { ColagemComposerProps } from "../../types/domain/colagem/colagem-composer-props.js";

import { ColagemComposer } from "./colagem-composer.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.colagemComposer;

describe("ColagemComposer", () => {
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

  const render = (overrides: Partial<ColagemComposerProps> = {}) => {
    const props: ColagemComposerProps = {
      attachment: { preview: "blob:foto", status: "allowed", mediaId: "media_1" },
      onFiles: () => {},
      onRemoveAttachment: () => {},
      onPublish: vi.fn().mockResolvedValue(undefined),
      ...overrides,
    };
    act(() => root.render(<ColagemComposer {...props} />));
    return props;
  };

  const legenda = () => host.querySelector<HTMLTextAreaElement>("textarea");
  const botao = () =>
    [...host.querySelectorAll("button")].find((b) => b.textContent?.includes(messages.publish));
  const digitar = (texto: string) => {
    const campo = legenda();
    if (!campo) throw new Error("textarea não renderizado");
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    act(() => {
      setter?.call(campo, texto);
      campo.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };

  it("sem foto anexada, publicar fica desligado com o aviso", () => {
    render({ attachment: null });
    expect(botao()?.disabled).toBe(true);
    expect(botao()?.title).toBe(messages.needPhoto);
  });

  it("publica com a legenda e o véu marcado", () => {
    const props = render();
    digitar("O pôr do sol de hoje");
    const spoiler = host.querySelector<HTMLInputElement>('input[type="checkbox"]');
    act(() => spoiler?.click());
    expect(botao()?.disabled).toBe(false);
    act(() => botao()?.click());
    expect(props.onPublish).toHaveBeenCalledWith({
      description: "O pôr do sol de hoje",
      mediaSpoiler: true,
    });
  });

  it("publica sem legenda: a descrição não vai", () => {
    const props = render();
    act(() => botao()?.click());
    expect(props.onPublish).toHaveBeenCalledWith({ description: undefined, mediaSpoiler: false });
  });

  it("colou: o campo limpa para a próxima foto", async () => {
    render();
    digitar("primeira");
    await act(async () => {
      botao()?.click();
    });
    expect(legenda()?.value).toBe("");
    expect(host.querySelector<HTMLInputElement>('input[type="checkbox"]')?.checked).toBe(false);
  });

  it("deu errado: o rascunho fica de pé para corrigir", async () => {
    render({ onPublish: vi.fn().mockRejectedValue(new Error("recusada")) });
    digitar("ainda aqui");
    await act(async () => {
      botao()?.click();
    });
    expect(legenda()?.value).toBe("ainda aqui");
  });
});
