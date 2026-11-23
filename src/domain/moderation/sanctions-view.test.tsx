// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import * as domain from "../index.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("SanctionsView", () => {
  it("exporta a view pública e distingue vazio de carregamento e erro", () => {
    expect(domain).toHaveProperty("SanctionsView");
    act(() =>
      root.render(
        <domain.SanctionsView
          mode="history"
          sanctions={[]}
          appeals={[]}
          now={Date.parse("2026-11-14T12:00:00Z")}
          loading={false}
          error={false}
          refreshing={false}
          appealMessage=""
          onAppealMessageChange={() => {}}
          onAppeal={() => {}}
          appealSubmitting={false}
          appealError={false}
          onRetry={() => {}}
        />,
      ),
    );
    expect(host.textContent).toContain("Nenhuma penalidade encontrada.");
    expect(host.textContent).not.toContain("Não foi possível");
  });
});
