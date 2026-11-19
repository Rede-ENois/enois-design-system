import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import type { EmoteCellProps } from "../../types/domain/emotes/emote-cell-props.js";
import { Input } from "../../ui/input.js";

/**
 * Uma figurinha na grade: a imagem, o código no `title`/`aria-label` e o clique devolvendo o
 * código.
 *
 * O clique é confirmado na própria célula: só `hover` não aparece no toque, e em telas pequenas a
 * pessoa não sabia se pegou a certa.
 */
export function EmoteCell({ code, src, onSelect }: EmoteCellProps) {
  return (
    <button
      type="button"
      title={code}
      aria-label={code}
      onClick={() => onSelect(code)}
      className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg p-1 transition hover:scale-105 hover:bg-surface-2 hover:ring-1 hover:ring-primary/35 active:scale-95 active:bg-surface-2 active:ring-2 active:ring-ring"
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
