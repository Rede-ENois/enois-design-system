import { Loader2 } from "lucide-react";

import { cn } from "../lib/utils.js";
import type { PullIndicatorProps } from "../types/components/ui/pull-indicator-props.js";

/**
 * Feedback do gesto de puxar para renovar: o ponto acompanha o dedo (até um teto, para não virar
 * pular de pulo) e gira proporcionalmente ao arrasto; passando do limite, gira contínuo — o gesto
 * "pegou". Decorativo (`aria-hidden`): quem usa leitor de tela tem o estado por `role="status"`
 * do chamador quando a renovação começa.
 *
 * Ancorado acima do conteúdo (o gesto acontece no topo da lista), dentro do bloco `relative`
 * do chamador.
 */
export function PullIndicator({ pull, trigger, className }: PullIndicatorProps) {
  const ready = pull >= trigger;
  const distance = Math.min(pull, trigger * 1.2);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 -top-12 z-10 flex translate-y-[var(--pull)] justify-center",
        className,
      )}
      style={{ "--pull": `${distance}px` }}
    >
      <span
        className="inline-flex rotate-[var(--pull-turn)] items-center justify-center rounded-full bg-surface-card p-2 shadow-[var(--shadow-float)]"
        style={{ "--pull-turn": `${(pull / trigger) * 360}deg` }}
      >
        <Loader2 className={cn("h-4 w-4 text-primary", ready && "animate-spin")} />
      </span>
    </div>
  );
}
