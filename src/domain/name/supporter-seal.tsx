import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { SupporterSealProps } from "../../types/domain/name/supporter-seal-props.js";

/**
 * Selo "Apoiador": a conta fez ao menos uma doação ao projeto. Fica na mesma familia de
 * `ContributorTag` e `HumanitySeal` — um rotulo curto com a borda do tom semantico, sem
 * valor nem data, porque quanto e quando alguem doou e privado de quem doou.
 */
export function SupporterSeal({ variant = "inline", className }: SupporterSealProps) {
  const messages = useMessages().supporterSeal;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-primary/40 bg-primary-soft font-medium text-primary",
        variant === "inline" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1.5 text-sm",
        className,
      )}
      title={messages.description}
    >
      {messages.label}
    </span>
  );
}
