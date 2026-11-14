// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, expect, it } from "vitest";

import { SanctionsView } from "../index.js";

let root: Root;
let host: HTMLDivElement;
beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

it("não apresenta prazo de recurso em andamento nem ameaça de banimento para sanção removida", () => {
  act(() =>
    root.render(
      <SanctionsView
        mode="history"
        sanctions={[
          {
            id: "sanc_sintetica",
            type: "SUSPENDED",
            status: "REMOVED",
            reason: "Decisão sintética revogada",
            createdAt: "2026-01-01T11:00:00Z",
            deadline: { kind: "APPEAL", at: "2026-01-08T11:00:00Z" },
            evidence: { kind: "UNAVAILABLE", text: null },
            canAppeal: false,
          },
        ]}
        appeals={[]}
        now={Date.parse("2026-01-02T12:00:00Z")}
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
  expect(host.textContent).toContain("Removida");
  expect(host.textContent).not.toContain("Prazo para recorrer");
  expect(host.textContent).not.toContain("pode resultar em banimento");
});
