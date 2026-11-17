import { Children, useState } from "react";

import { Loader2, Pencil, Trash2 } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { MuralQuadroProps } from "../../types/domain/murais/mural-quadro-props.js";
import { Button } from "../../ui/button.js";
import { ConfirmDialog } from "../../ui/confirm-dialog.js";
import { Input } from "../../ui/input.js";

/**
 * O quadro do mural: cabeçalho (título, descrição, dono, contagem), ações do dono e a barra de
 * colar publicação. As publicações coladas chegam como children — o card do feed é de quem
 * compõe; o mural só emoldura.
 */
export function MuralQuadro({
  mural,
  ehDono,
  onEditar,
  onRemover,
  onColar,
  colando,
  colarErro,
  children,
}: MuralQuadroProps) {
  const messages = useMessages().muraisQuadro;
  const [elo, setElo] = useState("");
  const [confirmarRemocao, setConfirmarRemocao] = useState(false);
  const semColadas = Children.count(children) === 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border-soft bg-surface-card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <h2 className="text-lg font-normal text-text-strong">{mural.title}</h2>
            {mural.description && <p className="text-sm text-text-subtle">{mural.description}</p>}
            <p className="text-xs text-text-subtle">
              {mural.owner.name ?? mural.owner.username ?? mural.owner.id}
              {" · "}
              {messages.contributions(mural.contributions)}
            </p>
          </div>
          {ehDono && (
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
          )}
        </div>

        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            const valor = elo.trim();
            if (valor.length === 0) return;
            onColar(valor);
            setElo("");
          }}
        >
          <Input
            value={elo}
            onChange={(event) => setElo(event.target.value)}
            placeholder={messages.colarPlaceholder}
            aria-label={messages.colar}
          />

          <Button type="submit" className="sm:w-auto" disabled={colando}>
            {colando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {messages.colando}
              </>
            ) : (
              messages.colar
            )}
          </Button>
        </form>
        {colarErro && <p className="mt-2 text-sm text-destructive">{colarErro}</p>}
      </div>

      <h3 className="text-sm font-normal text-text-strong">{messages.coladas}</h3>
      {semColadas && <p className="py-6 text-center text-sm text-text-subtle">{messages.vazio}</p>}
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
