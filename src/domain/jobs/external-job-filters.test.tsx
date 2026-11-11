// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ExternalJobFilterValues } from "../../types/domain/jobs/external-job-filter-values.js";
import type { ExternalJobFiltersProps } from "../../types/domain/jobs/external-job-filters-props.js";

import { ExternalJobFilters } from "./external-job-filters.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => {
  act(() => root.render(null));
});

const empty: ExternalJobFilterValues = {
  level: null,
  workModel: null,
  employmentType: null,
  city: "",
  state: "",
  country: "",
  salaryMin: null,
  remoteOnly: false,
  publishedAfter: null,
  sort: "recent",
};

const baseProps: ExternalJobFiltersProps = {
  value: empty,
  onChange: () => {},
  onClear: () => {},
  activeCount: 0,
};

function render(props: Partial<ExternalJobFiltersProps> = {}) {
  act(() => root.render(<ExternalJobFilters {...baseProps} {...props} />));
}

function pillByLabel(label: string): HTMLButtonElement {
  const found = [...container.querySelectorAll<HTMLButtonElement>("button")].find(
    (button) => button.textContent?.trim() === label,
  );
  if (!found) throw new Error(`pill "${label}" missing`);
  return found;
}

function inputById(id: string): HTMLInputElement {
  const found = container.querySelector<HTMLInputElement>(`#${id}`);
  if (!found) throw new Error(`input #${id} missing`);
  return found;
}

/** Digita no campo e tira o foco: é assim que o commit sai. */
function typeAndBlur(id: string, text: string) {
  const input = inputById(id);
  act(() => {
    input.focus();
  });
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, text);
  act(() => {
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.blur();
  });
}

describe("ExternalJobFilters", () => {
  it("toggles a level pill on and off", () => {
    const onChange = vi.fn();
    render({ onChange });

    act(() => pillByLabel("Sênior").click());
    expect(onChange).toHaveBeenCalledWith({ level: "SENIOR" });

    render({ onChange, value: { ...empty, level: "SENIOR" } });
    act(() => pillByLabel("Sênior").click());
    expect(onChange).toHaveBeenCalledWith({ level: null });
  });

  it("reports which work model the person chose", () => {
    const onChange = vi.fn();
    render({ onChange });

    act(() => pillByLabel("Remoto").click());
    expect(onChange).toHaveBeenCalledWith({ workModel: "REMOTE" });
  });

  it("reports the employment type", () => {
    const onChange = vi.fn();
    render({ onChange });

    act(() => pillByLabel("Estágio").click());
    expect(onChange).toHaveBeenCalledWith({ employmentType: "INTERNSHIP" });
  });

  it("commits the text filters on blur, once per field, trimmed", () => {
    const onChange = vi.fn();
    render({ onChange });

    typeAndBlur("external-job-city", "  São Paulo  ");
    expect(onChange).toHaveBeenCalledWith({ city: "São Paulo" });

    // Sem mudança, nenhum aviso: digitar e sair sem alterar não recarrega a lista.
    render({ onChange, value: { ...empty, city: "São Paulo" } });
    onChange.mockClear();
    typeAndBlur("external-job-city", "São Paulo");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("parses the salary floor as a number and clears it when emptied", () => {
    const onChange = vi.fn();
    render({ onChange });

    typeAndBlur("external-job-salary", "8.000");
    expect(onChange).toHaveBeenCalledWith({ salaryMin: 8000 });

    render({ onChange, value: { ...empty, salaryMin: 8000 } });
    typeAndBlur("external-job-salary", "");
    expect(onChange).toHaveBeenCalledWith({ salaryMin: null });
  });

  it("turns the remote-only switch into a boolean patch", () => {
    const onChange = vi.fn();
    render({ onChange });

    const sw = container.querySelector<HTMLButtonElement>('button[role="switch"]');
    if (!sw) throw new Error("switch missing");
    act(() => sw.click());
    expect(onChange).toHaveBeenCalledWith({ remoteOnly: true });
  });

  it("translates the publication window into an ISO date and back to null", () => {
    const onChange = vi.fn();
    render({ onChange });

    const select = container.querySelector('select[aria-label="Publicadas"]');
    if (!(select instanceof HTMLSelectElement)) throw new Error("select missing");
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set;
      setter?.call(select, "7");
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    const [patch] = onChange.mock.calls[0] as [{ publishedAfter: string }];
    const ageDays = (Date.now() - new Date(patch.publishedAfter).getTime()) / 86_400_000;
    expect(ageDays).toBeGreaterThan(6.9);
    expect(ageDays).toBeLessThan(7.1);

    render({ onChange, value: { ...empty, publishedAfter: patch.publishedAfter } });
    act(() => {
      const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set;
      setter?.call(select, "any");
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    expect(onChange).toHaveBeenLastCalledWith({ publishedAfter: null });
  });

  it("shows the clear button only when there are active filters", () => {
    const onClear = vi.fn();
    render({ onClear });
    // Sem filtros, o botão nem existe.
    expect(container.textContent).not.toContain("Limpar filtros");

    render({ onClear, activeCount: 2 });
    act(() => pillByLabel("Limpar filtros").click());
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("signals busy state through aria-busy", () => {
    render({ busy: true });
    const section = container.querySelector("section");
    expect(section?.getAttribute("aria-busy")).toBe("true");
  });

  it("shows the active filter count", () => {
    render({ activeCount: 3 });
    expect(container.textContent).toContain("3 filtros ativos");
  });
});
