import { type PointerEvent as ReactPointerEvent, useRef } from "react";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import type { EmoteCellProps } from "../../types/domain/emotes/emote-cell-props.js";
import { Input } from "../../ui/input.js";

/** Quanto tempo de pressão vira gesto de segurar (o toque curto segue escolhendo a figurinha). */
const HOLD_MS = 500;

/**
 * Uma figurinha na grade: a imagem, o código no `title`/`aria-label` e o clique devolvendo o
 * código.
 *
 * O clique é confirmado na própria célula: só `hover` não aparece no toque, e em telas pequenas a
 * pessoa não sabia se pegou a certa.
 *
 * Com `onHold`, segurar a figurinha abre as ações dela (denunciar, banir) em vez de escolher: o
 * clique que o navegador dispara ao soltar depois de uma pressão longa é descartado, e o toque
 * curto continua escolhendo. O mesmo gesto fica no menu de contexto (botão direito, Shift+F10 no
 * teclado), que é como quem não usa o toque chega nele.
 */
export function EmoteCell({ code, src, onSelect, onHold, holdLabel }: EmoteCellProps) {
  const holdTimer = useRef<number | null>(null);
  const held = useRef(false);

  const cancelHold = () => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const startPress = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!onHold || (event.pointerType === "mouse" && event.button !== 0)) {
      return;
    }
    cancelHold();
    held.current = false;
    holdTimer.current = window.setTimeout(() => {
      holdTimer.current = null;
      held.current = true;
      onHold(code);
    }, HOLD_MS);
  };

  const endPress = () => cancelHold();

  return (
    <button
      type="button"
      title={holdLabel ? `${code} — ${holdLabel}` : code}
      aria-label={code}
      onClick={() => {
        if (held.current) {
          held.current = false;
          return;
        }
        onSelect(code);
      }}
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerCancel={endPress}
      onPointerLeave={cancelHold}
      onContextMenu={
        onHold
          ? (event) => {
              event.preventDefault();
              onHold(code);
            }
          : undefined
      }
      onKeyDown={
        onHold
          ? (event) => {
              if (event.key === "F10" && event.shiftKey) {
                event.preventDefault();
                onHold(code);
              }
            }
          : undefined
      }
      className="mx-auto flex h-9 w-9 touch-none select-none items-center justify-center rounded-lg p-1 transition [-webkit-touch-callout:none] hover:scale-105 hover:bg-surface-2 hover:ring-1 hover:ring-primary/35 active:scale-95 active:bg-surface-2 active:ring-2 active:ring-ring"
    >
      {src && (
        <img
          src={src}
          alt={code}
          loading="lazy"
          decoding="async"
          className="h-7 w-7 object-contain"
        />
      )}
    </button>
  );
}

/**
 * Busca do seletor com a lupa dentro do campo.
 *
 * O `autoFocus` leva o foco à busca quando o diálogo abre (o Radix foca o primeiro elemento
 * focável; aqui é este campo, não o botão de fechar).
 */
export function EmoteSearchField({
  value,
  onChange,
  placeholder,
  autoFocus = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="relative min-w-0">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-subtle" />
      <Input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
        className="pl-8"
        showCounter={false}
      />
    </div>
  );
}

/** A grade em si: seis colunas no telefone, oito da tela pequena para cima. */
export function EmoteGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-8 gap-0.5 sm:grid-cols-10">{children}</div>;
}

/**
 * Botão de página (anterior/próxima): redondo, pequeno e só com o chevron — o rótulo vai para o
 * `aria-label`, porque quem vê a tela entende pela posição.
 */
export function EmotePageButton({
  direction,
  label,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-7 items-center justify-center rounded-full border border-border bg-background px-2 text-text-strong transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
