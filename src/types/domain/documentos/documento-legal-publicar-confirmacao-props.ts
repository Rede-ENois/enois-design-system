import type { DocumentoLegalAdminRotulos } from "./documento-legal-admin-rotulos.js";

export type DocumentoLegalPublicarConfirmacaoProps = {
  labels: DocumentoLegalAdminRotulos;
  publicando: boolean;
  /** Vazio esconde a confirmação: só o clique em publicar a abre. */
  aberta: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};
