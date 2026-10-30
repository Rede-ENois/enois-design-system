import type { ReactNode } from "react";

import type { JobApplicationFieldData } from "./job-application-field-data.js";
import type { JobApplicationPrefill } from "./job-application-prefill.js";
import type { JobApplicationValues } from "./job-application-values.js";

export type ApplyJobDialogProps = {
  job: { title: string; applicationFields?: JobApplicationFieldData[] };
  /** O botão que abre o diálogo. */
  children: ReactNode;
  /** Avisado a cada abrir/fechar (o app limpa o erro e o "enviada" ao fechar). */
  onOpenChange: (open: boolean) => void;
  pending: boolean;
  /** A candidatura foi enviada. */
  done: boolean;
  /** Erro do envio, já em texto de tela. */
  error: string | null;
  /** Quando o erro pede verificar a conta: para onde o link leva. */
  verifyHref: string | null;
  onSubmit: (values: JobApplicationValues) => void;
  /**
   * Lê o currículo e devolve as sugestões. Rejeita com um `Error` cuja mensagem já é o texto de
   * tela do motivo.
   */
  onPrefill: (file: File) => Promise<JobApplicationPrefill>;
  /** The professional identity that signs it (shown as "você envia como"). */
  applicant?: { name: string; username: string } | null;
  /**
   * Set while there is no active professional profile: the dialog shows the way to activate it
   * and does not let the person send (the server refuses it anyway).
   */
  professionalSetupHref?: string | null;
};
