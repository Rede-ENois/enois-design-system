// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import { SpoilerMedia } from "../domain/post/media/spoiler-media.js";

import { SpoilerPreferenceContext } from "./spoiler-preference.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const midiaVelada = (
  <SpoilerMedia active label="Mostrar mídia">
    {() => <img alt="foto" />}
  </SpoilerMedia>
);

describe("a preferência de mídia sensível", () => {
  it("sem preferência, o véu fica: rótulo de revelar na frente da mídia", () => {
    act(() => root.render(midiaVelada));
    expect(container.querySelector("button")?.getAttribute("aria-label")).toBe("Mostrar mídia");
    expect(container.querySelector("img")).toBeTruthy();
  });

  it("com a preferência ligada, a mídia sensível nasce revelada, sem véu nem botão", () => {
    act(() =>
      root.render(
        <SpoilerPreferenceContext value={true}>
          <SpoilerMedia active label="Mostrar mídia">
            {() => <img alt="foto" />}
          </SpoilerMedia>
        </SpoilerPreferenceContext>,
      ),
    );
    expect(container.querySelector("button")).toBeNull();
    expect(container.querySelector("img")).toBeTruthy();
  });

  it("a preferência não faz nada em mídia que não é sensível", () => {
    act(() =>
      root.render(
        <SpoilerPreferenceContext value={true}>
          <SpoilerMedia active={false} label="Mostrar mídia">
            {() => <img alt="foto" />}
          </SpoilerMedia>
        </SpoilerPreferenceContext>,
      ),
    );
    expect(container.querySelector("button")).toBeNull();
  });
});
