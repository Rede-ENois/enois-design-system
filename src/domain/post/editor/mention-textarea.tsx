import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

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
import { textFieldClasses } from "../../../lib/text-field-classes.js";
import { useMessages } from "../../../messages/messages-context.js";
import { RichTextToolbarMenu } from "../../../patterns/editor/rich-text-toolbar-menu.js";
import { RichTextToolbar } from "../../../patterns/editor/rich-text-toolbar.js";
import type { MentionTextareaProps } from "../../../types/domain/post/mention-textarea-props.js";
import type { MentionUser } from "../../../types/domain/post/mention-user.js";
import type { MentionListSide } from "../../../types/lib/mentions/list-placement.js";
import type { RichTextFormat } from "../../../types/lib/rich-text/rich-text-format.js";
import { CharCounter } from "../../../ui/char-counter.js";
import { UserAvatar } from "../../avatar/user-avatar.js";

/** Altura mínima da caixa, em linhas de texto, para dar espaço de revisar o que foi escrito. */
const MIN_ROWS = 4;

/**
 * O primeiro `<header>` da página pode ser o de um post. O que cobre a busca é o sticky do topo.
 */
function stickyHeaderBottom(node: HTMLElement): number {
  const header = node.ownerDocument.querySelector("header.sticky");
  return header?.getBoundingClientRect().bottom ?? 0;
}

/** Atalhos de teclado da formatacao; `mod` e Ctrl no Windows/Linux e Cmd no Mac. */
const SHORTCUTS: Record<string, RichTextFormat> = {
  b: "bold",
  i: "italic",
  e: "code",
  k: "link",
};

/** Grows with the text up to 240px; past that it scrolls inside. */
function fitHeight(el: HTMLTextAreaElement): void {
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
}

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
  toolbarMenu = false,
  onPasteImages,
  onSubmitShortcut,
  mentionResults: results,
  onMentionQueryChange,
}: MentionTextareaProps) {
  const messages = useMessages().mentionTextarea;
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionIndex, setMentionIndex] = useState(-1);
  const [listSide, setListSide] = useState<MentionListSide>("above");

  // Auto-expansao: cresce com o texto ate o teto (240px); dali em diante rola dentro.
  // Layout, não effect: a altura tem de estar aplicada antes da medida da lista, no mesmo frame.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (el) fitHeight(el);
  }, [value]);
  // The first measure can run before the field is laid out for good (final width, web font):
  // an empty field then stays several lines tall. Measure again whenever the box changes; the
  // second pass sets the same height, so it settles.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => fitHeight(el));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mentions, setMentions] = useState<Pick<MentionUser, "id" | "username">[]>([]);

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

  // Acompanha o texto: cresce conforme você escreve e encolhe ao apagar, nunca
  // ficando menor que MIN_ROWS linhas — assim dá pra reler e editar o que digitou.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const styles = getComputedStyle(el);
    const parsedLineHeight = parseFloat(styles.lineHeight);
    const lineHeight = Number.isFinite(parsedLineHeight) ? parsedLineHeight : 20;
    const verticalPadding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    const minHeight = MIN_ROWS * lineHeight + verticalPadding;

    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, minHeight)}px`;
  }, [value]);

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
      if (textareaRef.current?.contains(target)) return;
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
    const retained = retainMentions(next, selected);
    setMentions(retained);
    onChange(
      next,
      retained.map((user) => user.id),
    );
  };

  const handleInput = (e: FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    const next = el.value;
    const cursor = el.selectionStart;
    updateMention(next, cursor);
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
    changeValue(
      next,
      mentions.some((mention) => mention.id === user.id) ? mentions : [...mentions, user],
    );
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        const pos = before.length + user.username.length + 2;
        textareaRef.current.setSelectionRange(pos, pos);
        textareaRef.current.focus();
      }
    });
  };

  /** Formata o trecho selecionado e devolve o foco/cursor para dentro do campo. */
  const formatSelection = (format: RichTextFormat) => {
    const element = textareaRef.current;
    if (!element) return;

    const result = applyFormat(
      value,
      element.selectionStart,
      element.selectionEnd,
      format,
      messages.formatPlaceholders,
    );
    if (maxLength !== undefined && result.value.length > maxLength) return;

    changeValue(result.value);

    // O valor volta pelo `value` (componente controlado): a selecao so pode ser reposta depois
    // do proximo paint, quando o textarea ja tem o texto novo.
    requestAnimationFrame(() => {
      const node = textareaRef.current;
      if (!node) return;
      node.focus();
      node.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  };

  /**
   * Emoji do seletor: entra na posição do cursor, substituindo o que estiver selecionado (o mesmo
   * contrato das formatações). O campo não perde o foco ao escolher, então a posição é a que a
   * pessoa estava vendo. Passar do limite não insere — o contador de caracteres já avisa.
   */
  const insertEmoji = (emoji: string) => {
    const element = textareaRef.current;
    const start = element?.selectionStart ?? value.length;
    const end = element?.selectionEnd ?? start;
    const result = insertSnippet(value, start, end, emoji);
    if (maxLength !== undefined && result.value.length > maxLength) return;

    changeValue(result.value);

    requestAnimationFrame(() => {
      const node = textareaRef.current;
      if (!node) return;
      node.focus();
      node.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Antes da lista de menção: com a lista aberta, Enter escolhe a pessoa, mas Ctrl+Enter envia.
    if (onSubmitShortcut && isSubmitShortcut(e.nativeEvent)) {
      e.preventDefault();
      onSubmitShortcut();
      return;
    }

    if (toolbar && (e.ctrlKey || e.metaKey) && !e.altKey) {
      const shortcut = SHORTCUTS[e.key.toLowerCase()];
      if (shortcut) {
        e.preventDefault();
        formatSelection(shortcut);
        return;
      }
    }

    if (mentionIndex === -1 || results.length === 0) return;
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
    }
  };

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      {toolbar &&
        toolbarVisible &&
        (toolbarMenu ? (
          <RichTextToolbarMenu
            label={messages.toolbar}
            onFormat={formatSelection}
            onEmoji={insertEmoji}
            // Dentro do campo, no canto: o texto ganha um respiro à direita para não passar por baixo.
            className="absolute right-1 top-1 z-10"
          />
        ) : (
          <RichTextToolbar
            label={messages.toolbar}
            onFormat={formatSelection}
            onEmoji={insertEmoji}
            className="mb-1.5"
          />
        ))}

      <textarea
        ref={textareaRef}
        value={value}
        onInput={handleInput}
        onKeyDown={handleKey}
        onPaste={(event) => {
          if (!onPasteImages) return;
          const files = Array.from(event.clipboardData?.files ?? []).filter((file) =>
            file.type.startsWith("image/"),
          );
          if (files.length === 0) return;
          event.preventDefault();
          onPasteImages(files);
        }}
        placeholder={placeholder}
        className={textFieldClasses(
          "max-h-[240px] w-full resize-none overflow-y-auto text-base md:text-sm",
          className,
          toolbarMenu && "pr-9",
        )}
        maxLength={maxLength}
        rows={rows}
      />

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
