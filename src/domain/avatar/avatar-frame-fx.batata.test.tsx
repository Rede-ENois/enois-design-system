// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot, hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AvatarFrameFx } from "./avatar-frame-fx.js";

const FRAME = "moldura-neon";

describe("moldura com efeito no BATATA", () => {
  let root: Root | null = null;
  let host: HTMLDivElement;

  beforeEach(() => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    host = document.createElement("div");
    document.body.append(host);
  });

  afterEach(async () => {
    await act(async () => root?.unmount());
    root = null;
    host.remove();
    document.documentElement.removeAttribute("data-batata");
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("fora do BATATA desenha as partículas da moldura", () => {
    expect(renderToString(<AvatarFrameFx frame={FRAME} />)).toContain("moldura-fx");
  });

  // As partículas são até 60 nós por moldura e ficariam invisíveis (o CSS do BATATA as esconde).
  it("no BATATA não monta o efeito", async () => {
    document.documentElement.setAttribute("data-batata", "");
    root = createRoot(host);

    await act(async () => root?.render(<AvatarFrameFx frame={FRAME} />));

    expect(host.innerHTML).toBe("");
  });

  it("hidrata o desenho do servidor antes de retirar o efeito no BATATA", async () => {
    host.innerHTML = renderToString(<AvatarFrameFx frame={FRAME} />);
    expect(host.querySelector(".moldura-fx")).not.toBeNull();

    document.documentElement.setAttribute("data-batata", "");
    const recoverableError = vi.fn();
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});

    await act(async () => {
      root = hydrateRoot(host, <AvatarFrameFx frame={FRAME} />, {
        onRecoverableError: recoverableError,
      });
    });

    expect(recoverableError).not.toHaveBeenCalled();
    expect(errorLog).not.toHaveBeenCalled();
    expect(host.innerHTML).toBe("");
  });
});
