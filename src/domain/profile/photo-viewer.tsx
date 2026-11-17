import { useEffect, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";

import { ChevronLeft, ChevronRight, RefreshCw, X, ZoomIn, ZoomOut } from "lucide-react";

import { useSpoilerPreference } from "../../media/spoiler-preference.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ProfilePhotoViewerProps } from "../../types/domain/profile/profile-photo-viewer-props.js";
import { Button } from "../../ui/button.js";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "../../ui/dialog.js";

/** O zoom anda em degraus: nem um salto gigante, nem meio passo imperceptível. */
const PASSO_ZOOM = 0.5;
const ZOOM_MINIMO = 1;
const ZOOM_MAXIMO = 3;
/** O toque duplo alterna entre o tamanho natural e este aumento confortável de leitura. */
const ZOOM_TOQUE_DUPLO = 2;

/**
 * O visualizador das fotos do perfil: a foto em tela cheia com zoom de verdade — botões de
 * ampliar e reduzir, toque duplo para alternar e, quando ampliada, arrastar para passear pela
 * imagem. Anterior e seguinte caminham pela galeria; mudar de foto volta o zoom ao normal.
 *
 * O transform viaja como variáveis de CSS (`--pan-x`, `--pan-y`, `--escala`) e a classe do
 * Tailwind monta o transform delas: o que muda por interação é dado, não estilo.
 */
export function ProfilePhotoViewer({ photos, index, onIndexChange }: ProfilePhotoViewerProps) {
  const mensagens = useMessages();
  const messages = mensagens.profileGallery;
  const aberta = index !== null && index >= 0 && index < photos.length;
  const foto = aberta ? photos[index] : null;

  const [escala, setEscala] = useState(ZOOM_MINIMO);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  // Com "sempre revelar" ligado, a foto sensível já nasce aberta (a preferência vale aqui dentro).
  const prefereRevelar = useSpoilerPreference();
  const [revelada, setRevelada] = useState(prefereRevelar);
  const arrastando = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  // Trocar de foto (ou fechar) volta ao natural: cada foto começa inteira, e a sensível nasce velada.
  useEffect(() => {
    setEscala(ZOOM_MINIMO);
    setPan({ x: 0, y: 0 });
    setRevelada(prefereRevelar);
  }, [index, prefereRevelar]);

  if (!aberta || !foto) return null;

  const aoTamanhoNatural = () => {
    setEscala(ZOOM_MINIMO);
    setPan({ x: 0, y: 0 });
  };
  const ampliar = () => setEscala((atual) => Math.min(ZOOM_MAXIMO, atual + PASSO_ZOOM));
  const reduzir = () =>
    setEscala((atual) => {
      const novo = Math.max(ZOOM_MINIMO, atual - PASSO_ZOOM);
      if (novo === ZOOM_MINIMO) setPan({ x: 0, y: 0 });
      return novo;
    });
  const alternarToqueDuplo = () => {
    if (escala >= ZOOM_TOQUE_DUPLO) {
      aoTamanhoNatural();
    } else {
      setEscala(ZOOM_TOQUE_DUPLO);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onIndexChange(null);
      }}
    >
      <DialogContent
        hideClose
        aria-describedby={undefined}
        onClick={(event) => {
          event.stopPropagation();
          if (event.target === event.currentTarget) onIndexChange(null);
        }}
        className="flex h-[92dvh] w-[94vw] max-w-none items-center justify-center overflow-hidden border-0 bg-black/90 p-0 shadow-none"
      >
        <DialogTitle className="sr-only">{messages.counter(index + 1, photos.length)}</DialogTitle>

        <figure className="relative flex max-h-full max-w-full items-center justify-center">
          {foto.mediaSpoiler && !revelada ? (
            <button
              type="button"
              onClick={() => setRevelada(true)}
              className="relative grid place-items-center"
              aria-label={messages.revealPhoto}
            >
              <img
                src={foto.mediaUrl}
                alt=""
                draggable={false}
                className="max-h-[70dvh] max-w-full scale-105 object-contain blur-2xl"
              />

              <span className="absolute rounded-full bg-black/70 px-4 py-2 text-xs font-semibold text-white">
                {messages.revealPhoto}
              </span>
            </button>
          ) : (
            <FotoAmpliada
              foto={foto}
              escala={escala}
              pan={pan}
              arrastando={arrastando}
              setPan={setPan}
              alternarToqueDuplo={alternarToqueDuplo}
            />
          )}
        </figure>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/70 px-2 py-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onIndexChange(Math.max(0, index - 1))}
            disabled={index === 0}
            aria-label={messages.prev}
            title={messages.prev}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>

          <span className="min-w-24 select-none text-center text-xs text-white">
            {messages.counter(index + 1, photos.length)}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onIndexChange(Math.min(photos.length - 1, index + 1))}
            disabled={index === photos.length - 1}
            aria-label={messages.next}
            title={messages.next}
            className="text-white hover:bg-white/20"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="absolute right-4 top-4 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={ampliar}
            disabled={escala >= ZOOM_MAXIMO}
            aria-label={messages.zoomIn}
            title={messages.zoomIn}
            className="text-white hover:bg-white/20"
          >
            <ZoomIn className="size-4" aria-hidden="true" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={reduzir}
            disabled={escala <= ZOOM_MINIMO}
            aria-label={messages.zoomOut}
            title={messages.zoomOut}
            className="text-white hover:bg-white/20"
          >
            <ZoomOut className="size-4" aria-hidden="true" />
          </Button>
          {escala > ZOOM_MINIMO && (
            <Button
              variant="ghost"
              size="sm"
              onClick={aoTamanhoNatural}
              aria-label={messages.resetZoom}
              title={messages.resetZoom}
              className="text-white hover:bg-white/20"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
            </Button>
          )}
          <DialogClose
            aria-label={mensagens.imageLightbox.close}
            title={mensagens.imageLightbox.close}
            className="grid size-9 place-items-center rounded-full text-white hover:bg-white/20"
          >
            <X className="size-5" aria-hidden="true" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** A foto ampliável em si: o transform vem das variáveis e o arrasto atualiza as variáveis. */
function FotoAmpliada({
  foto,
  escala,
  pan,
  arrastando,
  setPan,
  alternarToqueDuplo,
}: {
  foto: { mediaUrl: string; description: string | null };
  escala: number;
  pan: { x: number; y: number };
  arrastando: RefObject<{ px: number; py: number; ox: number; oy: number } | null>;
  setPan: (pan: { x: number; y: number }) => void;
  alternarToqueDuplo: () => void;
}) {
  return (
    <img
      src={foto.mediaUrl}
      alt={foto.description ?? ""}
      draggable={false}
      onDoubleClick={alternarToqueDuplo}
      onPointerDown={(event) => {
        if (escala <= 1) return;
        arrastando.current = { px: event.clientX, py: event.clientY, ox: pan.x, oy: pan.y };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const inicio = arrastando.current;
        if (!inicio) return;
        setPan({
          x: inicio.ox + (event.clientX - inicio.px),
          y: inicio.oy + (event.clientY - inicio.py),
        });
      }}
      onPointerUp={() => {
        arrastando.current = null;
      }}
      className="max-h-full max-w-full touch-none select-none object-contain [transform:translate(var(--pan-x),var(--pan-y))_scale(var(--escala))]"
      style={{ "--pan-x": `${pan.x}px`, "--pan-y": `${pan.y}px`, "--escala": escala }}
    />
  );
}
