import {
  type ClipboardEvent,
  type KeyboardEvent,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useAdapters } from "../../../adapters/adapters-context.js";
import {
  MENTION_LIST_GAP,
  MENTION_LIST_MAX_HEIGHT,
  mentionListSide,
  mentionListSpaceAbove,
} from "../../../lib/mentions/list-placement.js";
import { applyFormat } from "../../../lib/rich-text/apply-format.js";
import { insertSnippet } from "../../../lib/rich-text/insert-snippet.js";
import { parseRichText } from "../../../lib/rich-text/parse.js";
import { isSubmitShortcut } from "../../../lib/submit-shortcut.js";
import { useMessages } from "../../../messages/messages-context.js";
import { RichTextToolbar } from "../../../patterns/editor/rich-text-toolbar.js";
import type { EditorEditKind } from "../../../types/domain/post/editor-edit-kind.js";
import type { EditorHistorySnapshot } from "../../../types/domain/post/editor-history-snapshot.js";
import type { MentionTextareaProps } from "../../../types/domain/post/mention-textarea-props.js";
import type { MentionUser } from "../../../types/domain/post/mention-user.js";
import type { TextSelection } from "../../../types/domain/post/text-selection.js";
import type { MentionListSide } from "../../../types/lib/mentions/list-placement.js";
import type { RichTextFormat } from "../../../types/lib/rich-text/rich-text-format.js";
import { CharCounter } from "../../../ui/char-counter.js";
import { UserAvatar } from "../../avatar/user-avatar.js";

import {
  collapseDoubleBreak,
  matchesSegments,
  readRangeText,
  readSelection,
  readSelectionEnds,
  readText,
  renderSegments,
  segmentText,
  selectionOnNodeBoundary,
  stepOverSticker,
  stickerAdjacentTo,
  syncTrailingBreak,
  writeSelection,
  writeSelectionEnds,
} from "./editor-dom.js";
import { createHistory, recordEdit, resetHistory, stepHistory } from "./editor-history.js";
import { initialContent } from "./initial-content.js";

/** Altura mínima da caixa, em linhas de texto, para dar espaço de revisar o que foi escrito. */
const MIN_ROWS = 4;

/**
 * O primeiro `<header>` da página pode ser o de um post. O que cobre a busca é o sticky do topo.
 */
function stickyHeaderBottom(node: HTMLElement): number {
  const header = node.ownerDocument.querySelector("header.sticky");
  return header?.getBoundingClientRect().bottom ?? 0;
}

/** The history step an `input` event belongs to; unknown kinds are a step of their own. */
function editKindOf(inputType: string): EditorEditKind {
  if (inputType === "" || inputType === "insertText" || inputType === "insertCompositionText") {
    return "insert";
  }
  return inputType.startsWith("deleteContent") ? "delete" : "step";
}

/** Atalhos de teclado da formatacao; `mod` e Ctrl no Windows/Linux e Cmd no Mac. */
const SHORTCUTS: Record<string, RichTextFormat> = {
  b: "bold",
  i: "italic",
  e: "code",
  k: "link",
};

function retainMentions(text: string, mentions: Pick<MentionUser, "id" | "username">[]) {
  // Use the rendered tokens, including formatted mentions and excluding literal code.
  const nodes = parseRichText(text);
  const usernames = new Set<string>();
  while (nodes.length > 0) {
    const node = nodes.pop()!;
    if (node.kind === "mention" && node.text) usernames.add(node.text.slice(1));
    nodes.push(...(node.children ?? []), ...(node.nested ?? []));
  }
  return mentions.filter((user) => usernames.has(user.username));
}

