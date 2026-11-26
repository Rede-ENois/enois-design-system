import type { PortfolioBlockKind } from "./portfolio-block-kind.js";
import type { PortfolioMediaKind } from "./portfolio-media-kind.js";
import type { PortfolioProjectCard } from "./portfolio-project-card.js";

/**
 * Uma peça da vitrine, no que a tela precisa desenhar. Texto, URL e card de projeto já vêm
 * resolvidos; `imageUrl`/`fileUrl` chegam absolutas e só existem quando o app conseguiu resolver a
 * mídia da peça.
 */
export type PortfolioBlock = {
  id: string;
  kind: PortfolioBlockKind;
  title: string | null;
  text: string | null;
  linkUrl: string | null;
  project: PortfolioProjectCard | null;
  mediaKind: PortfolioMediaKind | null;
  /** Endereço que abre a peça de mídia (o PDF inteiro, a imagem ou o vídeo). */
  fileUrl: string | null;
  /** Imagem que se mostra no card; no PDF, a primeira página renderizada. */
  imageUrl: string | null;
};
