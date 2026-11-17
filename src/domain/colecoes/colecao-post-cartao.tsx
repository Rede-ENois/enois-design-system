import { useState } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { ColecaoPostCartaoProps } from "../../types/domain/colecoes/colecao-post-cartao-props.js";
import { Button } from "../../ui/button.js";
import { ConfirmDialog } from "../../ui/confirm-dialog.js";

/** Dia e mês curtos ("12 nov.") — a coleção não conta segundos, só situa no tempo. */
function diaCurto(adicionadoAt: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
    new Date(adicionadoAt),
  );
}

/**
 * A moldura de uma publicação guardada: quando entrou na pasta, o gesto de tirar e, no meio, a
 * publicação salva (children) — que continua sendo ela mesma, com os gestos de sempre. Só sai
 * da coleção; o post segue salvo no perfil.
 */
export function ColecaoPostCartao({ info, onRemover, children }: ColecaoPostCartaoProps) {
  const messages = useMessages().colecoesQuadro;
  const [confirmar, setConfirmar] = useState(false);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2 text-xs text-text-subtle">
        <span className="truncate">{messages.guardadoEm(diaCurto(info.adicionadoAt))}</span>

        <Button variant="ghost" onClick={() => setConfirmar(true)}>
          {messages.tirar}
        </Button>
      </div>

      {children}

      <ConfirmDialog
        open={confirmar}
        onOpenChange={setConfirmar}
        title={messages.tirarConfirmTitle}
        description={messages.tirarConfirmBody}
        confirmLabel={messages.tirar}
        destructive
        onConfirm={() => {
          setConfirmar(false);
          onRemover();
        }}
      />
    </div>
  );
}
