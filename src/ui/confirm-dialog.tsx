import { useMessages } from "../messages/messages-context.js";

import { Button } from "./button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog.js";

/**
 * Confirmacao para acoes destrutivas ou dificeis de desfazer (excluir post, sair de comunidade).
 * Um so lugar para o padrao, para nao repetir confirmacao artesanal em cada tela.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive = false,
  pending = false,
  disabled = false,
  error,
  onCloseAutoFocus,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  pending?: boolean;
  /** Bloqueia a confirmacao enquanto o consumidor ainda nao tem o que confirmar. */
  disabled?: boolean;
  /** Mensagem da ultima tentativa, anunciada como alerta; some quando o consumidor limpa a prop. */
  error?: string;
  /** Foco ao fechar: o consumidor devolve o foco ao elemento que abriu o dialogo. */
  onCloseAutoFocus?: (event: Event) => void;
  onConfirm: () => void;
}) {
  const messages = useMessages().confirmDialog;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onCloseAutoFocus={onCloseAutoFocus}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {error ? (
          <p role="alert" className="break-words text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <DialogFooter className="gap-2">
          <Button variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            {cancelLabel ?? messages.cancel}
          </Button>

          <Button
            variant={destructive ? "destructive" : "default"}
            className="rounded-full"
            disabled={pending || disabled}
            onClick={onConfirm}
          >
            {pending ? messages.pending : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
