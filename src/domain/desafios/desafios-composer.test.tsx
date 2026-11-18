// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { DesafiosComposerProps } from "../../types/domain/desafios/desafios-composer-props.js";

import { DesafiosComposer } from "./desafios-composer.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.desafiosComposer;

describe("DesafiosComposer", () => {
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

  const render = (onPublish = vi.fn().mockResolvedValue(undefined)) => {
    const props: DesafiosComposerProps = { onPublish };
    act(() => root.render(<DesafiosComposer {...props} />));
    return onPublish;
  };

  const campoPorRotulo = (rotulo: string) =>
    host.querySelector(`[aria-label="${rotulo}"]`) as HTMLInputElement | HTMLTextAreaElement;
  const botaoConvocar = () =>
    Array.from(host.querySelectorAll("button")).find((button) =>
      button.textContent?.includes(messages.publish),
    )!;

  it("não convoca sem título e sem descrição", async () => {
    const onPublish = render();
    const botao = botaoConvocar();

    expect(botao.disabled).toBe(true);

    const titulo = campoPorRotulo(messages.titleAria);
    act(() => titulo.dispatchEvent(new Event("input", { bubbles: true })));
    expect(botao.disabled).toBe(true);
    expect(onPublish).not.toHaveBeenCalled();
  });

  it("convoca com título, descrição e janela, e limpa os campos quando publica", async () => {
    const onPublish = vi.fn().mockResolvedValue(undefined);
    render(onPublish);

    const titulo = campoPorRotulo(messages.titleAria);
    const descricao = campoPorRotulo(messages.descriptionAria);
    const prazo = host.querySelector<HTMLInputElement>("#desafios-prazo")!;

    const setar = (campo: HTMLInputElement | HTMLTextAreaElement, valor: string) => {
      const setter = Object.getOwnPropertyDescriptor(
        campo instanceof HTMLTextAreaElement
          ? Object.getPrototypeOf(campo)
          : HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(campo, valor);
      campo.dispatchEvent(new Event("input", { bubbles: true }));
    };

    act(() => setar(titulo, "Um desafio de escrita"));
    act(() => setar(descricao, "Escreva um poema sobre o seu bairro."));
    act(() => setar(prazo, "2026-12-01T10:30"));

    const botao = botaoConvocar();
    expect(botao.disabled).toBe(false);

    await act(async () => botao.click());
    await act(async () => {});

    expect(onPublish).toHaveBeenCalledWith({
      title: "Um desafio de escrita",
      description: "Escreva um poema sobre o seu bairro.",
      endsAt: expect.any(String),
    });
    expect(titulo.value).toBe("");
    expect(descricao.value).toBe("");
    expect(prazo.value).toBe("");
  });

  it("sem prazo, convoca com endsAt ausente", async () => {
    const onPublish = vi.fn().mockResolvedValue(undefined);
    render(onPublish);

    const setar = (campo: HTMLInputElement | HTMLTextAreaElement, valor: string) => {
      const proto =
        campo instanceof HTMLTextAreaElement
          ? Object.getPrototypeOf(campo)
          : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(campo, valor);
      campo.dispatchEvent(new Event("input", { bubbles: true }));
    };

    act(() => setar(campoPorRotulo(messages.titleAria), "Sem prazo"));
    act(() => setar(campoPorRotulo(messages.descriptionAria), "Faz qualquer coisa bonita."));

    await act(async () => botaoConvocar().click());
    await act(async () => {});

    expect(onPublish).toHaveBeenCalledWith({
      title: "Sem prazo",
      description: "Faz qualquer coisa bonita.",
      endsAt: undefined,
    });
  });
});
