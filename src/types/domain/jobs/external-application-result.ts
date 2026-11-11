/**
 * O comprovante do envio.
 *
 * `resumeAttached` é o que o servidor conseguiu anexar de verdade: quando o download do currículo
 * falha, o e-mail sai sem ele e este campo vem `false`. A tela nunca pode dizer "currículo enviado"
 * com base em outra coisa.
 */
export type ExternalApplicationResult = {
  recipientEmail: string;
  subject: string;
  resumeAttached: boolean;
  resumeName: string | null;
  status: string;
  appliedAt: string;
};
