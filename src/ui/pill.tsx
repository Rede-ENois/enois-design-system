import { cn } from "../lib/utils.js";
import type { PillProps } from "../types/components/ui/pill-props.js";

const SIZES = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-9 px-4 text-sm",
} as const;

/**
 * As pílulas desenham 32/36px de altura, abaixo dos 44px de alvo de toque confortável no
 * celular; o pseudo-elemento infla a área tocável sem mudar o desenho (mesmo recurso das
 * pílulas de reação).
 */
const TOUCH_AREA =
  "relative before:absolute before:-inset-y-1.5 before:-inset-x-0.5 before:content-['']";

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
        TOUCH_AREA,
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
