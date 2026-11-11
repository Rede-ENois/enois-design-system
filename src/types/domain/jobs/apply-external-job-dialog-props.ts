import type { ReactNode } from "react";

import type { ExternalApplicationDraft } from "./external-application-draft.js";
import type { ExternalApplicationResult } from "./external-application-result.js";

export type ApplyExternalJobDialogProps = {
  /** O botão que abre o diálogo. */
  children: ReactNode;
  /** Avisado a cada abrir/fechar (o app busca a prévia ao abrir e limpa o estado ao fechar). */
  onOpenChange: (open: boolean) => void;
  /** A prévia do servidor; `null` enquanto ela não chegou. */
  draft: ExternalApplicationDraft | null;
  /** A prévia está sendo buscada. */
  loading: boolean;
  /** Erro ao buscar a prévia, já em texto de tela. */
  loadError: string | null;
  /** O envio está em andamento. */
  pending: boolean;
  /** Erro do envio, já em texto de tela. */
  error: string | null;
  /** O envio terminou: o comprovante diz para onde foi e se o anexo foi junto. */
  result: ExternalApplicationResult | null;
  /**
   * Envia a candidatura. Só é chamado depois da confirmação explícita da pessoa — o diálogo não
   * tem outro caminho de envio.
   */
  onConfirm: (message: string) => void;
  /** Abre o cliente de e-mail da pessoa com o mesmo texto (alternativa sem anexo). */
  onOpenMailClient: () => void;
  /** Tenta de novo a busca da prévia. */
  onRetry: () => void;
};
