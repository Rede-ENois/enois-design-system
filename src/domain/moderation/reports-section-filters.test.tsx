// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EnoisProvider } from "../../messages/enois-provider.js";
import type { ReportsSectionProps } from "../../types/domain/moderation/reports-section-props.js";
import { ReportsSection } from "../index.js";

import { reportsStoryData } from "./reports.fixture.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;
let props: ReportsSectionProps;

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  props = {
    reports: reportsStoryData,
    admin: false,
    loading: false,
    error: false,
    pending: false,
    onRetry: vi.fn(),
    onVote: vi.fn(),
  };
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

function render(overrides: Partial<ReportsSectionProps> = {}) {
  props = { ...props, ...overrides };
  act(() =>
    root.render(
      <EnoisProvider>
        <ReportsSection {...props} />
      </EnoisProvider>,
    ),
  );
}

function filtro(label: string) {
  const fieldLabel = [...host.querySelectorAll("label")].find((item) => item.textContent === label);
  const element = document.getElementById(fieldLabel?.htmlFor ?? "");
  if (!(element instanceof HTMLSelectElement)) throw new Error(`Filtro não encontrado: ${label}`);
  return element;
}

function select(label: string, value: string) {
  const element = filtro(label);
  act(() => {
    element.value = value;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

function search(value: string) {
  const input = host.querySelector("input");
  if (!(input instanceof HTMLInputElement)) throw new Error("Busca não encontrada");
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

function button(label: string) {
  const element = [...host.querySelectorAll("button")].find((item) => item.textContent === label);
  if (!(element instanceof HTMLButtonElement)) throw new Error(`Botão não encontrado: ${label}`);
  return element;
}

function options(label: string) {
  return [...filtro(label).options].map((option) => option.value);
}

describe("ReportsSection — busca e filtros", () => {
  it("combina motivo e alvo, conta o recorte e limpa o vazio filtrado", () => {
    render();
    select("Motivo da denúncia", "SPAM");
    select("Tipo de alvo", "POST");
    expect(host.textContent).toContain("1 de 3 denúncia(s)");
    expect(host.textContent).toContain("Denúncia denuncia-ficticia-1");
    expect(host.textContent).not.toContain("Denúncia denuncia-ficticia-3");
    select("Tipo de alvo", "COMPANY");
    expect(host.textContent).toContain("Nenhuma denúncia neste recorte.");
    expect(host.textContent).toContain("0 de 3 denúncia(s)");
    const clear = [...host.querySelectorAll("button")].find(
      (item) => item.textContent === "Limpar filtros e busca",
    );
    if (!clear) throw new Error("Limpar filtros não encontrado no vazio filtrado");
    act(() => clear.click());
    expect(host.textContent).toContain("3 de 3 denúncia(s)");
    expect(filtro("Motivo da denúncia").value).toBe("");
    expect(host.textContent).toContain("Denúncia denuncia-ficticia-3");
  });

  it("só mostra o atalho de limpar quando existe algum filtro ativo", () => {
    render();
    expect(host.textContent).not.toContain("Limpar filtros e busca");
    select("Motivo da denúncia", "SPAM");
    expect(host.textContent).toContain("Limpar filtros e busca");
    act(() => button("Limpar filtros e busca").click());
    expect(host.textContent).not.toContain("Limpar filtros e busca");
    search("   ");
    expect(host.textContent).toContain("Limpar filtros e busca");
    expect(host.textContent).toContain("3 de 3 denúncia(s)");
    act(() => button("Limpar filtros e busca").click());
    expect(host.textContent).not.toContain("Limpar filtros e busca");
  });

  it.each([
    ["  sintético ", "2 de 3", "denuncia-ficticia-3"],
    ["PESSOA FICTÍCIA B", "1 de 3", "denuncia-ficticia-2"],
    ["promocional repetido", "1 de 3", "denuncia-ficticia-1"],
    ["denuncia-ficticia-2", "1 de 3", "denuncia-ficticia-2"],
    ["   ", "3 de 3", "denuncia-ficticia-1"],
  ])("busca por %j sem diferenciar caixa ou espaços nas pontas", (term, count, id) => {
    render();
    search(term);
    expect(host.textContent).toContain(`${count} denúncia(s)`);
    expect(host.textContent).toContain(`Denúncia ${id}`);
  });

  it("busca em todos os campos do cartão e não vaza a denúncia fora do recorte", () => {
    render();
    search("SINTÉTICO");
    expect(host.textContent).toContain("2 de 3 denúncia(s)");
    expect(host.textContent).not.toContain("Denúncia denuncia-ficticia-2");
    search("perfil de demonstração");
    expect(host.textContent).toContain("1 de 3 denúncia(s)");
    expect(host.textContent).toContain("Denúncia denuncia-ficticia-1");
    search("relato sintético");
    expect(host.textContent).toContain("1 de 3 denúncia(s)");
    expect(host.textContent).toContain("Denúncia denuncia-ficticia-3");
    search("ninguém escreveu isso");
    expect(host.textContent).toContain("0 de 3 denúncia(s)");
    expect(host.textContent).toContain("Nenhuma denúncia neste recorte.");
  });

  it("mantém a seleção fora do lote atual e não perde o outro filtro", () => {
    render();
    select("Motivo da denúncia", "SPAM");
    select("Tipo de alvo", "POST");
    render({ reports: [reportsStoryData[1]] });
    expect(filtro("Motivo da denúncia").value).toBe("SPAM");
    expect(filtro("Tipo de alvo").value).toBe("POST");
    expect(options("Motivo da denúncia")).toEqual(["", "SCAM", "SPAM"]);
    expect(options("Tipo de alvo")).toEqual(["", "COMPANY", "POST"]);
    expect(host.textContent).toContain("0 de 1 denúncia(s)");
    select("Tipo de alvo", "COMPANY");
    expect(host.textContent).toContain("0 de 1 denúncia(s)");
    expect(filtro("Motivo da denúncia").value).toBe("SPAM");
    expect(filtro("Tipo de alvo").value).toBe("COMPANY");
    select("Motivo da denúncia", "");
    expect(host.textContent).toContain("1 de 1 denúncia(s)");
    expect(filtro("Tipo de alvo").value).toBe("COMPANY");
  });

  it("recupera o conjunto completo de opções quando o filtro é limpo", () => {
    render();
    select("Motivo da denúncia", "SPAM");
    render({ reports: [reportsStoryData[1]] });
    expect(options("Motivo da denúncia")).toEqual(["", "SCAM", "SPAM"]);
    select("Motivo da denúncia", "");
    expect(options("Motivo da denúncia")).toEqual(["", "SCAM"]);
    expect(host.textContent).toContain("1 de 1 denúncia(s)");
  });

  it("lista cada opção do lote uma única vez e mostra o nome legível", () => {
    render();
    expect(options("Motivo da denúncia")).toEqual(["", "SPAM", "SCAM"]);
    expect(options("Tipo de alvo")).toEqual(["", "POST", "COMPANY", "COMMENT"]);
    expect([...filtro("Motivo da denúncia").options].map((option) => option.textContent)).toEqual([
      "Todos os motivos",
      "Spam",
      "Golpe",
    ]);
    expect([...filtro("Tipo de alvo").options].map((option) => option.textContent)).toEqual([
      "Todos os alvos",
      "Publicação",
      "Empresa",
      "Comentário",
    ]);
  });

  it("filtrar não consulta a API nem vota", () => {
    render();
    select("Motivo da denúncia", "SCAM");
    search("empresa");
    expect(props.onVote).not.toHaveBeenCalled();
    expect(props.onRetry).not.toHaveBeenCalled();
    expect(host.textContent).toContain("Denúncia denuncia-ficticia-2");
  });
});
