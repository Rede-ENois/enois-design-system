import type { PortfolioBlockKind } from "./portfolio-block-kind.js";

/** A peça no rascunho: o que está gravado, e o que ainda mostra o que a última publicação tinha. */
export type PortfolioEditorBlock = {
  id: string;
  kind: PortfolioBlockKind;
  title: string;
  text: string;
  projectId: string | null;
  mediaId: string | null;
  linkUrl: string | null;
  /** A peça mudou desde a última publicação. */
  unpublished: boolean;
};
