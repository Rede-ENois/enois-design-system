// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ConversationHeader } from "./conversation-header.js";

describe("ConversationHeader", () => {
  it("names who is on the other side of a titled thread", () => {
    const html = renderToStaticMarkup(
      <ConversationHeader
        conversationTitle="Pipeline de vendas"
        peer={{ name: "Mel Santos", headline: "Engenheira de dados" }}
        profileHref="/profissional/mel.pro"
      />,
    );
    expect(html).toContain("Pipeline de vendas");
    expect(html).toContain("Mel Santos · Engenheira de dados");
  });

  it("keeps the headline under the name of a person-to-person thread", () => {
    const html = renderToStaticMarkup(
      <ConversationHeader
        conversationTitle={null}
        peer={{ name: "Rita Lima", headline: "Recrutadora" }}
        profileHref="/perfil/rita"
      />,
    );
    expect(html).toContain("Rita Lima");
    expect(html).toContain(">Recrutadora<");
  });
});
