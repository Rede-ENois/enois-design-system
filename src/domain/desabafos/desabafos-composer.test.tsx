// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { DesabafosComposerProps } from "../../types/domain/desabafos/desabafos-composer-props.js";

import { DesabafosComposer } from "./desabafos-composer.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.desabafosComposer;

describe("DesabafosComposer", () => {
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

  const render = (overrides: Partial<DesabafosComposerProps> = {}) => {
    const props: DesabafosComposerProps = {
      onPublish: vi.fn().mockResolvedValue(undefined),
      ...overrides,
    };
    act(() => root.render(<DesabafosComposer {...props} />));
    return props;
  };

  const campo = () => host.querySelector<HTMLTextAreaElement>("textarea");
  const botao = () =>
    [...host.querySelectorAll("button")].find((b) => b.textContent?.includes(messages.publish));
  const digitar = (texto: string) => {
    const area = campo();
    if (!area) throw new Error("textarea não renderizado");
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    act(() => {
      setter?.call(area, texto);
      area.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };

  it("sem texto, publicar fica desligado com o aviso acolhedor", () => {
    render();
    expect(botao()?.disabled).toBe(true);
    expect(botao()?.title).toBe(messages.needText);
  });

  it("só espaços em branco não contam como desabafo", () => {
    render();
    digitar("   ");
    expect(botao()?.disabled).toBe(true);
  });

  it("publica o texto aparado e limpa o campo quando resolve", async () => {
    const props = render();
    digitar("  hoje foi difícil  ");
    expect(botao()?.disabled).toBe(false);
    await act(async () => {
      botao()?.click();
    });
    expect(props.onPublish).toHaveBeenCalledWith({ content: "hoje foi difícil" });
    expect(campo()?.value).toBe("");
  });

  it("a recusa não apaga o que a pessoa escreveu", async () => {
    const props = render({ onPublish: vi.fn().mockRejectedValue(new Error("400")) });
    digitar("ainda estou aqui");
    await act(async () => {
      botao()?.click();
    });
    expect(props.onPublish).toHaveBeenCalledTimes(1);
    expect(campo()?.value).toBe("ainda estou aqui");
  });

  it("lembra que o texto fica só nos Desabafos, fora do feed principal", () => {
    render();
    expect(host.textContent).toContain("fora do feed principal");
  });
});
