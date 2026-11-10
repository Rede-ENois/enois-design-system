import { cn } from "../lib/utils.js";
import type { PillProps } from "../types/components/ui/pill-props.js";

const SIZES = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-9 px-4 text-sm",
} as const;

/**
 * Filtro/aba em formato de pílula.
 *
 * Existiam quatro implementações do mesmo controle (feed, filtros de vaga, tópicos de
 * comunidade, abas do editar perfil) com bordas, fundos e tamanhos levemente diferentes.
 * Aqui vira um só, com a variante `active`.
 */
export function Pill({ active = false, size = "md", onClick, className, children }: PillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border font-semibold transition",
        SIZES[size],
        // Active is a soft violet field, not a solid button: a filter is a place you are, not an
        // action to press.
        active
          ? "border-transparent bg-primary-soft text-text-strong"
          : "border-border-soft bg-transparent text-text-subtle hover:bg-surface-2 hover:text-text-strong",
        className,
      )}
    >
      {children}
    </button>
  );
}
