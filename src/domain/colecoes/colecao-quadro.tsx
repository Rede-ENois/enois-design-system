import { Children, useState } from "react";

import { Loader2, Pencil, Trash2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ColecaoQuadroProps } from "../../types/domain/colecoes/colecao-quadro-props.js";
import { Button } from "../../ui/button.js";
import { ConfirmDialog } from "../../ui/confirm-dialog.js";
import { Input } from "../../ui/input.js";

/**
 * A pasta aberta: cabeçalho (título, descrição, contagem), ações de sempre (editar, remover) e a
 * barra de guardar post salvo. As publicações guardadas chegam como children — o card do feed é
 * de quem compõe; a coleção só emoldura.
 */
export function ColecaoQuadro({
  colecao,
  onEditar,
  onRemover,
  onGuardar,
  guardando,
  guardarErro,
  children,
}: ColecaoQuadroProps) {
  const messages = useMessages().colecoesQuadro;
  const [elo, setElo] = useState("");
  const [confirmarRemocao, setConfirmarRemocao] = useState(false);
  const semGuardados = Children.count(children) === 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border-soft bg-surface-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <h2 className="text-lg font-normal text-text-strong">{colecao.title}</h2>
            {colecao.description && (
              <p className="text-sm text-text-subtle">{colecao.description}</p>
            )}
            <p className="text-xs text-text-subtle">{messages.posts(colecao.postCount)}</p>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button variant="outline" onClick={onEditar}>
              <Pencil className="h-4 w-4" aria-hidden="true" />
              {messages.editar}
            </Button>

            <Button variant="outline" onClick={() => setConfirmarRemocao(true)}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {messages.remover}
            </Button>
          </div>
        </div>

        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            const valor = elo.trim();
            if (valor.length === 0) return;
            onGuardar(valor);
            setElo("");
          }}
        >
          <Input
            value={elo}
            onChange={(event) => setElo(event.target.value)}
            placeholder={messages.guardarPlaceholder}
            aria-label={messages.guardar}
          />

          <Button type="submit" className="sm:w-auto" disabled={guardando}>
            {guardando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {messages.guardando}
              </>
            ) : (
              messages.guardar
            )}
          </Button>
        </form>
        {guardarErro && <p className="mt-2 text-sm text-destructive">{guardarErro}</p>}
      </div>

      <h3 className="text-sm font-normal text-text-strong">{messages.guardados}</h3>
      {semGuardados && (
        <p className="py-6 text-center text-sm text-text-subtle">{messages.vazio}</p>
      )}
      <div className="space-y-4">{children}</div>

      <ConfirmDialog
        open={confirmarRemocao}
        onOpenChange={setConfirmarRemocao}
        title={messages.removerConfirmTitle}
        description={messages.removerConfirmBody}
        confirmLabel={messages.remover}
        destructive
        onConfirm={() => {
          setConfirmarRemocao(false);
          onRemover();
        }}
      />
    </div>
  );
}
