// @vitest-environment jsdom
import { type ReactNode, act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { MicroProjectProposalsDialogProps } from "../../types/domain/companies/micro-project-proposals-dialog-props.js";

import { proposal } from "./companies.fixture.js";
import { MicroProjectProposalsDialog } from "./micro-project-proposals-dialog.js";

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
const byLabel = (label: string) =>
  [...container.querySelectorAll<HTMLElement>("button, a")].find(
    (el) => (el.getAttribute("aria-label") ?? el.textContent) === label,
  ) as HTMLButtonElement | undefined;

const render = (patch: Partial<MicroProjectProposalsDialogProps> = {}) => {
  const props: MicroProjectProposalsDialogProps = {
    open: true,
    onOpenChange: vi.fn(),
    projectTitle: "Painel de pedidos",
    projectStatus: "OPEN",
    loading: false,
    proposals: [
      proposal(),
      proposal({ id: "pr2", person: { ...proposal().person, name: "Bia Rocha" } }),
    ],
    selectingId: null,
    onSelect: vi.fn(),
    ...patch,
  };
  act(() => root.render(<MicroProjectProposalsDialog {...props} />));
  return props;
};

describe("MicroProjectProposalsDialog", () => {
  it("shows each proposer's professional profile and message", () => {
    render();
    expect(byLabel("Caio Lima")?.getAttribute("href")).toBe("/profissional/caio.lima");
    expect(text()).toContain("Engenheiro de software");
    expect(text()).toContain("Já fiz um painel parecido");
    expect(byLabel("Conversar com Caio Lima")?.getAttribute("href")).toBe("/mensagens/c1");
  });

  it("chooses a proposal by its id", () => {
    const props = render();
    act(() => byLabel("Escolher a proposta de Bia Rocha")!.click());
    expect(props.onSelect).toHaveBeenCalledWith("pr2");
  });

  it("locks every choice while one is on its way", () => {
    render({ selectingId: "pr1" });
    expect(byLabel("Escolher a proposta de Caio Lima")!.disabled).toBe(true);
    expect(byLabel("Escolher a proposta de Bia Rocha")!.disabled).toBe(true);
  });

  it("marks the outcome and stops offering choices once the project moved on", () => {
    render({
      projectStatus: "IN_PROGRESS",
      proposals: [proposal({ status: "SELECTED" }), proposal({ id: "pr2", status: "DECLINED" })],
    });
    expect(text()).toContain("Escolhida");
    expect(text()).toContain("Não escolhida");
    expect(byLabel("Escolher a proposta de Caio Lima")).toBeUndefined();
  });

  it("has explicit loading, empty and error states", () => {
    render({ loading: true });
    expect(container.querySelector('[role="status"]')?.getAttribute("aria-label")).toBe(
      "Carregando propostas",
    );
    render({ proposals: [] });
    expect(text()).toContain("Nenhuma proposta ainda.");
    const onRetry = vi.fn();
    render({ error: true, onRetry });
    act(() => byLabel("Tentar de novo")!.click());
    expect(onRetry).toHaveBeenCalled();
  });
});
