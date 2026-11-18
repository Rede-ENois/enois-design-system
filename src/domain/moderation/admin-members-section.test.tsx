// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { AdminMemberRowData } from "../../types/domain/moderation/admin-member-row-data.js";

import { AdminMembersSection } from "./admin-members-section.js";

const rows: AdminMemberRowData[] = [
  {
    userId: "u1",
    username: "ana",
    name: "Ana Souza",
    avatar: null,
    roleLabel: "Dono",
    joinedAtLabel: "18/10/2026",
  },
  {
    userId: "u2",
    username: null,
    name: null,
    avatar: null,
    roleLabel: "Membro",
    joinedAtLabel: "19/10/2026",
  },
];

function render(overrides: Partial<Parameters<typeof AdminMembersSection>[0]> = {}) {
  return renderToStaticMarkup(
    <AdminMembersSection
      entityName="Grupo Teste"
      items={rows}
      total={340}
      page={1}
      pages={7}
      query=""
      onQuery={() => {}}
      onPage={() => {}}
      {...overrides}
    />,
  );
}

describe("AdminMembersSection", () => {
  it("shows the total, the roles and the join date of each member", () => {
    const html = render();
    expect(html).toContain("Membros de Grupo Teste");
    expect(html).toContain("340 pessoas");
    expect(html).toContain("@ana");
    expect(html).toContain("Dono");
    expect(html).toContain("18/10/2026");
  });

  it("labels a member whose profile is gone instead of showing an empty line", () => {
    expect(render()).toContain("Conta removida");
  });

  it("disables the arrows at the edges and shows the current page", () => {
    expect(render({ page: 0 })).toContain("Página 1 de 7");
    expect(render({ page: 0 })).toContain('disabled=""');

    // Last page: the "next" arrow is the disabled one; the previous stays enabled.
    const last = render({ page: 6 });
    expect(last).toContain("Página 7 de 7");
    expect(last).toContain('disabled=""');
  });

  it("shows the empty state and the error state", () => {
    expect(render({ items: [], total: 0 })).toContain("Nenhuma pessoa encontrada.");
    expect(render({ error: true })).toContain("Não foi possível carregar os membros.");
  });
});
