// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { describe, expect, it } from "vitest";

import { SaciHalloweenDuel } from "./saci-halloween-duel.js";

function render(props: { active: boolean; upcoming?: boolean }) {
  const host = document.createElement("div");
  const root = createRoot(host);
  act(() =>
    root.render(
      <SaciHalloweenDuel
        {...props}
        counts={{ saci: 0, halloween: 0 }}
        myChoice={null}
        winner={null}
        onChoose={() => {}}
      />,
    ),
  );
  const text = host.querySelector(".cos-duel__state")?.textContent;
  const disabled = [...host.querySelectorAll("button")].every((button) => button.disabled);
  act(() => root.unmount());
  return { text, disabled };
}

describe("SaciHalloweenDuel", () => {
  it("tells the duel opens later instead of saying it ended", () => {
    expect(render({ active: false, upcoming: true })).toEqual({
      text: "A escolha de times abre no sábado, 31/10.",
      disabled: true,
    });
  });

  it("says the choice ended once the duel closes", () => {
    expect(render({ active: false }).text).toBe("A escolha de times terminou.");
  });
});
