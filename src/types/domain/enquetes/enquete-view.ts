/**
 * Estado de uma enquete de um post: as alternativas, a contagem de votos (na mesma ordem das
 * opções), as posições escolhidas por quem lê, o total de pessoas que votaram, se aceita mais
 * de uma alternativa e o prazo de encerramento (ISO-8601; nulo = sem prazo).
 */
export type EnqueteView = {
  opcoes: string[];
  contagens: number[];
  meusVotos: number[];
  totalVotos: number;
  multiplaEscolha: boolean;
  terminaEm: string | null;
};