export function MentionTextarea({
  value,
  onChange,
  placeholder,
  className = "",
  maxLength,
  showCounter = true,
  rows,
  toolbar = false,
  toolbarVisible = true,
  onPasteImages,
  onSubmitShortcut,
  mentionResults: results,
  onMentionQueryChange,
  stickers,
  ref,
}: MentionTextareaProps) {
  const messages = useMessages().mentionTextarea;
  const { resolveMediaUrl } = useAdapters();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  // Where the caret was last seen inside the field; survives the focus going to a dialog.
  const lastSelectionRef = useRef<TextSelection | null>(null);
  // A selection to put back once the next value is drawn; `focus` also gives the field the focus.
  const pendingSelectionRef = useRef<(TextSelection & { focus: boolean }) | null>(null);
  const composingRef = useRef(false);
  const [history] = useState(createHistory);
  // The value this component last committed; a different `value` came from outside.
  const committedValueRef = useRef(value);
  // Where the caret was just before the browser edited the field (set by `beforeinput`).
  const beforeInputSelectionRef = useRef<TextSelection | null>(null);
  const beforeInputHandlerRef = useRef<(event: InputEvent) => void>(() => undefined);
  // Browsers without `contenteditable="plaintext-only"` insert block elements on Enter instead.
  const blockEnterRef = useRef(false);
  // Drawn once, for the server markup and hydration; see `initialContent`.
  const [firstContent] = useState(() =>
    initialContent(segmentText(value, stickers, resolveMediaUrl)),
  );
  const [, setRedrawCount] = useState(0);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionIndex, setMentionIndex] = useState(-1);
  const [listSide, setListSide] = useState<MentionListSide>("above");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mentions, setMentions] = useState<Pick<MentionUser, "id" | "username">[]>([]);

  useLayoutEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const mode = el.contentEditable;
    if (typeof mode === "string" && mode !== "plaintext-only") {
      el.contentEditable = "true";
      blockEnterRef.current = true;
    }
  }, []);

  // Draws `value` in the field. The DOM already matches while the person types, so this only
  // rebuilds it when it differs: a typed word became a sticker, the parent replaced the text, or
  // something rich was pasted. The caret is kept by text offset.
  useLayoutEffect(() => {
    const el = fieldRef.current;
    if (value !== committedValueRef.current) {
      // The parent replaced the text (cleared the draft, loaded another one): old steps are stale.
      committedValueRef.current = value;
      resetHistory(history);
    }
    if (!el || composingRef.current) return;

    const segments = segmentText(value, stickers, resolveMediaUrl);
    if (!matchesSegments(el, segments)) {
      const selection = readSelection(el);
      renderSegments(el, segments);
      if (selection) writeSelection(el, selection.start, selection.end);
    }
    syncTrailingBreak(el);

    const pending = pendingSelectionRef.current;
    if (!pending) return;
    pendingSelectionRef.current = null;
    lastSelectionRef.current = { start: pending.start, end: pending.end };
    if (pending.focus || el.ownerDocument.activeElement === el) {
      el.focus({ preventScroll: true });
      writeSelection(el, pending.start, pending.end);
    }
  });

  // The box grows with the text up to 240px (class) and is never shorter than `rows` lines.
  useLayoutEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const styles = getComputedStyle(el);
    const parsedLineHeight = parseFloat(styles.lineHeight);
    const lineHeight = Number.isFinite(parsedLineHeight) ? parsedLineHeight : 20;
    const verticalPadding =
      (parseFloat(styles.paddingTop) || 0) + (parseFloat(styles.paddingBottom) || 0);
    el.style.minHeight = `${Math.max(MIN_ROWS, rows ?? 0) * lineHeight + verticalPadding}px`;
  }, [rows, className]);

  // Remember the caret while it is inside the field: a dialog takes the focus away, and the owner
  // still inserts where the person was writing.
  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const remember = () => {
      const selection = readSelection(el);
      if (selection && !composingRef.current) lastSelectionRef.current = selection;
    };
    el.ownerDocument.addEventListener("selectionchange", remember);
    return () => el.ownerDocument.removeEventListener("selectionchange", remember);
  }, []);

  // A parent can clear or replace the draft without unmounting the editor.
  useEffect(() => {
    setMentions((current) => {
      const retained = retainMentions(value, current);
      return retained.length === current.length ? current : retained;
    });
  }, [value]);

  // A busca de quem mencionar é do app: o termo sobe e a lista volta em `mentionResults`.
  useEffect(() => {
    onMentionQueryChange(mentionQuery);
  }, [mentionQuery, onMentionQueryChange]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [results.length]);

  const listOpen = mentionQuery.length >= 2 && results.length > 0;

  // O scroll não borbulha: sem capture, rolar um diálogo não reavalia o lado.
  // Declarado depois dos efeitos de altura para medir o campo já crescido.
  useLayoutEffect(() => {
    if (!listOpen) return;

    const measure = () => {
      const node = rootRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const next = mentionListSide(
        mentionListSpaceAbove(rect.top, stickyHeaderBottom(node)),
        window.innerHeight - rect.bottom,
        MENTION_LIST_MAX_HEIGHT + MENTION_LIST_GAP,
      );
      setListSide((current) => (current === next ? current : next));
    };

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [listOpen, value]);

  // O campo continua a edição da menção. Fora da lista e do campo, o clique dispensa
  // o painel — senão ele fica por cima de Tipo, abas e do resto da página.
  useEffect(() => {
    if (!listOpen) return;

    const closeOnOutside = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (listRef.current?.contains(target)) return;
      if (fieldRef.current?.contains(target)) return;
      setMentionQuery("");
      setMentionIndex(-1);
    };

    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [listOpen]);

  const updateMention = (text: string, cursor: number) => {
    const before = text.slice(0, cursor);
    const at = before.lastIndexOf("@");
    if (at === -1) {
      setMentionQuery("");
      setMentionIndex(-1);
      return;
    }
    const term = before.slice(at + 1);
    if (term.includes(" ") || term.includes("\n") || term.length === 0) {
      setMentionQuery("");
      setMentionIndex(-1);
      return;
    }
    setMentionQuery(term);
    setMentionIndex(at);
  };

  const changeValue = (next: string, selected = mentions) => {
    committedValueRef.current = next;
    const retained = retainMentions(next, selected);
    setMentions(retained);
    onChange(
      next,
      retained.map((user) => user.id),
    );
  };

  const currentSelection = (): TextSelection => {
    const el = fieldRef.current;
    const live = el ? readSelection(el) : null;
    const selection = live ??
      lastSelectionRef.current ?? { start: value.length, end: value.length };
    const end = Math.min(selection.end, value.length);
    return { start: Math.min(selection.start, end), end };
  };

  /** Puts the edit that is about to be committed into the history. */
  const record = (
    kind: EditorEditKind,
    next: string,
    caret: number,
    beforeSelection = currentSelection(),
  ) => {
    recordEdit(
      history,
      kind,
      { value, selection: beforeSelection, mentions },
      { value: next, caret },
    );
  };

  /** Commits an edit: the new value goes up and the selection is put back once it is drawn. */
  const applyEdit = (
    next: string,
    selection: TextSelection,
    focus: boolean,
    kind: EditorEditKind = "step",
    beforeSelection?: TextSelection,
  ) => {
    record(kind, next, selection.end, beforeSelection);
    pendingSelectionRef.current = { ...selection, focus };
    updateMention(next, selection.end);
    changeValue(next);
    setRedrawCount((count) => count + 1);
  };

  /** Reads what the person did to the DOM (typing, IME, undo, a native delete). */
  const readFromDom = (inputType = "") => {
    const el = fieldRef.current;
    if (!el) return;
    const next = readText(el);
    const isLineBreak = inputType === "insertParagraph" || inputType === "insertLineBreak";
    const caret = readSelection(el)?.end;
    const beforeSelection = beforeInputSelectionRef.current ?? undefined;
    beforeInputSelectionRef.current = null;
    if (isLineBreak && caret !== undefined) {
      const collapsed = collapseDoubleBreak(value, next, caret);
      if (collapsed !== next) {
        applyEdit(collapsed, { start: caret - 1, end: caret - 1 }, true, "step", beforeSelection);
        return;
      }
    }
    const overLimit = maxLength !== undefined && next.length > maxLength;
    if (overLimit && composingRef.current) return;
    if (overLimit) {
      // Over the limit: the field shows `value` again, as a controlled textarea with maxLength did.
      renderSegments(el, segmentText(value, stickers, resolveMediaUrl));
      syncTrailingBreak(el);
      const previous = lastSelectionRef.current ?? { start: value.length, end: value.length };
      writeSelection(el, previous.start, previous.end);
      return;
    }
    if (next === "" && el.childNodes.length > 0 && !composingRef.current) el.replaceChildren();
    const selection = readSelection(el);
    record(editKindOf(inputType), next, selection?.end ?? next.length, beforeSelection);
    updateMention(next, selection?.end ?? next.length);
    changeValue(next);
  };

  const pick = (user: MentionUser) => {
    if (mentionIndex === -1) return;
    const before = value.slice(0, mentionIndex);
    const after = value.slice(mentionIndex + mentionQuery.length + 1);
    const next = `${before}@${user.username} ${after}`;
    if (maxLength !== undefined && next.length > maxLength) return;

    setMentionQuery("");
    setMentionIndex(-1);
    const caret = before.length + user.username.length + 2;
    record("step", next, caret);
    pendingSelectionRef.current = { start: caret, end: caret, focus: true };
    changeValue(
      next,
      mentions.some((mention) => mention.id === user.id) ? mentions : [...mentions, user],
    );
    setRedrawCount((count) => count + 1);
  };

  /** Formata o trecho selecionado e devolve o foco/cursor para dentro do campo. */
  const formatSelection = (format: RichTextFormat) => {
    const selection = currentSelection();
    const result = applyFormat(
      value,
      selection.start,
      selection.end,
      format,
      messages.formatPlaceholders,
    );
    if (maxLength !== undefined && result.value.length > maxLength) return;

    applyEdit(result.value, { start: result.selectionStart, end: result.selectionEnd }, true);
  };

  /**
   * Replaces the selection with `text`. `spaced` keeps the text apart from its neighbours with
   * spaces, so a sticker code stays a word. Over `maxLength` nothing changes. The caret lands after
   * the insert; the field takes the focus only if it had it (a dialog may be open over it).
   */
  const insertText = (text: string, spaced: boolean, selection = currentSelection()): boolean => {
    const before = value.slice(0, selection.start);
    const after = value.slice(selection.end);
    const prefix = spaced && before && !/\s$/.test(before) ? " " : "";
    const suffix = spaced && after && !/^\s/.test(after) ? " " : "";
    const inserted = `${prefix}${text}${suffix}`;
    const next = `${before}${inserted}${after}`;
    if (maxLength !== undefined && next.length > maxLength) return false;

    const caret = before.length + inserted.length;
    const focused = fieldRef.current?.ownerDocument.activeElement === fieldRef.current;
    applyEdit(next, { start: caret, end: caret }, focused);
    return true;
  };

  /**
   * Emoji do seletor: entra na posição do cursor, substituindo o que estiver selecionado (o mesmo
   * contrato das formatações). Passar do limite não insere — o contador de caracteres já avisa.
   */
  const insertEmoji = (emoji: string) => {
    const selection = currentSelection();
    const result = insertSnippet(value, selection.start, selection.end, emoji);
    if (maxLength !== undefined && result.value.length > maxLength) return;

    applyEdit(result.value, { start: result.selectionStart, end: result.selectionEnd }, true);
  };

  useImperativeHandle(ref, () => ({
    insertAtCaret: (text) => insertText(text, true),
    focus: () => {
      const el = fieldRef.current;
      if (!el) return;
      const selection = currentSelection();
      el.focus({ preventScroll: true });
      writeSelection(el, selection.start, selection.end);
    },
  }));

  /** Undo or redo one step: goes through `onChange` and mention reconciliation like any edit. */
  const moveInHistory = (direction: "undo" | "redo") => {
    const current: EditorHistorySnapshot = { value, selection: currentSelection(), mentions };
    const target = stepHistory(
      history,
      direction,
      current,
      (candidate) => maxLength === undefined || candidate.value.length <= maxLength,
    );
    if (!target) return;
    const focused = fieldRef.current?.ownerDocument.activeElement === fieldRef.current;
    pendingSelectionRef.current = { ...target.selection, focus: focused };
    updateMention(target.value, target.selection.end);
    changeValue(target.value, target.mentions);
    setRedrawCount((count) => count + 1);
  };

  /**
   * ArrowLeft/ArrowRight step over a sticker as one character. The browser's own move around a
   * non-editable span takes extra presses or gets stuck at its edge, so the move is done here
   * whenever a sticker is next (and for a collapse of a selection, which would end at that edge).
   */
  const moveAcrossSticker = (e: KeyboardEvent<HTMLDivElement>) => {
    const el = fieldRef.current;
    const ends = el ? readSelectionEnds(el) : null;
    if (!el || !ends || !stickers) return;
    const direction = e.key === "ArrowLeft" ? "backward" : "forward";
    if (e.shiftKey) {
      const target = stepOverSticker(value, ends.focus, direction, stickers, resolveMediaUrl);
      if (target === null) return;
      e.preventDefault();
      writeSelectionEnds(el, ends.anchor, target);
      return;
    }
    if (ends.anchor !== ends.focus) {
      e.preventDefault();
      const edges = [ends.anchor, ends.focus];
      const edge = direction === "backward" ? Math.min(...edges) : Math.max(...edges);
      writeSelection(el, edge, edge);
      return;
    }
    const target = stepOverSticker(value, ends.focus, direction, stickers, resolveMediaUrl);
    if (target === null) return;
    e.preventDefault();
    writeSelection(el, target, target);
  };

  /** Typing next to a sticker is done here: the browser may drop it at the span's edge. */
  const handleBeforeInput = (event: InputEvent) => {
    const el = fieldRef.current;
    if (!el) return;
    if (event.inputType === "historyUndo" || event.inputType === "historyRedo") {
      event.preventDefault();
      moveInHistory(event.inputType === "historyUndo" ? "undo" : "redo");
      return;
    }
    beforeInputSelectionRef.current = readSelection(el);
    const typed = event.inputType === "insertText" && event.data !== null && !event.isComposing;
    if (!typed || !selectionOnNodeBoundary(el)) return;
    event.preventDefault();
    const selection = currentSelection();
    const next = value.slice(0, selection.start) + event.data + value.slice(selection.end);
    if (maxLength !== undefined && next.length > maxLength) return;
    const caret = selection.start + event.data.length;
    applyEdit(next, { start: caret, end: caret }, true, "insert", selection);
  };

  useLayoutEffect(() => {
    beforeInputHandlerRef.current = handleBeforeInput;
  });

  // React has no native `beforeinput` with `inputType`, so it is listened to here.
  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const listener = (event: Event) => {
      if (event instanceof InputEvent) beforeInputHandlerRef.current(event);
    };
    el.addEventListener("beforeinput", listener);
    return () => el.removeEventListener("beforeinput", listener);
  }, []);

  const deleteStickerAtCaret = (
    e: KeyboardEvent<HTMLDivElement>,
    direction: "backward" | "forward",
  ) => {
    const selection = currentSelection();
    if (selection.start !== selection.end) return;
    const range = stickerAdjacentTo(value, selection.start, direction, stickers, resolveMediaUrl);
    if (!range) return;
    e.preventDefault();
    applyEdit(
      value.slice(0, range.start) + value.slice(range.end),
      { start: range.start, end: range.start },
      true,
    );
  };

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    // Antes da lista de menção: com a lista aberta, Enter escolhe a pessoa, mas Ctrl+Enter envia.
    if (onSubmitShortcut && isSubmitShortcut(e.nativeEvent)) {
      e.preventDefault();
      onSubmitShortcut();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.nativeEvent.isComposing) {
      const key = e.key.toLowerCase();
      if (key === "z" || (key === "y" && e.ctrlKey)) {
        // Always ours: the native stack is wiped by every redraw of the field.
        e.preventDefault();
        moveInHistory(key === "z" && !e.shiftKey ? "undo" : "redo");
        return;
      }
    }

    if (toolbar && (e.ctrlKey || e.metaKey) && !e.altKey) {
      const shortcut = SHORTCUTS[e.key.toLowerCase()];
      if (shortcut) {
        e.preventDefault();
        formatSelection(shortcut);
        return;
      }
    }

    if (mentionIndex !== -1 && results.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => (i + 1) % results.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => (i - 1 + results.length) % results.length);
        return;
      }
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        pick(results[selectedIdx]);
        return;
      }
      if (e.key === "Escape") {
        // Closing the list is all Esc does here: an inline reply around the field must not close.
        e.preventDefault();
        setMentionQuery("");
        setMentionIndex(-1);
        return;
      }
    }

    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && blockEnterRef.current) {
      e.preventDefault();
      insertText("\n", false);
      return;
    }
    if (
      (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      moveAcrossSticker(e);
      return;
    }
    if (e.key === "Backspace") deleteStickerAtCaret(e, "backward");
    else if (e.key === "Delete") deleteStickerAtCaret(e, "forward");
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const files = Array.from(event.clipboardData?.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    event.preventDefault();
    if (files.length > 0) {
      onPasteImages?.(files);
      return;
    }

    // Always as plain text: pasted HTML becomes text, and a long paste is cut at the limit.
    const pasted = (event.clipboardData?.getData("text/plain") ?? "").replace(/\r\n?/g, "\n");
    if (!pasted) return;
    const selection = currentSelection();
    const room =
      maxLength === undefined
        ? pasted.length
        : maxLength - (value.length - (selection.end - selection.start));
    if (room <= 0) return;
    let text = pasted.slice(0, room);
    // Never cut a surrogate pair in half.
    if (text.length < pasted.length && /[\uD800-\uDBFF]$/.test(text)) text = text.slice(0, -1);
    insertText(text, false, selection);
  };

  /** Copy and cut give the codes of the stickers in the selection, never their markup. */
  const handleCopy = (event: ClipboardEvent<HTMLDivElement>, cut: boolean) => {
    const el = fieldRef.current;
    const selection = el ? readSelection(el) : null;
    const domSelection = el?.ownerDocument.getSelection();
    const range = domSelection && domSelection.rangeCount > 0 ? domSelection.getRangeAt(0) : null;
    if (!selection || !range || selection.start === selection.end) return;
    event.preventDefault();
    event.clipboardData.setData("text/plain", readRangeText(range));
    if (!cut) return;
    applyEdit(
      value.slice(0, selection.start) + value.slice(selection.end),
      { start: selection.start, end: selection.start },
      true,
    );
  };

  const endComposition = () => {
    composingRef.current = false;
    readFromDom();
    setRedrawCount((count) => count + 1);
  };

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      {toolbar && toolbarVisible && (
        <RichTextToolbar
          label={messages.toolbar}
          onFormat={formatSelection}
          onEmoji={insertEmoji}
          className="mb-1.5"
        />
      )}

      <div
        ref={fieldRef}
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        aria-placeholder={placeholder}
        contentEditable="plaintext-only"
        suppressContentEditableWarning
        data-placeholder={placeholder}
        data-max-length={maxLength}
        onInput={(event) => {
          const native = event.nativeEvent;
          readFromDom(
            "inputType" in native && typeof native.inputType === "string" ? native.inputType : "",
          );
        }}
        onKeyDown={handleKey}
        onPaste={handlePaste}
        onCopy={(event) => handleCopy(event, false)}
        onCut={(event) => handleCopy(event, true)}
        onCompositionStart={() => {
          composingRef.current = true;
        }}
        onCompositionEnd={endComposition}
        className={`max-h-[240px] w-full min-w-0 overflow-y-auto whitespace-pre-wrap break-words [overflow-wrap:anywhere] empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)] ${className}`}
      >
        {firstContent}
      </div>

      {/* Mesmo contador de todo campo com limite (Input/Textarea usam o CharCounter via withCounter):
          um so lugar decide o aviso de "perto do limite" e o "limite atingido". */}
      {showCounter && maxLength !== undefined && (
        <CharCounter length={value.length} max={maxLength} />
      )}

      {/* `bottom-full` fixo cobria a busca do /feed: o composer fica sob o header. */}
      {listOpen && (
        <div
          ref={listRef}
          className={`absolute left-0 right-0 z-50 max-h-48 overflow-y-auto rounded-xl border border-border bg-popover shadow-lg ${
            listSide === "below" ? "top-full mt-1" : "bottom-full mb-1"
          }`}
        >
          {results.map((user, i) => (
            <button
              key={user.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                pick(user);
              }}
              onMouseEnter={() => setSelectedIdx(i)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition ${
                i === selectedIdx ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              <UserAvatar src={user.avatar} alt={user.name} className="h-8 w-8 shrink-0" />

              <div className="min-w-0">
                <p className="truncate font-medium">{user.name}</p>

                <p className="truncate text-xs text-muted-foreground">
                  {messages.username(user.username)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
