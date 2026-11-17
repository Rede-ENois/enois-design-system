import type { ComposerMediaDraft } from "../post/composer-media-draft.js";

import type { ColagemCommentInput } from "./colagem-comment-input.js";
import type { ColagemCommentView } from "./colagem-comment-view.js";
import type { ColagemCommentsState } from "./colagem-comments-state.js";
import type { ColagemPhotoDetail } from "./colagem-photo-detail.js";
import type { ColagemPhotoState } from "./colagem-photo-state.js";

export type ColagemPhotoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photo: ColagemPhotoDetail | null;
  photoState: ColagemPhotoState;
  comments: ColagemCommentView[];
  commentsState: ColagemCommentsState;
  /** Emoji de cada tipo de reação (o mesmo mapa que o app usa no feed). */
  emojis: Record<string, string>;
  /** Reação em andamento: pílulas e seletor param de aceitar clique. */
  reactionPending: boolean;
  /** Alternar a reação de quem vê: o app decide reagir, trocar ou remover. */
  onToggleReaction: (type: string) => void;
  /** Contribui com comentário; resolve, o campo limpa; rejeita, o rascunho fica. */
  onComment: (input: ColagemCommentInput) => Promise<void>;
  /** Remove um comentário (o próprio; a moderação passa pelo fluxo dela). */
  onRemoveComment: (commentId: string) => void;
  /** O autor remove a própria foto; rejeita, o diálogo fica aberto para o aviso do app. */
  onRemovePhoto: () => Promise<void>;
  /**
   * O anexo da contribuição (foto do comentário): subir é trabalho do app, a view desenha o
   * rascunho na linha de contribuição.
   */
  commentAttachment: ComposerMediaDraft | null;
  onCommentFiles: (files: File[]) => void;
  onRemoveCommentAttachment: () => void;
};
