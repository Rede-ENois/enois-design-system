// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CompanyTeamSectionProps } from "../../types/domain/jobs/company-team-section-props.js";

import { CompanyTeamSection } from "./company-team-section.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const text = () => container.textContent ?? "";

const render = (patch: Partial<CompanyTeamSectionProps> = {}) => {
  const props: CompanyTeamSectionProps = {
    members: [],
    search: "",
    onSearchChange: vi.fn(),
    results: [],
    selected: null,
    onSelectedChange: vi.fn(),
    role: "EDITOR",
    onRoleChange: vi.fn(),
    addPending: false,
    onAdd: vi.fn(),
    ...patch,
  };
  act(() => root.render(<CompanyTeamSection {...props} />));
  return props;
};

describe("CompanyTeamSection", () => {
  it("shows members by name, @ and role label", () => {
    render({
      members: [{ userId: "u1", role: "OWNER", name: "Ana Souza", username: "ana", avatar: null }],
    });
    expect(text()).toContain("Ana Souza");
    expect(text()).toContain("@ana");
    expect(text()).toContain("Dono");
  });

  it("still renders members without a name (older callers)", () => {
    render({ members: [{ userId: "0123456789abcdefghijkl", role: "EDITOR" }] });
    expect(text()).toContain("0123456789abcdefgh…");
    expect(text()).toContain("Editor");
  });

  it("labels the role select with readable roles", () => {
    render({ selected: { id: "u2", name: "Bia", username: "bia" } });
    const select = container.querySelector("select")!;
    expect(select.getAttribute("aria-label")).toBe("Papel na equipe");
    expect([...select.options].map((o) => o.textContent)).toEqual([
      "Editor",
      "Admin",
      "Recrutador",
    ]);
  });
});
