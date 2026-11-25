import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { composerSuggestionsAria } from "./composer-sticker-suggestions.js";

describe("composerSuggestionsAria", () => {
  it("menu fechado não pendura aria-controls no campo", () => {
    expect(composerSuggestionsAria("menu", false, 0)).toEqual({});
  });

  it("menu aberto aponta o campo para a lista e para o item destacado", () => {
    expect(composerSuggestionsAria("menu", true, 2)).toEqual({
      "aria-autocomplete": "list",
      "aria-controls": "menu",
      "aria-expanded": true,
      "aria-activedescendant": "menu-opcao-2",
    });
  });

  it("sem destaque não promete um item ativo", () => {
    expect(composerSuggestionsAria("menu", true, -1)).not.toHaveProperty("aria-activedescendant");
  });
});

describe("FigurinhaComunidadeCard", () => {
  it("mostra o código como entra no texto e só as ações oferecidas", async () => {
    const { FigurinhaComunidadeCard } = await import("./figurinha-comunidade-view.js");
    const html = renderToStaticMarkup(
      <FigurinhaComunidadeCard
        id="fig_1"
        codigo=":nomedacomunidade:"
        nome="Nome da comunidade"
        imagem="https://cdn.exemplo.com/a.png"
        autor="mel"
        onDenunciar={() => {}}
      />,
    );

    expect(html).toContain(":nomedacomunidade:");
    expect(html).toContain('alt="Nome da comunidade"');
    expect(html).toContain("Denunciar :nomedacomunidade:");
    expect(html).not.toContain("Remover");
  });
});
