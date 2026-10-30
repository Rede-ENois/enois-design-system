// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CompanyPageViewProps } from "../../types/domain/companies/company-page-view-props.js";

import { actions, companyPage, project } from "./companies.fixture.js";
import { CompanyPageView } from "./company-page-view.js";

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

const render = (patch: Partial<CompanyPageViewProps> = {}) => {
  const props = companyPage(patch);
  act(() => root.render(<CompanyPageView {...props} />));
  return props;
};

const team = (onNewProject = vi.fn(), onAction = vi.fn()) => ({
  checklist: [
    { key: "logo", label: "Logo e capa", done: true },
    { key: "about", label: "Escrever a descrição", done: false, onAction },
  ],
  counts: { open: 1, newProposals: 2, inProgress: 0, completed: 4 },
  onNewProject,
});

describe("CompanyPageView", () => {
  it("shows the facts and the numbers strip", () => {
    render();
    expect(container.querySelector("h1")?.textContent).toBe("Cozinha Aberta");
    const strip = container.querySelector('dl[aria-label="Em números"]')!;
    expect(strip.textContent).toContain("Concluídos4");
    expect(strip.textContent).toContain("Seguidores48");
    expect(text()).toContain("11 a 50 pessoas");
  });

  it("follows and unfollows as a pressed toggle, locked while pending", () => {
    const onToggle = vi.fn();
    render({ follow: { following: false, pending: false, onToggle } });
    const follow = button("Seguir Cozinha Aberta")!;
    expect(follow.getAttribute("aria-pressed")).toBe("false");
    act(() => follow.click());
    expect(onToggle).toHaveBeenCalled();
    render({ follow: { following: true, pending: true, onToggle } });
    expect(button("Seguir Cozinha Aberta")!.getAttribute("aria-pressed")).toBe("true");
    expect(button("Seguir Cozinha Aberta")!.disabled).toBe(true);
    expect(text()).toContain("Seguindo");
  });

  it("hides the follow button and the team panel from signed out visitors", () => {
    render({ follow: null, viewer: "SIGN_IN" });
    expect(button("Seguir Cozinha Aberta")).toBeNull();
    expect(text()).not.toContain("Painel da equipe");
    expect(text()).toContain("Entre para enviar uma proposta");
  });

  it("gives the team its panel: counts, checklist actions and a new project", () => {
    const onNewProject = vi.fn();
    const onAction = vi.fn();
    const onEdit = vi.fn();
    render({ team: team(onNewProject, onAction), onEdit, roleLabel: "Dono", viewer: "TEAM" });
    expect(text()).toContain("Seu papel: Dono");
    expect(text()).toContain("1 de 2 prontos");
    expect(
      container.querySelector('dl[aria-label="Andamento dos microprojetos"]')?.textContent,
    ).toContain("Propostas novas2");
    act(() => button("Escrever a descrição")!.click());
    act(() => button("Publicar microprojeto")!.click());
    act(() => button("Editar página")!.click());
    expect(onAction).toHaveBeenCalled();
    expect(onNewProject).toHaveBeenCalled();
    expect(onEdit).toHaveBeenCalled();
    // A done step is not a button.
    expect(button("Logo e capa")).toBeNull();
  });

  it("routes the project actions with the project id", () => {
    const onPropose = vi.fn();
    render({ projectActions: actions({ onPropose }), projects: [project({ id: "p9" })] });
    act(() => button("Enviar proposta para Painel de pedidos para a cozinha")!.click());
    expect(onPropose).toHaveBeenCalledWith("p9");
  });

  it("lists jobs and reviews, with an accessible rating", () => {
    render();
    expect(container.querySelector('a[href="/vagas/j1"]')?.textContent).toContain(
      "Presencial · Pleno",
    );
    expect(container.querySelector('a[href="/vagas?empresa=cozinha-aberta"]')).not.toBeNull();
    const ratings = [...container.querySelectorAll('[role="img"]')].map((el) =>
      el.getAttribute("aria-label"),
    );
    expect(ratings).toEqual(["Nota 5 de 5", "Nota 4 de 5"]);
    expect(text()).toContain("Briefing claro");
  });

  it("says so when there are no projects, jobs or reviews, differently for the team", () => {
    render({ projects: [], jobs: [], jobsHref: null, reviews: [] });
    expect(text()).toContain("Nenhum microprojeto aberto agora.");
    expect(text()).toContain("Nenhuma vaga aberta agora.");
    expect(text()).toContain("As avaliações aparecem aqui");
    render({ projects: [], team: team(), viewer: "TEAM" });
    expect(text()).toContain("Publique o primeiro microprojeto");
  });
});
