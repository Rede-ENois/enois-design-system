import type { RenderLinkPreview } from "./render-link-preview.js";

export type LinkPreviewsProps = {
  content: string;
  /** No feed a prévia de vídeo toca sozinha (muda) quando entra na tela; em comentário, não. */
  autoplay?: boolean;
  /**
   * O cartão de cada link de página. Sem ele o DS desenha o cartão simples (host + "abrir no
   * site"); com ele, o app desenha a miniatura com título, descrição e imagem.
   */
  renderLinkPreview?: RenderLinkPreview;
  /** Comentário: o cartão fica menor. */
  compact?: boolean;
};
