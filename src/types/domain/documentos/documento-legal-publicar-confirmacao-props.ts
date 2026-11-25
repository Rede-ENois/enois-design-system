import type { DocumentoLegalAdminRotulos } from "./documento-legal-admin-rotulos.js";

export type DocumentoLegalPublicarConfirmacaoProps = {
  labels: DocumentoLegalAdminRotulos;
  publicando: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};
