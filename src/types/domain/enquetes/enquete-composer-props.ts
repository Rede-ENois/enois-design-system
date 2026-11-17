export type EnqueteComposerProps = {
  opcoes: string[];
  onOpcoesChange: (opcoes: string[]) => void;
  /** Sem o par, o controle de múltipla escolha não aparece. */
  multiplaEscolha?: boolean;
  onMultiplaEscolhaChange?: (valor: boolean) => void;
  /** Sem o par, o controle de prazo não aparece. ISO-8601; vazio = sem prazo. */
  terminaEm?: string;
  onTerminaEmChange?: (valor: string | undefined) => void;
};
