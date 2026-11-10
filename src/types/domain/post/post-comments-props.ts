import type { ReactNode } from "react";

import type { CommentMediaDraft } from "./comment-media-draft.js";
import type { CommentsError } from "./comments-error.js";
import type { PostCommentNode } from "./post-comment-node.js";

export type PostCommentsProps<C extends PostCommentNode = PostCommentNode> = {
  /** Id do formulário (a resposta rola até ele). */
  formId: string;
  /** Comentários carregados, fixado primeiro e o resto do mais antigo ao mais novo. */
  comments: C[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: CommentsError | null;
  /**
   * Razao da recusa vinda da API (ex.: "Voce ja publicou este conteudo recentemente"). Quando
   * existe, substitui o texto generico do erro de ENVIO: a pessoa precisa saber o motivo para
   * poder agir — "tente de novo" num conteudo duplicado vai falhar igual.
   */
  sendErrorDetail?: string | null;
  onRetry: () => void;
  onLoadMore: () => void;
  /** Renders one comment row (the app wires its data). */
  renderComment: (comment: C, replyingTo?: string) => ReactNode;
  replyToId: string | null;
  onCancelReply: () => void;
  media: CommentMediaDraft[];
  mediaSpoiler: boolean;
  onToggleMediaSpoiler: () => void;
  onRemoveMedia: (index: number) => void;
  /** Insere o marcador da mídia no texto (o pendente vira o id real no upload). */
  onInsertMedia: (index: number) => void;
  onAddImages: (files: File[]) => void;
  onAddAudio: (file: File) => void;
  onErrorChange: (error: CommentsError | null) => void;
  /**
   * O campo de escrita (com menção) vem do app. As a function it learns whether the "+" tools are
   * open (to show its formatting bar only then) and who is being answered (for its placeholder).
   */
  composerField:
    ReactNode | ((state: { toolsOpen: boolean; replyingTo: string | null }) => ReactNode);
  /** Há texto ou mídia para enviar. */
  canSend: boolean;
  sending: boolean;
  /** Envia o comentário (com o campo-isca `website`); `true` quando deu certo. */
  onSubmit: (website: string) => Promise<boolean>;
  onOpenGifPicker: () => void;
  gifPicker?: ReactNode;
};
