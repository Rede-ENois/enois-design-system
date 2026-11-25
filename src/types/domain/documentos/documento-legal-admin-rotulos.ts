export type DocumentoLegalAdminRotulos = {
  /** Título da seção do formulário (o `titulo` abaixo é o do campo de título). */
  tituloSecao: string;
  /** Quem pode usar a tela (o app confere; aqui é só o aviso). */
  apenasAdmin: string;
  /** Rótulos das versões (os mesmos da página de leitura). */
  versao: (versao: number) => string;
  vigente: string;
  naoVigente: string;
  tipo: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  conteudoAjuda: string;
  enviar: string;
  enviando: string;
  erro: string;
  criarFeito: (versao: number) => string;
  publicar: string;
  publicarAviso: string;
  publicando: string;
  /** Aviso enquanto a confirmação da publicação está na tela. */
  confirmacaoTitulo: string;
  confirmar: string;
  cancelar: string;
  publicado: string;
  publicadoErro: string;
  vazio: string;
  publicados: string;
};
