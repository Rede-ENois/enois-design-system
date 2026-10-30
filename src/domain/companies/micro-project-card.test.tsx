// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { MicroProjectCardProps } from "../../types/domain/companies/micro-project-card-props.js";

import { actions, project } from "./companies.fixture.js";
import { MicroProjectCard } from "./micro-project-card.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const text = () => container.textContent ?? "";
const button = (label: string) =>
  [...container.querySelectorAll("button")].find(
    (b) => (b.getAttribute("aria-label") ?? b.textContent) === label,
  ) ?? null;
const link = (label: string) =>
  [...container.querySelectorAll("a")].find((a) => a.textContent === label) ?? null;

const render = (patch: Partial<MicroProjectCardProps> = {}) => {
  const props: MicroProjectCardProps = {
    project: project(),
    viewer: "OK",
    actions: actions({ onPropose: vi.fn(), onShowProposals: vi.fn(), onComplete: vi.fn() }),
    ...patch,
  };
  act(() => root.render(<MicroProjectCard {...props} />));
  return props;
};

describe("MicroProjectCard", () => {
  it("lets a professional propose, by the project id", () => {
    const props = render();
    act(() => button("Enviar proposta para Painel de pedidos para a cozinha")!.click());
    expect(props.actions.onPropose).toHaveBeenCalledWith("p1");
  });

  it("locks the proposal while it is on its way", () => {
    render({ actions: actions({ busyId: "p1" }) });
    expect(button("Enviar proposta para Painel de pedidos para a cozinha")!.disabled).toBe(true);
  });

  it("keeps scope, deliverables and criteria behind a toggle", () => {
    render();
    const toggle = button("Ver escopo e critérios")!;
    const details = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    expect(details.hidden).toBe(true);
    act(() => toggle.click());
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect(details.hidden).toBe(false);
    expect(details.querySelectorAll("li")).toHaveLength(4);
  });

  it("sends visitors to sign in", () => {
    render({ viewer: "SIGN_IN" });
    expect(link("Entre para enviar uma proposta")!.getAttribute("href")).toBe("/entrar");
    expect(button("Enviar proposta para Painel de pedidos para a cozinha")).toBeNull();
  });

  it("asks for the professional profile before proposing", () => {
    render({ viewer: "PROFESSIONAL_REQUIRED" });
    expect(text()).toContain("Propostas saem do seu perfil profissional.");
    expect(link("Ativar perfil profissional")!.getAttribute("href")).toBe("/profissional/ativar");
  });

  it("shows where the viewer's own proposal stands instead of the button", () => {
    render({ project: project({ myProposal: "SELECTED" }) });
    expect(text()).toContain("Sua proposta foi a escolhida.");
    expect(button("Enviar proposta para Painel de pedidos para a cozinha")).toBeNull();
  });

  it("says a closed project no longer takes proposals", () => {
    render({ project: project({ status: "COMPLETED" }) });
    expect(text()).toContain("Não recebe mais propostas.");
  });

  it("gives the team the proposals and, in progress, the completion", () => {
    const props = render({ viewer: "TEAM", project: project({ status: "IN_PROGRESS" }) });
    expect(text()).toContain("3 propostas");
    act(() => button("Ver propostas")!.click());
    act(() => button("Concluir")!.click());
    expect(props.actions.onShowProposals).toHaveBeenCalledWith("p1");
    expect(props.actions.onComplete).toHaveBeenCalledWith("p1");
  });

  it("does not offer completion to the team while the project is open", () => {
    render({ viewer: "TEAM" });
    expect(button("Concluir")).toBeNull();
  });
});
