import type { ConfessionarioCommentInput } from "./confessionario-comment-input.js";
import type { ConfessionarioCommentView } from "./confessionario-comment-view.js";
import type { ConfessionarioCommentsState } from "./confessionario-comments-state.js";
import type { ConfessionarioReactionOffered } from "./confessionario-reaction-offered.js";
import type { ConfissaoPostView } from "./confissao-post-view.js";

/** O card de uma confissão na linha do tempo: desenha o texto, as reações contadas e, quando
 * abertos, os comentários. A listagem de quem reagiu não existe — as contagens são o teto do
 * que se mostra. */
export type ConfessionarioCardProps = {
  post: ConfissaoPostView;
  commentsOpen: boolean;
  comments: ConfessionarioCommentView[];
  commentsState: ConfessionarioCommentsState;
  onToggleComments: () => void;
  onReact: (reaction: ConfessionarioReactionOffered) => void;
  onUnreact: () => void;
  onRemove: () => void;
  onComment: (input: ConfessionarioCommentInput) => Promise<void>;
  onRemoveComment: (commentId: string) => void;
  /** Abre a denúncia; o card só oferece o gesto para quem NÃO é o autor da confissão. */
  onReport?: () => void;
};
