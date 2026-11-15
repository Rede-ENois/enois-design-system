// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
    admin: true,
    loading: false,
    error: false,
    pending: false,
    actionError: false,
    onRetry: vi.fn(),
    onVote: vi.fn(),
    onAdminAction: vi.fn(async () => true),
  };
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

function render(overrides: Partial<ReportsSectionProps> = {}) {
  props = { ...props, ...overrides };
  act(() => root.render(<ReportsSection {...props} />));
}

function button(label: string, scope: ParentNode = document.body) {
  const element = [...scope.querySelectorAll("button")].find((item) => item.textContent === label);
  if (!(element instanceof HTMLButtonElement)) throw new Error(`Botão não encontrado: ${label}`);
  return element;
}

function click(element: HTMLElement) {
  act(() => {
    element.focus();
    element.click();
  });
}

function dialog() {
  const element = document.querySelector('[role="dialog"]');
  if (!(element instanceof HTMLElement)) throw new Error("Confirmação não encontrada");
  return element;
}

function select(label: string, value: string) {
  const fieldLabel = [...host.querySelectorAll("label")].find((item) => item.textContent === label);
  const element = document.getElementById(fieldLabel?.htmlFor ?? "");
  if (!(element instanceof HTMLSelectElement)) throw new Error(`Filtro não encontrado: ${label}`);
  act(() => {
    element.value = value;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

async function settle() {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

describe("ReportsSection", () => {
  it("mantém o voto coletivo e oculta ações e revisão administrativas de moderadores", () => {
    render({ admin: false });
    expect(host.textContent).toContain("Decisão coletiva");
    expect(host.textContent).toContain("Quórum necessário: 3");
    expect(host.textContent).not.toContain("Punir agora");
    expect(host.textContent).not.toContain("Ação administrativa direta");
    expect(host.querySelector("a")).toBeNull();
    click(button("Votar para punir", host));
    expect(props.onVote).toHaveBeenCalledWith("denuncia-ficticia-1", "PUNISH");
    click(button("Votar para descartar", host));
    expect(props.onVote).toHaveBeenCalledWith("denuncia-ficticia-1", "DISMISS");
  });

  it("oculta punição de alvos não elegíveis e de empresas mesmo com flag incorreta", () => {
    render({
      reports: [
        { ...reportsStoryData[1], canPenalize: true },
        ...["JOB", "GAME", "MESSAGE", "USER"].map((targetType) => ({
          ...reportsStoryData[0],
          reportId: targetType,
          targetType,
          canPenalize: false,
          author: null,
        })),
      ],
    });
    expect(host.textContent).not.toContain("Punir agora");
    expect(host.textContent).toContain("Remover empresa");
  });

  it("combina motivo e alvo, conta o recorte e permite limpar um vazio filtrado", () => {
    render();
    select("Motivo da denúncia", "SPAM");
    select("Tipo de alvo", "POST");
    expect(host.textContent).toContain("1 de 3 denúncia(s)");
    expect(host.textContent).toContain("Denúncia denuncia-ficticia-1");
    expect(host.textContent).not.toContain("Denúncia denuncia-ficticia-3");
    select("Tipo de alvo", "COMPANY");
    expect(host.textContent).toContain("Nenhuma denúncia neste recorte.");
    expect(host.textContent).toContain("0 de 3 denúncia(s)");
    click(button("Limpar filtros e busca", host));
    expect(host.textContent).toContain("3 de 3 denúncia(s)");
  });

  it("busca conteúdo sem diferenciar maiúsculas e mantém o recorte", () => {
    render();
    const input = host.querySelector("input");
    if (!input) throw new Error("Busca não encontrada");
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(
        input,
        "SINTÉTICO",
      );
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(host.textContent).toContain("2 de 3 denúncia(s)");
    expect(host.textContent).not.toContain("Denúncia denuncia-ficticia-2");
  });

  it("não transforma carregamento ou erro em fila vazia e permite retry", () => {
    render({ reports: [], loading: true });
    expect(host.querySelector('[role="status"]')?.getAttribute("aria-label")).toBe(
      "Carregando denúncias",
    );
    expect(host.textContent).not.toContain("Nenhuma denúncia aguardando");
    render({ loading: false, error: true });
    expect(host.querySelector('[role="alert"]')?.textContent).toContain(
      "Não foi possível carregar",
    );
    expect(host.textContent).not.toContain("Nenhuma denúncia aguardando");
    click(button("Tentar novamente", host));
    expect(props.onRetry).toHaveBeenCalledOnce();
    render({ error: false });
    expect(host.textContent).toContain("Nenhuma denúncia aguardando análise.");
  });

  it("respeita o href recebido em AppLink", () => {
    render();
    expect(host.querySelector("a")?.getAttribute("href")).toBe("#revisao-ficticia-1");
  });

  it.each([
    ["Punir agora", "penalize", "denuncia-ficticia-1"],
    ["Enviar advertência", "warn", "denuncia-ficticia-1"],
    ["Remover publicação", "remove", "denuncia-ficticia-1"],
    ["Remover empresa", "remove-company", "denuncia-ficticia-2"],
  ])("exige confirmação para %s e cancelar não muta", async (label, action, reportId) => {
    render();
    click(button(label, host));
    expect(dialog().textContent).toContain(reportId);
    expect(props.onAdminAction).not.toHaveBeenCalled();
    click(button("Cancelar", dialog()));
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(props.onAdminAction).not.toHaveBeenCalled();
    click(button(label, host));
    await act(async () => button(label, dialog()).click());
    expect(props.onAdminAction).toHaveBeenCalledExactlyOnceWith(reportId, action);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it.each(["Cancelar", "Fechar", "Escape"])(
    "devolve foco à origem ao fechar por %s sem executar ação",
    async (close) => {
      render();
      const trigger = button("Punir agora", host);
      click(trigger);
      if (close === "Escape") {
        act(() =>
          dialog().dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })),
        );
      } else click(button(close, dialog()));
      await settle();
      expect(document.querySelector('[role="dialog"]')).toBeNull();
      expect(document.activeElement).toBe(trigger);
      expect(props.onAdminAction).not.toHaveBeenCalled();
      expect(props.onVote).not.toHaveBeenCalled();
    },
  );

  it("não restaura foco em origem desabilitada ao cancelar", async () => {
    render();
    click(button("Punir agora", host));
    click(button("Cancelar", dialog()));
    render({ pending: true });
    await settle();
    expect(document.activeElement).toBe(host.querySelector("h2"));
    expect(props.onAdminAction).not.toHaveBeenCalled();
  });

  it("usa título estável ao cancelar com origem removida", async () => {
    render();
    click(button("Punir agora", host));
    render({ reports: [] });
    click(button("Cancelar", dialog()));
    await settle();
    expect(document.activeElement).toBe(host.querySelector("h2"));
    expect(props.onAdminAction).not.toHaveBeenCalled();
  });

  it("não rouba foco movido durante o fechamento da confirmação", async () => {
    render();
    click(button("Punir agora", host));
    click(button("Cancelar", dialog()));
    const search = host.querySelector("input");
    search?.focus();
    await settle();
    expect(document.activeElement).toBe(search);
    expect(props.onAdminAction).not.toHaveBeenCalled();
  });

  it.each(["callback", "refetch"])(
    "recupera foco quando o voto remove o cartão no %s sem operação extra",
    async (timing) => {
      const onVote = vi.fn(() => {
        if (timing === "callback") render({ reports: reportsStoryData.slice(1) });
      });
      render({ onVote });
      click(button("Votar para punir", host));
      if (timing === "refetch") {
        await settle();
        render({ reports: reportsStoryData.slice(1) });
      }
      await settle();
      expect(document.activeElement).toBe(host.querySelector("h2"));
      expect(onVote).toHaveBeenCalledExactlyOnceWith("denuncia-ficticia-1", "PUNISH");
      expect(props.onAdminAction).not.toHaveBeenCalled();
      expect(props.onRetry).not.toHaveBeenCalled();
    },
  );

  it("preserva foco movido antes do refetch após votar", async () => {
    render();
    click(button("Votar para descartar", host));
    const search = host.querySelector("input");
    search?.focus();
    render({ reports: reportsStoryData.slice(1) });
    await settle();
    expect(document.activeElement).toBe(search);
    expect(props.onVote).toHaveBeenCalledExactlyOnceWith("denuncia-ficticia-1", "DISMISS");
    expect(props.onAdminAction).not.toHaveBeenCalled();
  });

  it("explica restrição e remoção condicional do feed sem prometer banimento ou prazo", () => {
    render();
    click(button("Punir agora", host));
    expect(dialog().textContent).toContain("Responsável: Perfil de demonstração");
    expect(dialog().textContent).toContain("será restringida");
    expect(dialog().textContent).toContain("publicação ou comentário do feed");
    expect(dialog().textContent).not.toMatch(/banimento|permanente|dias|horas/i);
  });

  it("pending bloqueia votos e ações de todos os cartões", () => {
    render({ pending: true });
    for (const element of host.querySelectorAll("button")) {
      expect(element.disabled).toBe(true);
      click(element);
    }
    expect(props.onVote).not.toHaveBeenCalled();
    expect(props.onAdminAction).not.toHaveBeenCalled();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it("mantém confirmação e contexto com erro de ação dentro do diálogo", async () => {
    render({ onAdminAction: vi.fn(async () => false) });
    click(button("Punir agora", host));
    await act(async () => button("Punir agora", dialog()).click());
    expect(dialog().querySelector('[role="alert"]')?.textContent).toContain(
      "O contexto foi mantido",
    );
    expect(dialog().textContent).toContain("denuncia-ficticia-1");
    render({ actionError: true });
    expect(dialog().querySelector('[role="alert"]')).not.toBeNull();
    render({ onAdminAction: vi.fn(async () => true), actionError: false });
    await act(async () => button("Punir agora", dialog()).click());
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it("trata rejeição de Promise sem perder a confirmação", async () => {
    render({
      onAdminAction: vi.fn(async () => {
        throw new Error("Falha sintética");
      }),
    });
    click(button("Punir agora", host));
    await act(async () => button("Punir agora", dialog()).click());
    expect(dialog().querySelector('[role="alert"]')).not.toBeNull();
  });

  it("bloqueia duplo envio e votos enquanto a Promise está pendente", async () => {
    let complete = (_ok: boolean) => {};
    const promise = new Promise<boolean>((resolve) => {
      complete = resolve;
    });
    render({ onAdminAction: vi.fn(() => promise) });
    click(button("Punir agora", host));
    const confirmButton = button("Punir agora", dialog());
    act(() => {
      confirmButton.click();
      confirmButton.click();
    });
    expect(props.onAdminAction).toHaveBeenCalledOnce();
    expect(confirmButton.disabled).toBe(true);
    expect(button("Votar para punir", host).disabled).toBe(true);
    click(button("Cancelar", dialog()));
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
    await act(async () => complete(true));
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it("restaura foco no título estável quando o cartão desaparece após sucesso", async () => {
    render();
    click(button("Punir agora", host));
    await act(async () => button("Punir agora", dialog()).click());
    await settle();
    render({ reports: reportsStoryData.slice(1) });
    await settle();
    expect(document.activeElement).toBe(host.querySelector("h2"));
  });

  it("não rouba foco que o usuário moveu antes da atualização da fila", async () => {
    render();
    click(button("Punir agora", host));
    await act(async () => button("Punir agora", dialog()).click());
    await settle();
    const search = host.querySelector("input");
    search?.focus();
    render({ reports: reportsStoryData.slice(1) });
    await settle();
    expect(document.activeElement).toBe(search);
  });

  it("bloqueia confirmação se o administrador perder permissão", () => {
    render();
    click(button("Punir agora", host));
    render({ admin: false });
    expect(button("Punir agora", dialog()).disabled).toBe(true);
    click(button("Punir agora", dialog()));
    expect(props.onAdminAction).not.toHaveBeenCalled();
  });
  it("impede confirmar punição quando a elegibilidade muda durante a revisão", () => {
    render();
    click(button("Punir agora", host));
    render({ reports: reportsStoryData.map((report) => ({ ...report, canPenalize: false })) });
    expect(button("Punir agora", dialog()).disabled).toBe(true);
    click(button("Punir agora", dialog()));
    expect(props.onAdminAction).not.toHaveBeenCalled();
  });
});
