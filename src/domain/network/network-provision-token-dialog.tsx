import { useState } from "react";

import { Check, Copy, KeyRound, X } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { NetworkProvisionTokenDialogProps } from "../../types/domain/network/network-provision-token-dialog-props.js";
import { Button } from "../../ui/button.js";

/**
 * Emissão do token de provisionamento pela tela de admin.
 *
 * O token é de uso único e curto: ele cria o nó (enroll), não o opera. A API key — a credencial que
 * autoriza rodar — é emitida depois da aprovação, e por isso o texto do diálogo não promete que o
 * servidor já está na rede ao copiar o token.
 *
 * O admin informa a conta dona pelo nome de usuário; quem resolve a conta é o app, porque o
 * diálogo não fala com a rede.
 */
export function NetworkProvisionTokenDialog({
  open,
  onOpenChange,
  onProvision,
  provisionPending = false,
  issuedToken,
  onDismissToken,
  provisionError = null,
  profileOptions,
}: NetworkProvisionTokenDialogProps) {
  const messages = useMessages().networkProvisionTokenDialog;
  const [serverName, setServerName] = useState("");
  const [ownerUsername, setOwnerUsername] = useState("");
  const [profiles, setProfiles] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  if (!open) {
    return null;
  }

  const canSubmit = serverName.trim() !== "" && ownerUsername.trim() !== "" && profiles.length > 0;

  function close() {
    setCopied(false);
    setServerName("");
    setOwnerUsername("");
    setProfiles([]);
    onDismissToken();
    onOpenChange(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="network-provision-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="surface-card w-full max-w-lg space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3
            id="network-provision-title"
            className="flex items-center gap-2 text-base font-semibold text-text-strong"
          >
            <KeyRound className="h-4 w-4" />
            {issuedToken ? messages.tokenTitle : messages.title}
          </h3>

          <Button variant="outline" className="rounded-full" onClick={close}>
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

            <p className="text-xs text-muted-foreground">{messages.tokenNextStep}</p>

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

              <Button className="rounded-full" onClick={close}>
                {messages.done}
              </Button>
            </div>
          </>
        ) : (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (canSubmit) {
                onProvision({
                  serverName: serverName.trim(),
                  ownerUsername: ownerUsername.trim(),
                  profiles,
                });
              }
            }}
          >
            <p className="text-sm text-muted-foreground">{messages.description}</p>

            <label className="block space-y-1 text-xs">
              <span className="text-text-subtle">{messages.serverNameLabel}</span>

              <input
                type="text"
                value={serverName}
                maxLength={120}
                onChange={(event) => setServerName(event.target.value)}
                placeholder={messages.serverNamePlaceholder}
                className="w-full rounded-xl border border-border-soft bg-surface-2 px-3 py-2 text-sm text-text-strong"
              />
            </label>

            <label className="block space-y-1 text-xs">
              <span className="text-text-subtle">{messages.ownerLabel}</span>

              <input
                type="text"
                value={ownerUsername}
                maxLength={80}
                onChange={(event) => setOwnerUsername(event.target.value)}
                placeholder={messages.ownerPlaceholder}
                className="w-full rounded-xl border border-border-soft bg-surface-2 px-3 py-2 text-sm text-text-strong"
              />
            </label>

            <fieldset className="space-y-1 text-xs">
              <legend className="text-text-subtle">{messages.profilesLabel}</legend>

              <div className="flex flex-wrap gap-2">
                {profileOptions.map((profile) => {
                  const selected = profiles.includes(profile.id);

                  return (
                    <button
                      key={profile.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setProfiles((current) =>
                          current.includes(profile.id)
                            ? current.filter((item) => item !== profile.id)
                            : [...current, profile.id],
                        )
                      }
                      className={
                        selected
                          ? "rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
                          : "rounded-full border border-border-soft px-3 py-1 text-xs text-text-subtle"
                      }
                    >
                      {profile.label}
                    </button>
                  );
                })}
              </div>

              <p className="text-text-subtle">{messages.profilesHint}</p>
            </fieldset>

            {provisionError && (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {provisionError}
              </p>
            )}

            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" className="rounded-full" type="button" onClick={close}>
                {messages.cancel}
              </Button>

              <Button
                className="rounded-full"
                type="submit"
                disabled={!canSubmit || provisionPending}
              >
                {provisionPending ? messages.provisioning : messages.provision}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
