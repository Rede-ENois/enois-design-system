import { useCallback, useEffect, useRef, useState } from "react";

import { Volume2, VolumeX, X } from "lucide-react";

import { useMessages } from "../../../messages/messages-context.js";
import type { MediaStageProps } from "../../../types/domain/post/media-stage-props.js";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "../../../ui/dialog.js";

import { restoreSuspendedMedia, suspendOffscreenMedia } from "./lite-media.js";

/**
 * Palco de mídia do Modo lite: o vídeo escolhido abre em tela cheia e o resto da página sai de
 * cena — pausado e sem segurar buffer — enquanto a pessoa assiste.
 *
 * O que NÃO acontece, e é o ponto: nada é desmontado. O feed continua montado, na mesma
 * rolagem, e ao fechar a pessoa está exatamente onde estava — sem recarregar, sem voltar ao
 * topo, sem perder o que já tinha rolado. O vídeo volta para o card no segundo em que parou.
 *
 * Também não é a tela cheia do sistema: é uma camada do próprio app, então o voltar do
 * navegador, o gesto de fechar e o resto da interface continuam existindo.
 */
export function MediaStage({ src, initialTime = 0, muted = false, onClose }: MediaStageProps) {
  const messages = useMessages().mediaStage;
  const videoRef = useRef<HTMLVideoElement>(null);
  // The Dialog portal mounts its content in a second commit, so effects keyed on []
  // would run before the video exists. State from the callback ref keys them correctly.
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const closed = useRef(false);
  const [mutedNow, setMutedNow] = useState(muted);

  const attachVideo = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    setVideoElement(element);
  }, []);

  const close = useCallback(() => {
    if (closed.current) return;
    closed.current = true;
    onClose(videoRef.current?.currentTime ?? 0);
  }, [onClose]);

  useEffect(() => {
    if (!videoElement) return;

    // O palco nasce com som. Onde o navegador recusa autoplay com áudio (iOS, sobretudo no PWA),
    // a segunda tentativa é muda — que é permitida — e o botão de som fica a um toque.
    const attempt = videoElement.play();
    attempt?.catch(() => {
      if (videoElement.muted) return;
      videoElement.muted = true;
      setMutedNow(true);
      void videoElement.play().catch(() => undefined);
    });
  }, [videoElement]);

  useEffect(() => {
    if (!videoElement) return;

    // O resto da página sai de cena: tudo pausado, e os vídeos fora da tela devolvem a memória.
    suspendOffscreenMedia(videoElement);

    return () => {
      restoreSuspendedMedia();
    };
  }, [videoElement]);

  // The video stage mounts in a Dialog portal: `content-visibility: auto` on the
  // PostCard makes the card a containing block for `position: fixed` descendants
  // and would trap this fullscreen overlay. See docs/portal-overlays.md.
  return (
    <Dialog
      open
      onOpenChange={(nextOpen) => {
        if (!nextOpen) close();
      }}
    >
      <DialogContent
        hideClose
        aria-describedby={undefined}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="flex h-dvh w-screen max-w-none max-h-none items-center justify-center gap-0 overflow-hidden overflow-y-hidden border-0 bg-black p-0 shadow-none duration-0 sm:rounded-none"
      >
        <DialogTitle className="sr-only">{messages.title}</DialogTitle>

        <video
          ref={attachVideo}
          src={src}
          autoPlay
          playsInline
          controls
          muted={mutedNow}
          onLoadedMetadata={(event) => {
            // Continua do ponto onde o card estava (e de onde a pessoa parou da última vez).
            if (initialTime > 0) event.currentTarget.currentTime = initialTime;
          }}
          onClick={(event) => event.stopPropagation()}
          className="max-h-[100dvh] max-w-full bg-black"
        />

        <div className="absolute right-3 top-3 flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setMutedNow((value) => !value);
            }}
            aria-label={mutedNow ? messages.unmute : messages.mute}
            className="grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
          >
            {mutedNow ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>

          <DialogClose
            aria-label={messages.close}
            title={messages.close}
            className="grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
