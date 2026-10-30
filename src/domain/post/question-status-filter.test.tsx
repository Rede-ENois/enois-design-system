// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";

import { QuestionStatusFilter } from "./question-status-filter.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("QuestionStatusFilter", () => {
  it("marks the current option and reports the clicked one", () => {
    const onChange = vi.fn();
    const host = document.createElement("div");
    const root = createRoot(host);
    act(() => root.render(<QuestionStatusFilter value="open" onChange={onChange} />));

    expect(host.querySelector('[role="group"]')?.getAttribute("aria-label")).toBe(
      "Filtrar perguntas",
    );
    const buttons = [...host.querySelectorAll("button")];
    expect(buttons.map((button) => button.textContent)).toEqual(["Todas", "Abertas", "Resolvidas"]);
    expect(buttons.map((button) => button.getAttribute("aria-pressed"))).toEqual([
      "false",
      "true",
      "false",
    ]);

    act(() => buttons[2].click());
    expect(onChange).toHaveBeenCalledWith("resolved");
    act(() => root.unmount());
  });
});
