// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AdminEntityActionsSection } from "./admin-entity-actions-section.js";

const noop = async () => true;

function render(overrides: Partial<Parameters<typeof AdminEntityActionsSection>[0]> = {}) {
  return renderToStaticMarkup(
    <AdminEntityActionsSection
      kind="group"
      entityName="Grupo Teste"
      title="Administração da plataforma"
      deleteLabel="Excluir grupo"
      description="Decisões da administração sobre este grupo."
      onDelete={noop}
      onClose={noop}
      {...overrides}
    />,
  );
}

describe("AdminEntityActionsSection", () => {
  it("offers delete and close for a group, describing what each one does", () => {
    const html = render();
    expect(html).toContain("Excluir grupo");
    expect(html).toContain("Encerrar grupo");
    expect(html).toContain("preservar o histórico");
  });

  it("hides close for a community and names the community in the action", () => {
    const html = render({
      kind: "community",
      deleteLabel: "Excluir comunidade",
      onClose: undefined,
    });
    expect(html).toContain("Excluir comunidade");
    expect(html).not.toContain("Encerrar grupo");
  });

  it("does not open the confirmation before a click", () => {
    expect(render()).not.toContain("Confirmar exclusão");
  });

  it("locks the destructive button while the container is working", () => {
    expect(render({ deleting: true })).toContain('disabled=""');
  });
});
