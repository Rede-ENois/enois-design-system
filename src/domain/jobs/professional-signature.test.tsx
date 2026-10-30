// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import { ProfessionalSignature } from "./professional-signature.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

describe("ProfessionalSignature", () => {
  it("says which professional identity sends it", () => {
    act(() =>
      root.render(
        <ProfessionalSignature
          identity={{ name: "Mel Santos", username: "mel.pro" }}
          setupHref="/x"
        />,
      ),
    );
    expect(container.textContent).toContain("Mel Santos");
    expect(container.textContent).toContain("@mel.pro");
    expect(container.querySelector("a")).toBeNull();
  });

  it("without an active profile, leads to set it up", () => {
    act(() => root.render(<ProfessionalSignature identity={null} setupHref="/profissional" />));
    expect(container.querySelector('a[href="/profissional"]')).not.toBeNull();
  });

  it("renders nothing when there is neither", () => {
    act(() => root.render(<ProfessionalSignature identity={null} setupHref={null} />));
    expect(container.textContent).toBe("");
  });
});
