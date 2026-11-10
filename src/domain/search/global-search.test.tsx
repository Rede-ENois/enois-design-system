// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import { EnoisProvider } from "../../messages/enois-provider.js";

import { GlobalSearch } from "./global-search.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const header = document.createElement("header");
// O cabeçalho do app pinta com `backdrop-blur-md`: um ancestral filtrado vira bloco de
// contenção de descendentes `position: fixed`.
header.style.backdropFilter = "blur(12px)";
const container = document.createElement("div");
header.append(container);
document.body.append(header);
const root = createRoot(container);

const openSearch = () =>
  act(() => {
    const button = container.querySelector("button[aria-label]");
    button!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

const overlay = () => document.querySelector("body > div.fixed.inset-0");

afterEach(() => {
  act(() => root.render(null));
});

describe("GlobalSearch no celular", () => {
  it("monta o overlay em <body>, fora do cabeçalho com backdrop-filter", () => {
    act(() =>
      root.render(
        <EnoisProvider>
          <GlobalSearch
            results={[]}
            isFetching={false}
            onQueryChange={() => {}}
            onSelect={() => {}}
          />
        </EnoisProvider>,
      ),
    );
    openSearch();

    const panel = overlay();
    expect(panel).not.toBeNull();
    // Dentro do cabeçalho, `fixed inset-0` ficaria preso aos 57px do cabeçalho em vez de cobrir
    // a tela inteira — foi o defeito visto no celular.
    expect(panel!.parentElement).toBe(document.body);
  });
});
