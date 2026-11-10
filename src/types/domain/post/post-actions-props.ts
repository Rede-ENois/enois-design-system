import type { ReactNode } from "react";

import type { ReactionCountSummary } from "../../lib/reactions/reaction-count-summary.js";

export type PostActionsProps<T extends string = string> = {
  emojis: Record<T, string>;
  /** Reação de quem lê. */
  reactionStatus: T | null;
  /** Contagem por tipo: as bolinhas do contador mostram o top real do post (até 3). */
  reactionSummary?: ReactionCountSummary<T>;
  onReact: (type: T) => void;
  /** Reação em andamento: a transição para `true` dispara o pulso do ícone. */
  reactionPending: boolean;
  /** Se o pulso pode animar agora (modo lite e movimento reduzido desligam). */
  motionAllowed: () => boolean;
  reactionCount: number;
  commentsCount: number;
  repostsCount: number;
  savesCount: number;
  saved: boolean;
  /** Conteúdo de comunidade e os tipos que não viajam não oferecem republicar. */
  canRepost: boolean;
  /** O viewer já republicou este post (botão fica ativo, como saved). */
  reposted?: boolean;
  /**
   * Por que este post não pode ser republicado. Com `canRepost` falso e um motivo, o botão
   * aparece desabilitado e explica o motivo ao tocar, clicar ou focar; sem motivo, ele some.
   */
  repostUnavailableReason?: string;
  onShowReactions: () => void;
  /** O que o botão de comentários faz nesta tela: abrir a conversa aqui ou rolar até ela. */
  onComments: () => void;
  onRepost: () => void;
  onShare: () => void;
  onReport: () => void;
  onSave: () => void;
  /** Ações extras no fim da fileira (os selos do feed, por exemplo). */
  children?: ReactNode;
  /** Diálogos da fileira (republicar, reações, selos, denúncia), montados pelo app. */
  dialogs?: ReactNode;
};
