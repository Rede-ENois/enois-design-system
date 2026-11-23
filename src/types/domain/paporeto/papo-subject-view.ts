import type { PapoStatus } from "./papo-status.js";

/** Um assunto em alta pronto para a tela — SÓ agregado: sem autor, sem texto de publicação e
 * sem link de quem falou. O subject é expressão dobrada; quem desenha o rótulo é a tela. */
export type PapoSubjectView = {
  subject: string;
  status: PapoStatus;
  pontuacao: number;
  falasPost: number;
  falasComentario: number;
  pessoas: number;
  falasUltimaHora: number;
  /** Proporção de volume das últimas 24h contra a véspera; nulo = sem véspera comparável. */
  crescimento: number | null;
  /** O assunto passou pelo chão da base pequena: a tela diz que a amostra é menor. */
  amostragemMenor?: boolean;
  /** Tamanho da base do assunto (publicações distintas do escopo na janela); o marcador sai das pessoas. */
  janelaPublicacoes?: number;
};
