import { cn } from "../lib/utils.js";
import type { SelectProps } from "../types/components/ui/select-props.js";

/**
 * Campo de escolha única.
 *
 * <p>É `<select>` nativo de propósito: no celular o menu do sistema é o alvo de toque mais
 * confortável que existe. O que ele PRECISA declarar é a cor do widget — o popup de opções é
 * desenhado pelo navegador e, sem cor declarada, o texto usa o `color` do tema (claro no dark) sobre
 * o fundo claro do menu: texto branco sobre branco, como reportado com o tema DOS (#726, #727).
 * Fundo e texto dos tokens resolvem o fechado E as opções, porque o `<option>` herda o `color` e o
 * `background-color` do select pai.</p>
 */
export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-surface-card px-3 py-1 text-base text-text-strong shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&>option]:bg-surface-card [&>option]:text-text-strong",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
