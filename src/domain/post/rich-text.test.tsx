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

  it("com a prop, a figurinha do mapa também sai na classe do app (#1100)", () => {
    const html = renderToStaticMarkup(
      <RichText
        content="oi :enois_feliz: tudo bem?"
        mentionHref={mentionHref}
        inlineStickers={stickers}
        figurinha={{
          classe: "enois-figurinha",
          ehFigurinha: (url, ehMidiaNossa) => ehMidiaNossa(url) && url.startsWith("/emojis/"),
        }}
      />,
    );

    expect(html).toContain('src="/emojis/enois/feliz.webp" alt="Énóis feliz"');
    expect(html).toContain('class="enois-figurinha"');
    expect(html).not.toContain('class="inline-block h-[1.75em] w-auto max-w-none align-middle"');
  });

  it("com a prop, a figurinha do mapa que não é figurinha fica com o desenho que já tinha", () => {
    const html = renderToStaticMarkup(
      <RichText
        content="oi KEKW"
        mentionHref={mentionHref}
        inlineStickers={stickers}
        figurinha={{
          classe: "enois-figurinha",
          ehFigurinha: (url, ehMidiaNossa) => ehMidiaNossa(url) && url.startsWith("/emojis/enois/"),
        }}
      />,
    );

    expect(html).toContain('src="/emojis/kekw.webp"');
    expect(html).toContain('class="inline-block h-[1.75em] w-auto max-w-none align-middle"');
    expect(html).not.toContain("enois-figurinha");
  });
});

describe("RichText e o desenho da figurinha do app", () => {
  const figurinha = {
    classe: "enois-figurinha",
    ehFigurinha: (url: string, ehMidiaNossa: (url: string) => boolean) =>
      ehMidiaNossa(url) && url.startsWith("/emojis/"),
  };

  it("desenha o markdown da figurinha com a classe do app", () => {
    const html = renderToStaticMarkup(
      <RichText
        content="olha ![KEKW](/emojis/enois/like.webp)"
        mentionHref={mentionHref}
        figurinha={figurinha}
      />,
    );

    expect(html).toContain('class="enois-figurinha"');
    expect(html).not.toContain("rounded-xl");
  });

  it("a figurinha ganha do desenho de mídia direta, que também casaria pelo .webp", () => {
    const html = renderToStaticMarkup(
      <RichText
        content="olha ![KEKW](/emojis/enois/like.webp)"
        mentionHref={mentionHref}
        figurinha={figurinha}
      />,
    );

    expect(html).toContain('class="enois-figurinha"');
  });

  it("imagem que não é figurinha segue com o desenho de mídia", () => {
    const html = renderToStaticMarkup(
      <RichText
        content="olha ![foto](/media/foto.webp)"
        mentionHref={mentionHref}
        figurinha={figurinha}
      />,
    );

    expect(html).toContain("rounded-xl");
    expect(html).not.toContain("enois-figurinha");
  });

  it("sem a prop, o desenho é o de antes", () => {
    const html = renderToStaticMarkup(
      <RichText content="olha ![KEKW](/emojis/enois/like.webp)" mentionHref={mentionHref} />,
    );

    expect(html).not.toContain("enois-figurinha");
  });
});
