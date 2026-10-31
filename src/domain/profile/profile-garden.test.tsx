// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ProfileGardenStyle } from "../../types/domain/profile/profile-garden-style.js";

import { ProfileGamificationPanel } from "./profile-gamification-panel.js";
import { PROFILE_GARDEN_STYLES, gardenStyleOf } from "./profile-garden-styles.js";
import { ProfileGarden } from "./profile-garden.js";

const grown = { trajectory: 3, relations: 3, contribution: 3, tenure: 3, health: 2 };
const html = (node: React.ReactNode) => renderToStaticMarkup(node);
const label = (markup: string) => /aria-label="([^"]*)"/.exec(markup)?.[1];

describe("ProfileGarden", () => {
  it("describes the style and every part's stage in pt-BR", () => {
    const markup = html(
      <ProfileGarden
        garden={{ trajectory: 2, relations: 0, contribution: 1, tenure: 3, health: 2 }}
        style="cerrado"
      />,
    );

    expect(markup).toContain('role="img"');
    expect(label(markup)).toBe(
      "Jardim do cerrado: árvore jovem, flores em botão, canteiro brotando, gramado cheio.",
    );
  });

  it("names softer colors for lower health, never a dead garden", () => {
    expect(label(html(<ProfileGarden garden={{ ...grown, health: 1 }} />))).toContain(
      "cores suaves",
    );
    expect(label(html(<ProfileGarden garden={{ ...grown, health: 0 }} />))).toContain(
      "cores bem suaves",
    );
    expect(label(html(<ProfileGarden garden={grown} />))).not.toContain("cores");
    expect(html(<ProfileGarden garden={{ ...grown, health: 0 }} />)).toContain("saturate(0.45)");
  });

  it("clamps values out of range instead of breaking", () => {
    const markup = html(
      <ProfileGarden
        garden={{ trajectory: 9, relations: -2, contribution: Number.NaN, tenure: 1.4, health: 7 }}
      />,
    );

    expect(label(markup)).toBe(
      "Jardim do quintal: árvore adulta, flores em botão, canteiro semeado, grama nascendo.",
    );
  });

  it("shows the hint only to the owner, about the weakest part", () => {
    const garden = { trajectory: 2, relations: 2, contribution: 1, tenure: 0, health: 2 };

    expect(html(<ProfileGarden garden={garden} />)).not.toContain("profile-garden__hint");
    expect(html(<ProfileGarden garden={garden} isOwner />)).toContain(
      "Seu gramado fica mais cheio com o tempo de casa.",
    );
    expect(
      html(<ProfileGarden garden={{ ...garden, relations: 1, tenure: 2 }} isOwner />),
    ).toContain("Suas flores abrem quando pessoas novas interagem com você.");
    expect(html(<ProfileGarden garden={grown} isOwner />)).toContain("Seu jardim está no auge.");
  });

  it("draws every style at every stage", () => {
    for (const style of Object.keys(PROFILE_GARDEN_STYLES) as ProfileGardenStyle[]) {
      const shapes = [0, 1, 2, 3].map((stage) => {
        const garden = {
          trajectory: stage,
          relations: stage,
          contribution: stage,
          tenure: stage,
          health: 2,
        };
        const markup = html(<ProfileGarden garden={garden} style={style} />);
        expect(markup, `${style} ${stage}`).toContain("<svg");
        return markup.match(/<(path|circle|rect|ellipse)/g)?.length ?? 0;
      });
      // A seed garden still has something drawn, and the garden only grows from there.
      expect(shapes[0], style).toBeGreaterThan(8);
      expect(shapes[3], style).toBeGreaterThan(shapes[0]);
    }
  });

  it("maps GARDEN item ids to styles, falling back to the backyard", () => {
    expect(gardenStyleOf("garden-mata-atlantica")).toBe("mata-atlantica");
    expect(gardenStyleOf("garden-pampa")).toBe("pampa");
    expect(gardenStyleOf(null)).toBe("quintal");
    expect(gardenStyleOf("garden-futuro")).toBe("quintal");
    expect(gardenStyleOf("moldura-ambar")).toBe("quintal");
  });

  it("sits next to the reputation in the presence panel, replacing the plain bar", () => {
    const props = { isOwner: false, postsCount: 3, walletBalance: null, walletHref: "#" };
    const withGarden = html(
      <ProfileGamificationPanel
        {...props}
        profile={{ reputation: 42 }}
        garden={grown}
        gardenStyle="pampa"
      />,
    );
    const without = html(<ProfileGamificationPanel {...props} profile={{ reputation: 42 }} />);

    expect(withGarden).toContain("Jardim do pampa");
    expect(withGarden).not.toContain("w-2/3");
    expect(without).toContain("w-2/3");
    expect(without).not.toContain("profile-garden");
  });
});

describe("ProfileGarden motion", () => {
  let root: Root;
  let host: HTMLDivElement;
  let reduced = false;
  const animate = vi.fn(() => ({ cancel: vi.fn() }));

  beforeEach(() => {
    reduced = false;
    animate.mockClear();
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({ matches: query.includes("reduce") && reduced })),
    );
    SVGElement.prototype.animate = animate as unknown as SVGElement["animate"];
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    document.documentElement.removeAttribute("data-lite");
    vi.unstubAllGlobals();
  });

  it("grows in once on mount", async () => {
    await act(async () => root.render(<ProfileGarden garden={grown} />));
    await act(async () => root.render(<ProfileGarden garden={grown} isOwner />));

    expect(animate).toHaveBeenCalledTimes(1);
    const [frames, options] = animate.mock.calls[0] as unknown as [
      unknown[],
      { iterations?: number },
    ];
    expect(frames).toHaveLength(2);
    expect(options.iterations).toBeUndefined();
  });

  it("stays still in lite mode", async () => {
    document.documentElement.setAttribute("data-lite", "");
    await act(async () => root.render(<ProfileGarden garden={grown} />));

    expect(animate).not.toHaveBeenCalled();
  });

  it("stays still under prefers-reduced-motion", async () => {
    reduced = true;
    await act(async () => root.render(<ProfileGarden garden={grown} />));

    expect(animate).not.toHaveBeenCalled();
  });
});
