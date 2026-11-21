import type { FormatPlaceholders } from "../../types/lib/rich-text/format-placeholders.js";
import type { FormatResult } from "../../types/lib/rich-text/format-result.js";
import type { InlineFormat } from "../../types/lib/rich-text/inline-format.js";
import type { RichTextFormat } from "../../types/lib/rich-text/rich-text-format.js";
import type { Wrap } from "../../types/lib/rich-text/wrap.js";

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

  return applyInline(text, format, start, end, placeholders[format] ?? "");
}

/**
 * Variantes de cada marcacao inline, na ordem em que o leitor tenta (`**` antes de `__`,
 * `*` antes de `_`). A variante alternativa existe para nao encostar em marcador igual.
 */
const INLINE_MARKERS: Record<InlineFormat, string[]> = {
  bold: ["**", "__"],
  italic: ["*", "_"],
  strike: ["~~"],
  code: ["`"],
  spoiler: ["||"],
};

/** Barra invertida: o caractere seguinte e literal, entao nao conta como marcador em volta. */
function isEscaped(text: string, index: number): boolean {
  let slashes = 0;
  for (let i = index - 1; i >= 0 && text[i] === "\\"; i -= 1) slashes += 1;
  return slashes % 2 === 1;
}

function isWord(char: string | undefined): boolean {
  return char !== undefined && /[\p{L}\p{N}_]/u.test(char);
}

/** A marcacao abre em `index` pelas regras de borda do leitor (`*` colado em palavra nao abre). */
function canOpen(text: string, index: number, marker: string): boolean {
  if (!text.startsWith(marker, index) || isEscaped(text, index)) return false;
  const next = text[index + marker.length];
  if (next === undefined || /\s/.test(next)) return false;
  return !(marker === "*" || marker === "_") || !isWord(text[index - 1]);
}

/** A marcacao fecha em `index` pelas regras de borda do leitor. */
function canClose(text: string, index: number, marker: string): boolean {
  if (!text.startsWith(marker, index) || isEscaped(text, index)) return false;
  const previous = text[index - 1];
  if (previous === undefined || /\s/.test(previous)) return false;
  return !(marker === "*" || marker === "_") || !isWord(text[index + marker.length]);
}

/**
 * Marcacoes do texto com o par de bordas calculado como o leitor faz — a abertura mais proxima
 * antes de cada fechamento. Fora daqui o fechamento nao "ve" o que vem depois dele.
 */
function markerPairs(text: string, marker: string): Array<{ open: number; close: number }> {
  const pairs: Array<{ open: number; close: number }> = [];
  let pending = -1;
  for (let index = 0; index <= text.length - marker.length; index += 1) {
    if (canOpen(text, index, marker)) pending = index;
    else if (canClose(text, index, marker) && pending !== -1) {
      pairs.push({ open: pending, close: index });
      pending = -1;
    }
  }
  return pairs;
}

/**
 * Marcacao de qualquer formato que encosta no trecho `[start, end)` — contendo-o inteiro ou
 * pegando so um pedaco dele. Cercar o trecho por fora dela mantem o texto entre os marcadores
 * igual ao que o usuario escreveu.
 */
function enclosing(text: string, start: number, end: number): Wrap | null {
  let best: Wrap | null = null;
  for (const kind of Object.keys(INLINE_MARKERS) as InlineFormat[]) {
    for (const marker of INLINE_MARKERS[kind]) {
      for (const { open, close } of markerPairs(text, marker)) {
        if (close + marker.length <= start || open >= end) continue;
        const wrap = { start: open, end: close + marker.length, kind, marker };
        if (best === null || wrap.start < best.start) best = wrap;
      }
    }
  }
  return best;
}

/** Ha marcacao deste marcador aberta antes de `index`? Ali ele viraria o fechamento dela. */
function opensAcross(text: string, marker: string, index: number): boolean {
  return markerPairs(text, marker).some(({ open, close }) => open < index && index <= close);
}

/**
 * Variante que nao vira fechamento de uma marcacao ja aberta em `index`.
 *
 * `**` no lugar onde um `**` de fora ainda espera par fecha essa marcacao mais cedo, e o leitor
 * nao entende nenhuma das duas. Negrito e italico tem duas formas, entao sempre sobra uma livre.
 */
function pickMarker(text: string, kind: InlineFormat, index: number): string {
  return (
    INLINE_MARKERS[kind].find((marker) => !opensAcross(text, marker, index)) ??
    INLINE_MARKERS[kind][0]
  );
}

