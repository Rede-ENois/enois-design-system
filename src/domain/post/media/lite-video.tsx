import { useCallback, useRef, useState } from "react";

import { Play } from "lucide-react";

import { useMessages } from "../../../messages/messages-context.js";
import type { LiteVideoProps } from "../../../types/domain/post/lite-video-props.js";
import type { LiteVideoStage } from "../../../types/domain/post/lite-video-stage.js";

import { firstFrameSrc } from "./first-frame-src.js";
import { mediaBoxStyle, rememberVideoBox } from "./media-box.js";
import { MediaStage } from "./media-stage.js";

/**
 * Vídeo de publicação/comentário.
 *
 * Fora do Modo lite é o player de sempre, na página, com os controles nativos (e o autoplay mudo
 * coordenado do feed). No Modo lite ele vira um convite: o quadro fica parado e um toque abre o
 * **palco** — tela cheia com som, um decodificador só, e o resto da página em pausa.
 *
 * Ao fechar, a pessoa está exatamente onde estava (o feed não é desmontado nem recarregado) e o
 * ponto de parada fica guardado: reabrir continua de onde parou, sem obrigar o card a buscar
 * dados só para mostrar um quadro parado.
 */
export function LiteVideo({
  src,
  className = "max-h-96 w-full bg-surface-1",
  width,
  height,
  muted = true,
  registerRef,
  lite = false,
}: LiteVideoProps) {
  const messages = useMessages().liteVideo;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Onde a pessoa parou no palco: reabrir continua daí, sem tocar no player da página.
  const resumeAt = useRef(0);
  const [stage, setStage] = useState<LiteVideoStage | null>(null);

  const attach = useCallback(
    (element: HTMLVideoElement | null) => {
      videoRef.current = element;
      return registerRef?.(element);
    },
    [registerRef],
  );

  if (!src) return null;

  const box = { style: mediaBoxStyle(src, width, height), onLoadedMetadata: rememberVideoBox(src) };

  if (!lite) {
    return (
      <video
        ref={attach}
        src={firstFrameSrc(src)}
        muted={muted}
        playsInline
        preload="metadata"
        controls
        className={className}
        {...box}
      />
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label={messages.open}
        onClick={() => setStage({ time: resumeAt.current })}
        className="relative block w-full text-left"
      >
        <video
          ref={attach}
          src={firstFrameSrc(src)}
          muted
          playsInline
          preload="metadata"
          className={className}
          {...box}
        />

        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur">
            <Play className="ml-0.5 h-5 w-5" />
          </span>
        </span>
      </button>

      {stage && (
        <MediaStage
          src={src}
          initialTime={stage.time}
          onClose={(time) => {
            resumeAt.current = time;
            setStage(null);
          }}
        />
      )}
    </>
  );
}
