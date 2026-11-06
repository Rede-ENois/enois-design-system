import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CommunityMark } from "./community-mark.js";
import { EventTicket } from "./event-ticket.js";
import { Signal } from "./signal.js";

describe("Signal", () => {
  it("counts things to handle in a pill and messages in a balloon", () => {
    const pill = renderToStaticMarkup(<Signal signal={{ kind: "count", count: 2 }} />);
    const balloon = renderToStaticMarkup(<Signal signal={{ kind: "messages", count: 3 }} />);

    expect(pill).toContain("2 pendentes");
    expect(pill).toContain("rounded-full");
    expect(balloon).toContain("3 mensagens não lidas");
    expect(balloon).toContain("rounded-[11px_11px_11px_3px]");
  });

  it("caps long counts and hides an empty count", () => {
    expect(renderToStaticMarkup(<Signal signal={{ kind: "count", count: 140 }} />)).toContain(
      ">99+<",
    );
    expect(renderToStaticMarkup(<Signal signal={{ kind: "count", count: 0 }} />)).toBe("");
  });

  it("names the news dot and the today tag for screen readers", () => {
    expect(renderToStaticMarkup(<Signal signal={{ kind: "new" }} />)).toContain(
      'aria-label="Tem novidade"',
    );
    expect(renderToStaticMarkup(<Signal signal={{ kind: "today" }} />)).toContain("hoje");
  });
});

describe("semantic shapes", () => {
  it("draws a community as a squircle with its initials and color", () => {
    const html = renderToStaticMarkup(<CommunityMark name="Bancos de Dados" color="#0f766e" />);

    expect(html).toContain("rounded-[34%]");
    expect(html).toContain(">BD<");
    expect(html).toContain("background:#0f766e");
  });

  it("draws a community image preview when avatar is present", () => {
    const html = renderToStaticMarkup(
      <CommunityMark
        name="Nós axolotes"
        avatar="https://example.com/axolote.png"
        color="#db2777"
      />,
    );

    expect(html).toContain("rounded-[34%]");
    expect(html).toContain('src="https://example.com/axolote.png"');
    expect(html).not.toContain(">NA<");
  });

  it("draws an event as a notched ticket", () => {
    const html = renderToStaticMarkup(<EventTicket day="02" month="NOV" />);

    expect(html).toContain(">02<");
    expect(html).toContain(">NOV<");
    expect(html).toContain("radial-gradient");
  });
});

describe("CommunityMark color", () => {
  it("gives the same community the same table color when it has none", () => {
    const a = renderToStaticMarkup(<CommunityMark name="Rust" seed="community_1" />);
    const b = renderToStaticMarkup(<CommunityMark name="Rust" seed="community_1" />);

    expect(a).toBe(b);
    expect(a).toMatch(/background:var\(--table-[1-6]\)/);
  });
});
