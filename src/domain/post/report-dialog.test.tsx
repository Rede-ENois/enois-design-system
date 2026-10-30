// @vitest-environment node
import type { ReactNode } from "react";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { ReportDialog } from "./report-dialog.js";

// The Radix portal renders nothing on the server: the dialog parts become plain wrappers here.
vi.mock("../../ui/dialog.js", () => {
  const Plain = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  return { Dialog: Plain, DialogContent: Plain, DialogHeader: Plain, DialogTitle: Plain };
});

const reasons = ["SEXUAL_CONTENT", "SPAM", "OTHER"] as const;

const noop = (): void => {};

function render(): string {
  return renderToStaticMarkup(
    <ReportDialog
      targetType="POST"
      reasons={reasons}
      defaultReason="SPAM"
      guidelinesHref="/diretrizes"
      open
      onOpenChange={noop}
      onSubmit={async () => true}
    />,
  );
}

describe("ReportDialog", () => {
  it("shows every reason with a readable label", () => {
    const html = render();

    // O motivo de conteúdo sexual é o que dispara a quarentena imediata no backend: ele precisa
    // aparecer escrito como gente, não como código.
    expect(html).toContain("Nudez ou conteúdo sexual");
    expect(html).toContain("Spam");
    expect(html).toContain("Outro");
    expect(html).not.toContain("sexual content");
    expect(html).not.toContain(">SEXUAL_CONTENT<");
  });

  it("keeps the raw code when the app does not translate a reason", () => {
    const html = renderToStaticMarkup(
      <ReportDialog
        targetType="POST"
        reasons={["REASON_WITHOUT_TRANSLATION"] as const}
        defaultReason="REASON_WITHOUT_TRANSLATION"
        guidelinesHref="/diretrizes"
        open
        onOpenChange={noop}
        onSubmit={async () => true}
      />,
    );

    expect(html).toContain("reason without translation");
  });
});
