import { useState } from "react";

import { Check, Copy, KeyRound, X } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { NetworkJoinDialogProps } from "../../types/domain/network/network-join-dialog-props.js";
import { Button } from "../../ui/button.js";

/**
 * A solicitação de ingresso na rede: o participante declara o servidor (o nome que ele escolher),
 * recebe um token de uso único e curto e o leva ao instalador do runtime. O que ele pode executar
 * não se escolhe aqui — os perfis são negociados com o admin na aprovação do nó.
 */
export function NetworkJoinDialog({
  open,
  onOpenChange,
  onRequestJoin,
  joinPending = false,
  issuedToken,
  onDismissToken,
  joinError = null,
}: NetworkJoinDialogProps) {
  const messages = useMessages().networkJoinDialog;
  const [displayName, setDisplayName] = useState("");
  const [copied, setCopied] = useState(false);

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="network-join-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="surface-card w-full max-w-lg space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 id="network-join-title" className="text-base font-semibold text-text-strong">
            {issuedToken ? messages.tokenTitle : messages.title}
          </h3>

          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {
              setCopied(false);
              setDisplayName("");
              onDismissToken();
              onOpenChange(false);
            }}
          >
            <X className="h-4 w-4" />

            <span className="sr-only">{messages.close}</span>
          </Button>
        </div>

        {issuedToken ? (
          <>
            <p className="text-sm text-muted-foreground">{messages.tokenDescription}</p>

            <p className="break-all rounded-xl bg-surface-2 px-3 py-2 font-mono text-xs text-text-strong">
              {issuedToken.token}
            </p>

            <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300">
              {messages.tokenWarning(issuedToken.expiresAtLabel)}
            </p>

            <p className="text-xs text-muted-foreground">{issuedToken.nextStep}</p>

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  void navigator.clipboard?.writeText(issuedToken.token);
                  setCopied(true);
                }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}

                {copied ? messages.copied : messages.copy}
              </Button>

              <Button
                className="rounded-full"
                onClick={() => {
                  setCopied(false);
                  setDisplayName("");
                  onDismissToken();
                  onOpenChange(false);
                }}
              >
                {messages.done}
              </Button>
            </div>
          </>
        ) : (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (displayName.trim()) onRequestJoin(displayName);
            }}
          >
            <p className="text-sm text-muted-foreground">{messages.description}</p>

            <label className="block space-y-1 text-xs">
              <span className="text-text-subtle">{messages.serverNameLabel}</span>

              <input
                type="text"
                value={displayName}
                maxLength={120}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder={messages.serverNamePlaceholder}
                className="w-full rounded-xl border border-border-soft bg-surface-2 px-3 py-2 text-sm text-text-strong"
              />
            </label>

            {joinError && (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {joinError}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-full"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                {messages.cancel}
              </Button>

              <Button className="rounded-full" type="submit" disabled={joinPending}>
                {joinPending ? (
                  <KeyRound className="h-4 w-4 animate-pulse" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}

                {messages.submit}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
