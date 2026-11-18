// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { ConfessionarioComposerProps } from "../../types/domain/confessionario/confessionario-composer-props.js";

import { ConfessionarioComposer } from "./confessionario-composer.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.confessionarioComposer;

describe("ConfessionarioComposer", () => {
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

  const render = (overrides: Partial<ConfessionarioComposerProps> = {}) => {
    const props: ConfessionarioComposerProps = {
      onPublish: vi.fn().mockResolvedValue(undefined),
      ...overrides,
    };
    act(() => root.render(<ConfessionarioComposer {...props} />));
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

  it("sem texto, contar fica desligado com o convite para escrever", () => {
    render();
    expect(botao()?.disabled).toBe(true);
    expect(botao()?.title).toBe(messages.needText);
  });

  it("só espaços em branco não contam como história", () => {
    render();
    digitar("   ");
    expect(botao()?.disabled).toBe(true);
  });

  it("publica o texto aparado e limpa o campo quando resolve", async () => {
    const props = render();
    digitar("  nunca contei isso: ...  ");
    expect(botao()?.disabled).toBe(false);
    await act(async () => {
      botao()?.click();
    });
    expect(props.onPublish).toHaveBeenCalledWith({ content: "nunca contei isso: ..." });
    expect(campo()?.value).toBe("");
  });

  it("a recusa não apaga o que a pessoa escreveu", async () => {
    const props = render({ onPublish: vi.fn().mockRejectedValue(new Error("400")) });
    digitar("ainda me dá vergonha contar");
    await act(async () => {
      botao()?.click();
    });
    expect(props.onPublish).toHaveBeenCalledTimes(1);
    expect(campo()?.value).toBe("ainda me dá vergonha contar");
  });

  it("o campo tem o teto do backend (5000)", () => {
    render();
    expect(campo()?.maxLength).toBe(5000);
  });

  it("lembra que ninguém fica sabendo quem contou e que o texto fica fora do feed principal", () => {
    render();
    expect(host.textContent).toContain("Ninguém fica sabendo");
    expect(host.textContent).toContain("fora do feed principal");
  });
});
