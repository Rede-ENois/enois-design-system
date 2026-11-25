/**
 * Textos da retrospectiva do Énóis Wrapped. Tom de memória anual: fala do ano da pessoa com
 * carinho e humor, sem rótulo moral e sem prometer dado que não houve. Os textos das
 * características vêm das chaves estáveis do backend.
 */
export type WrappedMessages = {
  wrapped: {
    carregando: string;
    erro: string;
    tentarDeNovo: string;
    semDadosTitulo: string;
    semDadosTexto: string;
    naoProntaTitulo: string;
    naoProntaTexto: string;
    foraDaJanelaTitulo: string;
    foraDaJanelaTexto: string;
    /** Abertura da experiência (seção 1). */
    abertura: (nome: string, ano: number) => string;
    aberturaSub: string;
    diasAtivos: (dias: number) => string;
    publicacoes: (n: number) => string;
    comentarios: (n: number) => string;
    interacoesFeitas: (n: number) => string;
    interacoesRecebidas: (n: number) => string;
    comunidades: (n: number) => string;
    labelPublicacoes: string;
    labelComentarios: string;
    labelInteracoesFeitas: string;
    labelInteracoesRecebidas: string;
    labelComunidades: string;
    labelDiasAtivos: string;
    /** Assuntos (seção 2). */
    assuntosTitulo: string;
    assuntosPublicados: string;
    assuntosComentados: string;
    semAssuntos: string;
    /** Publicações marcantes (seção 3). */
    marcantesTitulo: string;
    marcantePropria: string;
    marcanteParticipacao: string;
    /** Tretas (seção 4). */
    tretasTitulo: string;
    tretasSub: string;
    tretaComentarios: (n: number) => string;
    tretaDuracao: (dias: number) => string;
    semTretas: string;
    /** Interações (seção 5). */
    interacoesTitulo: string;
    interagi: string;
    interagiram: string;
    /** Ritmo (seção 6). */
    ritmoTitulo: string;
    ritmoMes: (mes: string) => string;
    ritmoDia: (dia: string) => string;
    ritmoHora: (hora: number) => string;
    meses: string[];
    diasSemana: string[];
    /** Perfil (seção 7). */
    perfilTitulo: string;
    perfilDebatedor: string;
    perfilEspecialista: string;
    perfilObservador: string;
    perfilCriador: string;
    perfilComunitario: string;
    /** Impacto (seção 8). */
    impactoTitulo: string;
    impactoConversas: (n: number) => string;
    impactoRecebidas: (n: number) => string;
    impactoCredibilidade: (n: number) => string;
    /** Encerramento (seção 9). */
    encerramentoTitulo: string;
    encerramentoFrase: string;
    encerramentoTema: (tema: string) => string;
    encerramentoObrigado: string;
    /** Navegação e compartilhamento. */
    avancar: string;
    voltar: string;
    compartilhar: string;
    verPublicacao: string;
    verPerfil: string;
    compartilhado: string;
    copiado: string;
    etapa: (atual: number, total: number) => string;
  };
};
