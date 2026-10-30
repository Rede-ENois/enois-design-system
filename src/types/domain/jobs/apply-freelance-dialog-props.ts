export type ApplyFreelanceDialogProps = {
  freelance: { title: string; username: string | null };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
  /** Erro do envio, já em texto de tela. */
  error: string | null;
  /** A mensagem foi enviada: o diálogo troca o campo pelo atalho para a conversa. */
  sent: boolean;
  /** Recebe a mensagem já aparada. */
  onSend: (message: string) => void;
  onOpenChat: () => void;
  /** The professional identity that signs it (shown as "você envia como"). */
  applicant?: { name: string; username: string } | null;
  /**
   * Set while there is no active professional profile: the dialog shows the way to activate it
   * and does not let the person send (the server refuses it anyway).
   */
  professionalSetupHref?: string | null;
};
