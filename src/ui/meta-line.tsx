import { cn } from "../lib/utils.js";
import type { MetaLineProps } from "../types/components/ui/meta-line-props.js";

/**
 * Linha de apoio miúda e discreta: contagens, página atual, dica de uso.
 *
 * Antes cada tela repetia o próprio `<p>` de 11px; o tamanho e a cor agora vivem aqui.
 */
export function MetaLine({ children, align = "start", nowrap = false }: MetaLineProps) {
  return (
    <p
      className={cn(
        "text-[11px] leading-snug text-text-subtle",
        align === "center" && "text-center",
        align === "end" && "text-right",
        nowrap && "whitespace-nowrap",
      )}
    >
      {children}
    </p>
  );
}
