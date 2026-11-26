// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { PageBackLink } from "./page-back-link.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("PageBackLink", () => {
  let root: Root;
  let host: HTMLDivElement;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  it("é um link de verdade para o destino, com o texto dentro", () => {
    act(() =>
      root.render(
        <PageBackLink href="/perfil/ana">
          <>{"Ir para o perfil"}</>
        </PageBackLink>,
      ),
    );
    const link = host.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/perfil/ana");
    expect(link?.textContent).toBe("Ir para o perfil");
  });
});
