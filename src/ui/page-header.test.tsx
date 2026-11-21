// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import { PageHeader } from "./page-header.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

describe("PageHeader", () => {
  it("separa o cartao do titulo do elemento que vem depois dele", () => {
    act(() =>
      root.render(
        <PageHeader title="Blogs">
          <p>conteudo</p>
        </PageHeader>,
      ),
    );

    const header = container.querySelector("header");
    expect(header).not.toBeNull();
    const classes = header?.className.split(/\s+/) ?? [];
    // A tela que empilha os blocos sem `space-y`/`gap` no pai dependia desta margem para nao colar
    // o proximo elemento no cartao.
    expect(classes).toContain("mb-4");
    expect(classes).toContain("surface-card");
  });
});
