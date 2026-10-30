// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { NotificationPreferencesProps } from "../../types/domain/notifications/notification-preferences-props.js";

import { NotificationPreferences } from "./notification-preferences.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const values = {
  weeklyDigest: true,
  pushSocial: true,
  pushMessages: false,
  pushGroups: true,
  pushJobs: true,
  pushSystem: true,
};

function render(props: Partial<NotificationPreferencesProps> = {}) {
  act(() =>
    root.render(
      <NotificationPreferences
        values={values}
        onRetry={() => {}}
        onChange={() => {}}
        pushEnabled
        {...props}
      />,
    ),
  );
}

function switchFor(label: string) {
  const labelEl = [...container.querySelectorAll("p")].find((p) => p.textContent === label);
  return container.querySelector<HTMLButtonElement>(`[aria-labelledby="${labelEl?.id}"]`)!;
}

const live = () => container.querySelector("[aria-live]")!;

describe("NotificationPreferences", () => {
  it("calls onChange with the key and the flipped value", () => {
    const onChange = vi.fn();
    render({ onChange });

    act(() => switchFor("Mensagens").click());
    act(() => switchFor("Resumo semanal").click());

    expect(onChange).toHaveBeenNthCalledWith(1, "pushMessages", true);
    expect(onChange).toHaveBeenNthCalledWith(2, "weeklyDigest", false);
  });

  it("locks a pending switch and shows the saving indicator", () => {
    const onChange = vi.fn();
    render({ onChange, pending: { pushGroups: true } });

    const groups = switchFor("Grupos, blogs e jogos");
    expect(groups.disabled).toBe(true);
    expect(container.querySelector('[aria-label="Salvando…"]')).not.toBeNull();
    act(() => groups.click());
    expect(onChange).not.toHaveBeenCalled();
  });

  it("announces the save status through aria-live", () => {
    render({ saveStatus: "idle" });
    expect(live().getAttribute("aria-live")).toBe("polite");
    expect(live().textContent).toBe("");

    render({ saveStatus: "saved" });
    expect(live().textContent).toBe("Preferência salva.");

    render({ saveStatus: "error" });
    expect(live().textContent).toBe("Não foi possível salvar. Tente de novo.");
    expect(live().className).not.toContain("sr-only");
  });

  it("explains disabled push and keeps the categories usable", () => {
    const onEnablePush = vi.fn();
    render({ pushEnabled: false, onEnablePush });

    expect(container.textContent).toContain("Os avisos estão desligados neste dispositivo.");
    expect(switchFor("Vagas").disabled).toBe(false);
    const enable = [...container.querySelectorAll("button")].find(
      (b) => b.textContent === "Ligar avisos",
    )!;
    act(() => enable.click());
    expect(onEnablePush).toHaveBeenCalledOnce();
  });

  it("hides the push note when push is on", () => {
    render();
    expect(container.textContent).not.toContain("desligados neste dispositivo");
    expect(container.textContent).toContain("Avisos de segurança e moderação sempre chegam.");
  });

  it("shows a skeleton while loading and a retry when the load fails", () => {
    render({ values: null, loading: true });
    expect(container.querySelector('[role="status"]')?.textContent).toBe(
      "Carregando suas preferências",
    );

    const onRetry = vi.fn();
    render({ values: null, loadError: true, onRetry });
    const retry = container.querySelector("button")!;
    expect(retry.textContent).toBe("Tentar de novo");
    act(() => retry.click());
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
