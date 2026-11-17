// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AdminRemovePostAction } from "./admin-remove-post-action.js";

const texts = {
  label: "Remover publicação",
  title: "Remover esta publicação (administração)",
  description: "A publicação sai do ar na hora, com motivo registrado e auditoria.",
  confirmLabel: "Remover",
  cancelLabel: "Cancelar",
  reasonPlaceholder: "Motivo (mínimo 10 caracteres)",
  reasonTooShort: "O motivo precisa de pelo menos 10 caracteres.",
};

const noop = async () => true;

describe("AdminRemovePostAction", () => {
  it("starts as a single button; the confirmation only opens on click", () => {
    const html = renderToStaticMarkup(<AdminRemovePostAction {...texts} onRemove={noop} />);
    expect(html).toContain(texts.label);
    expect(html).not.toContain(texts.title);
  });

  it("keeps the error of the container out of the screen while the dialog is closed", () => {
    const html = renderToStaticMarkup(
      <AdminRemovePostAction
        {...texts}
        onRemove={noop}
        pending
        error="Não foi possível remover a publicação."
      />,
    );
    expect(html).toContain(texts.label);
    expect(html).not.toContain("Não foi possível remover");
  });
});
