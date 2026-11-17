import { Loader2 } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useSpoilerPreference } from "../../media/spoiler-preference.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ColagemGridState } from "../../types/domain/colagem/colagem-grid-state.js";
import type { ColagemPhotoGridProps } from "../../types/domain/colagem/colagem-photo-grid-props.js";
import type { ColagemPhotoSummary } from "../../types/domain/colagem/colagem-photo-summary.js";
import { Button } from "../../ui/button.js";

/**
 * A grade da Colagem: ladrilhos quadrados, foto sensível velada até o toque e, no hover, o
 * autor e o movimento (reações e contribuições) da foto. Estados de carga e vazio desenhados
 * aqui, com as palavras do DS.
 */
export function ColagemPhotoGrid({
  photos,
  state,
  onOpen,
  hasMore,
  loadingMore,
  onLoadMore,
}: ColagemPhotoGridProps) {
  const messages = useMessages().colagemGrid;

  if (state.kind === "loading") {
    return <EstadoGrid icone>{messages.loading}</EstadoGrid>;
  }
  if (state.kind === "error") {
    return <EstadoGrid>{messages.error}</EstadoGrid>;
  }
  if (state.kind === "empty") {
    return <EstadoGrid>{messages.empty}</EstadoGrid>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
        {photos.map((photo) => (
          <ColagemTile key={photo.id} photo={photo} onOpen={onOpen} />
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

function EstadoGrid({ children, icone = false }: { children: string; icone?: boolean }) {
  return (
    <p className="flex items-center justify-center gap-2 py-10 text-sm text-text-subtle">
      {icone && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </p>
  );
}

function ColagemTile({
  photo,
  onOpen,
}: {
  photo: ColagemPhotoSummary;
  onOpen: (id: string) => void;
}) {
  const messages = useMessages().colagemGrid;
  // Com "sempre revelar" ligado, a foto sensível entra direto, sem véu nem aviso.
  const prefereRevelar = useSpoilerPreference();
  const velada = photo.mediaSpoiler && !prefereRevelar;

  return (
    <button
      type="button"
      onClick={() => onOpen(photo.id)}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      )}
      aria-label={messages.openPhoto}
    >
      <img
        src={photo.mediaUrl}
        alt={photo.description ?? messages.openPhoto}
        className={
          velada
            ? "h-full w-full object-cover blur-md"
            : "h-full w-full object-cover transition group-hover:scale-[1.02]"
        }
        loading="lazy"
      />
      {velada && (
        <span className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs font-medium text-white">
          {messages.revealPhoto}
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/45 px-2 py-1 text-[11px] text-white opacity-0 transition group-hover:opacity-100">
        <span className="truncate">{photo.authorName}</span>

        <span className="flex shrink-0 items-center gap-2">
          <span>❤ {photo.reactions}</span>

          <span>💬 {photo.comments}</span>
        </span>
      </span>
    </button>
  );
}
