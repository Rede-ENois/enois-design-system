export type EnquetesMessages = {
  enqueteCard: {
    votos: (total: number) => string;
    semVotos: string;
    multipla: string;
    trocarVoto: string;
    manterVoto: string;
    confirmarVoto: string;
    votando: string;
    terminaEm: (dia: string) => string;
    encerradaEm: (dia: string) => string;
  };
  enqueteComposer: {
    opcoesRotulo: string;
    opcaoPlaceholder: (posicao: number) => string;
    adicionarOpcao: string;
    removerOpcao: string;
    dica: string;
    multiplaEscolha: string;
    prazoRotulo: string;
    prazoDica: string;
  };
};
