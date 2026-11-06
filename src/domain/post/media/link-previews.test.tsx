// @vitest-environment jsdom
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { LinkPreviews } from "./link-previews.js";

const PAGE = "https://exemplo.com/uma-materia";

describe("LinkPreviews", () => {
  it("desenha o cartão simples quando o app não passa um cartão próprio", () => {
    const markup = renderToStaticMarkup(<LinkPreviews content={`olha ${PAGE}`} />);

    expect(markup).toContain("exemplo.com");
    expect(markup).toContain("abrir no site");
  });

  it("entrega o link ao app quando ele sabe desenhar o cartão", () => {
    const seen: string[] = [];
    const markup = renderToStaticMarkup(
      <LinkPreviews
        content={`olha ${PAGE}`}
        renderLinkPreview={(url) => {
          seen.push(url);
          return <p>cartão de {url}</p>;
        }}
      />,
    );

    expect(seen).toEqual([PAGE]);
    expect(markup).toContain(`cartão de ${PAGE}`);
    // O cartão simples não aparece junto: é um ou outro.
    expect(markup).not.toContain("abrir no site");
  });

  it("não desenha nada quando o app devolve null (prévia ainda chegando)", () => {
    const markup = renderToStaticMarkup(
      <LinkPreviews content={`olha ${PAGE}`} renderLinkPreview={() => null} />,
    );

    expect(markup).toBe("");
  });

  it("não entrega ao app o que já se mostra sozinho: mídia direta e player", () => {
    const seen: string[] = [];
    renderToStaticMarkup(
      <LinkPreviews
        content="https://cdn.exemplo/foto.png https://youtu.be/dQw4w9WgXcQ"
        renderLinkPreview={(url) => {
          seen.push(url);
          return null;
        }}
      />,
    );

    expect(seen).toEqual([]);
  });

  it("avisa o app quando o cartão é de comentário", () => {
    const options: { compact: boolean }[] = [];
    renderToStaticMarkup(
      <LinkPreviews
        content={PAGE}
        compact
        renderLinkPreview={(_url, opts) => {
          options.push(opts);
          return null;
        }}
      />,
    );

    expect(options).toEqual([{ compact: true }]);
  });

  it("entrega cada link uma vez só, mesmo repetido no texto", () => {
    const seen: string[] = [];
    renderToStaticMarkup(
      <LinkPreviews
        content={`${PAGE} e de novo ${PAGE}`}
        renderLinkPreview={(url) => {
          seen.push(url);
          return null;
        }}
      />,
    );

    expect(seen).toEqual([PAGE]);
  });
});
