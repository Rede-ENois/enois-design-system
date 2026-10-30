// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ConversationItem } from "./conversation-item.js";

const base = { id: "c1", title: null, lastMessage: "Oi", unread: 0 };

describe("ConversationItem", () => {
  it("a titled thread shows the person first and the subject before the preview", () => {
    const html = renderToStaticMarkup(
      <ConversationItem
        conversation={{ ...base, title: "Pipeline de vendas" }}
        peer={{ name: "Mel Santos" }}
        profileHref="/profissional/mel.pro"
        timeLabel="há 6 min"
        isActive={false}
        onSelect={() => {}}
      />,
    );
    expect(html).toContain("Mel Santos");
    expect(html).toContain("Pipeline de vendas · Oi");
  });

  it("without a known person, the subject is the name", () => {
    const html = renderToStaticMarkup(
      <ConversationItem
        conversation={{ ...base, title: "Pipeline de vendas" }}
        peer={null}
        profileHref="/perfil/x"
        timeLabel=""
        isActive={false}
        onSelect={() => {}}
      />,
    );
    expect(html).toContain("Pipeline de vendas");
    expect(html).not.toContain("Pipeline de vendas ·");
  });
});
