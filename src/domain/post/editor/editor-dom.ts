import type { EditorSegment } from "../../../types/domain/post/editor-segment.js";
import type { EditorSticker } from "../../../types/domain/post/editor-sticker.js";
import type { TextSelectionEnds } from "../../../types/domain/post/text-selection-ends.js";
import type { TextSelection } from "../../../types/domain/post/text-selection.js";

/**
 * The field is a contenteditable that only ever holds text nodes, sticker spans and, at most, one
 * trailing sentinel `<br>`. The value of the field is the text of those nodes, a sticker counting as
 * its code. Everything here is DOM plumbing; the component owns the state.
 */

export const STICKER_ATTRIBUTE = "data-sticker-code";
export const SENTINEL_ATTRIBUTE = "data-trailing-break";
export const STICKER_CLASS = "mx-px inline-block select-none align-middle";
export const STICKER_IMAGE_CLASS = "inline-block h-[1.75em] w-auto max-w-none align-middle";

const isElement = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE;
const isStickerNode = (node: Node): node is HTMLElement =>
  isElement(node) && node.hasAttribute(STICKER_ATTRIBUTE);
const isSentinel = (node: Node) => isElement(node) && node.hasAttribute(SENTINEL_ATTRIBUTE);

/** Text a node stands for: stickers are their code, a stray `<br>` or block is a line break. */
function nodeText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.nodeValue ?? "";
  if (isStickerNode(node)) return node.getAttribute(STICKER_ATTRIBUTE) ?? "";
  if (isSentinel(node)) return "";
  if (!isElement(node) && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return "";
  if (isElement(node) && node.tagName === "BR") return "\n";

  let text = "";
  node.childNodes.forEach((child, index) => {
    const isBlock = isElement(child) && (child.tagName === "DIV" || child.tagName === "P");
    text += (isBlock && index > 0 ? "\n" : "") + nodeText(child);
  });
  return text;
}

/** The value the field currently shows. */
export function readText(root: HTMLElement): string {
  return nodeText(root);
}

/** The text of a selection range, with stickers as their codes (copy and cut). */
export function readRangeText(range: Range): string {
  return nodeText(range.cloneContents());
}

/** The sticker whose code is `word`, if any. */
function stickerFor(
  stickers: Record<string, EditorSticker> | undefined,
  word: string,
): EditorSticker | undefined {
  return stickers && Object.prototype.hasOwnProperty.call(stickers, word)
    ? stickers[word]
    : undefined;
}

/** Splits `text` into text and sticker segments; only whole whitespace-delimited words match. */
export function segmentText(
  text: string,
  stickers: Record<string, EditorSticker> | undefined,
  resolveUrl: (url: string) => string | undefined,
): EditorSegment[] {
  const segments: EditorSegment[] = [];
  const pushText = (chunk: string) => {
    if (!chunk) return;
    const last = segments[segments.length - 1];
    if (last?.kind === "text") last.text += chunk;
    else segments.push({ kind: "text", text: chunk });
  };

  let cursor = 0;
  for (const match of text.matchAll(/\S+/g)) {
    const word = match[0];
    const sticker = stickerFor(stickers, word);
    const src = sticker ? resolveUrl(sticker.url) : undefined;
    if (!sticker || !src) continue;
    pushText(text.slice(cursor, match.index));
    segments.push({ kind: "sticker", code: word, src, alt: sticker.alt });
    cursor = match.index + word.length;
  }
  pushText(text.slice(cursor));
  return segments;
}

function domSegments(root: HTMLElement): EditorSegment[] {
  const segments: EditorSegment[] = [];
  root.childNodes.forEach((child) => {
    if (isSentinel(child)) return;
    if (isStickerNode(child)) {
      const image = child.querySelector("img");
      segments.push({
        kind: "sticker",
        code: child.getAttribute(STICKER_ATTRIBUTE) ?? "",
        src: image?.getAttribute("src") ?? "",
        alt: image?.getAttribute("alt") ?? "",
      });
      return;
    }
    const text = nodeText(child);
    if (!text) return;
    const last = segments[segments.length - 1];
    if (last?.kind === "text") last.text += text;
    else segments.push({ kind: "text", text });
  });
  return segments;
}

