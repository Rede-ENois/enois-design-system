import { useState } from "react";

import { Send } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ApplyFreelanceDialogProps } from "../../types/domain/jobs/apply-freelance-dialog-props.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Textarea } from "../../ui/textarea.js";

import { ProfessionalSignature } from "./professional-signature.js";

/**
 * Proposta para um freela: não existe formulário. A mensagem de apresentação sai pela identidade
 * profissional e vai para a conversa profissional com quem publicou, onde escopo, prazo e valor
 * são combinados.
 *
 * A mensagem vem preenchida para a pessoa não travar no "o que eu escrevo?", mas é editável.
 */
export function ApplyFreelanceDialog({
  freelance,
  open,
  onOpenChange,
  pending,
  error,
  sent,
  onSend,
  onOpenChat,
  applicant = null,
  professionalSetupHref = null,
}: ApplyFreelanceDialogProps) {
  const messages = useMessages().applyFreelanceDialog;
  const [message, setMessage] = useState(() => messages.message(freelance.title));

  const handleOpenChange = (next: boolean) => {
    // Reabrir o diálogo volta ao rascunho original: a mensagem enviada não fica no campo.
    if (!next) setMessage(messages.message(freelance.title));
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[88vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-normal">{messages.title}</DialogTitle>

          <DialogDescription>{messages.hint}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <p className="rounded-lg bg-surface-1 p-3 text-sm">
            <span className="font-semibold text-text-strong">{freelance.title}</span>

            {freelance.username && (
              <span className="text-text-subtle"> · @{freelance.username}</span>
            )}
          </p>

          {sent ? (
            <div className="space-y-3">
              <p role="status" className="text-sm text-growth">
                {messages.sent}
              </p>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => handleOpenChange(false)}
                >
                  {messages.cancel}
                </Button>

                <Button
                  className="gap-2 rounded-full"
                  onClick={() => {
                    handleOpenChange(false);
                    onOpenChat();
                  }}
                >
                  {messages.openChat}
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ProfessionalSignature identity={applicant} setupHref={professionalSetupHref} />
              <Textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={messages.placeholder}
                aria-label={messages.placeholder}
                rows={5}
                maxLength={2000}
              />

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="rounded-full"
                  disabled={pending}
                  onClick={() => handleOpenChange(false)}
                >
                  {messages.cancel}
                </Button>

                <Button
                  className="gap-2 rounded-full"
                  disabled={
                    pending || message.trim().length === 0 || Boolean(professionalSetupHref)
                  }
                  onClick={() => onSend(message.trim())}
                >
                  <Send className="h-4 w-4" />

                  {pending ? messages.sending : messages.send}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
