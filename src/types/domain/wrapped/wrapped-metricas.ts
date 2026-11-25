/** As contagens do ano, como o backend calculou (nada é somado na view). */
export type WrappedMetricas = {
  publicacoes: number;
  comentarios: number;
  interacoesFeitas: number;
  interacoesRecebidas: number;
  comunidades: number;
  diasAtivos: number;
  mesMaisAtivo: number | null;
};
