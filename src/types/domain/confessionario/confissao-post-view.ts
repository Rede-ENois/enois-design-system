import type { ConfessionarioReactionOffered } from "./confessionario-reaction-offered.js";

/**
 * Uma confissão na linha do tempo do Confessionário: texto e contagens, SEM autor.
 *
 * O anonimato é do contrato: o DS não recebe nome, avatar nem estilo porque o backend não manda —
 * quem reconhece a própria história é o `isMine` calculado no servidor, nunca um id de autor
 * exposto. Reação é contada, nunca nominada: não existe lista de quem reagiu.
 */
export type ConfissaoPostView = {
  id: string;
  content: string;
  /** ISO 8601, como o backend manda; a view formata no fuso de quem vê. */
  createdAt: string;
  reactions: number;
  reactionSummary: Record<string, number>;
  /** Minha reação, quando eu reagi; nulo quando só conta a dos outros. */
  myReaction: ConfessionarioReactionOffered | null;
  comments: number;
  /** Quem vê é quem contou: a view mostra o gesto de remover a própria. */
  isMine: boolean;
};
