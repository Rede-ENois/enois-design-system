import { CalendarClock } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { DesafiosDetalheProps } from "../../types/domain/desafios/desafios-detalhe-props.js";
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog.js";

import { DesafiosAuthor } from "./desafios-author.js";
import { DesafiosParticipacoes } from "./desafios-participacoes.js";

const HORA = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

/**
 * O desafio aberto em tela cheia: o convite no topo (quem convocou, o que pedia e a janela) e o
 * mural das participações embaixo. É uma camada do próprio app, montada no portal do diálogo —
 * a mesma lição do palco de mídia (docs/portal-overlays.md): dentro de um card com
 * `[content-visibility:auto]` um `fixed` embutido fica preso ao card e rola junto com o feed.
 *
 * O fechar termina sempre no mesmo lugar: Escape, o X e o clique no fundo passam por
 * `onOpenChange(false)`. Abrir e fechar é decisão de quem usa a view, não dela: sem alternância
 * interna, o toque no card atrás não reabre nem fecha por acidente.
 */
export function DesafiosDetalhe({ open, onOpenChange, timeLeft, ...mural }: DesafiosDetalheProps) {
  // A janela fala a mesma língua do card ("termina X"); o resto da cópia é do mural.
  const messages = useMessages().desafiosCard;
  const { desafio } = mural;
  const encerrado = desafio.status === "CLOSED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="flex h-dvh max-h-none w-screen max-w-none flex-col gap-0 overflow-hidden border-0 p-0 shadow-none sm:rounded-none"
      >
        {/* A coluna fica centrada no desktop: a camada ocupa a janela, mas a leitura não estica.
            A rolagem é da coluna inteira (convite + mural): com o mural em outro contêiner, o gesto
            sobre o convite não chegava às participações — e o convite longo comia a altura da
            camada, deixando o mural sem espaço para rolar. */}
        <div className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col overflow-y-auto overscroll-contain">
          <header className="shrink-0 space-y-2 border-b border-border-soft px-4 py-4 pr-14">
            <DesafiosAuthor author={desafio.author} />

            <DialogTitle className="text-lg font-semibold text-text-strong">
              {desafio.title}
            </DialogTitle>

            <p className="whitespace-pre-wrap text-sm text-text-strong">{desafio.description}</p>

            <p className="flex items-center gap-1 text-xs text-text-subtle">
              <CalendarClock aria-hidden className="h-3.5 w-3.5" />

              {encerrado
                ? messages.closed
                : desafio.endsAt
                  ? messages.closesAt(timeLeft ?? HORA.format(new Date(desafio.endsAt)))
                  : messages.noDeadline}
            </p>
          </header>

          <div className="px-4 py-4">
            <DesafiosParticipacoes {...mural} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
