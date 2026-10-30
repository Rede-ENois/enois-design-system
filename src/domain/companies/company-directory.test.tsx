// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CompanyDirectoryProps } from "../../types/domain/companies/company-directory-props.js";

import { entry } from "./companies.fixture.js";
import { CompanyDirectory } from "./company-directory.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const text = () => container.textContent ?? "";
const button = (label: string) =>
  [...container.querySelectorAll("button")].find((b) => b.textContent === label) ?? null;

function type(el: HTMLInputElement, value: string) {
  const proto = Object.getPrototypeOf(el) as object;
  Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

const render = (patch: Partial<CompanyDirectoryProps> = {}) => {
  const props: CompanyDirectoryProps = {
    query: "",
    onQueryChange: vi.fn(),
    sectors: ["Alimentação", "Tecnologia"],
    sector: null,
    onSectorChange: vi.fn(),
    entries: [entry()],
    loading: false,
    error: false,
    onRetry: vi.fn(),
    myPages: null,
    ...patch,
  };
  act(() => root.render(<CompanyDirectory {...props} />));
  return props;
};

describe("CompanyDirectory", () => {
  it("searches through a labelled field", () => {
    const props = render();
    const input = container.querySelector<HTMLInputElement>("input[type=search]")!;
    expect(container.querySelector(`label[for="${input.id}"]`)?.textContent).toBe("Buscar empresa");
    act(() => type(input, "coz"));
    expect(props.onQueryChange).toHaveBeenCalledWith("coz");
  });

  it("filters by sector and toggles back to all", () => {
    const props = render({ sector: "Tecnologia" });
    act(() => button("Alimentação")!.click());
    act(() => button("Tecnologia")!.click());
    act(() => button("Todos")!.click());
    expect(props.onSectorChange).toHaveBeenNthCalledWith(1, "Alimentação");
    expect(props.onSectorChange).toHaveBeenNthCalledWith(2, null);
    expect(props.onSectorChange).toHaveBeenNthCalledWith(3, null);
    expect(button("Tecnologia")!.getAttribute("aria-pressed")).toBe("true");
  });

  it("links each card and marks who is hiring", () => {
    render({
      entries: [
        entry(),
        entry({ key: "c2", name: "Quieta", openJobs: 0, openProjects: 0, followers: 3 }),
      ],
    });
    const links = [...container.querySelectorAll("a")];
    expect(links.map((a) => a.getAttribute("href"))).toEqual([
      "/empresa/cozinha-aberta",
      "/empresa/cozinha-aberta",
    ]);
    expect(text().match(/Contratando/g)).toHaveLength(1);
    expect(text()).toContain("2 vagas · 1 microprojeto · 48 seguidores");
    expect(text()).toContain("2 empresas");
  });

  it("marks companies that only exist through job posts", () => {
    render({ entries: [entry({ external: true, href: "/vagas?empresa=x" })] });
    expect(text()).toContain("Ainda sem página na rede");
    expect(text()).not.toContain("seguidores");
  });

  it("shows the viewer's pages and the create action only when signed in", () => {
    render();
    expect(button("Criar página")).toBeNull();
    const onCreatePage = vi.fn();
    render({
      myPages: [{ slug: "minha", name: "Minha Empresa", logo: null, href: "/empresa/minha" }],
      onCreatePage,
    });
    expect(container.querySelector('nav[aria-label="Suas páginas"] a')?.getAttribute("href")).toBe(
      "/empresa/minha",
    );
    act(() => button("Criar página")!.click());
    expect(onCreatePage).toHaveBeenCalled();
  });

  it("has explicit loading, error and empty states", () => {
    render({ loading: true });
    expect(container.querySelector('[role="status"]')?.getAttribute("aria-label")).toBe(
      "Carregando empresas",
    );
    const props = render({ error: true });
    act(() => button("Tentar de novo")!.click());
    expect(props.onRetry).toHaveBeenCalled();
    render({ entries: [] });
    expect(text()).toContain("Nenhuma empresa por aqui ainda.");
  });

  it("offers to clear the filters when they hide everything", () => {
    const props = render({ entries: [], query: "zzz", sector: "Tecnologia" });
    expect(text()).toContain("Nenhuma empresa encontrada com esses filtros.");
    act(() => button("Limpar filtros")!.click());
    expect(props.onQueryChange).toHaveBeenCalledWith("");
    expect(props.onSectorChange).toHaveBeenCalledWith(null);
  });
});
