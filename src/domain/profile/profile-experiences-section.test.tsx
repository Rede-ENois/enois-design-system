import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { ProfileExperienceItem } from "../../types/domain/profile/profile-experience-item.js";

import { ProfileExperiencesSection } from "./profile-experiences-section.js";

const item = (patch: Partial<ProfileExperienceItem>): ProfileExperienceItem => ({
  id: "e1",
  title: "Dev",
  company: "Énóis",
  startLabel: "jan. 2023",
  endLabel: "mar. 2024",
  months: 15,
  ...patch,
});

const render = (items: ProfileExperienceItem[]) =>
  renderToStaticMarkup(<ProfileExperiencesSection experiences={items} />);

describe("ProfileExperiencesSection", () => {
  it("sem experiências não desenha nada", () => {
    expect(render([])).toBe("");
  });

  it("período com fim e duração em anos e meses", () => {
    expect(render([item({})])).toContain("jan. 2023 - mar. 2024 · 1 ano e 3 meses");
  });

  it("quem está lá vê 'atual' no lugar do fim", () => {
    expect(render([item({ currentlyHere: true, months: 24 })])).toContain(
      "jan. 2023 - atual · 2 anos",
    );
  });

  it("sem início mostra só 'atual', sem duração", () => {
    const html = render([item({ startLabel: null, endLabel: null, months: null })]);
    expect(html).toContain(">atual<");
    expect(html).not.toContain("mês");
  });
});
