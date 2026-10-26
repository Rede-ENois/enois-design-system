import { describe, expect, it } from "vitest";

import { defaultMessages } from "./default-messages.js";
import { mergeMessages } from "./merge-messages.js";

describe("mergeMessages", () => {
  it("returns the pt-BR defaults without overrides", () => {
    expect(mergeMessages()).toEqual(defaultMessages);
  });

  it("replaces only the overridden keys of a component", () => {
    const merged = mergeMessages({ passwordInput: { show: "Show password" } });

    expect(merged.passwordInput).toEqual({ show: "Show password", hide: "Ocultar senha" });
    expect(merged.dialog).toEqual(defaultMessages.dialog);
  });
});
