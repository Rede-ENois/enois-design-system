import { useMessages } from "../../messages/messages-context.js";
import type { ComposerDraftStatusProps } from "../../types/domain/post/composer-draft-status-props.js";

/**
 * O aviso discreto de que nada se perdeu: o rascunho do compositor está salvo (e quando), com
 * a saída para descartá-lo. É o mesmo rascunho em qualquer dispositivo — aqui só se conta a
 * hora da última salva; sem rascunho, o aviso nem aparece.
 */
export function ComposerDraftStatus({ salvoEm, onDescartar }: ComposerDraftStatusProps) {
  const messages = useMessages().composerDraft;
  if (!salvoEm) return null;

  const quando = new Date(salvoEm);
  if (Number.isNaN(quando.getTime())) return null;

  const hora = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(
    quando,
  );

  return (
    <div className="flex min-h-6 items-center justify-end gap-1 px-1 text-[13px] text-text-subtle">
      <span aria-live="polite">{messages.salvo(hora)}</span>
      {onDescartar && (
        <button
          type="button"
          onClick={onDescartar}
          className="rounded-full px-2 py-0.5 font-medium text-text-subtle transition hover:bg-surface-2 hover:text-text-strong"
        >
          {messages.descartar}
        </button>
      )}
    </div>
  );
}
