import type { FigurinhaComunidadeCatalogoProps } from "../../types/domain/emotes/figurinha-comunidade-catalogo-props.js";
import { Button } from "../../ui/button.js";
import { EmptyState } from "../../ui/empty-state.js";
import { SearchField } from "../../ui/search-field.js";

import {
  FigurinhaComunidadeCard,
  FigurinhaComunidadeGrid,
  FigurinhaComunidadePagination,
} from "./figurinha-comunidade-view.js";

/**
 * A página do catálogo da comunidade: título, busca, grade de cartões e páginas.
 *
 * Só desenha — o app manda os cartões já montados (com as ações que a pessoa tem) e diz em que
 * estado está a consulta (`loading`, `error`, `empty`, `guest` ou `ready`).
 */
export function FigurinhaComunidadeCatalogo({
  cartoes,
  total,
  termo,
  onTermoChange,
  page,
  totalPages,
  state,
  title,
  intro,
  searchPlaceholder,
  labels,
  onPageChange,
  onRetry,
  retryLabel,
}: FigurinhaComunidadeCatalogoProps) {
  const aviso = state === "error" ? labels.error : labels.loading;

  if (state === "guest") {
    return (
      <section className="flex flex-col gap-4" aria-label={title}>
        <p className="sr-only">{intro}</p>

        <EmptyState title={labels.guest} />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4" aria-label={title} aria-busy={state === "loading"}>
      <p className="sr-only">{intro}</p>

      <SearchField
        id="busca-figurinhas"
        value={termo}
        placeholder={searchPlaceholder}
        onChange={onTermoChange}
      />

      {total !== null && <p className="text-xs text-text-subtle">{labels.count(total)}</p>}

      {state === "error" ? (
        <EmptyState title={aviso}>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              {retryLabel}
            </Button>
          )}
        </EmptyState>
      ) : state === "loading" ? (
        <p role="status" className="text-sm text-text-subtle">
          {aviso}
        </p>
      ) : state === "empty" ? (
        <EmptyState title={labels.empty} />
      ) : (
        <FigurinhaComunidadeGrid>
          {cartoes.map((cartao) => (
            <FigurinhaComunidadeCard key={cartao.id || cartao.codigo} {...cartao} />
          ))}
        </FigurinhaComunidadeGrid>
      )}

      <FigurinhaComunidadePagination
        page={page}
        totalPages={totalPages}
        labels={{ previous: labels.previous, next: labels.next, page: labels.page }}
        onPageChange={onPageChange}
      />
    </section>
  );
}
