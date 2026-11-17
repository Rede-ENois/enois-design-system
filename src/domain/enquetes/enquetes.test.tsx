// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { EnqueteCardProps } from "../../types/domain/enquetes/enquete-card-props.js";
import type { EnqueteComposerProps } from "../../types/domain/enquetes/enquete-composer-props.js";
import type { EnqueteView } from "../../types/domain/enquetes/enquete-view.js";

import { EnqueteCard } from "./enquete-card.js";
import { EnqueteComposer } from "./enquete-composer.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const card = defaultMessages.enqueteCard;

const enquete = (overrides: Partial<EnqueteView> = {}): EnqueteView => ({
  opcoes: ["Café", "Chá"],
  contagens: [0, 0],
  meusVotos: [],
  totalVotos: 0,
  multiplaEscolha: false,
  terminaEm: null,
  ...overrides,
});

describe("EnqueteCard", () => {
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

  const render = (props: Partial<EnqueteCardProps> & { enquete?: EnqueteView } = {}) => {
    const completos: EnqueteCardProps = {
      enquete: props.enquete ?? enquete(),
      pendente: props.pendente ?? false,
      onVotar: props.onVotar ?? vi.fn(),
      onVotarMultiplo: props.onVotarMultiplo ?? vi.fn(),
    };
    act(() => {
      root.render(<EnqueteCard {...completos} />);
    });
    return completos;
  };

  it("mostra as alternativas como botões antes do voto", () => {
    render();
    expect(host.querySelectorAll("button").length).toBe(2);
    expect(host.textContent).toContain("Café");
    expect(host.textContent).toContain("Nenhum voto ainda");
  });

  it("escolha única: o clique na alternativa dispara onVotar", () => {
    const onVotar = vi.fn();
    render({ onVotar });
    act(() => {
      (host.querySelectorAll("button")[1] as HTMLButtonElement).click();
    });
    expect(onVotar).toHaveBeenCalledWith(1);
  });

  it("resultado: contagem, escolha marcada e o gesto de trocar o voto", () => {
    render({ enquete: enquete({ contagens: [1, 0], meusVotos: [0], totalVotos: 1 }) });
    expect(host.textContent).toContain("1 voto");
    expect(host.textContent).toContain("100%");
    const trocar = [...host.querySelectorAll("button")].find(
      (botao) => botao.textContent === card.trocarVoto,
    );
    act(() => {
      (trocar as HTMLButtonElement).click();
    });
    // Voltou para as alternativas.
    expect(host.querySelectorAll("button").length).toBeGreaterThan(1);
    expect(host.textContent).toContain(card.manterVoto);
  });

  it("múltipla escolha: marca alternativas e confirma com a lista", () => {
    const onVotarMultiplo = vi.fn();
    render({
      enquete: enquete({ opcoes: ["A", "B", "C"], multiplaEscolha: true }),
      onVotarMultiplo,
    });
    const botoes = [...host.querySelectorAll("button")];
    act(() => {
      (botoes[0] as HTMLButtonElement).click();
      (botoes[2] as HTMLButtonElement).click();
    });
    expect(host.textContent).toContain(card.confirmarVoto);
    const confirmar = [...host.querySelectorAll("button")].find(
      (botao) => botao.textContent === card.confirmarVoto,
    );
    act(() => {
      (confirmar as HTMLButtonElement).click();
    });
    expect(onVotarMultiplo).toHaveBeenCalledWith([0, 2]);
  });

  it("prazo passado: resultado congelado, sem botões e com a data", () => {
    render({
      enquete: enquete({
        contagens: [2, 1],
        totalVotos: 3,
        terminaEm: new Date(Date.now() - 60_000).toISOString(),
      }),
    });
    expect(host.querySelectorAll("button").length).toBe(0);
    expect(host.textContent).toContain("3 votos");
    expect(host.textContent).toContain("Encerrada em");
  });

  it("prazo futuro aparece no rodapé", () => {
    render({
      enquete: enquete({ terminaEm: new Date(Date.now() + 3_600_000).toISOString() }),
    });
    expect(host.textContent).toContain("Termina em");
  });

  it("pendente: alternativas desabilitadas e rótulo de registrando", () => {
    render({ pendente: true });
    for (const botao of host.querySelectorAll("button")) {
      expect((botao as HTMLButtonElement).disabled).toBe(true);
    }
  });

  it("pendente na múltipla: confirmar mostra registrando", () => {
    render({ enquete: enquete({ opcoes: ["A", "B"], multiplaEscolha: true }), pendente: true });
    expect(host.textContent).toContain(card.votando);
  });
});

describe("EnqueteComposer", () => {
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

  const montar = (props: Partial<EnqueteComposerProps> = {}) => {
    const completos: EnqueteComposerProps = {
      opcoes: props.opcoes ?? ["A", "B"],
      onOpcoesChange: props.onOpcoesChange ?? vi.fn(),
      multiplaEscolha: props.multiplaEscolha,
      onMultiplaEscolhaChange: props.onMultiplaEscolhaChange,
      terminaEm: props.terminaEm,
      onTerminaEmChange: props.onTerminaEmChange,
    };
    act(() => {
      root.render(<EnqueteComposer {...completos} />);
    });
    return completos;
  };

  const digitar = (campo: HTMLInputElement, valor: string) => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    act(() => {
      setter?.call(campo, valor);
      campo.dispatchEvent(new Event("input", { bubbles: true }));
    });
  };

  it("adiciona e remove alternativas", () => {
    const onOpcoesChange = vi.fn();
    montar({ opcoes: ["A", "B", "C"], onOpcoesChange });
    act(() => {
      [...host.querySelectorAll("button")]
        .find((botao) => botao.getAttribute("aria-label") === "Remover alternativa")
        ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    // O primeiro botão de remover é o da primeira alternativa ("A").
    expect(onOpcoesChange).toHaveBeenCalledWith(["B", "C"]);
  });

  it("múltipla escolha só aparece quando o controle é ligado", () => {
    montar();
    expect(host.querySelector('input[type="checkbox"]')).toBeNull();

    const onMultiplaEscolhaChange = vi.fn();
    montar({ onMultiplaEscolhaChange });
    const caixa = host.querySelector('input[type="checkbox"]') as HTMLInputElement;
    act(() => {
      caixa.click();
    });
    expect(onMultiplaEscolhaChange).toHaveBeenCalledWith(true);
  });

  it("prazo: data escolhida sai em ISO UTC", () => {
    const onTerminaEmChange = vi.fn();
    montar({ onTerminaEmChange });
    const campo = host.querySelector("#enquete-prazo") as HTMLInputElement;
    digitar(campo, "2026-12-01T10:30");
    const iso = onTerminaEmChange.mock.calls[0][0] as string;
    expect(iso.endsWith("Z")).toBe(true);
  });

  it("prazo: limpar o campo volta a sem prazo", () => {
    const onTerminaEmChange = vi.fn();
    montar({ terminaEm: "2026-12-01T13:30:00.000Z", onTerminaEmChange });
    const campo = host.querySelector("#enquete-prazo") as HTMLInputElement;
    digitar(campo, "");
    expect(onTerminaEmChange).toHaveBeenCalledWith(undefined);
  });
});
