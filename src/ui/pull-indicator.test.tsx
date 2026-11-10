import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PullIndicator } from "./pull-indicator.js";

describe("PullIndicator", () => {
  it("acompanha o dedo e gira proporcionalmente ao arrasto", () => {
    const html = renderToStaticMarkup(<PullIndicator pull={35} trigger={70} />);

    expect(html).toContain("--pull:35px");
    expect(html).toContain("--pull-turn:180deg");
    expect(html).not.toContain("animate-spin");
    expect(html).toContain('aria-hidden="true"');
  });

  it("passando do limite gira continuamente e o arrasto para de crescer", () => {
    const atTrigger = renderToStaticMarkup(<PullIndicator pull={70} trigger={70} />);
    const beyond = renderToStaticMarkup(<PullIndicator pull={130} trigger={70} />);

    expect(atTrigger).toContain("animate-spin");
    // Teto do deslocamento (trigger * 1.2 = 84): o ponto não acompanha o dedo para sempre.
    expect(beyond).toContain("--pull:84px");
    expect(beyond).toContain("animate-spin");
  });

  it("sem arrasto fica parado no lugar", () => {
    const html = renderToStaticMarkup(<PullIndicator pull={0} trigger={70} />);

    expect(html).toContain("--pull:0px");
    expect(html).toContain("--pull-turn:0deg");
  });
});
