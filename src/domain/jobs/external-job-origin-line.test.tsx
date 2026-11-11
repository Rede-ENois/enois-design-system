// @vitest-environment jsdom
import { act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";

import type { ExternalJobOriginLineProps } from "../../types/domain/jobs/external-job-origin-line-props.js";
import type { ExternalJobOrigin } from "../../types/domain/jobs/external-job-origin.js";

import { ExternalJobOriginLine } from "./external-job-origin-line.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => {
  act(() => root.render(null));
});

const now = new Date("2026-11-10T12:00:00Z");

const origin: ExternalJobOrigin = {
  platform: "Adzuna",
  sourceUrl: "https://adzuna.com.br/vaga/123",
  publishedAt: "2026-11-03T09:00:00Z",
  lastSeenAt: "2026-11-08T12:00:00Z",
  removedAt: null,
  expiresAt: null,
};

function render(props: Partial<ExternalJobOriginLineProps> = {}) {
  act(() => root.render(<ExternalJobOriginLine origin={origin} now={now} {...props} />));
}

describe("ExternalJobOriginLine", () => {
  it("shows where the job came from", () => {
    render();
    expect(container.textContent).toContain("Vaga externa · Adzuna");
  });

  it("shows the publication date the source informed", () => {
    render();
    expect(container.textContent).toContain("Publicada em 3 de novembro de 2026");
  });

  it("says the source does not inform the date instead of guessing one", () => {
    render({ origin: { ...origin, publishedAt: null } });
    expect(container.textContent).toContain("A fonte não informa a data de publicação");
  });

  it("reports the last verification relative to now, not the publication", () => {
    render();
    expect(container.textContent).toContain("Verificada na fonte há 2 dias");
    expect(container.textContent).not.toContain("Publicada em há");
  });

  it("falls back honestly when the job was never verified", () => {
    render({ origin: { ...origin, lastSeenAt: null } });
    expect(container.textContent).toContain("Ainda não verificada na fonte");
  });

  it("marks a job the source no longer lists", () => {
    render({ origin: { ...origin, removedAt: "2026-11-09T12:00:00Z" } });
    expect(container.textContent).toContain("A fonte não lista mais esta vaga");
  });

  it("marks an expired job", () => {
    render({ origin: { ...origin, expiresAt: "2026-11-09T12:00:00Z" } });
    expect(container.textContent).toContain("Esta vaga expirou na fonte");
  });

  it("does not mark removed and expired at the same time", () => {
    render({
      origin: { ...origin, removedAt: "2026-11-09T12:00:00Z", expiresAt: "2026-11-09T12:00:00Z" },
    });
    expect(container.textContent).toContain("A fonte não lista mais esta vaga");
    expect(container.textContent).not.toContain("Esta vaga expirou na fonte");
  });

  it("does not mark a job that expires in the future", () => {
    render({ origin: { ...origin, expiresAt: "2026-12-01T12:00:00Z" } });
    expect(container.textContent).not.toContain("expirou");
  });

  it("links to the original publication, safe scheme only", () => {
    render();
    const link = container.querySelector("a");
    expect(link?.getAttribute("href")).toBe("https://adzuna.com.br/vaga/123");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");

    render({ origin: { ...origin, sourceUrl: "javascript:alert(1)" } });
    expect(container.querySelector("a")).toBeNull();
  });

  it("hides the source link when the source has no URL", () => {
    render({ origin: { ...origin, sourceUrl: null } });
    expect(container.querySelector("a")).toBeNull();
  });

  it("says hoje and ontem instead of counting days for the last two", () => {
    render({ origin: { ...origin, lastSeenAt: "2026-11-10T08:00:00Z" } });
    expect(container.textContent).toContain("Verificada na fonte hoje");

    render({ origin: { ...origin, lastSeenAt: "2026-11-09T12:00:00Z" } });
    expect(container.textContent).toContain("Verificada na fonte ontem");
  });
});
