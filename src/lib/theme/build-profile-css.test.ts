import { describe, expect, it } from "vitest";

import { EMPTY_PROFILE_LOOK, type ProfileLook } from "../../types/lib/theme/profile-look.js";

import { buildProfileCss, themeCollectionById } from "./build-profile-css.js";
import { THEME_COLLECTIONS } from "./theme-collections.js";

/** Declarações de `property` nas regras cujo seletor inclui o container puro, em ordem. */
function containerDeclarations(css: string, id: string, property: string): string[] {
  const container = `[data-profile-theme="${id}"]`;
  const values: string[] = [];
  for (const [, selectors, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!selectors.split(",").some((selector) => selector.trim() === container)) continue;
    for (const [, value] of body.matchAll(new RegExp(`(?:^|;)\\s*${property}:\\s*([^;]+)`, "g"))) {
      values.push(value.trim());
    }
  }
  return values;
}

const ARCADE = themeCollectionById("arcade-8bit")!;

function look(overrides: Partial<ProfileLook> = {}): ProfileLook {
  return { ...EMPTY_PROFILE_LOOK, theme: "arcade-8bit", ...overrides };
}

describe("buildProfileCss", () => {
  it("põe os tokens no container, nunca no html", () => {
    const css = buildProfileCss(ARCADE, look(), "light");

    expect(css).toContain(`[data-profile-theme="arcade-8bit"] {`);
    expect(css).toContain("--primary:");
    expect(css).not.toContain("html:root");
  });

  it("reescreve o CSS estrutural do preset para o container", () => {
    const css = buildProfileCss(ARCADE, look(), "light");

    expect(css).toContain(`[data-profile-theme="arcade-8bit"] .surface-card`);
    expect(css).not.toContain(`html:root[data-theme="arcade-8bit"]`);
  });

  it("usa os tokens do modo escuro quando o app está escuro", () => {
    const dual = themeCollectionById("intersection")!;
    const light = buildProfileCss(dual, { ...EMPTY_PROFILE_LOOK, theme: dual.id }, "light");
    const dark = buildProfileCss(dual, { ...EMPTY_PROFILE_LOOK, theme: dual.id }, "dark");

    expect(dark).not.toBe(light);
    expect(dark).toContain("--foreground:");
  });

  it("troca a tipografia quando a pessoa escolhe outra família", () => {
    const serif = buildProfileCss(ARCADE, look({ font: "serif" }), "light");

    expect(serif).toContain("Georgia");
    expect(buildProfileCss(ARCADE, look(), "light")).not.toContain("Georgia");
  });

  it("aplica a cor escolhida no destaque sem mexer nas superfícies do preset", () => {
    const base = buildProfileCss(ARCADE, look(), "light");
    const tinted = buildProfileCss(ARCADE, look({ accent: "#ff00aa" }), "light");

    expect(tinted).not.toBe(base);
    expect(tinted).toContain("--primary:");
    expect(tinted).toContain("--ring:");
    expect(tinted).not.toContain("--card: #ff00aa");
  });

  it("traduz cantos retos, texturas desligadas, cabeçalho e decoração", () => {
    const css = buildProfileCss(
      ARCADE,
      look({ borders: "square", textures: false, header: "solid", decoration: 2 }),
      "light",
    );

    expect(css).toContain("--radius: 0px;");
    expect(css).toContain("background-image: none;");
    expect(css).toContain(".cos-card__banner::after");
    expect(css).toContain("--profile-decoration: 0.8;");
  });

  it("texturas desligadas tiram o padrão do fundo da vitrine em todos os temas", () => {
    for (const collection of THEME_COLLECTIONS) {
      for (const mode of ["light", "dark"] as const) {
        const css = buildProfileCss(
          collection,
          look({ theme: collection.id, textures: false }),
          mode,
        );
        const images = containerDeclarations(css, collection.id, "background-image");
        const shorthands = containerDeclarations(css, collection.id, "background");

        expect(images.at(-1) ?? "none", `${collection.id} (${mode})`).toBe("none");
        expect(
          shorthands.filter((value) => value.includes("gradient")),
          collection.id,
        ).toEqual([]);
        // A última cor declarada é a que vale; `var(--background)` só serve se o token for sólido.
        const tokens =
          mode === "dark"
            ? (collection.tokens.dark ?? collection.tokens.light)
            : collection.tokens.light;
        const color = containerDeclarations(css, collection.id, "background-color").at(-1) ?? "";
        const resolved = color === "var(--background)" ? (tokens["--background"] ?? "") : color;
        expect(resolved, `${collection.id} (${mode}) sem cor sólida`).not.toContain("gradient");
      }
    }
  });

  it("fundo em gradiente ganha uma cor sólida por baixo", () => {
    const css = buildProfileCss(ARCADE, look(), "light");

    expect(containerDeclarations(css, "arcade-8bit", "background-color")).toContain("#0a0612");
    expect(containerDeclarations(css, "arcade-8bit", "background-image").at(-1)).toContain(
      "gradient",
    );
  });

  it("sem nível escolhido, a moldura fica discreta", () => {
    const css = buildProfileCss(ARCADE, look(), "light");

    expect(css).toContain("--profile-decoration: 0.35;");
  });

  it("só devolve tema do catálogo fixo", () => {
    expect(themeCollectionById("arcade-8bit")).not.toBeNull();
    expect(themeCollectionById("tema-inventado")).toBeNull();
    expect(themeCollectionById(null)).toBeNull();
  });
});
