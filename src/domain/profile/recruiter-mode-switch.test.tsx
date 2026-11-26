// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { RecruiterModeSwitch } from "./recruiter-mode-switch.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

describe("RecruiterModeSwitch", () => {
  it("is labelled, explains itself and turns the mode on", () => {
    const onChange = vi.fn();
    act(() => root.render(<RecruiterModeSwitch value={false} onChange={onChange} />));

    const toggle = container.querySelector<HTMLButtonElement>('[role="switch"]')!;
    expect(container.querySelector(`label[for="${toggle.id}"]`)!.textContent).toBe(
      "Sou recrutador",
    );
    expect(toggle.getAttribute("aria-describedby")).toBe(container.querySelector("p")!.id);
    expect(toggle.getAttribute("aria-checked")).toBe("false");

    act(() => toggle.click());
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("holds still while saving", () => {
    const onChange = vi.fn();
    act(() => root.render(<RecruiterModeSwitch value onChange={onChange} pending />));

    const toggle = container.querySelector<HTMLButtonElement>('[role="switch"]')!;
    expect(toggle.disabled).toBe(true);
    expect(toggle.getAttribute("aria-busy")).toBe("true");
  });
});
