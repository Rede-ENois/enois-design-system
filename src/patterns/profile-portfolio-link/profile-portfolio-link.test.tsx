// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { defaultMessages } from "../../messages/default-messages.js";
import type { ProfilePortfolioLinkProps } from "../../types/patterns/profile-portfolio-link-props.js";

import { ProfilePortfolioLink } from "./profile-portfolio-link.js";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const messages = defaultMessages.profilePortfolioLink;

describe("ProfilePortfolioLink", () => {
  let root: Root;
  let host: HTMLDivElement;

  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  const render = (props: ProfilePortfolioLinkProps) => {
    act(() => root.render(<ProfilePortfolioLink {...props} />));
    const link = host.querySelector("a");
    expect(link).not.toBeNull();
    return link as HTMLAnchorElement;
  };

  it("quem visita abre a vitrine publicada", () => {
    const link = render({ href: "/portfolio/ana" });
    expect(link.getAttribute("href")).toBe("/portfolio/ana");
    expect(link.textContent).toBe(messages.open);
  });

  it("o dono abre o editor", () => {
    const link = render({ href: "/portfolio/editar", owner: true });
    expect(link.getAttribute("href")).toBe("/portfolio/editar");
    expect(link.textContent).toBe(messages.edit);
  });
});
