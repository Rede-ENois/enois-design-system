import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MentionTextarea } from "./mention-textarea.js";

const render = (showCounter?: boolean) =>
  renderToStaticMarkup(
    <MentionTextarea
      value="teste"
      onChange={() => undefined}
      maxLength={1200}
      showCounter={showCounter}
      mentionResults={[]}
      onMentionQueryChange={() => undefined}
    />,
  );

describe("MentionTextarea", () => {
  it("mostra o contador interno por padrão", () => {
    expect(render()).toContain('aria-live="polite"');
  });

  it("permite ocultar o contador sem remover o limite do campo", () => {
    const html = render(false);

    expect(html).not.toContain('aria-live="polite"');
    expect(html).toContain('data-max-length="1200"');
  });
});
