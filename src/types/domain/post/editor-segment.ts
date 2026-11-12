/** A run of the field content: plain text, or a sticker drawn as one atomic image. */
export type EditorSegment =
  { kind: "text"; text: string } | { kind: "sticker"; code: string; src: string; alt: string };
