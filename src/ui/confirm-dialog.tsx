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
  onConfirm,
  error,
  onCloseAutoFocus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  pending?: boolean;
  disabled?: boolean;
  onConfirm: () => void;
  error?: string;
  onCloseAutoFocus?: (event: Event) => void;
}) {
  const messages = useMessages().confirmDialog;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" onCloseAutoFocus={onCloseAutoFocus}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription className="break-words">{description}</DialogDescription>
        </DialogHeader>

        {error && (
          <p role="alert" className="text-sm text-text-strong">
            {error}
          </p>
        )}

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
