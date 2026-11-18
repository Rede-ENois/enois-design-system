import { CalendarClock, Flag, Trash2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { DesafiosCardProps } from "../../types/domain/desafios/desafios-card-props.js";

import { DesafiosAuthor } from "./desafios-author.js";

const HORA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * O card de um desafio na linha do tempo: o convite e quem o fez, com autoria nominal —
 * desafio não tem "Alguém". A janela aparece como prazo quando existe; encerrado, o card
 * mostra o estado. Abrir o mural é gesto de quem vê; remover, só de quem convocou; denúncia,
 * de quem vê e não convocou. Encerrar NÃO é gesto do card: o reconhecimento exige ver as
 * participações, então mora no mural (`DesafiosParticipacoes`).
 */
export function DesafiosCard({ desafio, timeLeft, onOpen, onRemove, onReport }: DesafiosCardProps) {
  const messages = useMessages().desafiosCard;
  const encerrado = desafio.status === "CLOSED";

  return (
    <article className="space-y-3 rounded-2xl border border-border p-4">
      <div className="flex items-start gap-2">
        <DesafiosAuthor author={desafio.author} />

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {desafio.isMine && (
            <button
              type="button"
              onClick={onRemove}
              className="text-text-subtle transition hover:text-text-strong"
              title={messages.remove}
              aria-label={messages.remove}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          {!desafio.isMine && onReport && (
            <button
              type="button"
              onClick={onReport}
              className="text-text-subtle transition hover:text-text-strong"
              title={messages.report}
              aria-label={messages.report}
            >
              <Flag className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <button type="button" onClick={onOpen} className="block w-full text-left">
        <h3 className="text-base font-semibold text-text-strong">{desafio.title}</h3>

        <p className="mt-1 line-clamp-4 whitespace-pre-wrap text-sm text-text-strong">
          {desafio.description}
        </p>
      </button>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-subtle">
        <span>{HORA.format(new Date(desafio.createdAt))}</span>

        {encerrado ? (
          <span className="font-medium">{messages.closed}</span>
        ) : (
          <span className="flex items-center gap-1">
            <CalendarClock aria-hidden className="h-3.5 w-3.5" />
            {desafio.endsAt
              ? messages.closesAt(timeLeft ?? HORA.format(new Date(desafio.endsAt)))
              : messages.noDeadline}
          </span>
        )}

        <button
          type="button"
          onClick={onOpen}
          className="ml-auto font-medium text-text-strong transition hover:underline"
        >
          {messages.participacoes(desafio.participacoes)} · {messages.open}
        </button>
      </div>
    </article>
  );
}
