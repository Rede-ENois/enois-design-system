// @vitest-environment jsdom
import { type ComponentProps, act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ComposerCrossPost } from "./composer-cross-post.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function mount(props: ComponentProps<typeof ComposerCrossPost>) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  act(() => root.render(<ComposerCrossPost {...props} />));
  return container;
}

afterEach(() => {
  document.body.replaceChildren();
});

describe("ComposerCrossPost", () => {
  it("offers the professional feed, ticked, and reports the new state", () => {
    const onChange = vi.fn();
    const container = mount({ checked: true, onChange });

    const box = container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    expect(box.checked).toBe(true);
    expect(container.textContent).toContain("Publicar também no feed profissional");
    expect(container.textContent).toContain("assinada pelo seu perfil profissional");

    act(() => box.click());
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("explains the type instead of offering it, and still shows a publish error", () => {
    const container = mount({
      checked: false,
      onChange: () => {},
      unavailableReason: "Use um tipo profissional.",
      error: "Você precisa de um perfil profissional ativo.",
    });

    expect(container.querySelector('input[type="checkbox"]')).toBeNull();
    expect(container.textContent).toContain("Use um tipo profissional.");
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      "perfil profissional ativo",
    );
  });
});
