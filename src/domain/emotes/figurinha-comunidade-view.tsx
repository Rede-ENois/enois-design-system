import { Flag, SquareArrowOutUpRight, Trash2 } from "lucide-react";

import type { FigurinhaComunidadeItem } from "../../types/domain/emotes/figurinha-comunidade-item.js";
import { Button } from "../../ui/button.js";

import { EmotePageButton } from "./emote-cell.js";

/**
 * Cartão de uma figurinha do catálogo da comunidade.
 *
 * A figurinha grande com o nome embaixo, o código em destaque (é o que a pessoa digita) e as
 * ações: usar no texto, denunciar (qualquer um), tirar do catálogo (só o autor). O cartão não
 * decide se pode — o app passa só as ações que a pessoa tem.
 */
export function FigurinhaComunidadeCard({
  codigo,
  nome,
  imagem,
  autor,
  onUsar,
  onDenunciar,
  onRemover,
}: FigurinhaComunidadeItem) {
  return (
    <article className="flex flex-col gap-2 rounded-xl border border-border-soft bg-surface-1 p-3">
      <button
        type="button"
        onClick={onUsar}
        disabled={!onUsar}
        title={nome}
        className="grid aspect-square w-full place-items-center rounded-lg bg-surface-2 p-2 transition hover:ring-1 hover:ring-primary/35 disabled:cursor-default disabled:ring-0"
      >
        <img
          src={imagem}
          alt={nome}
          loading="lazy"
          decoding="async"
          className="max-h-24 max-w-24 object-contain"
        />
      </button>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-text-strong" title={nome}>
          {nome}
        </p>

        <p className="truncate font-mono text-xs text-text-subtle">{codigo}</p>

        <p className="truncate text-xs text-text-subtle">{autor}</p>
      </div>

      <div className="flex items-center gap-1">
        {onUsar && (
          <Button type="button" size="sm" variant="ghost" onClick={onUsar}>
            <SquareArrowOutUpRight className="h-3.5 w-3.5" />
          </Button>
        )}
        {onRemover && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-label={`Remover ${codigo}`}
            onClick={onRemover}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
        {onDenunciar && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-label={`Denunciar ${codigo}`}
            onClick={onDenunciar}
          >
            <Flag className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </article>
  );
}

/** A grade do catálogo: duas colunas no telefone e até seis na tela larga. */
export function FigurinhaComunidadeGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {children}
    </div>
  );
}

/** Miniatura + nome/código, para a lista de "minhas figurinhas" e para o resultado do envio. */
export function FigurinhaComunidadeRow({
  codigo,
  nome,
  imagem,
  acao,
}: {
  codigo: string;
  nome: string;
  imagem: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border-soft bg-surface-1 p-2">
      <img src={imagem} alt={nome} className="h-10 w-10 shrink-0 object-contain" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-strong">{nome}</p>

        <p className="truncate font-mono text-xs text-text-subtle">{codigo}</p>
      </div>
      {acao}
    </div>
  );
}

/** Rodapé de páginas do catálogo, no mesmo formato do seletor de figurinhas. */
export function FigurinhaComunidadePagination({
  page,
  totalPages,
  labels,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  labels: { previous: string; next: string; page: (page: number, totalPages: number) => string };
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav
      aria-label={labels.page(page, totalPages)}
      className="flex items-center justify-center gap-2"
    >
      <EmotePageButton
        direction="previous"
        label={labels.previous}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      />

      <span className="text-xs text-text-subtle">{labels.page(page, totalPages)}</span>

      <EmotePageButton
        direction="next"
        label={labels.next}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      />
    </nav>
  );
}
