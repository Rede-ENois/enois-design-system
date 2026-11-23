import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AppLayout } from "./app-layout.js";

// O ambiente de teste do pacote e sem DOM: o que vale aqui e o atributo que sai no HTML.
function mainClasses(markup: string): string[] {
  return (/<main class="([^"]*)"/.exec(markup)?.[1] ?? "").split(/\s+/);
}

describe("AppLayout.Main", () => {
  it("sem gap nao mexe no espacamento herdado", () => {
    const markup = renderToStaticMarkup(
      <AppLayout.Main>
        <p>bloco</p>
      </AppLayout.Main>,
    );
    const classes = mainClasses(markup);
    expect(classes).toContain("flex-1");
    expect(classes).not.toContain("space-y-4");
  });

  it("gap medio espaca os blocos empilhados", () => {
    const markup = renderToStaticMarkup(
      <AppLayout.Main gap="md">
        <p>bloco</p>

        <p>outro bloco</p>
      </AppLayout.Main>,
    );
    const classes = mainClasses(markup);
    expect(classes).toContain("gap-4");
    expect(classes).not.toContain("space-y-4");
  });

  it("ocupa a largura da casca sem crescer por causa do conteudo", () => {
    const markup = renderToStaticMarkup(
      <AppLayout.Main gap="md">
        <p>bloco</p>
      </AppLayout.Main>,
    );
    const classes = mainClasses(markup);
    expect(classes).toContain("w-full");
    expect(classes).toContain("max-w-full");
    expect(classes).toContain("min-w-0");
  });
});
