// @vitest-environment jsdom
import { type ReactNode, act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CompleteMicroProjectDialogProps } from "../../types/domain/companies/complete-micro-project-dialog-props.js";

import { CompleteMicroProjectDialog } from "./complete-micro-project-dialog.js";

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
const radios = () => [...container.querySelectorAll<HTMLInputElement>("input[type=radio]")];
const submit = () => container.querySelector<HTMLButtonElement>("button[type=submit]")!;

function type(el: HTMLTextAreaElement, value: string) {
  const proto = Object.getPrototypeOf(el) as object;
  Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

const render = (patch: Partial<CompleteMicroProjectDialogProps> = {}) => {
  const props: CompleteMicroProjectDialogProps = {
    open: true,
    onOpenChange: vi.fn(),
    personName: "Ana Souza",
    pending: false,
    onConfirm: vi.fn(),
    ...patch,
  };
  act(() => root.render(<CompleteMicroProjectDialog {...props} />));
  return props;
};

describe("CompleteMicroProjectDialog", () => {
  it("is a real radio group of five labelled stars under a legend", () => {
    render();
    expect(container.querySelector("fieldset legend")?.textContent).toBe(
      "Como foi trabalhar com Ana Souza?",
    );
    expect(radios()).toHaveLength(5);
    expect(new Set(radios().map((r) => r.name)).size).toBe(1);
    expect(radios()[0].closest("label")?.textContent).toBe("1 estrela");
    expect(radios()[4].closest("label")?.textContent).toBe("5 estrelas");
  });

  it("completes without a review", () => {
    const props = render();
    act(() => submit().click());
    expect(props.onConfirm).toHaveBeenCalledWith({});
  });

  it("sends the chosen rating and the trimmed comment", () => {
    const props = render();
    act(() => radios()[3].click());
    expect(radios()[3].checked).toBe(true);
    expect(text()).toContain("Muito bom");
    act(() => type(container.querySelector("textarea")!, "  Entrega caprichada.  "));
    act(() => submit().click());
    expect(props.onConfirm).toHaveBeenCalledWith({ rating: 4, text: "Entrega caprichada." });
  });

  it("asks for a rating before sending a comment", () => {
    const props = render();
    act(() => type(container.querySelector("textarea")!, "Gostei."));
    act(() => submit().click());
    expect(props.onConfirm).not.toHaveBeenCalled();
    expect(text()).toContain("Escolha uma nota para enviar o comentário.");
  });

  it("lets the rating be cleared", () => {
    const props = render();
    act(() => radios()[1].click());
    const clear = [...container.querySelectorAll("button")].find(
      (b) => b.textContent === "Sem avaliação",
    )!;
    act(() => clear.click());
    act(() => submit().click());
    expect(props.onConfirm).toHaveBeenCalledWith({});
  });

  it("caps the comment at 500 characters and locks while pending", () => {
    render({ pending: true });
    expect(container.querySelector("textarea")!.maxLength).toBe(500);
    expect(submit().disabled).toBe(true);
  });
});
