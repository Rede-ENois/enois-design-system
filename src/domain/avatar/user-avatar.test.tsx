// @vitest-environment node
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { AvatarFrameFx } from "./avatar-frame-fx.js";
import { ANIMATED_FRAMES, FX_FRAMES, SEASONAL_FX_FRAMES } from "./avatar-frames.js";
import { UserAvatar } from "./user-avatar.js";

describe("UserAvatar com moldura", () => {
  it("inclui os IDs das coleções Elementos e Tecnologia usadas no catálogo", () => {
    const frames = [
      "moldura-mare",
      "moldura-trepadeira",
      "moldura-vendaval",
      "moldura-vaga-lumes",
      "moldura-fliperama",
      "moldura-circuito",
      "moldura-neon",
      "moldura-radar",
    ];
    expect(FX_FRAMES).toEqual(expect.arrayContaining(frames));
    expect(ANIMATED_FRAMES).toEqual(expect.arrayContaining(frames));
    expect(new Set(FX_FRAMES).size).toBe(FX_FRAMES.length);
    expect(new Set(ANIMATED_FRAMES).size).toBe(ANIMATED_FRAMES.length);
  });

  it("moldura simples continua no próprio Avatar, sem invólucro", () => {
    const html = renderToString(
      <UserAvatar frame="moldura-violeta" alt="Ana Lima" className="h-8 w-8" />,
    );
    expect(html).toMatch(
      /^<span[^>]*class="[^"]*h-8 w-8[^"]*"[^>]*data-avatar-frame="moldura-violeta"/,
    );
    expect(html).not.toContain("moldura-fx");
  });

  it.each(FX_FRAMES)(
    "%s: invólucro com o tamanho de quem chamou e o efeito ao lado do Avatar",
    (frame) => {
      const html = renderToString(
        <UserAvatar frame={frame} alt="Ana Lima" className="h-8 w-8 shrink-0" />,
      );
      expect(html).toMatch(
        new RegExp(`^<span class="[^"]*h-8 w-8[^"]*" data-avatar-frame="${frame}"`),
      );
      expect(html).not.toContain("h-10 w-10");
      expect(html).toContain('<span aria-hidden="true" class="moldura-fx">');
      expect(html.match(/data-avatar-frame=/g)).toHaveLength(1);
      expect(html.match(/class="moldura-fx"/g)).toHaveLength(1);
      expect(html).toContain("AL");
    },
  );

  it("corta o efeito da moldura quando o avatar está em um campo compacto", () => {
    const html = renderToString(
      <UserAvatar
        frame="moldura-buraco-negro"
        frameOverflow="hidden"
        alt="Ana Lima"
        className="h-8 w-8"
      />,
    );
    expect(html).toMatch(/class="[^"]*overflow-hidden[^"]*h-8 w-8[^"]*"/);
  });

  it.each(FX_FRAMES)("%s: dois avatares não dividem ids de filtro", (frame) => {
    const html = renderToString(
      <>
        <UserAvatar frame={frame} alt="A" />
        <UserAvatar frame={frame} alt="B" />
      </>,
    );
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    // Órbita, galáxia, lacraia, fliperama e a maioria das sazonais não usam filtro nem gradiente:
    // não têm ids.
    const withoutIds =
      frame === "moldura-orbita" ||
      frame === "moldura-galaxia" ||
      frame === "moldura-lacraia" ||
      frame === "moldura-fliperama" ||
      (SEASONAL_FX_FRAMES as readonly string[]).includes(frame);
    if (!withoutIds) {
      expect(ids.length).toBeGreaterThan(0);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(["moldura-0x100", "moldura-terminal", "moldura-toalha"])(
    "%s: o texto em volta usa um caminho com id próprio por avatar",
    (frame) => {
      const html = renderToString(
        <>
          <UserAvatar frame={frame} alt="A" />
          <UserAvatar frame={frame} alt="B" />
        </>,
      );
      const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
      expect(ids).toHaveLength(2);
      expect(new Set(ids).size).toBe(2);
      for (const id of ids) expect(html).toContain(`href="#${id}"`);
    },
  );

  it.each([
    "moldura-desconhecida",
    "moldura-dragao",
    "moldura-prisma",
    "toString",
    "constructor",
    "__proto__",
    "",
  ])("efeito desconhecido %s não quebra a tela: não desenha nada", (frame) => {
    expect(renderToString(<AvatarFrameFx frame={frame} />)).toBe("");
  });
});
