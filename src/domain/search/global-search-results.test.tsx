import { Wallet } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { GlobalSearchResults } from "./global-search-results.js";

describe("GlobalSearchResults", () => {
  it("draws a feature as a colored place, not as a person", () => {
    const html = renderToStaticMarkup(
      <GlobalSearchResults
        query="car"
        isFetching={false}
        onSelect={() => {}}
        items={[
          {
            id: "carteira",
            type: "feature",
            title: "Carteira",
            subtitle: "Faíscas",
            image: null,
            href: "/carteira",
            icon: Wallet,
            color: "var(--table-6)",
          },
        ]}
      />,
    );
    expect(html).toContain("rounded-[34%]");
    expect(html).toContain("var(--table-6)");
  });
});
