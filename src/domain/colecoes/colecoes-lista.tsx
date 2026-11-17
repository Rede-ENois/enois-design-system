import { FolderOpen, Loader2 } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ColecaoResumo } from "../../types/domain/colecoes/colecao-resumo.js";
import type { ColecoesEstado } from "../../types/domain/colecoes/colecoes-estado.js";
import type { ColecoesListaProps } from "../../types/domain/colecoes/colecoes-lista-props.js";
import { Button } from "../../ui/button.js";

/**
 * A lista das suas coleções: pastas com título, descrição e quantos posts já guardam. Coleção é
 * privada, então nada aqui mostra dono — quem vê a página é sempre quem criou. Estados de carga,
 * erro e vazio desenhados aqui, com as palavras do DS.
 */
export function ColecoesLista({
  colecoes,
  state,
  onOpen,
  hasMore,
  loadingMore,
  onLoadMore,
}: ColecoesListaProps) {
  const messages = useMessages().colecoesLista;

  if (state.kind === "loading") {
    return <EstadoLista icone>{messages.loading}</EstadoLista>;
  }
  if (state.kind === "error") {
    return <EstadoLista>{messages.error}</EstadoLista>;
  }
  if (state.kind === "empty") {
    return <EstadoLista>{messages.empty}</EstadoLista>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {colecoes.map((colecao) => (
          <CartaoColecao key={colecao.id} colecao={colecao} onOpen={onOpen} />
        ))}
      </div>

      {hasMore && (
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

function CartaoColecao({
  colecao,
  onOpen,
}: {
  colecao: ColecaoResumo;
  onOpen: (colecaoId: string) => void;
}) {
  const messages = useMessages().colecoesLista;

  return (
    <button
      type="button"
      onClick={() => onOpen(colecao.id)}
      className={cn(
        "flex flex-col gap-1 rounded-2xl border border-border-soft bg-surface-card p-4 text-left",
        "transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      )}
      aria-label={messages.openColecao}
    >
      <span className="flex items-center gap-2 text-base font-normal text-text-strong">
        <FolderOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        {colecao.title}
      </span>

      {colecao.description && (
        <span className="line-clamp-2 text-sm text-text-subtle">{colecao.description}</span>
      )}

      <span className="mt-1 flex justify-end text-xs text-text-subtle">
        {messages.posts(colecao.postCount)}
      </span>
    </button>
  );
}
