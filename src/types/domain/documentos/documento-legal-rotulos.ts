/** Os textos que o app manda para a página: tudo o que aparece nela nasce do app. */
export type DocumentoLegalRotulos = {
  pendenciaTitulo: string;
  pendenciaIntro: string;
  pendenciaIr: string;
  aceito: (data: string) => string;
  aceitar: string;
  aceitando: string;
  aceiteAviso: string;
  aceiteErro: string;
  aceiteFeito: string;
  historico: string;
  versao: (versao: number) => string;
  vigente: string;
  naoVigente: string;
  anterior: string;
};
