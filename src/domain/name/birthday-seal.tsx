import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { BirthdaySealProps } from "../../types/domain/name/birthday-seal-props.js";

/**
 * Tag "Aniversariante": aparece ao lado do nome em quem faz aniversário HOJE (no fuso do
 * app, que é onde a data é calculada), onde o app já mostra os selos de perfil.
 *
 * Diferente do selo de humanidade (ícone discreto) e da tag de contribuinte (cor do perfil),
 * esta tem cor própria — o mesmo vocabulário de "celebração" do tema — e um balãozinho para
 * quem passa o cursor: é um convite a dar parabéns, não um atributo de confiança.
 */
export function BirthdaySeal({ className }: BirthdaySealProps) {
  const messages = useMessages().birthdaySeal;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border border-signal-love/40 bg-signal-love/10 px-2 py-0.5 text-[11px] font-medium text-signal-love",
        className,
      )}
      title={messages.description}
    >
      <span aria-hidden>🎂</span>

      <span>{messages.label}</span>
    </span>
  );
}
