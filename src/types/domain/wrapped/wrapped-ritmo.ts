/**
 * O ritmo do ano: os picos (null quando não houve atividade no eixo) e a série completa para o
 * gráfico. 12 meses, 7 dias (domingo=0) e 24 horas, na ordem de apresentação.
 */
export type WrappedRitmo = {
  diaSemanaMaisAtivo: number | null;
  horaMaisAtiva: number | null;
  mesMaisAtivo: number | null;
  porMes: number[];
  porDiaSemana: number[];
  porHora: number[];
};
