// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { DoacaoPessoalCardProps } from "../../types/domain/doacoes/doacao-pessoal-card-props.js";

import { DoacaoPessoalCard } from "./doacao-pessoal-card.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.doacaoPessoal;

const codigo: NonNullable<DoacaoPessoalCardProps["codigo"]> = {
  id: "doacao-1",
  pixCopyAndPaste: "00020126BR.GOV.BCB.PIX",
  amountCents: 2000,
};

let host: HTMLDivElement;
let root: Root;

const render = (props: Partial<DoacaoPessoalCardProps> = {}) => {
  const handlers = {
    onValorChange: vi.fn(),
    onAbrir: vi.fn(),
    onComprovanteChange: vi.fn(),
    onConfirmar: vi.fn(),
    onCopiar: vi.fn(),
    onMudarValor: vi.fn(),
  };
  act(() =>
    root.render(
      <DoacaoPessoalCard
        apoiador={null}
        codigo={null}
        qrCodeDataUrl={null}
        valorCents={null}
        comprovante=""
        erro={null}
        erroConfirmar={null}
        abrindo={false}
        confirmando={false}
        confirmada={false}
        copiado={false}
        {...handlers}
        {...props}
      />,
    ),
  );
  return { host, handlers };
};

const NBSP = "\u00a0";

/** O Intl separa símbolo e valor com espaço não quebrável; a busca normaliza. */
const normalizar = (texto: string) => texto.replace(new RegExp(NBSP, "g"), " ");

const botao = (texto: string) => {
  const found = [...host.querySelectorAll("button")].find((el) =>
    normalizar(el.textContent ?? "").includes(texto),
  );
  if (!found) throw new Error(`botão "${texto}" não encontrado`);
  return found as HTMLButtonElement;
};

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("DoacaoPessoalCard", () => {
  it("escolhe o valor pelas pílulas e só abre o código com um valor definido", () => {
    const { handlers } = render();

    expect(botao(messages.gerarCodigo).disabled).toBe(true);

    act(() => botao("R$ 20,00").click());
    expect(handlers.onValorChange).toHaveBeenCalledWith(2000);
  });

  it("lê o valor digitado em centavos e ignora o que não é dígito", () => {
    const { handlers } = render();
    const campo = host.querySelector("input") as HTMLInputElement;

    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(campo, "R$ 1.5a0");
      campo.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(handlers.onValorChange).toHaveBeenLastCalledWith(150);
  });

  it("mostra o código copia e cola e o comprovante, e confirma só com comprovante", () => {
    const { handlers } = render({ codigo, valorCents: 2000 });

    expect(host.textContent).toContain(codigo.pixCopyAndPaste);
    expect(botao(messages.confirmar).disabled).toBe(true);

    act(() => botao(messages.copiar).click());
    expect(handlers.onCopiar).toHaveBeenCalledTimes(1);

    act(() => botao(messages.confirmar).click());
    expect(handlers.onConfirmar).not.toHaveBeenCalled();
  });

  it("confirmar com comprovante avisa a app e o erro dela aparece", () => {
    const { handlers } = render({
      codigo,
      valorCents: 2000,
      comprovante: "Pix enviado R$ 20,00",
    });

    act(() => botao(messages.confirmar).click());
    expect(handlers.onConfirmar).toHaveBeenCalledTimes(1);
  });

  it("erro de confirmação aparece com role de alerta", () => {
    render({ codigo, valorCents: 2000, comprovante: "x", erroConfirmar: "Linha inválida" });

    const alerta = host.querySelector('[role="alert"]');
    expect(alerta?.textContent).toBe("Linha inválida");
  });

  it("apoiador vê o selo e o texto de quem já apoiou; quem não é não vê", () => {
    render({ apoiador: true });
    expect(host.textContent).toContain(messages.seloAtivo);
    expect(host.textContent).toContain(messages.descricaoApoiador);

    act(() => {
      root.render(<div />);
    });
    render({ apoiador: false });
    expect(host.textContent).not.toContain(messages.seloAtivo);
    expect(host.textContent).toContain(messages.descricao);
  });

  it("não usa cor solta nem hexadecimal", () => {
    const html = host.outerHTML;
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });
});
