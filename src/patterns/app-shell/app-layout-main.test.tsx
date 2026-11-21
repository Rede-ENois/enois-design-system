import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AppLayout } from "./app-layout.js";

// O ambiente de teste do pacote e sem DOM: o que vale aqui e o atributo que sai no HTML.
function mainClassName(markup: string): string {
  return /<main class="([^"]*)"/.exec(markup)?.[1] ?? "";
}

describe("AppLayout.Main", () => {
  it("sem gap nao mexe no espacamento herdado", () => {
    const markup = renderToStaticMarkup(
      <AppLayout.Main>
        <p>bloco</p>
      </AppLayout.Main>,
    );
    const classes = mainClassName(markup).split(/\s+/);
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
    expect(mainClassName(markup).split(/\s+/)).toContain("space-y-4");
  });
});
