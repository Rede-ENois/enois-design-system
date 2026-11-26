import type { WrappedComportamento } from "./wrapped-comportamento.js";

/**
 * O ritmo do ano: os picos (null quando não houve atividade no eixo), a série completa para o
 * gráfico e como a presença mudou entre as metades. 12 meses, 7 dias (domingo=0) e 24 horas.
 */
export type WrappedRitmo = {
  diaSemanaMaisAtivo: number | null;
  horaMaisAtiva: number | null;
  mesMaisAtivo: number | null;
  porMes: number[];
  porDiaSemana: number[];
  porHora: number[];
  comportamento: WrappedComportamento;
};
