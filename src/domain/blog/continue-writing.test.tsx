// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ContinueWriting } from "./continue-writing.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const DRAFTS = [
  { id: "draft_1", title: "Ensaio sobre redes", updatedAtLabel: "16/11/2026 10:00" },
  { id: "draft_2", title: "  ", updatedAtLabel: "15/11/2026 09:00" },
];

function mount(props = {}) {
  const host = document.createElement("div");
  document.body.appendChild(host);
  const root = createRoot(host);
  const spun = (
    <ContinueWriting
      drafts={DRAFTS}
      resumeHref={(id) => `/blog/post/new?rascunho=${id}`}
      onDiscard={() => {}}
      {...props}
    />
  );
  act(() => root.render(spun));
  return { host, root };
}

describe("ContinueWriting", () => {
  afterEach(() => document.body.replaceChildren());

  it("lists each draft with its title and the resume link", () => {
    const { host } = mount();
    expect(host.textContent).toContain("Continuar escrevendo");
    expect(host.textContent).toContain("Ensaio sobre redes");
    const link = host.querySelector("a");
    expect(link?.getAttribute("href")).toBe("/blog/post/new?rascunho=draft_1");
  });

  it("falls back to the untitled label for a blank title", () => {
    const { host } = mount();
    expect(host.textContent).toContain("Sem título");
  });

  it("reports the resume intent with the draft id", () => {
    const onDiscard = vi.fn();
    const { host } = mount({ onDiscard });
    const buttons = [...host.querySelectorAll("button")];
    const excluir = buttons.find((b) => b.textContent === "Excluir");
    act(() => excluir!.click());
    expect(onDiscard).toHaveBeenCalledWith("draft_1");
  });

  it("renders nothing when there are no drafts", () => {
    const { host } = mount({ drafts: [] });
    expect(host.textContent).toBe("");
  });
});
