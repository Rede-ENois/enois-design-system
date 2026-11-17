import type { AuthorNameStyle } from "../name/author-name-style.js";

import type { DesabafosReactionOffered } from "./desabafos-reaction-offered.js";

/** Um desabafo na linha do tempo do feed próprio: autor achatado, texto e contagens. Reação é
 * contada, nunca nominada — não existe aqui lista de quem apoiou, só o MEU tipo. */
export type DesabafoPostView = {
  id: string;
  authorName: string | null;
  authorAvatar: string | null;
  authorStyle: AuthorNameStyle | null;
  content: string;
  /** ISO 8601, como o backend manda; a view formata no fuso de quem vê. */
  createdAt: string;
  reactions: number;
  reactionSummary: Record<string, number>;
  /** Minha reação, quando eu apoiei; nulo quando só conta a dos outros. */
  myReaction: DesabafosReactionOffered | null;
  comments: number;
  /** Quem vê é quem desabafou: a view mostra o gesto de remover o próprio. */
  isMine: boolean;
};
