// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { SanctionData } from "../../types/domain/moderation/sanction-data.js";
import type { SanctionsViewProps } from "../../types/domain/moderation/sanctions-view-props.js";

import { SanctionsView } from "./sanctions-view.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let host: HTMLDivElement;
let root: Root;
const now = Date.parse("2026-11-14T12:00:00Z");
const sanction: SanctionData = {
  id: "sanction-demo",
  type: "SUSPENDED",
  status: "ACTIVE",
  reason: "Motivo de demonstração",
  createdAt: "2026-11-14T10:00:00Z",
  deadline: { kind: "APPEAL", at: "2026-11-14T14:30:00Z" },
  evidence: { kind: "TEXT", text: "Trecho seguro de demonstração" },
  canAppeal: true,
};
const props: SanctionsViewProps = {
  mode: "history",
  sanctions: [sanction],
  appeals: [],
  now,
  loading: false,
  error: false,
  refreshing: false,
  appealMessage: "",
  onAppealMessageChange: () => {},
  onAppeal: () => {},
  appealSubmitting: false,
  appealError: false,
  onRetry: () => {},
};
const render = (overrides: Partial<SanctionsViewProps> = {}) =>
  act(() => root.render(<SanctionsView {...props} {...overrides} />));
const text = () => host.textContent ?? "";
const button = (label: string) =>
  Array.from(host.querySelectorAll("button")).find((b) => b.textContent === label)!;
beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.restoreAllMocks();
});

