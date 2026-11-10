/** A loaded media asset, as the media views read it. */
export type MediaItemData = {
  id: string;
  mimeType: string;
  /** Stored path or URL; the app resolves it through the media adapters. */
  cdnUrl: string | null;
  /**
   * Pixel size, when the server knows it. With both, the view reserves the media's box before it
   * loads, so a card does not grow under the reader (and a virtualized list does not jump).
   */
  width?: number | null;
  height?: number | null;
};
