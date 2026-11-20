// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { defaultAdapters } from "./adapters-context.js";

const { appPathOf } = defaultAdapters;

describe("default appPathOf", () => {
  it("returns the path of a URL on the current host", () => {
    expect(appPathOf(`${window.location.origin}/post/2?x=1#c`)).toBe("/post/2?x=1#c");
  });

  it("keeps a relative path", () => {
    expect(appPathOf("/perfil/ana")).toBe("/perfil/ana");
  });

  it("returns null for another host, a lookalike host or a non-path value", () => {
    expect(appPathOf("https://github.com/Rede-ENois")).toBeNull();
    expect(appPathOf(`https://${window.location.host}.evil.com/post/2`)).toBeNull();
    expect(appPathOf("//evil.com/post/2")).toBeNull();
    expect(appPathOf("/\\evil.com/post/2")).toBeNull();
    expect(appPathOf("#secao")).toBeNull();
    expect(appPathOf("mailto:a@b.c")).toBeNull();
  });

  it("returns null when the path alone would point at another site", () => {
    expect(appPathOf(`${window.location.origin}//evil.com/post/2`)).toBeNull();
  });
});
