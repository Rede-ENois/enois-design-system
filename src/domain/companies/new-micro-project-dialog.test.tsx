// @vitest-environment jsdom
import { type ReactNode, act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { NewMicroProjectDialogProps } from "../../types/domain/companies/new-micro-project-dialog-props.js";

import { NewMicroProjectDialog } from "./new-micro-project-dialog.js";

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
/** The control a visible label points at, so the test also proves the labelling. */
const field = (label: string) => {
  const el = [...container.querySelectorAll("label")].find((l) =>
    l.textContent?.startsWith(label),
  )!;
  return document.getElementById(el.htmlFor) as HTMLInputElement | HTMLTextAreaElement;
};

function type(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = Object.getPrototypeOf(el) as object;
  Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

const render = (patch: Partial<NewMicroProjectDialogProps> = {}) => {
  const props: NewMicroProjectDialogProps = {
    open: true,
    onOpenChange: vi.fn(),
    pending: false,
    error: null,
    onSubmit: vi.fn(),
    ...patch,
  };
  act(() => root.render(<NewMicroProjectDialog {...props} />));
  return props;
};

const fillRequired = () => {
  act(() => type(field("Título"), "Painel de pedidos"));
  act(() =>
    type(field("O problema real"), "Os pedidos chegam por três canais e a cozinha se perde."),
  );
  act(() => type(field("Entregáveis"), "Painel web\n\n  Guia de uso  "));
  act(() => type(field("Critérios de aceite"), "Pedido em 5 segundos"));
};

describe("NewMicroProjectDialog", () => {
  it("shows the rules inline after the first try, on the right fields", () => {
    const props = render();
    act(() => submit().click());
    expect(props.onSubmit).not.toHaveBeenCalled();
    expect(text()).toContain("Use pelo menos 8 caracteres.");
    expect(text()).toContain("Descreva o problema com pelo menos 30 caracteres.");
    expect(field("Entregáveis").getAttribute("aria-invalid")).toBe("true");
    expect(field("Critérios de aceite").getAttribute("aria-invalid")).toBe("true");
    expect(field("Escopo do piloto").getAttribute("aria-invalid")).toBeNull();
  });

  it("publishes trimmed values with one item per line", () => {
    const props = render();
    fillRequired();
    act(() => type(field("Orçamento"), " R$ 2.000 "));
    act(() => submit().click());
    expect(props.onSubmit).toHaveBeenCalledWith({
      title: "Painel de pedidos",
      problem: "Os pedidos chegam por três canais e a cozinha se perde.",
      scope: null,
      deliverables: ["Painel web", "Guia de uso"],
      acceptance: ["Pedido em 5 segundos"],
      budget: "R$ 2.000",
      deadline: null,
    });
  });

  it("refuses a deadline in the past and sends a valid one as ISO", () => {
    const props = render();
    fillRequired();
    act(() => type(field("Prazo"), "01/01/2020"));
    act(() => submit().click());
    expect(props.onSubmit).not.toHaveBeenCalled();
    expect(text()).toContain("Escolha uma data a partir de hoje.");
    act(() => type(field("Prazo"), "31/12/2099"));
    act(() => submit().click());
    expect(props.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ deadline: "2099-12-31" }),
    );
  });

  it("locks publishing while pending and shows the error", () => {
    render({ pending: true, error: "Não foi possível publicar." });
    expect(submit().disabled).toBe(true);
    expect(container.querySelector('[role="alert"]')?.textContent).toBe(
      "Não foi possível publicar.",
    );
  });
});
