import { useState } from "react";

import { useMessages } from "../../../messages/messages-context.js";
import type { EmbedPlayerProps } from "../../../types/domain/post/embed-player-props.js";
import type { PosterThumbnailProps } from "../../../types/domain/post/poster-thumbnail-props.js";

import { buildEmbedUrl } from "./embed-url.js";
import { useInView } from "./use-in-view.js";

/**
 * Player de vídeo do post.
 *
 * Sem `autoplay`: fica na capa e só monta o quadro no clique — assim um feed com vários vídeos não
 * carrega vários players de uma vez.
 *
 * Com `autoplay` (feed): toca sozinho quando a publicação entra na tela, **mudo**, que é a única
 * forma que o navegador aceita sem gesto do usuário. Ao sair da tela o quadro é desmontado, o que
 * para a reprodução (não há como pausar um player de terceiros de fora; desmontar também libera o
 * player, em vez de deixá-lo rodando escondido). Clicar na capa toca com som, porque aí o clique é
 * gesto e a regra do navegador deixa de valer.
 */
export function EmbedPlayer({ type, id, autoplay = false, startSeconds }: EmbedPlayerProps) {
  const messages = useMessages().embedPlayer;
  const [playing, setPlaying] = useState(false);
  const { ref, inView } = useInView<HTMLDivElement>();

  const autoPlaying = autoplay && inView && !playing;
  const showPlayer = playing || autoPlaying;

  return (
    <div ref={ref} className="mt-3">
      {showPlayer ? (
        <div className="overflow-hidden rounded-xl border border-border-soft bg-surface-1">
          <iframe
            src={buildEmbedUrl(type, id, {
              autoplay: true,
              // Autoplay em tela: mudo (regra do navegador). Clique na capa: com som.
              muted: autoPlaying,
              host: typeof window !== "undefined" ? window.location.hostname : "",
              startSeconds,
            })}
            title={messages.playerTitle}
            className="aspect-video w-full"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
            // YouTube refuses playback without a `Referer` (error 153), and apps may send
            // `Referrer-Policy: no-referrer`: the frame asks for the browser default just for
            // itself, so the origin goes along but the post path does not.
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : (
        <button
          type="button"
          aria-label={messages.watchOn(type === "youtube" ? "YouTube" : type)}
          onClick={() => setPlaying(true)}
          className="relative block w-full overflow-hidden rounded-xl border border-border-soft text-left transition hover:opacity-90"
        >
          <PosterThumbnail type={type} id={id} />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="ml-0.5 h-5 w-5"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  );
}

/**
 * Capa antes de tocar: miniatura do provedor (uma imagem, sem script) ou um bloco com o nome dele.
 *
 * O `maxresdefault.jpg` do YouTube só existe quando o vídeo foi enviado em HD; nos demais o CDN
 * responde 404 e o card ficava sem capa. O `onError` cai para o `hqdefault.jpg`, que existe para
 * todo vídeo — e se esse também falhar, mostra o bloco com o nome do provedor.
 */
function PosterThumbnail({ type, id }: PosterThumbnailProps) {
  const messages = useMessages().embedPlayer;
  // 0 = maxres, 1 = hq (existe em todo vídeo), 2 = desiste e mostra o bloco.
  const [tentativa, setTentativa] = useState(0);
  const thumbnail =
    type === "youtube"
      ? tentativa === 0
        ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
        : tentativa === 1
          ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
          : ""
      : type === "dailymotion"
        ? `https://www.dailymotion.com/thumbnail/video/${id}`
        : "";

  if (thumbnail) {
    return (
      <img
        src={thumbnail}
        alt=""
        loading="lazy"
        decoding="async"
        onError={() => setTentativa((atual) => atual + 1)}
        className="aspect-video w-full bg-surface-1 object-cover"
      />
    );
  }

  return (
    <div className="flex aspect-video w-full items-center justify-center bg-surface-1">
      <div className="text-center">
        <p className="text-2xl">
          {type === "vimeo"
            ? messages.icons.cinema
            : type === "twitch"
              ? messages.icons.television
              : messages.icons.play}
        </p>

        <p className="mt-1 text-xs font-normal text-text-subtle">
          {messages.watchOn(type === "youtube" ? "YouTube" : type)}
        </p>
      </div>
    </div>
  );
}
