// @vitest-environment jsdom
import { type ReactNode, act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { MicroProjectProposalDialogProps } from "../../types/domain/companies/micro-project-proposal-dialog-props.js";

import { MicroProjectProposalDialog } from "./micro-project-proposal-dialog.js";

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
const field = () => container.querySelector("textarea")!;

function type(el: HTMLTextAreaElement, value: string) {
  const proto = Object.getPrototypeOf(el) as object;
  Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

const render = (patch: Partial<MicroProjectProposalDialogProps> = {}) => {
  const props: MicroProjectProposalDialogProps = {
    open: true,
    onOpenChange: vi.fn(),
    projectTitle: "Painel de pedidos",
    applicant: { name: "Ana Souza", username: "ana.souza" },
    pending: false,
    error: null,
    onSubmit: vi.fn(),
    ...patch,
  };
  act(() => root.render(<MicroProjectProposalDialog {...props} />));
  return props;
};

describe("MicroProjectProposalDialog", () => {
  it("signs with the professional identity and labels the field", () => {
    render();
    expect(text()).toContain("Ana Souza");
    const label = container.querySelector(`label[for="${field().id}"]`);
    expect(label?.textContent).toBe("Sua proposta");
  });

  it("refuses a message under 20 characters and says how many are missing", () => {
    const props = render();
    act(() => type(field(), "Curta demais"));
    act(() => submit().click());
    expect(props.onSubmit).not.toHaveBeenCalled();
    expect(field().getAttribute("aria-invalid")).toBe("true");
    expect(text()).toContain("Faltam 8 caracteres.");
  });

  it("sends the trimmed message", () => {
    const props = render();
    act(() => type(field(), "  Eu resolveria com uma fila única.  "));
    act(() => submit().click());
    expect(props.onSubmit).toHaveBeenCalledWith("Eu resolveria com uma fila única.");
  });

  it("caps the message at 2000 characters with a counter", () => {
    render();
    expect(field().maxLength).toBe(2000);
    expect(text()).toContain("0 / 2.000");
  });

  it("locks sending while pending and shows the error", () => {
    render({ pending: true, error: "Não foi possível enviar." });
    expect(submit().disabled).toBe(true);
    expect(container.querySelector('[role="alert"]')?.textContent).toBe("Não foi possível enviar.");
  });
});