function sameSegments(a: EditorSegment[], b: EditorSegment[]): boolean {
  return (
    a.length === b.length &&
    a.every((segment, index) => {
      const other = b[index];
      if (segment.kind === "text") return other.kind === "text" && other.text === segment.text;
      return (
        other.kind === "sticker" &&
        other.code === segment.code &&
        other.src === segment.src &&
        other.alt === segment.alt
      );
    })
  );
}

/** True when the DOM holds exactly `segments`, as text nodes and sticker spans only. */
export function matchesSegments(root: HTMLElement, segments: EditorSegment[]): boolean {
  const onlyKnownNodes = Array.from(root.childNodes).every(
    (child) => child.nodeType === Node.TEXT_NODE || isStickerNode(child) || isSentinel(child),
  );
  return onlyKnownNodes && sameSegments(domSegments(root), segments);
}

function createSticker(doc: Document, segment: Extract<EditorSegment, { kind: "sticker" }>) {
  const span = doc.createElement("span");
  span.setAttribute("contenteditable", "false");
  span.setAttribute(STICKER_ATTRIBUTE, segment.code);
  span.className = STICKER_CLASS;
  const image = doc.createElement("img");
  image.setAttribute("src", segment.src);
  image.setAttribute("alt", segment.alt);
  image.setAttribute("draggable", "false");
  image.className = STICKER_IMAGE_CLASS;
  span.append(image);
  return span;
}

/** Replaces the content with `segments`. */
export function renderSegments(root: HTMLElement, segments: EditorSegment[]): void {
  const doc = root.ownerDocument;
  root.replaceChildren(
    ...segments.map((segment) =>
      segment.kind === "text" ? doc.createTextNode(segment.text) : createSticker(doc, segment),
    ),
  );
}

/**
 * Whether the last line needs the sentinel: a line break at the very end of a pre-wrap box has no
 * height until something follows it, and a sticker at the very end leaves the caret nowhere to
 * stand (browsers drop it at the edge of the non-editable span, where typing is lost).
 */
export function needsTrailingBreak(segments: EditorSegment[]): boolean {
  const last = segments[segments.length - 1];
  return last !== undefined && (last.kind === "sticker" || last.text.endsWith("\n"));
}

/** Keeps the sentinel `<br>` in step with `needsTrailingBreak`. It carries no text. */
export function syncTrailingBreak(root: HTMLElement): void {
  const content = Array.from(root.childNodes).filter((child) => !isSentinel(child));
  const lastContent = content[content.length - 1];
  const needed =
    lastContent !== undefined && (isStickerNode(lastContent) || readText(root).endsWith("\n"));
  const last = root.lastChild;
  const present = last !== null && isSentinel(last);
  if (needed && !present) {
    const sentinel = root.ownerDocument.createElement("br");
    sentinel.setAttribute(SENTINEL_ATTRIBUTE, "");
    root.append(sentinel);
  } else if (!needed && present) {
    last.remove();
  }
}

function offsetAt(root: HTMLElement, node: Node, offset: number): number {
  const range = root.ownerDocument.createRange();
  range.setStart(root, 0);
  range.setEnd(node, offset);
  return nodeText(range.cloneContents()).length;
}

/** Where `offset` characters of text fall in the DOM; stickers are never entered. */
function locate(root: HTMLElement, offset: number): { node: Node; offset: number } {
  let passed = 0;
  const children = Array.from(root.childNodes);
  for (const [index, child] of children.entries()) {
    if (isSentinel(child)) return { node: root, offset: index };
    const length = nodeText(child).length;
    if (child.nodeType === Node.TEXT_NODE) {
      if (offset <= passed + length) return { node: child, offset: offset - passed };
    } else if (offset <= passed) {
      return { node: root, offset: index };
    } else if (offset < passed + length) {
      const nearerEnd = offset - passed > length / 2;
      return { node: root, offset: nearerEnd ? index + 1 : index };
    }
    passed += length;
  }
  return { node: root, offset: children.length };
}

