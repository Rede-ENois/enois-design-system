import type { FormatPlaceholders } from "../../types/lib/rich-text/format-placeholders.js";
import type { FormatResult } from "../../types/lib/rich-text/format-result.js";
import type { RichTextFormat } from "../../types/lib/rich-text/rich-text-format.js";

/**
 * Aplica uma formatacao no trecho selecionado do campo de escrita.
 *
 * Funcao pura (recebe o texto e a selecao, devolve o texto novo e onde o cursor fica) para o
 * mesmo comportamento valer no composer, na edicao de post e nos comentarios — e para dar para
 * testar sem navegador.
 */
export function applyFormat(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  format: RichTextFormat,
  placeholders: FormatPlaceholders,
): FormatResult {
  const start = Math.max(0, Math.min(selectionStart, text.length));
  const end = Math.max(start, Math.min(selectionEnd, text.length));

  if (format === "heading") return applyHeading(text, start, end);
  if (format === "bulletList") return prefixLines(text, start, end, "- ");
  if (format === "quote") return prefixLines(text, start, end, "> ");
  if (format === "link") return insertLink(text, start, end, placeholders.link);

  const [opening, closing] = INLINE_MARKERS[format];
  const selected = text.slice(start, end);
  const inner = selected || placeholders[format];
  const value = text.slice(0, start) + opening + inner + closing + text.slice(end);

  return {
    value,
    selectionStart: start + opening.length,
    selectionEnd: start + opening.length + inner.length,
  };
}

const INLINE_MARKERS: Record<"bold" | "italic" | "strike" | "code" | "spoiler", [string, string]> =
  {
    bold: ["**", "**"],
    italic: ["*", "*"],
    strike: ["~~", "~~"],
    code: ["`", "`"],
    spoiler: ["||", "||"],
  };

/** `[texto](https://)` com a URL selecionada, que e o que falta preencher. */
function insertLink(text: string, start: number, end: number, placeholder: string): FormatResult {
  const label = text.slice(start, end) || placeholder;
  const url = "https://";
  const value = `${text.slice(0, start)}[${label}](${url})${text.slice(end)}`;
  const urlStart = start + label.length + 3;

  return { value, selectionStart: urlStart, selectionEnd: urlStart + url.length };
}

/**
 * Titulo com UMA cerquilha: e a forma que o leitor reconhece como titulo. Duas cerquilhas viram
 * `#` + `# titulo` — o titulo aparece como texto normal com um jogo-da-velha antes, e a linha
 * seguinte, com uma cerquilha, fica maior que a que o botao produziu.
 *
 * Linha que ja tem cerquilha troca o nivel em vez de empilhar outra: clicar duas vezes no botao
 * nao transforma o titulo em `## # titulo`.
 */
function applyHeading(text: string, start: number, end: number): FormatResult {
  const current = currentLine(text, start, end);
  // O clique sobe um nivel (e para em tres), como no editor de texto de sempre.
  const level = current === 0 ? 1 : Math.min(current + 1, 3);
  const prefix = "#".repeat(level) + " ";

  return level === 1
    ? prefixLines(text, start, end, prefix)
    : prefixLines(text, start, end, prefix, current);
}

/** Cerquilhas com que a primeira linha tocada ja comeca (0 quando nao e titulo). */
function currentLine(text: string, start: number, end: number): number {
  const lineStart = text.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  const first = text.slice(lineStart).split("\n")[0] ?? "";

  return /^(#{1,3}) /.exec(first)?.[1].length ?? 0;
}

/**
 * Prefixa as linhas tocadas pela selecao (titulo, lista, citacao). Aplica em todas as linhas
 * selecionadas de uma vez: marcar um paragrafo inteiro como lista e o caso comum, e fazer isso
 * com um clique e melhor do que linha a linha.
 */
function prefixLines(
  text: string,
  start: number,
  end: number,
  prefix: string,
  headingLevel = 0,
): FormatResult {
  const lineStart = text.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  const block = text.slice(lineStart, end);

  if (block === "") {
    const value = text.slice(0, lineStart) + prefix + text.slice(end);
    const cursor = lineStart + prefix.length;

    return { value, selectionStart: cursor, selectionEnd: cursor };
  }

  // No titulo a cerquilha antiga sai antes da nova entrar: senao ela fica no texto.
  const strip = headingLevel > 0 ? new RegExp(`^#{1,${headingLevel}} `) : undefined;
  const prefixed = block
    .split("\n")
    .map((line) => prefix + (strip ? line.replace(strip, "") : line))
    .join("\n");
  const value = text.slice(0, lineStart) + prefixed + text.slice(end);

  return { value, selectionStart: lineStart, selectionEnd: lineStart + prefixed.length };
}
