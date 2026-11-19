import { useEffect, useMemo, useState } from "react";

import { Smile } from "lucide-react";

import { EMOJI_CATEGORIES } from "../constants/emoji-catalog.js";
import { cn } from "../lib/utils.js";
import { useMessages } from "../messages/messages-context.js";
import type { EmojiPickerProps } from "../types/components/ui/emoji-picker-props.js";

import { Input } from "./input.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

/** Quantos emojis ficam visíveis antes do "+" (uma fileira da grade de 6 colunas). */
const FIRST_ROW = 5;

/**
 * Quantos emojis recentes a memória guarda. Doze = duas fileiras: o bastante para a "mão" de quem
 * usa sempre os mesmos, sem empurrar a lista curada para longe.
 */
const RECENT_LIMIT = 12;

/** Chave do localStorage dos recentes. Os últimos escolhidos voltam primeiro (FIFO). */
const RECENTS_KEY = "enois-emoji-recents";

/** Sem acento e em minúsculas: "coração" e "coracao" acham o mesmo emoji. */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Recência primeiro: os recentes que existem na lista pedida abrem a fileira (na ordem em que
 * foram usados, o último primeiro), e o resto segue a ordem curada, sem dup.
 */
function ordenarComRecentes<T extends { emoji: string }>(entries: T[], recents: string[]): T[] {
  if (recents.length === 0) return entries;
  const byEmoji = new Map(entries.map((entry) => [entry.emoji, entry]));
  const recentes = recents
    .map((emoji) => byEmoji.get(emoji))
    .filter((e): e is T => e !== undefined);
  const recentesSet = new Set(recentes.map((e) => e.emoji));
  return [...recentes, ...entries.filter((entry) => !recentesSet.has(entry.emoji))];
}

/**
 * Seletor de emojis: a lista na tela para quem escreve no computador (sem teclado de emoji) e para
 * aparelho que não renderiza emoji nenhum.
 *
 * O emoji entra como CARACTERE no texto, então vale em qualquer campo e sobrevive a copiar e colar.
 * Os botões usam `onMouseDown` com `preventDefault` (mesma regra da barra de formatação): o campo
 * de escrita não perde o foco, e é dele que sai a posição do cursor na hora de inserir. O seletor
 * fica aberto depois de escolher — quem quer três emojis seguidos não precisa reabrir.
 *
 * Primeira fileira + "+": a grade completa de uma categoria é longa, e no celular ninguém rola
 * um popover para achar emoji. A primeira fileira da categoria (ou do resultado da busca) fica à
 * vista e o "+" revela o resto, com o mesmo gesto em todas as superfícies do app.
 *
 * Ordem: os emojis recentes vêm PRIMEIRO (o último escolhido abre a fileira) — quem usa sempre os
 * mesmos três não os procura de novo em cada categoria. Depois vêm os da categoria curada, sem
 * repetir os recentes que já apareceram. Os recentes ficam no navegador (é memória de uso, não
 * dado de conta): falha ao ler ou gravar não impede escolher emoji.
 */
export function EmojiPicker({ onPick, buttonClassName, buttonTitle }: EmojiPickerProps) {
  const messages = useMessages().emojiPicker;
  const first = EMOJI_CATEGORIES[0]?.id ?? "";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState(first);
  const [expanded, setExpanded] = useState(false);
  const [recents, setRecents] = useState<string[]>([]);

  // Lê uma vez, na montagem: a memória é do navegador, não do render.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENTS_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      setRecents(
        Array.isArray(parsed) ? parsed.filter((e): e is string => typeof e === "string") : [],
      );
    } catch {
      setRecents([]);
    }
  }, []);

  const remember = (emoji: string) => {
    setRecents((current) => {
      const next = [emoji, ...current.filter((e) => e !== emoji)].slice(0, RECENT_LIMIT);
      try {
        localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
      } catch {
        // Armazenamento bloqueado: a ordem vale nesta sessão, só não sobrevive ao recarregar.
      }
      return next;
    });
  };

  const term = normalize(query.trim());
  const results = useMemo(() => {
    if (term === "") {
      const daCategoria =
        EMOJI_CATEGORIES.find((category) => category.id === categoryId)?.emojis ?? [];
      return ordenarComRecentes(daCategoria, recents);
    }
    const literal = query.trim();
    const achados = EMOJI_CATEGORIES.flatMap((category) => category.emojis).filter(
      (entry) => normalize(entry.name).includes(term) || entry.emoji === literal,
    );
    // Busca é busca: sai na ordem do catálogo. Recência manda na navegação por categoria.
    return ordenarComRecentes(achados, recents);
  }, [categoryId, query, term, recents]);

  const keepFocus = (event: { preventDefault: () => void }) => event.preventDefault();

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setExpanded(false);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          title={buttonTitle}
          aria-label={buttonTitle}
          onMouseDown={keepFocus}
          className={buttonClassName}
        >
          <Smile className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" side="top" className="w-72 p-2">
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setExpanded(false);
          }}
          placeholder={messages.search}
          aria-label={messages.search}
          className="h-8 text-xs"
        />

        {term === "" && (
          <div className="mt-2 flex flex-wrap gap-1">
            {EMOJI_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onMouseDown={keepFocus}
                onClick={() => {
                  setCategoryId(category.id);
                  setExpanded(false);
                }}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-medium transition",
                  category.id === categoryId
                    ? "bg-primary-soft text-primary"
                    : "text-text-subtle hover:bg-surface-2",
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        )}

        {results.length === 0 ? (
          <p className="py-6 text-center text-xs font-normal text-text-subtle">{messages.empty}</p>
        ) : (
          <div className="mt-2 grid max-h-56 grid-cols-6 gap-0.5 overflow-y-auto overscroll-contain">
            {(expanded ? results : results.slice(0, FIRST_ROW)).map((entry, index) => (
              <button
                key={`${entry.emoji}-${index}`}
                type="button"
                title={entry.name}
                aria-label={entry.name}
                onMouseDown={keepFocus}
                onClick={() => {
                  remember(entry.emoji);
                  onPick(entry.emoji);
                }}
                className="grid h-8 w-8 place-items-center rounded-lg text-lg leading-none transition hover:bg-surface-2"
              >
                {entry.emoji}
              </button>
            ))}
            {!expanded && results.length > FIRST_ROW && (
              <button
                type="button"
                title={messages.more}
                aria-label={messages.more}
                onMouseDown={keepFocus}
                onClick={() => setExpanded(true)}
                className="grid h-8 w-8 place-items-center rounded-lg text-lg font-semibold leading-none text-text-subtle transition hover:bg-surface-2"
              >
                +
              </button>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
