// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BirthdaySeal } from "./birthday-seal.js";

describe("BirthdaySeal", () => {
  it("shows the visible label next to the name", () => {
    const html = renderToStaticMarkup(<BirthdaySeal />);

    expect(html).toContain("Aniversariante");
    expect(html).toContain("🎂");
  });

  it("carries the explanation as a tooltip for the curious hover", () => {
    expect(renderToStaticMarkup(<BirthdaySeal />)).toContain("Hoje é o aniversário desta pessoa");
  });

  it("keeps its own color, not the profile contributor color", () => {
    expect(renderToStaticMarkup(<BirthdaySeal />)).toContain("text-signal-love");
  });
});