describe("Transparência da penalidade", () => {
  it("distingue carregamento e erro de consulta, com nova tentativa", () => {
    render({ loading: true });
    expect(host.querySelector('[role="status"]')?.textContent).toContain("Carregando penalidades");
    expect(text()).not.toContain(sanction.reason);
    const onRetry = vi.fn();
    render({ error: true, onRetry });
    expect(host.querySelector('[role="alert"]')?.textContent).toContain(
      "Não foi possível carregar suas penalidades.",
    );
    expect(text()).not.toContain("Nenhuma penalidade");
    act(() => button("Tentar novamente").click());
    expect(onRetry).toHaveBeenCalledOnce();
  });
  it("diferencia prazo de recurso de liberação", () => {
    render({ mode: "suspended" });
    expect(host.querySelector("h1")?.textContent).toBe("Conta suspensa");
    expect(text()).toContain(sanction.reason);
    expect(text()).toContain(sanction.evidence.text);
    expect(text()).toContain("Prazo para recorrer");
    expect(text()).toContain("Restam 2h 30min para apresentar seu recurso.");
    expect(text()).toContain(
      "Esta suspensão pode resultar em banimento. O contador indica o prazo para recorrer, não a liberação automática da conta.",
    );
    expect(host.querySelector('time[datetime="2026-11-14T14:30:00Z"]')?.textContent).toMatch(
      /14\/11\/2026.*14:30.*UTC/,
    );
    expect(text()).not.toContain("Término da punição");
  });
  it("recalcula término por props sem timer nem transição automática ao zerar", () => {
    const interval = vi.spyOn(globalThis, "setInterval");
    const ending: SanctionData = {
      ...sanction,
      deadline: { kind: "END", at: "2026-11-14T14:30:00Z" },
    };
    render({ sanctions: [ending] });
    expect(text()).toContain("Término da punição");
    expect(text()).toContain("Faltam 2h 30min");
    expect(text()).toContain("Término previsto:");
    expect(text()).not.toContain("Esta suspensão pode resultar");
    render({ sanctions: [ending], now: Date.parse("2026-11-14T14:29:59Z") });
    expect(text()).toContain("Faltam 0h 1min");
    expect(interval).not.toHaveBeenCalled();
    render({ sanctions: [ending], now: Date.parse("2026-11-14T14:30:00Z"), refreshing: true });
    expect(text()).toContain("Prazo encerrado");
    expect(text()).toContain("Verificando situação no servidor");
    expect(text()).not.toMatch(/conta liberada|conta banida|-1min/i);
    expect(button("Verificando situação no servidor...").disabled).toBe(true);
  });
  it("representa ausência de prazo, dados inválidos e decisões permanentes", () => {
    for (const deadline of [
      { kind: "NONE" as const, at: null },
      { kind: "END" as const, at: null },
      { kind: "APPEAL" as const, at: "inválido" },
    ]) {
      render({ sanctions: [{ ...sanction, deadline }] });
      expect(text()).toContain(
        deadline.kind === "NONE" ? "Sem prazo definido" : "Prazo indisponível",
      );
      expect(text()).not.toContain("NaN");
    }
    for (const type of ["BAN", "PERMABAN"] as const) {
      render({ sanctions: [{ ...sanction, type, deadline: { kind: "NONE", at: null } }] });
      expect(text()).toContain("Banimento permanente");
      expect(text()).toContain("Sem prazo definido");
    }
    render({ now: NaN });
    expect(text()).toContain("Tempo restante indisponível");
    expect(text()).not.toContain("NaN");
  });
  it("explicita origem comportamental, ausência e descrição segura de mídia", () => {
    render({
      sanctions: [
        {
          ...sanction,
          reason: null,
          evidence: { kind: "BEHAVIOR", text: "Conduta repetida de demonstração" },
        },
      ],
    });
    expect(text()).toContain("Motivo indisponível");
    expect(text()).toContain("Punição por comportamento");
    expect(text()).toContain("não está necessariamente associada a uma única publicação");
    expect(text()).toContain("Conduta repetida de demonstração");
    render({ sanctions: [{ ...sanction, evidence: { kind: "UNAVAILABLE", text: "Não exibir" } }] });
    expect(text()).toContain("Evidência indisponível");
    expect(text()).not.toContain("Não exibir");
    render({
      sanctions: [
        { ...sanction, evidence: { kind: "MEDIA", text: "Descrição segura de demonstração" } },
      ],
    });
    expect(text()).toContain("Descrição segura da mídia");
    expect(text()).toContain("Descrição segura de demonstração");
  });
  it("renderiza conteúdo como texto limitado sem reproduzir mídia", () => {
    const unsafe = '<img src="https://example.invalid/demo" onerror="alert(1)">';
    render({
      sanctions: [
        {
          ...sanction,
          reason: unsafe,
          evidence: { kind: "TEXT", text: unsafe + "x".repeat(2000) },
        },
      ],
    });
    expect(text()).toContain(unsafe);
    expect(host.querySelector("img, video, audio, iframe, script")).toBeNull();
    expect(text()).not.toContain("x".repeat(601));
  });
  it("valida recurso pelo texto aparado e emite somente ações válidas", () => {
    const onAppeal = vi.fn();
    for (const appealMessage of ["", "   ", "123456789", "x".repeat(1001)]) {
      render({ appealMessage, onAppeal });
      expect(button("Recorrer").disabled).toBe(true);
      act(() =>
        host
          .querySelector("form")!
          .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
      );
    }
    expect(onAppeal).not.toHaveBeenCalled();
    for (const appealMessage of ["  1234567890  ", "x".repeat(1000)]) {
      render({ appealMessage, onAppeal });
      expect(button("Recorrer").disabled).toBe(false);
      act(() => button("Recorrer").click());
    }
    expect(onAppeal).toHaveBeenCalledTimes(2);
    const onAppealMessageChange = vi.fn();
    render({ onAppealMessageChange });
    const input = host.querySelector("textarea")!;
    expect(input.labels?.length).toBe(1);
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")!.set!.call(
        input,
        "Nova mensagem",
      );
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(onAppealMessageChange).toHaveBeenCalledWith("Nova mensagem");
  });
  it("bloqueia duplo envio antes da atualização de props e permite tentar após erro", () => {
    const onAppeal = vi.fn();
    render({ appealMessage: "Mensagem de recurso", onAppeal });
    act(() => {
      button("Recorrer").click();
      button("Recorrer").click();
    });
    expect(onAppeal).toHaveBeenCalledOnce();
    render({ appealMessage: "Mensagem de recurso", onAppeal, appealSubmitting: true });
    expect(button("Enviando recurso...").disabled).toBe(true);
    expect(host.querySelector("textarea")?.disabled).toBe(true);
    render({ appealMessage: "Mensagem de recurso", onAppeal, appealError: true });
    expect(host.querySelector('[role="alert"]')?.textContent).toContain(
      "Não foi possível enviar seu recurso.",
    );
    expect(host.querySelector("textarea")?.value).toBe("Mensagem de recurso");
    act(() => button("Recorrer").click());
    expect(onAppeal).toHaveBeenCalledTimes(2);
  });
  it("mostra o acompanhamento e bloqueia somente a pendência da mesma sanção", () => {
    const appeal = {
      id: "appeal-demo",
      sanctionId: sanction.id,
      message: "Mensagem de demonstração",
      createdAt: "2026-11-14T11:00:00Z",
      status: "PENDING" as const,
    };
    render({ appeals: [appeal], appealMessage: "Mensagem de recurso" });
    expect(text()).toContain("Recurso em análise");
    expect(text()).toContain(appeal.message);
    expect(host.querySelector("form")).toBeNull();
    for (const status of ["APPROVED", "DENIED"] as const) {
      render({ appeals: [{ ...appeal, status }] });
      expect(text()).toContain(status === "APPROVED" ? "Recurso aprovado" : "Recurso negado");
      expect(host.querySelector("form")).not.toBeNull();
    }
    render({ appeals: [{ ...appeal, sanctionId: "outra-sanção" }] });
    expect(host.querySelector("form")).not.toBeNull();
  });
  it("não inventa elegibilidade por prazo, tipo ou status", () => {
    render({ sanctions: [{ ...sanction, canAppeal: false }] });
    expect(host.querySelector("form")).toBeNull();
    render({
      sanctions: [
        {
          ...sanction,
          type: "BAN",
          status: "REMOVED",
          deadline: { kind: "APPEAL", at: "2026-11-14T11:00:00Z" },
        },
      ],
    });
    expect(host.querySelector("form")).not.toBeNull();
    expect(text()).toContain("Prazo encerrado");
  });
  it("vincula o formulário ao alvo controlado sem enviar contra outro registro", () => {
    const second = { ...sanction, id: "sanction-demo-2" };
    const onAppealSanctionChange = vi.fn();
    render({ sanctions: [sanction, second], appealSanctionId: second.id, onAppealSanctionChange });
    const cards = host.querySelectorAll("li[data-sanction-id]");
    expect(cards[0].querySelector("form")).toBeNull();
    expect(cards[1].querySelector("form")).not.toBeNull();
    const select = host.querySelector("select")!;
    act(() => {
      select.value = sanction.id;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(onAppealSanctionChange).toHaveBeenCalledWith(sanction.id);
    render({ appealSanctionId: "alvo-ausente" });
    expect(host.querySelector("form")).toBeNull();
  });
  it("mantém pendência ao vencer e aceita somente a atualização confirmada", () => {
    const pending = {
      id: "pending-demo",
      sanctionId: sanction.id,
      message: "Recurso fictício pendente",
      status: "PENDING" as const,
      createdAt: "2026-11-14T11:00:00Z",
    };
    const onRetry = vi.fn();
    render({ appeals: [pending], now: Date.parse("2026-11-14T15:00:00Z"), onRetry });
    expect(text()).toContain("Prazo encerrado");
    expect(text()).toContain("Recurso em análise");
    expect(host.querySelector("form")).toBeNull();
    act(() => button("Verificar situação no servidor").click());
    expect(onRetry).toHaveBeenCalledOnce();
    render({
      sanctions: [{ ...sanction, status: "REMOVED", canAppeal: false }],
      appeals: [{ ...pending, status: "APPROVED" }],
    });
    expect(text()).toContain("Removida");
    expect(text()).toContain("Recurso aprovado");
    expect(host.querySelector("form")).toBeNull();
  });
  it("não chama restrição ou banimento de suspensão no prazo de recurso", () => {
    for (const type of ["RESTRICTION", "BAN", "PERMABAN"] as const) {
      render({ sanctions: [{ ...sanction, type }] });
      expect(text()).toContain("Prazo para recorrer");
      expect(text()).toContain("Restam 2h 30min para apresentar seu recurso.");
      expect(text()).not.toContain("Esta suspensão pode resultar em banimento.");
    }
  });
  it("mostra horário exato em UTC para datas com offset e trata data inválida", () => {
    render({
      sanctions: [
        {
          ...sanction,
          createdAt: "inválida",
          deadline: { kind: "END", at: "2026-11-14T11:30:00-03:00" },
        },
      ],
    });
    expect(text()).toContain("Data indisponível");
    expect(text()).toContain("14/11/2026, 14:30:00 UTC");
    expect(text()).toContain("Faltam 2h 30min");
    render({ sanctions: [{ ...sanction, evidence: { kind: "TEXT", text: "  " } }] });
    expect(text()).toContain("Evidência indisponível");
  });
  it("mostra remoção confirmada e links somente quando recebidos", () => {
    render({
      sanctions: [{ ...sanction, status: "REMOVED" }],
      backHref: "/voltar",
      loginHref: "/entrar",
    });
    expect(text()).toContain("Removida");
    expect(host.querySelector('a[href="/voltar"]')).not.toBeNull();
    expect(host.querySelector('a[href="/entrar"]')).not.toBeNull();
    render();
    expect(host.querySelector("a")).toBeNull();
  });
});
