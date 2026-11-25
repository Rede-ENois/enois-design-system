// @vitest-environment jsdom
import { act, createRef, useEffect } from "react";

import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  ComposerStickerSuggestions,
  composerSuggestionsAria,
} from "./composer-sticker-suggestions.js";

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

describe("ComposerStickerSuggestions", () => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

  const OPCOES = [
    { id: "enois_1", code: "like", nome: "Curti", src: "/a.png", origem: "É Nóis" },
    { id: "com_9", code: "like", nome: "Curti também", src: "/b.png", origem: "Comunidade" },
  ];

  async function montar(destaqueId?: string) {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const campo = document.createElement("textarea");
    document.body.appendChild(campo);
    campo.getBoundingClientRect = () => ({ top: 100, bottom: 140, left: 20 }) as DOMRect;
    const anchor = createRef<HTMLElement>();
    anchor.current = campo;
    // Anuncia a montagem: sem o efeito do menu rodando, um teste que termina antes leria `document`
    // já vazio e o teardown global quebraria com "document is not defined".
    let montado!: () => void;
    const pronto = new Promise<void>((resolve) => (montado = resolve));
    function AvisarMontagem() {
      useEffect(() => montado(), []);
      return null;
    }
    const root = createRoot(host);
    act(() =>
      root.render(
        <>
          <AvisarMontagem />
          <ComposerStickerSuggestions
            id="menu"
            opcoes={OPCOES}
            destaque={0}
            destaqueId={destaqueId}
            loadingLabel="Carregando"
            listLabel="Figurinhas"
            onEscolher={() => {}}
            onDestacar={() => {}}
            anchor={anchor}
          />
        </>,
      ),
    );
    return {
      pronto,
      menu: document.getElementById("menu") as HTMLElement | null,
      desmontar() {
        act(() => root.unmount());
        host.remove();
        campo.remove();
      },
    };
  }

  it("o código repetido entre origens não mistura destaque com aria-selected", async () => {
    // As duas linhas têm `:like:`; a chave é o id, então o aria-selected é de quem foi destacado.
    const { pronto, menu, desmontar } = await montar("com_9");
    await pronto;
    const itens = menu?.querySelectorAll('[role="option"]') ?? [];

    expect(itens).toHaveLength(2);
    expect(itens[0]?.getAttribute("aria-selected")).toBe("false");
    expect(itens[1]?.getAttribute("aria-selected")).toBe("true");
    desmontar();
  });

  it("o menu acompanha a rolagem: a posição é medida de novo", async () => {
    const { pronto, menu, desmontar } = await montar();
    await pronto;
    const antes = menu?.style.getPropertyValue("--menu-top");

    // O campo andou 60px para cima (a página rolou) e nenhum prop mudou.
    const campo = document.querySelector("textarea") as HTMLTextAreaElement;
    campo.getBoundingClientRect = () => ({ top: 40, bottom: 80, left: 20 }) as DOMRect;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    const depois = document.getElementById("menu")?.style.getPropertyValue("--menu-top");
    expect(Number.parseFloat(depois ?? "")).toBe(Number.parseFloat(antes ?? "") - 60);
    desmontar();
  });
});
