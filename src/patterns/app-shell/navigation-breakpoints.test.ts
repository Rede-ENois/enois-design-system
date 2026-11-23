import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Authenticated navigation has a single boundary: 1024px (lg). Below it the menu button and
 * drawer apply; from it on, the sidebar. When the button disappeared at `md` (768px) while the
 * sidebar only appeared at `lg`, the 768–1023px range had no navigation at all.
 */
function source(path: string): string {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("authenticated navigation breakpoint", () => {
  it("keeps the menu button on tablets and hides it only on desktop", () => {
    const header = source("src/domain/shell/authenticated-app-header.tsx");
    const button = header.match(/<button[\s\S]*?aria-label=\{messages\.openMenu\}/)?.[0] ?? "";
    // Classes montadas numa funcao para o `order` do celular: vale o que o arquivo declara.
    const classes = button + (header.match(/function menuButtonClassName[\s\S]*?\n\}/)?.[0] ?? "");
    expect(classes).toContain("lg:hidden");
    expect(classes).not.toContain("md:hidden");
  });

  it("hides the drawer overlay and panel with the menu button", () => {
    const drawer = source("src/patterns/app-shell/navigation-drawer.tsx");
    expect(drawer).not.toContain("md:hidden");
    expect(drawer.match(/lg:hidden/g)).toHaveLength(2);
  });

  it("shows the sidebar only on desktop, never over the drawer", () => {
    const sidebar = source("src/patterns/app-shell/app-sidebar.tsx");
    expect(sidebar).toContain("lg:block");
    expect(sidebar).not.toContain("md:block");
  });
});
