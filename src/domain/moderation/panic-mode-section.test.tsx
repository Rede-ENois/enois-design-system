// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PanicModeSectionProps } from "../../types/domain/moderation/panic-mode-section-props.js";
import { PanicModeSection } from "../index.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;
let props: PanicModeSectionProps;

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  props = {
    active: false,
    envLocked: false,
    onActivate: vi.fn(),
    onDeactivate: vi.fn(),
  };
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

function render(overrides: Partial<PanicModeSectionProps> = {}) {
  props = { ...props, ...overrides };
  act(() => root.render(<PanicModeSection {...props} />));
}

function button(label: string, scope: ParentNode = document.body) {
  const element = [...scope.querySelectorAll("button")].find((item) => item.textContent === label);
  if (!(element instanceof HTMLButtonElement)) throw new Error(`Botão não encontrado: ${label}`);
  return element;
}

describe("PanicModeSection", () => {
  it("recolhe controles inativos em details rotulado pelo título com compact", () => {
    render({ compact: true });
    const details = host.querySelector("details");
    expect(details).not.toBeNull();
    expect(details?.open).toBe(false);
    expect(details?.querySelector("summary")?.textContent).toBe(
      host.querySelector("h2")?.textContent,
    );
    expect(details?.querySelector("summary")?.textContent).toBe("Modo pânico");
    expect(details?.contains(button("Ativar modo pânico", host))).toBe(true);
    expect(props.onActivate).not.toHaveBeenCalled();
    expect(props.onDeactivate).not.toHaveBeenCalled();
  });

  it.each([undefined, false])("preserva apresentação expandida com compact=%s", (compact) => {
    render({ compact });
    expect(host.querySelector("details")).toBeNull();
    expect(host.querySelector("h2")?.textContent).toBe("Modo pânico");
    expect(host.textContent).toContain("Bloqueia toda escrita");
    expect(button("Ativar modo pânico", host).disabled).toBe(false);
  });

  it.each([
    { active: true },
    { envLocked: true },
    { loading: true },
    { pending: true },
    { active: true, envLocked: true },
  ])("não recolhe estado importante com compact e %j", (state) => {
    render({ compact: true, ...state });
    expect(host.querySelector("details")).toBeNull();
    if (props.envLocked) expect(host.textContent).toContain("travado pela variável de ambiente");
    else if (props.active) expect(host.textContent).toContain("ATIVO: toda escrita");
    const toggle = button(props.active ? "Desativar modo pânico" : "Ativar modo pânico", host);
    expect(toggle.disabled).toBe(!!(props.loading || props.pending || props.envLocked));
    if (toggle.disabled) act(() => toggle.click());
    expect(props.onActivate).not.toHaveBeenCalled();
    expect(props.onDeactivate).not.toHaveBeenCalled();
  });

  it("abrir o resumo apenas revela controles e ativar continua exigindo confirmação", () => {
    render({ compact: true });
    const details = host.querySelector("details");
    const summary = details?.querySelector("summary");
    if (!summary) throw new Error("Resumo não encontrado");
    act(() => summary.click());
    expect(details?.open).toBe(true);
    expect(props.onActivate).not.toHaveBeenCalled();
    act(() => button("Ativar modo pânico", host).click());
    const confirmation = document.querySelector('[role="dialog"]');
    expect(confirmation?.textContent).toContain("Ativar o modo pânico?");
    expect(props.onActivate).not.toHaveBeenCalled();
    act(() => button("Ativar modo pânico", confirmation ?? document.body).click());
    expect(props.onActivate).toHaveBeenCalledOnce();
    expect(props.onDeactivate).not.toHaveBeenCalled();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it("cancelar ativação compacta não altera o modo", () => {
    render({ compact: true });
    act(() => host.querySelector("summary")?.click());
    act(() => button("Ativar modo pânico", host).click());
    act(() => button("Cancelar").click());
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(props.onActivate).not.toHaveBeenCalled();
    expect(host.querySelector("details")?.open).toBe(true);
  });

  it.each([false, true])(
    "mantém falha de consulta visível e bloqueia mudanças com active=%s",
    (active) => {
      const onRetry = vi.fn();
      render({ compact: true, active, error: true, onRetry });
      expect(host.querySelector("details")).toBeNull();
      expect(host.querySelector('[role="alert"]')?.textContent).toContain(
        "Não foi possível confirmar",
      );
      expect(button(active ? "Desativar modo pânico" : "Ativar modo pânico", host).disabled).toBe(
        true,
      );
      act(() => button("Tentar novamente", host).click());
      expect(onRetry).toHaveBeenCalledOnce();
      expect(props.onActivate).not.toHaveBeenCalled();
      expect(props.onDeactivate).not.toHaveBeenCalled();
    },
  );

  it("expande imediatamente ao receber bloqueio ativo e preserva desativação existente", () => {
    render({ compact: true });
    expect(host.querySelector("details")?.open).toBe(false);
    render({ active: true });
    expect(host.querySelector("details")).toBeNull();
    expect(host.textContent).toContain("ATIVO: toda escrita");
    act(() => button("Desativar modo pânico", host).click());
    expect(props.onDeactivate).toHaveBeenCalledOnce();
    expect(props.onActivate).not.toHaveBeenCalled();
  });
});
