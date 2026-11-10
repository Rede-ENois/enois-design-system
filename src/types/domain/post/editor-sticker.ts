/** A sticker the field can draw inline: the image behind a code typed or inserted in the text. */
export type EditorSticker = {
  /** Image URL; it goes through `useAdapters().resolveMediaUrl` before it is drawn. */
  url: string;
  /** Text alternative of the image. */
  alt: string;
};
