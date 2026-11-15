import type { EmbedPlayerProps } from "../../../types/domain/post/embed-player-props.js";

/**
 * Converte o marcador de tempo do link (`t=6479`, `t=10m5s`, `t=1h2m3s`, `start=90`) em segundos.
 * Sem marcador — ou com valor zero/inválido — devolve `undefined` e o player começa do começo.
 */
function parseStartSeconds(url: string): number | undefined {
  const m = url.match(/[?&#](?:t|start|time_continue)=([0-9hms]+)/i);
  if (!m) return undefined;
  const value = m[1].toLowerCase();
  if (/^\d+$/.test(value)) {
    const seconds = Number(value);
    return seconds > 0 ? seconds : undefined;
  }
  const compound = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!compound) return undefined;
  const seconds =
    Number(compound[1] ?? 0) * 3600 + Number(compound[2] ?? 0) * 60 + Number(compound[3] ?? 0);
  return seconds > 0 ? seconds : undefined;
}

/** Detecta URL de vídeo (YouTube/Vimeo/Dailymotion/Twitch) no conteúdo do post. */
export function extractVideoId(url: string): EmbedPlayerProps | null {
  const patterns: [RegExp, EmbedPlayerProps["type"]][] = [
    // YouTube: `watch` (o `v` pode vir depois de outros parâmetros, como no compartilhamento do
    // celular), `youtu.be`, `embed`, `shorts`, `live`, `v` e a origem `youtube-nocookie`. Todos
    // tocam no mesmo `youtube.com/embed/{id}` — sem `shorts`/`live` aqui, o link caía no card
    // "abrir no site" em vez do player.
    [
      /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#\s]*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      "youtube",
    ],
    [/(?:dailymotion\.com\/video\/|dai\.ly\/)([a-zA-Z0-9]+)/, "dailymotion"],
    [/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/, "vimeo"],
    [/(?:twitch\.tv\/videos\/|clips\.twitch\.tv\/)([a-zA-Z0-9_-]+)/, "twitch"],
    // O Spotify precisa do TIPO no caminho do embed (`embed/track/{id}`); só o id dava 404.
    [
      /open\.spotify\.com\/(?:intl-[a-z]+\/)?((?:track|album|playlist|episode|show|artist)\/[a-zA-Z0-9]+)/,
      "spotify",
    ],
    [/twitch\.tv\/([a-zA-Z0-9_]+)\/?$/, "twitch"],
  ];
  for (const [regex, type] of patterns) {
    const m = url.match(regex);
    if (!m) continue;
    const video: EmbedPlayerProps = { type, id: m[1] };
    // O tempo compartilhado (`?t=`) é do YouTube; os demais provedores não recebem o corte.
    if (type === "youtube") video.startSeconds = parseStartSeconds(url);
    return video;
  }
  return null;
}
