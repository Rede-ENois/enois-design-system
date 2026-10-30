import { useState } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { ReportDialogProps } from "../../types/domain/post/report-dialog-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Button } from "../../ui/button.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog.js";
import { Label } from "../../ui/label.js";
import { Textarea } from "../../ui/textarea.js";

/**
 * Denúncia de qualquer alvo. Quem abre manda no estado (`open`/`onOpenChange`) — o card do post
 * guarda isso no store, porque o botão de denunciar fica longe do diálogo. O envio é do app
 * (`onSubmit`); a descrição é limpa quando ele confirma.
 */
export function ReportDialog<T extends string>({
  targetType,
  reasons,
  defaultReason,
  guidelinesHref,
  open,
  onOpenChange,
  sending = false,
  onSubmit,
}: ReportDialogProps<T>) {
  const messages = useMessages().reportDialog;
  const [reason, setReason] = useState<T>(defaultReason);
  const [description, setDescription] = useState("");

  const submit = async () => {
    if (sending) return;
    const sent = await onSubmit({ reason, description: description || undefined });
    if (sent) setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-normal">{messages.titles[targetType]}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-normal text-text-subtle">{messages.reason}</Label>

            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as T)}
              className="flex h-10 w-full rounded-md border border-border-soft bg-background px-3 py-2 text-sm font-normal text-text-strong border-transparent bg-muted"
            >
              {reasons.map((r) => (
                <option key={r} value={r} className="h-10 border-transparent bg-muted">
                  {messages.reasons?.[r] ?? r.replace(/_/g, " ").toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-normal text-text-subtle">{messages.description}</Label>

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="border-border-soft bg-surface-1 text-sm font-normal h-10 border-transparent bg-muted"
            />
          </div>

          <Button className="w-full rounded-full" onClick={submit} disabled={sending}>
            {sending ? messages.sending : messages.action}
          </Button>

          <p className="text-center text-xs text-text-subtle">
            <AppLink href={guidelinesHref} className="text-primary hover:underline" target="_blank">
              {messages.guidelines}
            </AppLink>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
