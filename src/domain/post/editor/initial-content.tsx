import type { ReactNode } from "react";

import type { EditorSegment } from "../../../types/domain/post/editor-segment.js";

import {
  SENTINEL_ATTRIBUTE,
  STICKER_ATTRIBUTE,
  STICKER_CLASS,
  STICKER_IMAGE_CLASS,
  needsTrailingBreak,
} from "./editor-dom.js";

/**
 * The field content as React elements, for the server markup and the first client render only: the
 * text and the stickers are there before any script runs, and hydration finds the same nodes the
 * browser code would draw. Afterwards the field is drawn by `renderSegments`; this tree is built
 * once and kept, so React never reconciles it against the nodes that code replaces.
 */
export function initialContent(segments: EditorSegment[]): ReactNode[] {
  const nodes: ReactNode[] = segments.map((segment, index) =>
    segment.kind === "text" ? (
      segment.text
    ) : (
      <span
        key={index}
        contentEditable={false}
        suppressContentEditableWarning
        {...{ [STICKER_ATTRIBUTE]: segment.code }}
        className={STICKER_CLASS}
      >
        <img
          src={segment.src}
          alt={segment.alt}
          draggable={false}
          className={STICKER_IMAGE_CLASS}
        />
      </span>
    ),
  );
  if (needsTrailingBreak(segments))
    nodes.push(<br key="trailing-break" {...{ [SENTINEL_ATTRIBUTE]: "" }} />);
  return nodes;
}
