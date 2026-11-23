// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EnoisProvider } from "../../messages/enois-provider.js";
import type { ModerationReportData } from "../../types/domain/moderation/moderation-report-data.js";
import type { ReportCardProps } from "../../types/domain/moderation/report-card-props.js";
import { ReportCard } from "../index.js";

import { reportsStoryData } from "./reports.fixture.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;
let props: ReportCardProps;

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  props = {
    report: reportsStoryData[0],
    admin: true,
    pending: false,
    onVote: vi.fn(),
  };
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

function render(overrides: Partial<ReportCardProps> = {}) {
  props = { ...props, ...overrides };
  act(() =>
    root.render(
      <EnoisProvider>
        <ul>
          <ReportCard {...props} />
        </ul>
      </EnoisProvider>,
    ),
  );
}

function button(label: string) {
  const element = [...host.querySelectorAll("button")].find((item) => item.textContent === label);
  if (!(element instanceof HTMLButtonElement)) throw new Error(`Botão não encontrado: ${label}`);
  return element;
}

function click(element: HTMLElement) {
  act(() => element.click());
}

function report(overrides: Partial<ModerationReportData>) {
  return { ...reportsStoryData[0], ...overrides };
}

describe("ReportCard", () => {
  it("mostra referência, motivo, alvo, data, partes, conteúdo e relato", () => {
    render();
    expect(host.textContent).toContain("Denúncia denuncia-ficticia-1");
    expect(host.textContent).toContain("Spam");
    expect(host.textContent).toContain("Publicação");
    expect(host.textContent).toContain("14/11/2026, 09:30");
    expect(host.textContent).toContain("Pessoa fictícia A");
    expect(host.textContent).toContain("Perfil de demonstração");
    expect(host.textContent).toContain("Conteúdo sintético para revisão da equipe.");
    expect(host.textContent).toContain("Relato fictício: conteúdo promocional repetido.");
    expect(host.querySelector("li")).not.toBeNull();
  });

  it("explicita autor e conteúdo ausentes e renderiza o relato como texto", () => {
    render({
      report: report({
        author: null,
        content: null,
        description: "<script>alert('ficticio')</script>",
      }),
    });
    expect(host.textContent).toContain("Não identificado");
    expect(host.textContent).toContain("Conteúdo indisponível");
    expect(host.textContent).toContain("<script>alert('ficticio')</script>");
    expect(host.querySelector("script")).toBeNull();
  });

  it("omite o bloco de relato quando não há descrição", () => {
    render({ report: report({ description: null }) });
    expect(host.textContent).not.toContain("Relato da denúncia");
  });

  it("cai no identificador bruto quando o motivo ou o alvo não tem nome conhecido", () => {
    render({ report: report({ reason: "MOTIVO_NOVO", targetType: "ALVO_NOVO" }) });
    expect(host.textContent).toContain("MOTIVO_NOVO");
    expect(host.textContent).toContain("ALVO_NOVO");
  });

  it("expõe o conteúdo longo em região rolável focável", () => {
    const content = "Conteúdo longo ".repeat(200);
    render({ report: report({ content }) });
    const region = host.querySelector('[role="region"]');
    expect(region?.getAttribute("aria-label")).toBe("Conteúdo denunciado");
    expect(region?.getAttribute("tabindex")).toBe("0");
    expect(region?.className).toContain("overflow-y-auto");
    expect(region?.textContent).toBe(content);
  });

  it("mostra contagens, quórum e o voto da pessoa apenas quando existe", () => {
    render({ report: report({ myVote: "DISMISS" }) });
    expect(host.textContent).toContain("Votos para punir: 2");
    expect(host.textContent).toContain("Votos para descartar: 1");
    expect(host.textContent).toContain("Quórum necessário: 3");
    expect(host.textContent).toContain("Seu voto: descartar");
    expect(button("Votar para descartar").getAttribute("aria-pressed")).toBe("true");
    expect(button("Votar para punir").getAttribute("aria-pressed")).toBe("false");
    render({ report: report({ myVote: null }) });
    expect(host.textContent).not.toContain("Seu voto");
  });

  it("emite o voto com a referência do relato sem confirmar nada", () => {
    render();
    click(button("Votar para punir"));
    expect(props.onVote).toHaveBeenCalledExactlyOnceWith("denuncia-ficticia-1", "PUNISH");
    click(button("Votar para descartar"));
    expect(props.onVote).toHaveBeenLastCalledWith("denuncia-ficticia-1", "DISMISS");
    expect(props.onVote).toHaveBeenCalledTimes(2);
  });

  it("bloqueia os votos enquanto a fila está pendente", () => {
    render({ pending: true });
    expect(button("Votar para punir").disabled).toBe(true);
    expect(button("Votar para descartar").disabled).toBe(true);
    click(button("Votar para punir"));
    expect(props.onVote).not.toHaveBeenCalled();
  });

  it("usa somente o href recebido na revisão e o oculta sem visibilidade administrativa", () => {
    render();
    expect(host.querySelector("a")?.getAttribute("href")).toBe("#revisao-ficticia-1");
    render({ admin: false });
    expect(host.querySelector("a")).toBeNull();
    expect(host.textContent).toContain("Decisão coletiva");
  });

  it("não expõe ação administrativa direta", () => {
    render();
    expect(host.textContent).not.toContain("Ação administrativa imediata");
    expect(host.querySelectorAll("button")).toHaveLength(2);
  });

  describe("Punir agora", () => {
    function dialogButton(label: string) {
      const element = [...document.body.querySelectorAll("button")].find(
        (item) => item.textContent === label && item.closest("[role='dialog']"),
      );
      if (!(element instanceof HTMLButtonElement)) {
        throw new Error(`Botão do diálogo não encontrado: ${label}`);
      }
      return element;
    }

    function typeReason(value: string) {
      const input = document.body.querySelector<HTMLInputElement>("[role='dialog'] input");
      if (!input) throw new Error("Campo de motivo ausente");
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      act(() => {
        setter?.call(input, value);
        input.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }

    it("mostra a ação só para admin elegível e com callback", () => {
      render({ onPenalize: vi.fn() });
      expect(host.textContent).toContain("Ação administrativa imediata");
      render({ onPenalize: undefined });
      expect(host.textContent).not.toContain("Ação administrativa imediata");
      render({ admin: false, onPenalize: vi.fn() });
      expect(host.textContent).not.toContain("Ação administrativa imediata");
    });

    it("mantém empresa inelegível mesmo com a flag ligada", () => {
      render({
        report: report({ targetType: "COMPANY", canPenalize: true }),
        onPenalize: vi.fn(),
      });
      expect(host.textContent).not.toContain("Ação administrativa imediata");
    });

    it("não muta ao abrir e cancelar o diálogo", () => {
      const onPenalize = vi.fn().mockResolvedValue(true);
      render({ onPenalize });
      click(button("Punir agora"));
      expect(onPenalize).not.toHaveBeenCalled();
      click(dialogButton("Cancelar"));
      expect(onPenalize).not.toHaveBeenCalled();
    });

    it("não confirma com motivo curto demais", () => {
      const onPenalize = vi.fn().mockResolvedValue(true);
      render({ onPenalize });
      click(button("Punir agora"));
      typeReason("curto");
      expect(dialogButton("Punir agora").disabled).toBe(true);
      expect(onPenalize).not.toHaveBeenCalled();
    });

    it("confirma uma única vez com o motivo aparado", async () => {
      const onPenalize = vi.fn().mockResolvedValue(true);
      render({ onPenalize });
      click(button("Punir agora"));
      typeReason("   Motivo administrativo fictício válido   ");
      await act(async () => {
        dialogButton("Punir agora").click();
      });
      expect(onPenalize).toHaveBeenCalledExactlyOnceWith(
        "denuncia-ficticia-1",
        "Motivo administrativo fictício válido",
      );
      expect(onPenalize).toHaveBeenCalledTimes(1);
    });

    it("mantém o diálogo e informa a falha sem declarar sucesso", async () => {
      const onPenalize = vi.fn().mockResolvedValue(false);
      render({ onPenalize });
      click(button("Punir agora"));
      typeReason("Motivo administrativo fictício válido");
      await act(async () => {
        dialogButton("Punir agora").click();
      });
      expect(document.body.textContent).toContain("Não foi possível aplicar a punição");
    });

    it("bloqueia a abertura enquanto a fila está pendente", () => {
      render({ onPenalize: vi.fn(), pending: true });
      expect(button("Punir agora").disabled).toBe(true);
    });
  });
});
