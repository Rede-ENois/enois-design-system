import type { ReactNode } from "react";

import type { ProfileHtmlFrameProps } from "../profile/profile-html-frame-props.js";

import type { PortfolioAuthor } from "./portfolio-author.js";
import type { PortfolioBlock } from "./portfolio-block.js";

export type PortfolioShowcaseProps = {
  author: PortfolioAuthor;
  /** URL do perfil de quem assina. */
  profileHref: string;
  /** A página em HTML/CSS; nula quando o autor só publicou peças. */
  html: string | null;
  blocks: PortfolioBlock[];
  publishedAt: string | null;
  /** Desenha a página no quadro isolado do app (tema e modo lite moram lá). */
  renderHtmlFrame: (props: ProfileHtmlFrameProps) => ReactNode;
  /** Sem nada publicado: a última versão saiu do ar. */
  unavailable?: boolean;
};
