// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import { SandboxedHtmlFrame } from "./sandboxed-html-frame.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const srcDoc = (props: { autoHeight?: boolean; clip?: boolean }) => {
  act(() =>
    root.render(
      <SandboxedHtmlFrame html="<div>capa</div>" title="Capa" theme="light" {...props} />,
    ),
  );
  return container.querySelector("iframe")?.getAttribute("srcdoc") ?? "";
};

describe("SandboxedHtmlFrame height", () => {
  it("hands a fixed height down, so the author's height:100% fills a cover", () => {
    expect(srcDoc({ autoHeight: false })).toContain("html,body{margin:0;height:100%;");
    expect(srcDoc({ clip: true })).toContain("html,body{margin:0;height:100%;");
  });

  it("stretches the first child of body in a fixed-height frame (banner cover)", () => {
    expect(srcDoc({ autoHeight: false })).toContain("body>:first-child{min-height:100%}");
    expect(srcDoc({ clip: true })).toContain("body>:first-child{min-height:100%}");
  });

  it("leaves a frame that grows with its content at its content height", () => {
    expect(srcDoc({})).not.toContain("height:100%");
    expect(srcDoc({})).not.toContain("body>:first-child");
  });
});
