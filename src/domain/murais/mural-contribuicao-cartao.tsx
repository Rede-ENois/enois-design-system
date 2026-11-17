import { useState } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { MuralContribuicaoCartaoProps } from "../../types/domain/murais/mural-contribuicao-cartao-props.js";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar.js";
import { Button } from "../../ui/button.js";
import { ConfirmDialog } from "../../ui/confirm-dialog.js";

/** Dia e mês curtos ("12 nov.") — o mural não conta segundos, só situa no tempo. */
function diaCurto(addedAt: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(
    new Date(addedAt),
  );
}

/**
 * A moldura de uma publicação colada: quem colou, quando, o gesto de tirar do quadro e, no
 * meio, a publicação do feed (children) — que continua sendo ela mesma, com os gestos de
 * sempre. Só sai do mural; o post fica no feed de quem publicou.
 */
export function MuralContribuicaoCartao({
  info,
  podeRemover,
  onRemover,
  children,
}: MuralContribuicaoCartaoProps) {
  const messages = useMessages().muraisQuadro;
  const [confirmar, setConfirmar] = useState(false);
  const nome = info.addedBy.name ?? info.addedBy.username ?? info.addedBy.id;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2 text-xs text-text-subtle">
        <span className="flex min-w-0 items-center gap-2">
          <Avatar className="h-6 w-6">
            {info.addedBy.avatar && <AvatarImage src={info.addedBy.avatar} alt={nome} />}
            <AvatarFallback className="bg-surface-2 text-[10px] font-bold text-text-subtle">
              {nome[0]?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>

          <span className="truncate">{messages.coladoPor(nome)}</span>

          <span className="shrink-0">{diaCurto(info.addedAt)}</span>
        </span>
        {podeRemover && (
          <Button variant="ghost" onClick={() => setConfirmar(true)}>
            {messages.tirar}
          </Button>
        )}
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
