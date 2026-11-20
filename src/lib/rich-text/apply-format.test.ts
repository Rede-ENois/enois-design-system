import { describe, expect, it } from "vitest";

import { applyFormat } from "./apply-format.js";

const placeholders = {
  bold: "negrito",
  italic: "italico",
  strike: "riscado",
  code: "codigo",
  spoiler: "spoiler",
  link: "texto",
};

describe("applyFormat: titulo", () => {
  it("numa linha vazia, abre com uma cerquilha — a forma que o leitor pinta como titulo", () => {
    // Duas cerquilhas saiam como "#" + "# titulo": texto normal com uma cerquilha na frente.
    expect(applyFormat("", 0, 0, "heading", placeholders)).toEqual({
      value: "# ",
      selectionStart: 2,
      selectionEnd: 2,
    });
  });

  it("numa linha com texto, poe a cerquilha no comeco da linha", () => {
    expect(applyFormat("Meu titulo", 6, 6, "heading", placeholders)).toEqual({
      value: "# Meu titulo",
      selectionStart: 0,
      selectionEnd: 8,
    });
  });

  it("clicar de novo no titulo troca o nivel, sem empilhar cerquilha no texto", () => {
    expect(applyFormat("# Meu titulo", 4, 4, "heading", placeholders)).toEqual({
      value: "## Meu titulo",
      selectionStart: 0,
      selectionEnd: 5,
    });
  });

  it("sobe um nivel por clique, ate tres cerquilhas, e nao passa disso", () => {
    const segundo = applyFormat("# Meu titulo", 0, 11, "heading", placeholders);
    expect(segundo.value).toBe("## Meu titulo");

    const terceiro = applyFormat(segundo.value, 0, 12, "heading", placeholders);
    expect(terceiro.value).toBe("### Meu titulo");

    expect(applyFormat(terceiro.value, 0, 13, "heading", placeholders).value).toBe(
      "### Meu titulo",
    );
  });

  it("marca o titulo no meio do texto sem tocar no resto", () => {
    const texto = "Antes\nMeio\nDepois";
    const resultado = applyFormat(texto, 7, 10, "heading", placeholders);

    expect(resultado.value).toBe("Antes\n# Meio\nDepois");
    expect([resultado.selectionStart, resultado.selectionEnd]).toEqual([6, 12]);
  });

  it("garante que outros formatos continuam prefixando linha a linha", () => {
    // O caminho da lista nao muda: duas linhas viram dois itens.
    expect(applyFormat("a\nb", 0, 3, "bulletList", placeholders).value).toBe("- a\n- b");
  });
});
