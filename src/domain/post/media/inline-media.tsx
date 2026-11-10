import { useAdapters } from "../../../adapters/adapters-context.js";
import { useMessages } from "../../../messages/messages-context.js";
import type { InlineMediaProps } from "../../../types/domain/post/inline-media-props.js";

import { ImageLightbox } from "./image-lightbox.js";
import { LiteVideo } from "./lite-video.js";
import { mediaBoxStyle, rememberImageBox } from "./media-box.js";
import { SpoilerMedia } from "./spoiler-media.js";

/**
 * Uma mídia NO MEIO do texto (item 9 do backlog): o render do marcador `{{media:<id>}}`.
 *
 * A mídia precisa ser anexo da publicação — o RichText só troca o marcador por aqui quando o
 * id está na lista de mídias dela, e o backend recusa na gravação qualquer marcador órfão.
 * Imagem clica para ver em tela cheia; vídeo e áudio ganham o player (sem autoplay: som que
 * começa sozinho no meio de um texto é o oposto do que esta rede quer).
 */
export function InlineMedia({ media, mediaSpoiler = false, lite = false }: InlineMediaProps) {
  const messages = useMessages().inlineMedia;
  const { resolveMediaUrl, resolveMediaOriginalUrl } = useAdapters();

  if (!media?.cdnUrl) return null;
  const imageSrc = resolveMediaUrl(media.cdnUrl);

  if (media.mimeType.startsWith("audio/")) {
    return (
      <div className="my-2 rounded-xl border border-border-soft bg-surface-1 p-2">
        <audio
          src={resolveMediaOriginalUrl(media.cdnUrl)}
          controls
          preload="metadata"
          className="w-full"
        />
      </div>
    );
  }

  if (media.mimeType.startsWith("video/")) {
    return (
      <div className="my-2 overflow-hidden rounded-xl border border-border-soft">
        <SpoilerMedia active={mediaSpoiler} label={messages.spoilerReveal}>
          {() => (
            <LiteVideo
              src={resolveMediaOriginalUrl(media.cdnUrl)}
              width={media.width}
              height={media.height}
              lite={lite}
            />
          )}
        </SpoilerMedia>
      </div>
    );
  }

  return (
    <>
      <div className="my-2 overflow-hidden rounded-xl border border-border-soft">
        <SpoilerMedia active={mediaSpoiler} label={messages.spoilerReveal}>
          {() => (
            <ImageLightbox src={imageSrc}>
              <button
                type="button"
                className="block w-full cursor-zoom-in"
                aria-label={messages.openImage}
              >
                <img
                  src={imageSrc}
                  alt=""
                  loading="lazy"
                  style={mediaBoxStyle(imageSrc, media.width, media.height)}
                  onLoad={rememberImageBox(imageSrc)}
                  className="h-auto max-h-96 w-full bg-surface-1 object-contain"
                />
              </button>
            </ImageLightbox>
          )}
        </SpoilerMedia>
      </div>
    </>
  );
}
