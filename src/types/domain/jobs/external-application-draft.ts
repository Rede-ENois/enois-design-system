/**
 * O e-mail de candidatura que o Énóis vai enviar, como o servidor o montou.
 *
 * É a prévia: nada aqui foi enviado ainda. `resumeAvailable` diz se há currículo no perfil para
 * anexar — e `resumeName` é o nome do arquivo que a pessoa reconhece.
 */
export type ExternalApplicationDraft = {
  recipientEmail: string;
  subject: string;
  body: string;
  resumeAvailable: boolean;
  resumeName: string | null;
  jobTitle: string;
  company: string | null;
  jobUrl: string | null;
};
