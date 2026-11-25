/** O envio de uma figurinha: o formulário é do DS; o arquivo escolhido chega por `onArquivo`. */
export type FigurinhaComunidadeEnvioProps = {
  logado: boolean;
  codigo: string;
  onCodigoChange: (codigo: string) => void;
  nome: string;
  onNomeChange: (nome: string) => void;
  onArquivo: (arquivo: File | null) => void;
  /** Cresce quando o envio conclui: o seletor de arquivo é recriado vazio. */
  arquivoReset: number;
  enviando: boolean;
  podeEnviar: boolean;
  onEnviar: () => void;
  erro: string | null;
  labels: {
    titulo: string;
    intro: string;
    arquivo: string;
    ajudaArquivo: (kb: number) => string;
    codigo: string;
    codigoExemplo: string;
    codigoAjuda: string;
    codigoReservado: string;
    nome: string;
    nomeAjuda: string;
    dica: string;
    enviar: string;
    enviando: string;
    diretrizes: string;
    entrar: string;
    login: string;
  };
  onAbrirDiretrizes: () => void;
  onEntrar: () => void;
  /** Conteúdo extra abaixo (a figurinha recém-publicada). */
  children?: React.ReactNode;
};
