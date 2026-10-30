// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContextSwitcher } from "./context-switcher.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const buttons = () => Array.from(container.querySelectorAll("button"));

describe("ContextSwitcher", () => {
  it("marks the active interface and asks for the other one", () => {
    const onChange = vi.fn();
    act(() => root.render(<ContextSwitcher value="SOCIAL" onChange={onChange} />));

    const [social, professional] = buttons();
    expect(social.getAttribute("aria-pressed")).toBe("true");
    expect(professional.getAttribute("aria-pressed")).toBe("false");

    act(() => professional.click());
    expect(onChange).toHaveBeenCalledWith("PROFESSIONAL");

    // Choosing the interface that is already active does nothing.
    act(() => social.click());
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("offers to set up the professional identity only inside the professional interface", () => {
    act(() =>
      root.render(
        <ContextSwitcher
          value="SOCIAL"
          onChange={() => {}}
          professionalSetupHref="/profissional"
        />,
      ),
    );
    expect(container.querySelector('a[href="/profissional"]')).toBeNull();

    act(() =>
      root.render(
        <ContextSwitcher
          value="PROFESSIONAL"
          onChange={() => {}}
          professionalSetupHref="/profissional"
        />,
      ),
    );
    expect(container.querySelector('a[href="/profissional"]')?.textContent).toContain(
      "Ative seu perfil profissional",
    );
  });

  it("collapses to one labelled button that swaps the interface", () => {
    const onChange = vi.fn();
    act(() => root.render(<ContextSwitcher value="PROFESSIONAL" onChange={onChange} collapsed />));

    const [only] = buttons();
    expect(buttons()).toHaveLength(1);
    expect(only.getAttribute("aria-label")).toContain("Profissional");

    act(() => only.click());
    expect(onChange).toHaveBeenCalledWith("SOCIAL");
  });
});
