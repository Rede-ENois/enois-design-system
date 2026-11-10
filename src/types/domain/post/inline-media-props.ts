import type { MediaItemData } from "./media-item-data.js";

export type InlineMediaProps = {
  /** The media behind the `{{media:<id>}}` marker; nothing renders until it loads. */
  media?: Pick<MediaItemData, "mimeType" | "cdnUrl" | "width" | "height"> | null;
  mediaSpoiler?: boolean;
  /** Modo lite: vídeo vira convite para o palco em tela cheia. */
  lite?: boolean;
};
