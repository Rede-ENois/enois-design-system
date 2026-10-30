// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";

import { CaughtUpDivider } from "./caught-up-divider.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("CaughtUpDivider", () => {
  it("is an accessible separator with the caught up copy", () => {
    const container = document.createElement("div");
    act(() => createRoot(container).render(<CaughtUpDivider />));

    const separator = container.querySelector('[role="separator"]')!;
    expect(separator.getAttribute("aria-label")).toBe(
      "Você está em dia. Abaixo, posts que você já viu.",
    );
    expect(separator.textContent).toContain("Você está em dia");
  });
});
