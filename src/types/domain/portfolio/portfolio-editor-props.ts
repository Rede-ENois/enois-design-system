import type { ReactNode } from "react";

import type { ProfileHtmlFrameProps } from "../profile/profile-html-frame-props.js";

import type { PortfolioBlockValues } from "./portfolio-block-values.js";
import type { PortfolioEditorBlock } from "./portfolio-editor-block.js";
import type { PortfolioEditorState } from "./portfolio-editor-state.js";
import type { PortfolioOutro } from "./portfolio-outro.js";

export type PortfolioEditorProps = {
  state: PortfolioEditorState;
  /** A página do rascunho (HTML/CSS), como está no servidor. */
  html: string;
  /** Versão publicada (0 = nunca publicado) e quando, para o cabeçalho dizer o que está no ar. */
  publishedVersion: number;
  publishedAt: string | null;
  blocks: PortfolioEditorBlock[];
  /** Projetos do perfil que podem virar peça, com o motivo quando não podem. */
  outros: PortfolioOutro[];
  /** Última recusa do servidor, já em texto. O app limpa ao começar uma nova ação. */
  error: string | null;
  /** Uma gravação em andamento (rascunho, peça, ordem ou publicação). */
  pending: boolean;
  /** Largura da prévia do quadro isolado: quem desenha é o DS, quem põe o tema é o app. */
  renderHtmlFrame: (props: ProfileHtmlFrameProps) => ReactNode;
  onDraftChange: (html: string) => void;
  onSaveDraft: () => void;
  onSaveBlock: (values: PortfolioBlockValues, blockId: string | null) => void;
  onRemoveBlock: (blockId: string) => void;
  /** A nova ordem das peças gravadas, do topo para o fim. */
  onReorder: (order: string[]) => void;
  onPublish: () => void;
};
