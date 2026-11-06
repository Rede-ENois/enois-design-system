import { Fragment } from "react";

import { useAdapters } from "../../../adapters/adapters-context.js";
import { rendersInline, trimTrailingPunctuation } from "../../../lib/shared-links.js";
import { useMessages } from "../../../messages/messages-context.js";
import type { LinkPreviewsProps } from "../../../types/domain/post/link-previews-props.js";

import { EmbedPlayer } from "./embed-player.js";
import { extractVideoId } from "./extract-video-id.js";

/** Renderiza preview de cada URL do conteúdo de um post (vídeo embedado ou card do link). */
export function LinkPreviews({
  content,
  autoplay = false,
  renderLinkPreview,
  compact = false,
}: LinkPreviewsProps) {
  const messages = useMessages().linkPreviews;
  const { isOwnMediaUrl } = useAdapters();
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = content.match(urlRegex) ?? [];
  const seen = new Set<string>();

  return (
    <>
      {urls.map((url) => {
        if (seen.has(url)) return null;
        seen.add(url);

        // GIF/imagem/vídeo/áudio de URL direta já são renderizados DENTRO do RichText; repetir
        // aqui era o que fazia o GIF aparecer duas vezes no post e no comentário. A pontuação final
        // sai antes da checagem: `.../giphy.gif.` (ponto da frase) tem que ser lido como o GIF dele.
        if (rendersInline(trimTrailingPunctuation(url), isOwnMediaUrl)) return null;

        const video = extractVideoId(url);
        if (video) {
          return <EmbedPlayer key={url} type={video.type} id={video.id} autoplay={autoplay} />;
        }

        // O app desenha o cartão quando sabe mais do que o host (título, descrição, miniatura).
        // `null` é resposta válida: a prévia ainda está chegando e o link não aparece sozinho.
        if (renderLinkPreview) {
          return <Fragment key={url}>{renderLinkPreview(url, { compact })}</Fragment>;
        }

        return (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-3 rounded-xl border border-border-soft bg-surface-1 px-4 py-3 text-sm font-normal transition hover:bg-surface-3"
          >
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-xs font-bold text-primary">
              {(() => {
                try {
                  return new URL(url).hostname.slice(0, 2).toUpperCase();
                } catch {
                  return messages.webIcon;
                }
              })()}
            </div>

            <div className="min-w-0">
              <p className="truncate font-normal text-text-strong">
                {(() => {
                  try {
                    return new URL(url).hostname;
                  } catch {
                    return url;
                  }
                })()}
              </p>

              <p className="truncate text-xs font-normal text-text-subtle">{messages.openLabel}</p>
            </div>
          </a>
        );
      })}
    </>
  );
}
