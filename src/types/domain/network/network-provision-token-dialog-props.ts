export type NetworkProvisionTokenDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Emite o token de provisionamento. O app resolve o dono (username → conta) antes de chamar; o
   * diálogo só entrega o que o admin digitou.
   */
  onProvision: (input: { serverName: string; ownerUsername: string; profiles: string[] }) => void;
  provisionPending?: boolean;
  /**
   * O token emitido, de uso único: `null` enquanto não emitido ou depois de fechar. Ele só cria o
   * nó; operar depende da API key, que o admin emite depois da aprovação.
   */
  issuedToken: { token: string; expiresAtLabel: string } | null;
  onDismissToken: () => void;
  /** Erro da emissão (ex.: conta do dono não encontrada), já traduzido pelo app. */
  provisionError?: string | null;
  /** Perfis que o admin pode conceder. Vazio = a tela não oferece escolha (nunca sem perfil). */
  profileOptions: { id: string; label: string }[];
};
