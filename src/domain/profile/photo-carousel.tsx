import { useRef, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useSpoilerPreference } from "../../media/spoiler-preference.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ProfilePhotoCarouselProps } from "../../types/domain/profile/profile-photo-carousel-props.js";
import { Button } from "../../ui/button.js";

import { ProfilePhotoViewer } from "./photo-viewer.js";

/** Quanto as setas da tira caminham por clique: meia largura visível, um passo confortável. */
const PASSO_TIRA = 0.5;

/**
 * A galeria de fotos do perfil: uma tira horizontal de miniaturas que a pessoa folheia e abre
 * no visualizador com zoom. Os estados de carga e erro têm parágrafo próprio; a tira em si só
 * existe quando há fotos. O visualizador vive aqui dentro — abrir uma miniatura é abri-lo.
 */
export function ProfilePhotoCarousel({
  photos,
  state,
  hasMore,
  loadingMore,
  onLoadMore,
}: ProfilePhotoCarouselProps) {
  const messages = useMessages().profileGallery;
  // "Sempre revelar" tira o véu das miniaturas (e o visualizador nasce com a foto aberta).
  const prefereRevelar = useSpoilerPreference();
  const [aberta, setAberta] = useState<number | null>(null);
  const tira = useRef<HTMLDivElement>(null);

  const folhear = (direcao: 1 | -1) => {
    const tiraAtual = tira.current;
    if (!tiraAtual) return;
    tiraAtual.scrollBy({ left: direcao * tiraAtual.clientWidth * PASSO_TIRA, behavior: "smooth" });
  };

  if (state.kind === "loading") {
    return <p className="py-6 text-center text-sm text-text-subtle">{messages.loading}</p>;
  }

  if (state.kind === "error") {
    return <p className="py-6 text-center text-sm text-text-subtle">{messages.error}</p>;
  }

  if (state.kind === "empty" || photos.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => folhear(-1)}
          aria-label={messages.prev}
          title={messages.prev}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </Button>

        <div ref={tira} className="flex flex-1 gap-2 overflow-x-auto scroll-smooth">
          {photos.map((foto, indice) => (
            <button
              key={foto.id}
              type="button"
              onClick={() => setAberta(indice)}
              aria-label={messages.openPhoto}
              title={messages.openPhoto}
              className="relative h-24 w-24 shrink-0 snap-start overflow-hidden rounded-xl border border-border-soft transition hover:opacity-90"
            >
              <img
                src={foto.mediaUrl}
                alt={foto.description ?? ""}
                loading="lazy"
                draggable={false}
                className={`h-full w-full bg-surface-1 object-cover ${
                  foto.mediaSpoiler && !prefereRevelar ? "scale-110 blur-md" : ""
                }`}
              />
              {foto.mediaSpoiler && !prefereRevelar && (
                <span className="absolute inset-x-0 bottom-0 bg-surface-card/85 px-1 py-0.5 text-center text-[10px] font-semibold text-text-strong">
                  {messages.revealPhoto}
                </span>
              )}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => folhear(1)}
          aria-label={messages.next}
          title={messages.next}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={onLoadMore} disabled={loadingMore}>
            {messages.loadMore}
          </Button>
        </div>
      )}

      <ProfilePhotoViewer photos={photos} index={aberta} onIndexChange={setAberta} />
    </div>
  );
}
