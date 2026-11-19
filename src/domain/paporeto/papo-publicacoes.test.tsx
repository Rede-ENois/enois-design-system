// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { PapoPublicacaoView } from "../../types/domain/paporeto/papo-publicacao-view.js";
import type { PapoPublicacoesProps } from "../../types/domain/paporeto/papo-publicacoes-props.js";

import { PapoPublicacoesRelacionadas } from "./papo-publicacoes.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.papoPublicacoes;

const publicacao = (overrides: Partial<PapoPublicacaoView> = {}): PapoPublicacaoView => ({
  id: "post_1",
  fonte: "POST",
  texto: "bora de meetup de rust na sexta?",
  autor: "Ana Lima",
  handle: "ana.lima",
  quando: "há 2 horas",
  href: "/post/post_1",
  ...overrides,
});

describe("PapoPublicacoesRelacionadas", () => {
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

  const render = (overrides: Partial<PapoPublicacoesProps> = {}) => {
    const props: PapoPublicacoesProps = {
      subject: "meetup de rust",
      publicacoes: [publicacao()],
      estado: "ready",
      onRetry: vi.fn(),
      ...overrides,
    };
    act(() => root.render(<PapoPublicacoesRelacionadas {...props} />));
    return props;
  };

  it("mostra fonte, autoria, quando e o texto publico", () => {
    render();

    const texto = host.textContent ?? "";
    expect(texto).toContain(messages.titulo);
    expect(texto).toContain(messages.fontePost);
    expect(texto).toContain("Ana Lima");
    expect(texto).toContain("@ana.lima");
    expect(texto).toContain("há 2 horas");
    expect(texto).toContain("bora de meetup de rust na sexta?");
    expect(texto).toContain(messages.contagem(1));
  });

  it("fonte anonima nao inventa autor nem handle", () => {
    render({
      publicacoes: [
        publicacao({ fonte: "DESABAFO", autor: null, handle: null, href: "/desabafos" }),
      ],
    });

    const texto = host.textContent ?? "";
    expect(texto).toContain(messages.fonteDesabafo);
    expect(texto).toContain(messages.semAutor);
    expect(texto).not.toContain("@");
  });

  it("sem publicacoes, diz o vazio e nao desenha lista", () => {
    render({ publicacoes: [] });

    expect(host.textContent ?? "").toContain(messages.vazio);
    expect(host.querySelectorAll("li")).toHaveLength(0);
  });

  it("carregando nao mostra lista nem vazio", () => {
    render({ publicacoes: null, estado: "loading" });

    const texto = host.textContent ?? "";
    expect(texto).toContain(messages.carregando);
    expect(texto).not.toContain(messages.vazio);
    expect(host.querySelectorAll("li")).toHaveLength(0);
  });

  it("erro mostra o aviso e o retry dispara o callback", () => {
    const props = render({ publicacoes: null, estado: "error" });

    expect(host.textContent ?? "").toContain(messages.erro);

    const retry = [...host.querySelectorAll("button")].find((b) =>
      b.textContent?.includes(messages.retry),
    );
    act(() => retry?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(props.onRetry).toHaveBeenCalledTimes(1);
  });

  it("endereco que nao e link seguro nao vira ancora", () => {
    render({ publicacoes: [publicacao({ href: "javascript:alert(1)" })] });

    expect(host.querySelector("a")).toBeNull();
  });
});
