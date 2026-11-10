import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { HumanitySealProps } from "../../types/domain/name/humanity-seal-props.js";
import { HumanitySealIcon } from "../../ui/humanity-seal-icon.js";

/**
 * Selo "Humanidade Comprovada": aparece ao lado do nome onde o app já mostra indicadores de perfil
 * (perfil, publicações, comentários, mensagens).
 *
 * É diferente de verificação profissional e de certificação de habilidade: o que ele diz é apenas
 * que um provedor especializado confirmou que a conta é de uma pessoa real. Por isso o desenho é
 * sóbrio — sem número, sem nível, sem cor de destaque — e a explicação vai no `title` e no texto
 * longo da variante do perfil.
 */
export function HumanitySeal({ variant = "inline", className }: HumanitySealProps) {
  const messages = useMessages().humanitySeal;

  if (variant === "inline") {
    return (
      <span
        className={cn("inline-flex shrink-0 items-center text-growth", className)}
        title={messages.description}
      >
        <span className="sr-only">{messages.label}</span>

        <HumanitySealIcon className="h-4 w-4" aria-hidden />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-growth/40 bg-growth/10 px-2 py-0.5 text-[11px] font-medium text-growth",
        className,
      )}
      title={messages.description}
    >
      <HumanitySealIcon className="h-3.5 w-3.5" aria-hidden />

      <span>{messages.label}</span>
    </span>
  );
}
