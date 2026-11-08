// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ANIMATED_FRAMES, isFxFrame } from "../avatar-frames.js";
import { UserAvatar } from "../user-avatar.js";

const FRAMES = ["moldura-caixao", "moldura-bruxa", "moldura-lanterna", "moldura-uivo"];

const css = readFileSync("src/styles.css", "utf8");
const frameCss = css.slice(
  css.indexOf('[data-avatar-frame="moldura-ambar"]'),
  css.indexOf("/* ── Scrollbar"),
);

describe("Molduras de Halloween", () => {
  let host: HTMLDivElement;
  let styles: HTMLStyleElement;

  beforeEach(() => {
    host = document.createElement("div");
    styles = document.createElement("style");
    styles.textContent = frameCss;
    document.head.append(styles);
    document.body.append(host);
  });

  afterEach(() => {
    host.remove();
    styles.remove();
  });

  it.each(FRAMES)(
    "%s: é uma moldura animada com efeito, fora da árvore de acessibilidade",
    (frame) => {
      expect(isFxFrame(frame)).toBe(true);
      expect(ANIMATED_FRAMES).toContain(frame);
      host.innerHTML = renderToStaticMarkup(<UserAvatar frame={frame} alt="Ana" />);
      const fx = host.querySelector(".moldura-fx")!;
      expect(fx.getAttribute("aria-hidden")).toBe("true");
      expect(fx.querySelector("svg")).not.toBeNull();
    },
  );

  // Movimento reduzido e modo lite mostram a pose de repouso: só as partículas podem sumir.
  it.each(FRAMES)("%s: parada, nenhuma parte do desenho fica escondida", (frame) => {
    host.innerHTML = renderToStaticMarkup(<UserAvatar frame={frame} />);
    const hidden = [...host.querySelectorAll(".moldura-fx *")].filter((element) => {
      if (element.closest(".moldura-fx__particula")) return false;
      const style = getComputedStyle(element);
      return style.opacity === "0" || style.display === "none";
    });
    expect(hidden).toEqual([]);
  });

  it("o caixão repousa com a tampa aberta, para a foto aparecer sem animação", () => {
    host.innerHTML = renderToStaticMarkup(<UserAvatar frame="moldura-caixao" />);
    const lid = host.querySelector(".moldura-caixao__lid")!;
    expect(getComputedStyle(lid).transform).toBe("rotateY(-96deg)");
    expect(lid.querySelectorAll(".moldura-caixao__face")).toHaveLength(2);
    expect(css).toMatch(
      /@keyframes moldura-caixao-lid \{\s*0%,[^{]*\{\s*transform: rotateY\(0deg\)/,
    );
  });
});