/** The selection inside `root` as text offsets, or null when it is elsewhere. */
export function readSelection(root: HTMLElement): TextSelection | null {
  const selection = root.ownerDocument.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null;
  return {
    start: offsetAt(root, range.startContainer, range.startOffset),
    end: offsetAt(root, range.endContainer, range.endOffset),
  };
}

/** The selection inside `root` with its direction, or null when it is elsewhere. */
export function readSelectionEnds(root: HTMLElement): TextSelectionEnds | null {
  const selection = root.ownerDocument.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const { anchorNode, focusNode } = selection;
  if (!anchorNode || !focusNode || !root.contains(anchorNode) || !root.contains(focusNode)) {
    return null;
  }
  return {
    anchor: offsetAt(root, anchorNode, selection.anchorOffset),
    focus: offsetAt(root, focusNode, selection.focusOffset),
  };
}

/** Selects from `anchor` to `focus` (text offsets); `focus` may come before `anchor`. */
export function writeSelectionEnds(root: HTMLElement, anchor: number, focus: number): void {
  const selection = root.ownerDocument.getSelection();
  if (!selection) return;
  const from = locate(root, anchor);
  const to = locate(root, focus);
  selection.setBaseAndExtent(from.node, from.offset, to.node, to.offset);
}

/** Selects `start`..`end` (text offsets). */
export function writeSelection(root: HTMLElement, start: number, end: number): void {
  writeSelectionEnds(root, start, end);
}

/**
 * True when a sticker is in the field and either end of the selection sits between nodes of the
 * field (next to a sticker) instead of inside a text node. Native typing there is unreliable.
 */
export function selectionOnNodeBoundary(root: HTMLElement): boolean {
  if (!root.querySelector(`[${STICKER_ATTRIBUTE}]`)) return false;
  const selection = root.ownerDocument.getSelection();
  if (!selection || selection.rangeCount === 0) return false;
  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return false;
  return (
    range.startContainer.nodeType !== Node.TEXT_NODE ||
    range.endContainer.nodeType !== Node.TEXT_NODE
  );
}

/** The sticker whose code spans `offset - 1` (backward) or `offset` (forward), as a text range. */
export function stickerAdjacentTo(
  text: string,
  offset: number,
  direction: "backward" | "forward",
  stickers: Record<string, EditorSticker> | undefined,
  resolveUrl: (url: string) => string | undefined,
): TextSelection | null {
  if (!stickers) return null;
  const probe = direction === "backward" ? offset - 1 : offset;
  if (probe < 0 || probe >= text.length || /\s/.test(text[probe])) return null;
  let start = probe;
  while (start > 0 && !/\s/.test(text[start - 1])) start -= 1;
  let end = probe + 1;
  while (end < text.length && !/\s/.test(text[end])) end += 1;
  const word = text.slice(start, end);
  const sticker = stickerFor(stickers, word);
  return sticker && resolveUrl(sticker.url) ? { start, end } : null;
}

/**
 * Where an arrow key moves the caret from `offset` when a sticker is the next character in that
 * direction: across the whole sticker, as one character. Null when there is no sticker there and
 * the browser should move as usual.
 */
export function stepOverSticker(
  text: string,
  offset: number,
  direction: "backward" | "forward",
  stickers: Record<string, EditorSticker> | undefined,
  resolveUrl: (url: string) => string | undefined,
): number | null {
  const range = stickerAdjacentTo(text, offset, direction, stickers, resolveUrl);
  if (!range) return null;
  return direction === "backward" ? range.start : range.end;
}

/**
 * Some browsers put two line breaks in a `plaintext-only` field when Enter is pressed at the end of
 * the text (one for the break, one for the placeholder that gives the last line a height). One
 * paragraph insert must add exactly one `\n`: this drops the extra one and returns the text as is
 * for every other edit.
 */
export function collapseDoubleBreak(previous: string, next: string, caret: number): string {
  const doubled = next.slice(caret - 2, caret) === "\n\n";
  const gainedTwo = next.length === previous.length + 2;
  if (!doubled || !gainedTwo) return next;
  const collapsed = next.slice(0, caret - 1) + next.slice(caret);
  const expected = `${previous.slice(0, caret - 2)}\n${previous.slice(caret - 2)}`;
  return collapsed === expected ? collapsed : next;
}