/** A outra variante do formato: `**`↔`__`, `*`↔`_`. E a que pode envolver uma marcacao igual. */
function alternate(kind: InlineFormat, marker: string): string {
  return INLINE_MARKERS[kind].find((variant) => variant !== marker) ?? marker;
}

/**
 * Uma variante encosta na outra? `*` colado em `**` vira `***`, e o leitor le negrito de `*a` com
 * um asterisco solto: quem comeca com o prefixo do outro (ou contem o outro) nao pode ficar junto.
 */
function clashes(one: string, other: string): boolean {
  return one.startsWith(other) || other.startsWith(one);
}

/**
 * Marca o trecho com o formato e, clicando outra vez no mesmo botao, tira a marcacao.
 *
 * Envolver a selecao crua estragava o texto quando ela ja estava dentro de outro formato: com
 * `~~riscado~~` e a palavra selecionada, o negrito saia no meio dos tils (`~~**riscado**~~`), onde
 * o leitor nao entende nenhum dos dois. A marcacao nova agora cerca a marcacao que ja estava la.
 */
function applyInline(
  text: string,
  kind: InlineFormat,
  start: number,
  end: number,
  placeholder: string,
): FormatResult {
  const outside = enclosing(text, start, end);
  const inner = text.slice(start, end);

  // Mesmo formato em volta e a selecao toda por dentro dela: o clique tira a marcacao, e o texto
  // que estava marcado fica selecionado (com o cursor parado, o trecho todo).
  if (
    outside &&
    outside.kind === kind &&
    outside.start + outside.marker.length <= start &&
    end <= outside.end - outside.marker.length
  ) {
    const content = text.slice(
      outside.start + outside.marker.length,
      outside.end - outside.marker.length,
    );
    const value = text.slice(0, outside.start) + content + text.slice(outside.end);
    const from = Math.max(outside.start, start - outside.marker.length);
    return {
      value,
      selectionStart: from,
      selectionEnd: from + Math.max(content.length, end - start),
    };
  }

  // Sem texto selecionado entra o exemplo no lugar do cursor: o botao faz algo com o cursor parado.
  if (inner === "") {
    const marker = pickMarker(text, kind, start);
    const value = text.slice(0, start) + marker + placeholder + marker + text.slice(start);
    return {
      value,
      selectionStart: start + marker.length,
      selectionEnd: start + marker.length + placeholder.length,
    };
  }

  if (outside) {
    // Variante que nao encosta na marcacao de fora nem aparece dentro do trecho: `**` colado num
    // `*` vira `***`, que o leitor le como negrito de `*a` com um asterisco solto. Havendo variante
    // livre, a marcacao nova envolve a antiga por fora (`~~x~~` + negrito vira `**~~x~~**`); sem
    // nenhuma, entra por dentro dela (`*a*` + negrito vira `*__a__*`), que o leitor entende nos
    // dois niveis.
    const span = text.slice(outside.start, outside.end);
    const free = INLINE_MARKERS[kind].find(
      (variant) =>
        variant !== outside.marker && !clashes(variant, outside.marker) && !span.includes(variant),
    );

    if (free) {
      const value = text.slice(0, outside.start) + free + span + free + text.slice(outside.end);
      return {
        value,
        selectionStart: outside.start + free.length,
        selectionEnd: outside.end + free.length,
      };
    }

    // Por dentro, a marcacao nova tambem nao pode encostar na de fora: `**` dentro de `*` vira `***`.
    const marker =
      INLINE_MARKERS[kind].find((variant) => !clashes(variant, outside.marker)) ??
      alternate(kind, outside.marker);
    const contentStart = outside.start + outside.marker.length;
    const contentEnd = outside.end - outside.marker.length;
    const value =
      text.slice(0, contentStart) +
      marker +
      text.slice(contentStart, contentEnd) +
      marker +
      text.slice(contentEnd);

    return {
      value,
      selectionStart: start + marker.length,
      selectionEnd: end + marker.length,
    };
  }

  // Sem nada em volta, a marcacao nova abraca exatamente a selecao.
  const marker = pickMarker(text, kind, start);
  const value = text.slice(0, start) + marker + inner + marker + text.slice(end);

  return {
    value,
    selectionStart: start + marker.length,
    selectionEnd: end + marker.length,
  };
}

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
