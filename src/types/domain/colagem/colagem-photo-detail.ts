import type { AuthorNameStyle } from "../name/author-name-style.js";

import type { ColagemPhotoSummary } from "./colagem-photo-summary.js";

/**
 * A foto aberta no detalhe: o piso da grade mais o autor de verdade (avatar, estilo do nome) e o
 * estado das reações — o que as pílulas e o seletor precisam para desenhar e alternar.
 */
export type ColagemPhotoDetail = ColagemPhotoSummary & {
  authorAvatar: string | null;
  authorAvatarFrame: string | null;
  authorStyle: AuthorNameStyle | null;
  /** Contagem por tipo de reação (a mesma forma do resumo do feed). */
  reactionSummary: Record<string, number>;
  /** Reação de quem está vendo; nenhuma é `null`. */
  myReaction: string | null;
  /** Só o autor tem o menu de remover a própria foto. */
  isOwner: boolean;
};
