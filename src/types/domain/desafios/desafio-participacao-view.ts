import type { DesafioAuthorView } from "./desafio-author-view.js";

/**
 * Uma participação no mural do desafio, com autoria nominal: quem respondeu o convite assina.
 * A torcida é contada, nunca nominada — só o total e se quem lê torceu.
 */
export type DesafioParticipacaoView = {
  id: string;
  desafioId: string;
  author: DesafioAuthorView;
  content: string;
  /** ISO 8601, como o backend manda; a view formata no fuso de quem vê. */
  createdAt: string;
  cheers: number;
  /** Minha torcida, quando existe; tocar de novo tira. */
  cheered: boolean;
  /** Quem vê é quem escreveu: a view mostra o gesto de remover a própria. */
  isMine: boolean;
};
