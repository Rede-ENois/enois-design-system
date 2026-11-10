// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ANIMATED_FRAMES, isFxFrame } from "../avatar-frames.js";
import { UserAvatar } from "../user-avatar.js";

const css = readFileSync("src/styles.css", "utf8");
const frameCss = css.slice(
  css.indexOf('[data-avatar-frame="moldura-ambar"]'),
  css.indexOf("/* ── Scrollbar"),
);

describe("Moldura Lacraia", () => {
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
    document.documentElement.removeAttribute("data-lite");
  });

  function render(wrapperClass = "") {
    host.className = wrapperClass;
    host.innerHTML = renderToStaticMarkup(<UserAvatar frame="moldura-lacraia" alt="Ana" />);
    return {
      avatar: host.querySelector("[data-avatar-frame]")!,
      crawl: host.querySelector(".moldura-lacraia__crawl")!,
      still: host.querySelector(".moldura-lacraia__still")!,
    };
  }

  function shows(element: Element) {
    const style = getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  }

  it("é uma moldura animada com efeito, feita de duas imagens decorativas", () => {
    expect(isFxFrame("moldura-lacraia")).toBe(true);
    expect(ANIMATED_FRAMES).toContain("moldura-lacraia");
    render();
    expect(host.querySelector(".moldura-fx")!.getAttribute("aria-hidden")).toBe("true");
    const images = [...host.querySelectorAll("img")].filter((image) =>
      image.closest(".moldura-lacraia"),
    );
    expect(images).toHaveLength(2);
    expect(
      images.every((image) => image.alt === "" && image.getAttribute("loading") === "lazy"),
    ).toBe(true);
  });

  it("parada mostra só o quadro estático; animando, toca o loop no lugar dele", () => {
    const { avatar, crawl, still } = render();
    expect(shows(still)).toBe(true);
    expect(shows(crawl)).toBe(false);
    avatar.setAttribute("data-avatar-animating", "");
    expect(shows(crawl)).toBe(true);
    expect(shows(still)).toBe(false);
  });

  it("na vitrine parada da loja e no modo lite volta ao quadro estático mesmo animando", () => {
    const shop = render("cos-still");
    shop.avatar.setAttribute("data-avatar-animating", "");
    expect(shows(shop.crawl)).toBe(false);
    expect(shows(shop.still)).toBe(true);

    document.documentElement.setAttribute("data-lite", "");
    const lite = render();
    lite.avatar.setAttribute("data-avatar-animating", "");
    expect(shows(lite.crawl)).toBe(false);
    expect(shows(lite.still)).toBe(true);
  });

  it("com movimento reduzido o loop dá lugar ao quadro estático", () => {
    const { avatar, crawl, still } = render();
    avatar.setAttribute("data-avatar-animating", "");
    // O jsdom não aplica media queries: conferimos as regras do bloco real contra os elementos.
    const reduced = [...styles.sheet!.cssRules]
      .filter(
        (rule): rule is CSSMediaRule =>
          rule instanceof CSSMediaRule && rule.conditionText === "(prefers-reduced-motion: reduce)",
      )
      .flatMap((rule) => [...rule.cssRules])
      .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule);
    expect(
      reduced.some((rule) => crawl.matches(rule.selectorText) && rule.style.display === "none"),
    ).toBe(true);
    expect(
      reduced.some(
        (rule) => still.matches(rule.selectorText) && rule.style.visibility === "visible",
      ),
    ).toBe(true);
  });
});
