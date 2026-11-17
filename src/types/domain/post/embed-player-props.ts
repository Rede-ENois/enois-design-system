export type EmbedPlayerProps = {
  type: string;
  id: string;
  /**
   * Toca sozinho (mudo) quando entra na tela — usado no feed. Navegador só libera autoplay mudo,
   * então o som vem no clique: na capa ou no botão do próprio player.
   */
  autoplay?: boolean;
  /**
   * Segundo do vídeo em que a reprodução começa (parâmetro `t` do link compartilhado). Sem valor,
   * o player começa do começo.
   */
  startSeconds?: number;
};
