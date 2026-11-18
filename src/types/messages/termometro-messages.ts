/**
 * Textos do painel do Termômetro. Tom de clima coletivo: o painel fala do CONJUNTO, nunca de
 * uma pessoa — e com amostra pequena ele diz isso em vez de inventar indicador.
 */
export type TermometroMessages = {
  termometroPanel: {
    title: string;
    subtitle: string;
    loading: string;
    error: string;
    retry: string;
    periodoHoje: string;
    periodo24h: string;
    periodo7d: string;
    periodo30d: string;
    manifestacoes: (count: number) => string;
    participantes: (count: number) => string;
    amostraInsuficiente: string;
    semManifestacoes: string;
    dominante: string;
    semDominante: string;
    comparacaoComJanelaAnterior: (delta: number) => string;
    semComparacao: string;
    privacidade: string;
    emocaoAlegre: string;
    emocaoPesada: string;
    emocaoCansada: string;
    emocaoPrecisando: string;
    emocaoCuriosa: string;
    emocaoCelebrando: string;
  };
};
