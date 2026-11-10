import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AuthenticatedAppHeader } from "./authenticated-app-header.js";

const html = (navigationHasNews?: boolean) =>
  renderToStaticMarkup(
    <AuthenticatedAppHeader
      homeHref="/feed"
      onOpenNavigation={() => {}}
      navigationHasNews={navigationHasNews}
      search={null}
      actions={null}
    />,
  );

describe("AuthenticatedAppHeader", () => {
  it("puts the news dot on the menu button only when the menu has news", () => {
    expect(html(true)).toContain("Tem novidade");
    expect(html()).not.toContain("Tem novidade");
  });
});
