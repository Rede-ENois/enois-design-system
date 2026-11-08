import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { RichTextToolbarMenu } from "./rich-text-toolbar-menu.js";

describe("RichTextToolbarMenu", () => {
  it("renders a three-dot trigger instead of the always-visible bar", () => {
    const html = renderToStaticMarkup(
      <RichTextToolbarMenu label="Formatação do texto" onFormat={() => {}} />,
    );

    expect(html).toContain('aria-label="Formatação"');
    expect(html).toContain('data-state="closed"');
    // O conteúdo do popover só existe quando abre: nenhuma barra ocupa espaço no campo parado.
    expect(html).not.toContain('role="toolbar"');
  });
});
