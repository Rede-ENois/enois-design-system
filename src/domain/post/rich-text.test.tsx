import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { EditorSticker } from "../../types/domain/post/editor-sticker.js";

import { RichText } from "./rich-text.js";

const mentionHref = (username: string): string => `/perfil/${username}`;

/** O adapter do app: o caminho `/emojis/...` é mídia da casa; provedor externo não é. */
const isOwnMediaUrl = (url: string) => url.startsWith("/");

describe("RichText links", () => {
  it.each([
    "[clique](javascript:alert(1))",
    "[clique]( javascript:alert(1))",
    "![foto](javascript:alert(1))",
    "[clique](data:text/html,oi)",
  ])("never renders a script href for %j", (content) => {
    const html = renderToStaticMarkup(<RichText content={content} mentionHref={mentionHref} />);
    expect(html).not.toMatch(/href="\s*(javascript|data):/i);
  });

  it("keeps http links clickable", () => {
    const html = renderToStaticMarkup(
      <RichText content="[site](https://example.com)" mentionHref={mentionHref} />,
    );
    expect(html).toContain('href="https://example.com"');
  });
});

describe("RichText figurinhas", () => {
  const stickers: Record<string, EditorSticker> = {
    ":enois_feliz:": { url: "/emojis/enois/feliz.webp", alt: "Énóis feliz" },
    KEKW: { url: "/emojis/kekw.webp", alt: "KEKW" },
  };

  it("desenha a figurinha de código como imagem inline do tamanho do texto", () => {
    const html = renderToStaticMarkup(
      <RichText
        content="oi :enois_feliz: tudo bem?"
        mentionHref={mentionHref}
        inlineStickers={stickers}
      />,
    );

    expect(html).toContain('<img src="/emojis/enois/feliz.webp" alt="Énóis feliz"');
    expect(html).toContain('class="inline-block h-[1.75em] w-auto max-w-none align-middle"');
    expect(html).not.toContain("max-h-80");
  });

  it("só troca a palavra inteira: código colado em outra palavra fica texto", () => {
    const html = renderToStaticMarkup(
      <RichText content="a KEKWb e KEKW" mentionHref={mentionHref} inlineStickers={stickers} />,
    );

    expect(html).toContain("KEKWb");
    expect(html.match(/<img/g)).toHaveLength(1);
  });

  it("sem o mapa de figurinhas, o markdown de imagem da casa continua como imagem", () => {
    const html = renderToStaticMarkup(
      <RichText content="![foto](/media/foto.png)" mentionHref={mentionHref} />,
    );

    expect(html).toContain('src="/media/foto.png"');
  });

  it("figurinha citada por código com endereço externo não rende imagem remota", () => {
    const html = renderToStaticMarkup(
      <RichText
        content="oi KEKW"
        mentionHref={mentionHref}
        inlineStickers={{ KEKW: { url: "https://cdn.example.com/kekw.png", alt: "KEKW" } }}
      />,
    );

    expect(html).not.toContain("<img");
  });
});
