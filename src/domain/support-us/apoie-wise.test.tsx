// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ApoieWise } from "./apoie-wise.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("ApoieWise", () => {
  let root: Root;
  let host: HTMLDivElement;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
    act(() => root.render(<ApoieWise href="https://example.test/pay/fulano" />));
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    document.body.replaceChildren();
  });

  const link = () => host.querySelector<HTMLAnchorElement>("a");
  const campo = () => host.querySelector<HTMLInputElement>('input[type="number"]');
  /** As quatro pílulas de valor vêm antes do botão do link na árvore: índice 2 é o "US$ 25". */
  const pilula = (posicao: number) => host.querySelectorAll<HTMLButtonElement>("button")[posicao];

  it("liga a página de pagamento que o app passa, em aba nova", () => {
    expect(link()?.getAttribute("href")).toBe("https://example.test/pay/fulano");
    expect(link()?.getAttribute("target")).toBe("_blank");
    expect(link()?.getAttribute("rel")).toContain("noopener");
  });

  it("marca o valor sugerido escolhido e aceita um valor digitado", () => {
    act(() => pilula(2)!.click());
    expect(pilula(2)?.getAttribute("aria-pressed")).toBe("true");
    expect(pilula(2)?.textContent).toBe("US$ 25");

    const input = campo()!;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    act(() => {
      setter.call(input, "37");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(campo()?.value).toBe("37");
    expect(pilula(2)?.getAttribute("aria-pressed")).toBe("false");
  });
});
