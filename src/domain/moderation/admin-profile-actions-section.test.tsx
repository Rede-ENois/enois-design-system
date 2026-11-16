// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { AdminHistoryRowData } from "../../types/domain/moderation/admin-history-row-data.js";

import { AdminProfileActionsSection } from "./admin-profile-actions-section.js";

const history: AdminHistoryRowData[] = [
  {
    id: "warn_1",
    kind: "WARNING",
    typeLabel: "Advertência",
    reason: "Publicações repetidas fora das diretrizes.",
    active: true,
    createdAtLabel: "18/10/2026, 10:31",
  },
  {
    id: "sanction_1",
    kind: "SANCTION",
    typeLabel: "Suspensão",
    reason: "Golpe contra membros da comunidade.",
    active: true,
    createdAtLabel: "17/10/2026, 09:00",
    dueAtLabel: "24/10/2026, 09:00",
  },
];

const noop = async () => true;

function render(overrides: Partial<Parameters<typeof AdminProfileActionsSection>[0]> = {}) {
  return renderToStaticMarkup(
    <AdminProfileActionsSection
      profile={{ username: "alvo", displayName: "Alvo Teste", activeWarnings: 1 }}
      history={history}
      onWarn={noop}
      onSanction={noop}
      onRevokeWarning={noop}
      {...overrides}
    />,
  );
}

describe("AdminProfileActionsSection", () => {
  it("shows the three direct actions and the active warning count", () => {
    const html = render();
    expect(html).toContain("Ações diretas de administração");
    expect(html).toContain("Advertir");
    expect(html).toContain("Banir permanentemente");
    expect(html).toContain("A conta tem 1 advertência ativa");
  });

  it("lists the history with the due date of a suspension and the revoke action", () => {
    const html = render();
    expect(html).toContain("Advertência · ativa");
    expect(html).toContain("vira banimento em 24/10/2026, 09:00");
    expect(html).toContain("Revogar advertência");
  });

  it("locks the destructive buttons until the reason has ten characters", () => {
    expect(render()).toContain("disabled");
  });

  it("shows the empty history", () => {
    expect(render({ history: [] })).toContain("Nenhuma advertência ou sanção registrada");
  });

  it("renders nothing for a non-administrator (failed read)", () => {
    expect(render({ error: true })).toBe("");
  });
});
