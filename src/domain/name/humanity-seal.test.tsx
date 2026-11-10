// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { HumanitySeal } from "./humanity-seal.js";

describe("HumanitySeal", () => {
  it("keeps the label readable for screen readers in the inline variant", () => {
    const html = renderToStaticMarkup(<HumanitySeal />);

    expect(html).toContain("Humanidade Comprovada");
    expect(html).toContain("sr-only");
    expect(html).toContain('aria-hidden="true"');
  });

  it("carries the official description as the tooltip", () => {
    expect(renderToStaticMarkup(<HumanitySeal />)).toContain(
      "processo de verificação de identidade realizado por um provedor especializado",
    );
  });

  it("shows the label visibly in the profile variant", () => {
    const html = renderToStaticMarkup(<HumanitySeal variant="full" />);

    expect(html).toContain("Humanidade Comprovada");
    expect(html).not.toContain("sr-only");
  });
});
