// @vitest-environment node
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CATALOG_LOOKS } from "./cosmetic-catalog.fixture.js";
import { LookScene } from "./look-scene.js";
import { LOOK_SCENES } from "./look-scenes.js";

const lookIds = new Set(CATALOG_LOOKS.map((look) => look.id));

/** Every file a scene points at, as a path on disk (the `new URL(..., import.meta.url)` href). */
const srcOf = (value: string): string =>
  value.startsWith("file:") ? fileURLToPath(value) : decodeURIComponent(new URL(value).pathname);

describe("look scenes", () => {
  it("draws a scene for every ready-made look, without a stray key", () => {
    // Toda look pronta tem cena: o catálogo e o mapa andam juntos, sem id inventado.
    expect([...Object.keys(LOOK_SCENES)].sort()).toEqual([...lookIds].sort());
  });

  it("points at Kenney sprites that exist in the repository", () => {
    const srcs = new Set(Object.values(LOOK_SCENES).flatMap((scene) => scene.map((s) => s.src)));
    expect(srcs.size).toBeGreaterThan(8);

    for (const src of srcs) {
      expect(existsSync(srcOf(src)), src).toBe(true);
      expect(src).toContain("/kenney/");
    }
  });

  it("keeps each sprite inside the card with a visible color", () => {
    for (const [lookId, scene] of Object.entries(LOOK_SCENES)) {
      for (const sprite of scene) {
        expect(sprite.size, lookId).toBeGreaterThan(0);
        expect(sprite.x, lookId).toBeGreaterThanOrEqual(0);
        expect(sprite.y, lookId).toBeGreaterThanOrEqual(0);
        // Um sprite que começa fora da caixa nunca aparece; o que passa do fim é cortado pela cena.
        expect(sprite.x, lookId).toBeLessThan(100);
        expect(sprite.y, lookId).toBeLessThan(100);
        expect(sprite.color, lookId).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  it("paints the scene as tinted sprites behind the card content", () => {
    const html = renderToStaticMarkup(<LookScene lookId="look-jardim" />);
    const masks = html.match(/<mask /g)?.length;

    expect(masks).toBe(LOOK_SCENES["look-jardim"].length);
    expect(html).toContain('class="cos-look__scene"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('fill="#f472b6"');
    expect(html).toContain('mask="url(#');
  });

  it("draws nothing for a look without a scene", () => {
    expect(renderToStaticMarkup(<LookScene lookId="look-que-nao-existe" />)).toBe("");
  });
});
