// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ProfileCityPrivacy } from "./profile-city-privacy.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

describe("ProfileCityPrivacy", () => {
  it("is labelled and turns the city on", () => {
    const onChange = vi.fn();
    act(() => root.render(<ProfileCityPrivacy value={false} onChange={onChange} />));

    const toggle = container.querySelector<HTMLButtonElement>('[role="switch"]')!;
    expect(container.querySelector(`label[for="${toggle.id}"]`)!.textContent).toBe(
      "Mostrar minha cidade no perfil",
    );
    expect(toggle.getAttribute("aria-checked")).toBe("false");

    act(() => toggle.click());
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("holds still while saving", () => {
    const onChange = vi.fn();
    act(() => root.render(<ProfileCityPrivacy value onChange={onChange} pending />));

    const toggle = container.querySelector<HTMLButtonElement>('[role="switch"]')!;
    expect(toggle.disabled).toBe(true);
    expect(toggle.getAttribute("aria-busy")).toBe("true");
  });
});
