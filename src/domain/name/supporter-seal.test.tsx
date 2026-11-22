// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SupporterSeal } from "./supporter-seal.js";

describe("SupporterSeal", () => {
  it("mostra o rotulo do selo com a explicacao no title", () => {
    const html = renderToStaticMarkup(<SupporterSeal />);

    expect(html).toContain("Apoiador");
    expect(html).toContain('title="Esta conta já apoiou o projeto com uma doação."');
  });

  it("a variante do perfil e maior que a do nome", () => {
    const inline = renderToStaticMarkup(<SupporterSeal />);
    const badge = renderToStaticMarkup(<SupporterSeal variant="badge" />);

    expect(inline).toContain("text-[11px]");
    expect(badge).toContain("text-sm");
    expect(badge).not.toContain("text-[11px]");
  });

  it("pinta com token do tema, nunca com cor fixa", () => {
    const html = renderToStaticMarkup(<SupporterSeal variant="badge" />);

    expect(html).toContain("text-primary");
    expect(html).toContain("border-primary/40");
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });
});
