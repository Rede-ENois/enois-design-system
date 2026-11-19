import type { DesabafosReactionOffered } from "./desabafos-reaction-offered.js";

/**
 * Um desabafo na linha do tempo do feed próprio: texto e contagens, SEM autor.
 *
 * O anonimato é do contrato: o DS não recebe nome, avatar nem estilo porque o backend não manda
 * mais — quem vê reconhece o próprio desabafo pelo `isMine` calculado no servidor, nunca por um
 * id de autor exposto. Reação é contada, nunca nominada: não existe lista de quem apoiou.
 */
export type DesabafoPostView = {
  id: string;
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
