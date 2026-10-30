// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { ProfessionalProfileProps } from "../../types/domain/profile/professional-profile-props.js";

import { ProfessionalProfile } from "./professional-profile.js";

const render = (patch: Partial<ProfessionalProfileProps> = {}) =>
  renderToStaticMarkup(
    <ProfessionalProfile
      backHref="/feed"
      profile={{ name: "Ana", username: "ana.pro", skills: [], links: [] }}
      experiences={[]}
      educations={[]}
      certifications={[]}
      posts={<p>posts</p>}
      {...patch}
    />,
  );

describe("ProfessionalProfile", () => {
  it("shows the professional @ and hides the owner action from visitors", () => {
    const html = render();
    expect(html).toContain("@ana.pro");
    expect(html).not.toContain("Editar perfil profissional");
  });

  it("offers the edit link to the owner", () => {
    expect(render({ editHref: "/profissional" })).toContain('href="/profissional"');
  });

  it("drops empty sections instead of drawing empty headings", () => {
    const html = render();
    expect(html).not.toContain("Trajetória");
    expect(html).not.toContain("Habilidades");
    expect(html).not.toContain("Credibilidade");
  });

  it("marks the current position on the timeline and writes the period without dashes", () => {
    const html = render({
      experiences: [
        {
          id: "e1",
          title: "Dev",
          company: "Exemplo",
          currentlyHere: true,
          startLabel: "jan. 2024",
          endLabel: null,
          months: 3,
        },
      ],
    });
    expect(html).toContain("jan. 2024 até o momento · 3 meses");
    expect(html).not.toMatch(/[–—]/);
  });

  it("labels the verified mark and the credibility strip", () => {
    const html = render({
      profile: {
        name: "Ana",
        username: "ana.pro",
        identityVerified: true,
        reputation: 1240,
        memberSinceLabel: "mar. 2026",
        skills: ["Go"],
        links: ["https://www.example.dev/ana/"],
      },
    });
    expect(html).toContain('aria-label="Identidade verificada"');
    expect(html).toContain("1.240");
    expect(html).toContain("example.dev/ana");
  });
});
