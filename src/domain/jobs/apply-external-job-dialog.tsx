import { useState } from "react";

import { AlertTriangle, CheckCircle2, FileText, Loader2, Mail, Send } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ApplyExternalJobDialogProps } from "../../types/domain/jobs/apply-external-job-dialog-props.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog.js";
import { Label } from "../../ui/label.js";
import { LoadingState } from "../../ui/loading-state.js";
import { Textarea } from "../../ui/textarea.js";

/**
 * Candidatura a uma vaga EXTERNA enviada pelo Énóis.
 *
 * O `mailto:` do card abre o cliente de e-mail da pessoa, mas não consegue anexar arquivo. Aqui o
 * e-mail sai pelo servidor com o currículo de verdade — e a tela mostra exatamente o que vai sair
 * (destinatário, assunto, corpo) antes de qualquer envio. O botão de confirmar é o único caminho:
 * não existe envio automático, nem ao abrir o diálogo.
 *
 * O comprovante é honesto por construção: quando o servidor não conseguiu baixar o currículo, ele
 * responde `resumeAttached = false` e a tela diz que o e-mail saiu sem anexo, em vez de comemorar
 * um envio que não aconteceu.
 */
export function ApplyExternalJobDialog({
  children,
  onOpenChange,
  draft,
  loading,
  loadError,
  pending,
  error,
  result,
  onConfirm,
  onOpenMailClient,
  onRetry,
}: ApplyExternalJobDialogProps) {
  const messages = useMessages().applyExternalJobDialog;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const close = (next: boolean) => {
    setOpen(next);
    if (!next) setMessage("");
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-normal">{messages.title(draft?.jobTitle ?? "")}</DialogTitle>

          <DialogDescription>{messages.intro}</DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-growth" />

            <p className="mt-3 text-base font-medium">{messages.success}</p>

            <p className="mt-2 text-sm text-muted-foreground">
              {result.resumeAttached && result.resumeName
                ? messages.successWithResume(result.resumeName)
                : messages.successWithoutResume}
            </p>

            <p className="mt-2 break-words text-xs text-muted-foreground">
              {result.subject} · {result.recipientEmail}
            </p>

            <Button className="mt-5 w-full rounded-full" onClick={() => close(false)}>
              {messages.close}
            </Button>
          </div>
        ) : loading ? (
          <LoadingState label={messages.loading} />
        ) : loadError ? (
          <div className="space-y-3 py-2">
            <p className="rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
              {loadError}
            </p>

            <Button variant="outline" className="w-full rounded-full" onClick={onRetry}>
              {messages.retry}
            </Button>
          </div>
        ) : draft ? (
          <div className="space-y-4 pt-2">
            <dl className="space-y-2 rounded-xl bg-muted/60 px-4 py-3 text-sm">
              <div className="flex gap-2">
                <dt className="shrink-0 text-xs font-medium text-muted-foreground">
                  {messages.to}
                </dt>

                <dd className="min-w-0 break-words">{draft.recipientEmail}</dd>
              </div>

              <div className="flex gap-2">
                <dt className="shrink-0 text-xs font-medium text-muted-foreground">
                  {messages.subject}
                </dt>

                <dd className="min-w-0 break-words">{draft.subject}</dd>
              </div>
            </dl>

            <div className="space-y-1.5">
              <Label className="text-xs">{messages.body}</Label>

              <Textarea
                readOnly
                rows={8}
                value={draft.body}
                className="bg-muted/40 text-xs"
                aria-label={messages.body}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">{messages.message}</Label>

              <Textarea
                rows={3}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={messages.messagePlaceholder}
                maxLength={2000}
              />
            </div>

            {draft.resumeAvailable ? (
              <p className="inline-flex items-start gap-1.5 text-xs text-growth">
                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />

                <>{messages.resumeAttached(draft.resumeName ?? "curriculo.pdf")}</>
              </p>
            ) : (
              <div className="rounded-xl bg-amber-500/10 px-4 py-2 text-xs text-amber-700 dark:text-amber-400">
                <p className="inline-flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />

                  <>{messages.resumeMissing}</>
                </p>

                <p className="mt-1">{messages.resumeMissingHint}</p>
              </div>
            )}

            <p className="text-xs text-muted-foreground">{messages.sendingThrough}</p>

            {error && (
              <p className="rounded-xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <p className="text-xs text-muted-foreground">{messages.confirmHint}</p>

            <Button
              className="w-full rounded-full gap-2"
              disabled={pending}
              onClick={() => onConfirm(message.trim())}
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}

              <>{pending ? messages.sending : messages.confirm}</>
            </Button>

            <div className="border-t border-border-soft pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full rounded-full gap-1.5"
                onClick={onOpenMailClient}
              >
                <Mail className="h-3.5 w-3.5" />

                <>{messages.openMailClient}</>
              </Button>

              <p className="mt-1 text-center text-xs text-muted-foreground">
                {messages.openMailClientHint}
              </p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
