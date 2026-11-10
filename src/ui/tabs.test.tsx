import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Tabs, TabsList, TabsTrigger } from "./tabs.js";

const activeTab = (className?: string) =>
  renderToStaticMarkup(
    <Tabs defaultValue="t">
      <TabsList aria-label="escopo">
        <TabsTrigger value="t" className={className}>
          Tudo
        </TabsTrigger>

        <TabsTrigger value="o">Outro</TabsTrigger>
      </TabsList>
    </Tabs>,
  );

describe("TabsTrigger", () => {
  it("colors the active tab with theme tokens, not the dark-theme prototype hex", () => {
    // Os hex do protótipo de reações (#8b5cf6/#c4b5fd, pensados para tema escuro) davam
    // contraste 1,1–1,5:1 no tema claro — a aba ativa ficava MENOS legível que a inativa
    // (6,25:1). Os tokens (bg-primary-soft / text-primary-text) garantem >= 4,5:1 nos
    // dois temas, como o Pill já faz.
    const html = activeTab();

    expect(html).toContain('data-state="active"');
    expect(html).toContain("bg-primary-soft");
    expect(html).toContain("text-primary-text");
    expect(html).toContain("ring-primary/40");
    expect(html).not.toContain("#8b5cf6");
    expect(html).not.toContain("#c4b5fd");
  });

  it("keeps caller classes merged after the base ones", () => {
    expect(activeTab("my-extra-class")).toContain("my-extra-class");
  });
});
