import { Loader2, ShieldCheck, ShieldQuestion } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { IdentityVerificationSectionProps } from "../../types/domain/security/identity-verification-section-props.js";
import { Button } from "../../ui/button.js";
import { HumanitySealIcon } from "../../ui/humanity-seal-icon.js";
import { HumanitySeal } from "../name/humanity-seal.js";

import { resolveIdentityReleaseView } from "./resolve-identity-release-view.js";

/**
 * Verificação de identidade civil, com liberação progressiva. O estado vem SEMPRE do backend.
 *
 * São cinco telas e nenhuma delas julga a pessoa: quem ainda não foi liberado lê "está chegando",
 * sem nota de credibilidade, posição no ranking ou prazo; a recusa é resultado da verificação e não
 * punição. A verificação é opcional — nunca é requisito para usar o Énóis.
 */
export function IdentityVerificationSection({
  status,
  loading = false,
  onStart,
  startPending = false,
  onRefresh,
  refreshPending = false,
  onRevoke,
  revokePending = false,
}: IdentityVerificationSectionProps) {
  const messages = useMessages().identityVerificationSection;
  const view = resolveIdentityReleaseView(status);

  if (loading) {
    return (
      <section className="surface-card p-5">
        <div className="flex items-center gap-2">
          <ShieldQuestion className="h-5 w-5 text-primary" />

          <h2 className="text-sm font-semibold">{messages.title}</h2>
        </div>

        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <Loader2 className="h-4 w-4 animate-spin" />
          {messages.starting}
        </p>
      </section>
    );
  }

  return (
    <section className="surface-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {view === "APPROVED" ? (
            <ShieldCheck className="h-5 w-5 shrink-0 text-growth" />
          ) : (
            <ShieldQuestion className="h-5 w-5 shrink-0 text-primary" />
          )}

          <h2 className="min-w-0 text-sm font-semibold">{messages.title}</h2>
        </div>

        {view === "APPROVED" && <HumanitySeal variant="full" />}
      </div>

      <p className="mt-2 text-sm text-muted-foreground">{messages.subtitle}</p>

      <p className="mt-3 text-sm font-medium">{messages.states[view]}</p>

      {view === "WAITING" && (
        <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          <p>{messages.waitingHint}</p>

          <p>{messages.waitingNext}</p>
        </div>
      )}

      {view === "APPROVED" && (
        <p className="mt-2 text-xs text-muted-foreground">{messages.badgeHint}</p>
      )}

      <div className="mt-4 space-y-1 text-xs text-muted-foreground">
        <p>{messages.whatWeStore}</p>

        <p>{messages.whoProcesses}</p>
      </div>

      {view === "ELIGIBLE" && !status?.providerAvailable && (
        <p className="mt-4 rounded-xl bg-surface-2 p-3 text-xs text-text-subtle">
          {messages.unavailable}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {view === "ELIGIBLE" && (
          <Button
            className="gap-1.5 rounded-full"
            disabled={startPending || loading}
            onClick={onStart}
          >
            {startPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <HumanitySealIcon className="h-4 w-4" aria-hidden />
            )}

            {startPending ? messages.starting : messages.start}
          </Button>
        )}

        {view === "IN_PROGRESS" && (
          <Button
            variant="outline"
            className="rounded-full"
            disabled={refreshPending}
            onClick={onRefresh}
          >
            {refreshPending ? <Loader2 className="h-4 w-4 animate-spin" /> : messages.refresh}
          </Button>
        )}

        {view === "APPROVED" && (
          <Button
            variant="outline"
            className="rounded-full text-destructive"
            disabled={revokePending}
            onClick={onRevoke}
          >
            {messages.revoke}
          </Button>
        )}
      </div>
    </section>
  );
}
