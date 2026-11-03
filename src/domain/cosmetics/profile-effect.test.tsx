// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProfileEffect } from "./profile-effect.js";
import { PROFILE_EFFECTS, profileEffectParticles } from "./profile-effects.js";

describe("ProfileEffect", () => {
  let root: Root;
  let host: HTMLDivElement;
  let reduced = false;
  const animate = vi.fn(() => ({ cancel: vi.fn(), onfinish: null }));

  beforeEach(() => {
    reduced = false;
    animate.mockClear();
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({ matches: query.includes("reduce") && reduced })),
    );
    HTMLElement.prototype.animate = animate as unknown as HTMLElement["animate"];
    host = document.createElement("div");
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    host.remove();
    document.documentElement.removeAttribute("data-lite");
    document.documentElement.removeAttribute("data-force-motion");
    vi.unstubAllGlobals();
  });

  const particles = () => host.querySelectorAll(".cos-fx-layer__particle").length;

  it("plays once on mount, one animation per particle", async () => {
    await act(async () => root.render(<ProfileEffect effect="efeito-morcegos" />));

    expect(particles()).toBe(PROFILE_EFFECTS["efeito-morcegos"].count);
    expect(animate).toHaveBeenCalledTimes(PROFILE_EFFECTS["efeito-morcegos"].count);
  });

  it("plays again when the replay key changes", async () => {
    await act(async () => root.render(<ProfileEffect effect="efeito-correio" replayKey={1} />));
    await act(async () => root.render(<ProfileEffect effect="efeito-correio" replayKey={2} />));

    expect(animate).toHaveBeenCalledTimes(2);
  });

  it("stays still under prefers-reduced-motion", async () => {
    reduced = true;
    await act(async () => root.render(<ProfileEffect effect="efeito-neve" />));

    expect(particles()).toBe(0);
    expect(animate).not.toHaveBeenCalled();
  });

  it("plays under reduced motion when the app forces motion", async () => {
    reduced = true;
    document.documentElement.setAttribute("data-force-motion", "");
    await act(async () => root.render(<ProfileEffect effect="efeito-correio" />));

    expect(animate).toHaveBeenCalledTimes(1);
  });

  it("stays still in lite mode, even with forced motion", async () => {
    document.documentElement.setAttribute("data-lite", "");
    document.documentElement.setAttribute("data-force-motion", "");
    await act(async () => root.render(<ProfileEffect effect="efeito-neve" />));

    expect(particles()).toBe(0);
  });

  it("renders nothing for an unknown effect", async () => {
    await act(async () => root.render(<ProfileEffect effect="efeito-futuro" />));

    expect(particles()).toBe(0);
    expect(animate).not.toHaveBeenCalled();
  });

  it("draws the permanent effects with the Kenney sprites, tinted", async () => {
    await act(async () => root.render(<ProfileEffect effect="efeito-estrelas" />));

    const sprite = host.querySelector<HTMLElement>(".cos-fx-layer__particle span");
    expect(sprite?.getAttribute("style")).toContain("star-01.webp");
    expect(sprite?.getAttribute("style")).toContain("background-color");
  });
});

describe("profileEffectParticles", () => {
  it("melts the snow before it reaches the bottom", () => {
    const [flake] = profileEffectParticles(PROFILE_EFFECTS["efeito-neve"], 300, 400, () => 0.5);

    expect(flake.icon).toBe("floco");
    expect(flake.keyframes.at(-1)).toMatchObject({ opacity: 0 });
    expect(flake.options.fill).toBe("both");
  });

  it("gives the permanent effects a Kenney sprite and a tint instead of an icon", () => {
    const stars = profileEffectParticles(PROFILE_EFFECTS["efeito-estrelas"], 300, 400, () => 0.5);
    const leaves = profileEffectParticles(
      PROFILE_EFFECTS["efeito-folhas-calmas"],
      300,
      400,
      () => 0.5,
    );

    expect(stars[0].sprite).toContain("star-01.webp");
    expect(stars[0].color).toBe("#fbbf24");
    expect(stars[0].icon).toBeUndefined();
    expect(leaves.map((particle) => particle.sprite)).toContainEqual(
      expect.stringContaining("leaf-"),
    );
    expect(leaves.every((particle) => particle.color)).toBe(true);
  });

  it("draws the Boitatá as shrinking dots, one after the other", () => {
    const dots = profileEffectParticles(PROFILE_EFFECTS["efeito-boitata"], 300, 400, Math.random);

    expect(dots).toHaveLength(16);
    expect(dots[0].icon).toBeUndefined();
    expect(dots[1].size).toBeLessThan(dots[0].size);
    expect(dots[1].options.delay).toBeGreaterThan(dots[0].options.delay as number);
  });
});
