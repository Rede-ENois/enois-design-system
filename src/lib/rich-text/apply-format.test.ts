import { describe, expect, it } from "vitest";

import { applyFormat } from "./apply-format.js";
import { parseRichText } from "./parse.js";

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

/** Nomes dos formatos inline que o leitor abriu no texto, na ordem em que aparecem. */
const BLOCOS = new Set([
  "paragraph",
  "heading",
  "quote",
  "list",
  "listItem",
  "codeBlock",
  "table",
  "tableRow",
  "tableCell",
]);

function formatos(texto: string): string[] {
  const nomes: string[] = [];
  const visitar = (nodes: unknown): void => {
    if (!Array.isArray(nodes)) return;
    for (const node of nodes as Array<{ kind?: string; children?: unknown }>) {
      if (node.kind === undefined || node.kind === "text") continue;
      if (!BLOCOS.has(node.kind)) nomes.push(node.kind);
      visitar(node.children);
    }
  };
  visitar(parseRichText(texto));
  return nomes;
}

describe("applyFormat: formatos inline", () => {
  it("envolve a marcacao que ja estava no trecho, em vez de entrar no meio dela", () => {
    // Antes saia "~~**riscado**~~": negrito dentro do riscado, e o leitor nao lia nenhum dos dois.
    const resultado = applyFormat("~~riscado~~", 2, 9, "bold", placeholders);

    expect(resultado.value).toBe("**~~riscado~~**");
    expect(formatos(resultado.value)).toEqual(["bold", "strike"]);
  });

  it("envolve a marcacao inteira tambem quando a selecao pega so uma parte dela", () => {
    const resultado = applyFormat("a ~~b~~ c", 4, 5, "bold", placeholders);

    expect(resultado.value).toBe("a **~~b~~** c");
    expect(formatos(resultado.value)).toEqual(["bold", "strike"]);
  });

  it("usa a outra variante do formato para nao encostar em marcador igual", () => {
    // O texto ja tem `**`; o negrito novo sai `__` para quatro asteriscos seguidos nao virarem `****`.
    const novo = applyFormat("um negrito e texto", 3, 10, "bold", placeholders);
    const reformado = applyFormat("um **negrito** e texto", 4, 11, "bold", placeholders);

    expect(novo.value).toBe("um **negrito** e texto");
    expect(reformado.value).toBe("um __**negrito**__ e texto");
    expect(formatos(novo.value)).toEqual(["bold"]);
    expect(formatos(reformado.value)).toEqual(["bold", "bold"]);
  });

  it("clicar de novo no mesmo formato tira a marcacao em vez de empilhar outra", () => {
    const primeiro = applyFormat("~~riscado~~", 2, 9, "bold", placeholders);
    const segundo = applyFormat(
      primeiro.value,
      primeiro.selectionStart,
      primeiro.selectionEnd,
      "bold",
      placeholders,
    );

    expect(segundo.value).toBe("~~riscado~~");
    expect(formatos(segundo.value)).toEqual(["strike"]);
  });

  it("tira a marcacao quando o cursor esta parado dentro dela", () => {
    const resultado = applyFormat("**negrito**", 5, 5, "bold", placeholders);

    expect(resultado.value).toBe("negrito");
  });

  it("marca o trecho selecionado e volta a selecao para o texto, nao para o marcador", () => {
    const resultado = applyFormat("riscado mais texto", 0, 7, "bold", placeholders);

    expect(resultado.value).toBe("**riscado** mais texto");
    expect(resultado.value.slice(resultado.selectionStart, resultado.selectionEnd)).toBe("riscado");
  });

  it("poe o exemplo no lugar do cursor quando nada esta selecionado", () => {
    const resultado = applyFormat("", 0, 0, "bold", placeholders);

    expect(resultado.value).toBe("**negrito**");
    expect([resultado.selectionStart, resultado.selectionEnd]).toEqual([2, 9]);
  });

  it("envolve a marcacao que ja cercava o trecho e mantem o formato de dentro", () => {
    const resultado = applyFormat("**a** e b", 0, 9, "italic", placeholders);

    expect(resultado.value).toBe("_**a**_ e b");
    expect(formatos(resultado.value)).toEqual(["italic", "bold"]);
  });
});
