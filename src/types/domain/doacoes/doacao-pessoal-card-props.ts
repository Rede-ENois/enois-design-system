import type { DoacaoPixView } from "./doacao-pix-view.js";

export type DoacaoPessoalCardProps = {
  /** `null` enquanto a conta ainda não foi consultada; o card não afirma selo sem saber. */
  apoiador: boolean | null;
  codigo: DoacaoPixView | null;
  qrCodeDataUrl: string | null;
  valorCents: number | null;
  comprovante: string;
  erro: string | null;
  erroConfirmar: string | null;
  abrindo: boolean;
  confirmando: boolean;
  confirmada: boolean;
  copiado: boolean;
  onValorChange: (centavos: number | null) => void;
  onAbrir: () => void;
  onComprovanteChange: (texto: string) => void;
  onConfirmar: () => void;
  onCopiar: () => void;
  onMudarValor: () => void;
};
