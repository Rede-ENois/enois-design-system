// @vitest-environment jsdom
import { type ReactNode, act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CreateCompanyDialogProps } from "../../types/domain/companies/create-company-dialog-props.js";

import { CreateCompanyDialog } from "./create-company-dialog.js";

// The Radix portal is not under test: the dialog parts render inline.
vi.mock("../../ui/dialog.js", () => {
  const Plain = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  return {
    Dialog: ({ open, children }: { open: boolean; children?: ReactNode }) =>
      open ? <div>{children}</div> : null,
    DialogContent: Plain,
    DialogHeader: Plain,
    DialogTitle: Plain,
    DialogDescription: Plain,
  };
});

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const text = () => container.textContent ?? "";
const submit = () => container.querySelector<HTMLButtonElement>("button[type=submit]")!;
const field = (label: string) => {
  const el = [...container.querySelectorAll("label")].find((l) =>
    l.textContent?.startsWith(label),
  )!;
  return document.getElementById(el.htmlFor) as HTMLInputElement | HTMLSelectElement;
};

function type(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
  const proto = Object.getPrototypeOf(el) as object;
  Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
  el.dispatchEvent(
    new Event(el instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }),
  );
}

const render = (patch: Partial<CreateCompanyDialogProps> = {}) => {
  const props: CreateCompanyDialogProps = {
    open: true,
    onOpenChange: vi.fn(),
    pending: false,
    error: null,
    sizeOptions: [
      { value: "1-10", label: "1 a 10 pessoas" },
      { value: "11-50", label: "11 a 50 pessoas" },
    ],
    onSubmit: vi.fn(),
    ...patch,
  };
  act(() => root.render(<CreateCompanyDialog {...props} />));
  return props;
};

describe("CreateCompanyDialog", () => {
  it("requires the name", () => {
    const props = render();
    act(() => submit().click());
    expect(props.onSubmit).not.toHaveBeenCalled();
    expect(text()).toContain("Diga o nome da empresa.");
    expect(field("Nome da empresa").getAttribute("aria-invalid")).toBe("true");
  });

  it("refuses a site that is not an http(s) address", () => {
    const props = render();
    act(() => type(field("Nome da empresa"), "Cozinha Aberta"));
    act(() => type(field("Site"), "javascript:alert(1)"));
    act(() => submit().click());
    expect(props.onSubmit).not.toHaveBeenCalled();
    expect(text()).toContain("Use um endereço que comece com https://");
  });

  it("creates with trimmed values, empty optionals as null", () => {
    const props = render();
    act(() => type(field("Nome da empresa"), "  Cozinha Aberta "));
    act(() => type(field("Tamanho"), "11-50"));
    act(() => type(field("Site"), "https://cozinha.example"));
    act(() => submit().click());
    expect(props.onSubmit).toHaveBeenCalledWith({
      name: "Cozinha Aberta",
      description: null,
      sector: null,
      size: "11-50",
      location: null,
      website: "https://cozinha.example",
    });
  });

  it("locks creating while pending and shows the error", () => {
    render({ pending: true, error: "Não foi possível criar." });
    expect(submit().disabled).toBe(true);
    expect(container.querySelector('[role="alert"]')?.textContent).toBe("Não foi possível criar.");
  });
});
