import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ComposerLauncher } from "./composer-launcher.js";

describe("ComposerLauncher", () => {
  it("is a single line that opens the composer, with media only when offered", () => {
    const withMedia = renderToStaticMarkup(
      <ComposerLauncher avatar={null} name="Ana" onOpen={() => {}} onAddMedia={() => {}} />,
    );
    const plain = renderToStaticMarkup(
      <ComposerLauncher avatar={null} name="Ana" onOpen={() => {}} />,
    );

    expect(withMedia).toContain("Começar publicação");
    expect(withMedia).toContain('aria-label="Adicionar foto ou vídeo"');
    expect(plain).not.toContain("Adicionar foto ou vídeo");
  });
});
