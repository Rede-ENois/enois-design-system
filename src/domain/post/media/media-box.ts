import type { CSSProperties, SyntheticEvent } from "react";

/**
 * Proportions of the media already seen in this session, by address. The server does not send the
 * size of a post's media, so the first load of each one still grows its card once; a card that a
 * virtualized feed unmounts and mounts again then starts with the box it will end with. Without
 * this, a card at the edge of the list mounted short, grew when its video loaded, the list
 * corrected the scroll, the card left the range, and the loop repeated (the feed flicker).
 */
const ratios = new Map<string, number>();
// ponytail: plain cap, oldest first; a feed session sees far fewer media than this.
const MAX_RATIOS = 1000;

function remember(src: string | undefined, width: number, height: number) {
  if (!src || !width || !height) return;
  if (ratios.size >= MAX_RATIOS) ratios.delete(ratios.keys().next().value!);
  ratios.set(src, width / height);
}

/** `aspect-ratio` for the media's box: the server's size when known, else the one seen before. */
export function mediaBoxStyle(
  src: string | undefined,
  width?: number | null,
  height?: number | null,
): CSSProperties | undefined {
  if (width && height) return { aspectRatio: `${width} / ${height}` };
  const ratio = src ? ratios.get(src) : undefined;
  return ratio ? { aspectRatio: String(ratio) } : undefined;
}

/** `onLoad` of an image: keeps its natural proportion for the next mount. */
export function rememberImageBox(src: string | undefined) {
  return (event: SyntheticEvent<HTMLImageElement>) =>
    remember(src, event.currentTarget.naturalWidth, event.currentTarget.naturalHeight);
}

/** `onLoadedMetadata` of a video: keeps its proportion for the next mount. */
export function rememberVideoBox(src: string | undefined) {
  return (event: SyntheticEvent<HTMLVideoElement>) =>
    remember(src, event.currentTarget.videoWidth, event.currentTarget.videoHeight);
}

/** Tests only. */
export function clearMediaBoxes() {
  ratios.clear();
}
