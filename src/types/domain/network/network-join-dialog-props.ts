export type NetworkJoinDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Emite o token de ingresso (o backend cria o pedido; a aprovação é do admin). */
  onRequestJoin: (displayName: string) => void;
  joinPending?: boolean;
  /** O token emitido, de uso único; `null` enquanto não emitido ou após fechar. */
  issuedToken: { token: string; expiresAtLabel: string; nextStep: string } | null;
  onDismissToken: () => void;
  /** Erro da solicitação (ex.: limite de tokens vivos), já traduzido pelo app. */
  joinError?: string | null;
};
