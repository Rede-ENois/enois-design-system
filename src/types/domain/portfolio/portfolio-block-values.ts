import type { PortfolioBlockKind } from "./portfolio-block-kind.js";

/** O formulário da peça, como ele é enviado: só o campo do tipo escolhido conta. */
export type PortfolioBlockValues = {
  kind: PortfolioBlockKind;
  title: string;
  text: string;
  projectId: string;
  mediaId: string;
  linkUrl: string;
};
