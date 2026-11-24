import * as React from "react";

import { Image, Loader2 } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { MuraisEstado } from "../../types/domain/murais/murais-estado.js";
import type { MuraisListaProps } from "../../types/domain/murais/murais-lista-props.js";
import type { MuralResumo } from "../../types/domain/murais/mural-resumo.js";
import { Button } from "../../ui/button.js";
import { SearchField } from "../../ui/search-field.js";

/**
 * A lista de murais do Explorar: cartões com título, descrição, dono e quantas publicações já
 * estão coladas. Estados de carga, erro e vazio desenhados aqui, com as palavras do DS. Com
 * `busca`, o campo fica sempre visível — inclusive no vazio, para trocar o termo sem recarregar.
 */
export function MuraisLista({
  murais,
  state,
  onOpen,
  busca,
  hasMore,
  loadingMore,
  onLoadMore,
}: MuraisListaProps) {
  const messages = useMessages().muraisLista;
  const buscaId = React.useId();
  const termo = busca?.valor.trim() ?? "";

  const campo = busca && (
    <SearchField
      id={buscaId}
      value={busca.valor}
      onChange={busca.aoMudar}
      placeholder={messages.buscarPlaceholder}
    />
  );

  if (state.kind === "loading" && !termo) {
    return (
      <div className="space-y-4">
        {campo}

        <EstadoLista icone>{messages.loading}</EstadoLista>
      </div>
    );
  }
  if (state.kind === "error") {
    return (
      <div className="space-y-4">
        {campo}

        <EstadoLista>{messages.error}</EstadoLista>
      </div>
    );
  }
  if (state.kind === "empty") {
    return (
      <div className="space-y-4">
        {campo}

        <EstadoLista>{termo ? messages.semResultado(termo) : messages.empty}</EstadoLista>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {campo}

      <div className="grid gap-3 sm:grid-cols-2">
        {murais.map((mural) => (
          <CartaoMural key={mural.id} mural={mural} onOpen={onOpen} />
        ))}
      </div>

      {hasMore && !termo && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onLoadMore}>
            {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : messages.loadMore}
          </Button>
        </div>
      )}
    </div>
  );
}

function EstadoLista({ children, icone = false }: { children: string; icone?: boolean }) {
  return (
    <p className="flex items-center justify-center gap-2 py-10 text-sm text-text-subtle">
      {icone && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </p>
  );
}

function CartaoMural({ mural, onOpen }: { mural: MuralResumo; onOpen: (muralId: string) => void }) {
  const messages = useMessages().muraisLista;

  return (
    <button
      type="button"
      onClick={() => onOpen(mural.id)}
      className={cn(
        "flex flex-col gap-1 rounded-2xl border border-border-soft bg-surface-card p-4 text-left",
        "transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      )}
      aria-label={messages.openMural}
    >
      <span className="flex items-center gap-2 text-base font-normal text-text-strong">
        <Image className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        {mural.title}
      </span>

      {mural.description && (
        <span className="line-clamp-2 text-sm text-text-subtle">{mural.description}</span>
      )}

      <span className="mt-1 flex items-center justify-between text-xs text-text-subtle">
        <span className="truncate">
          {mural.owner.name ?? mural.owner.username ?? mural.owner.id}
        </span>

        <span className="shrink-0">{messages.contributions(mural.contributions)}</span>
      </span>
    </button>
  );
}
