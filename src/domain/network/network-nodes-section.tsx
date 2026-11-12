import { useState } from "react";

import { Check, Copy, KeyRound, Loader2, RefreshCw, Server, ShieldOff, X } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import { ListRowSkeletons } from "../../patterns/skeletons/list-row-skeletons.js";
import type { NetworkNodeData } from "../../types/domain/network/network-node-data.js";
import type { NetworkNodesSectionProps } from "../../types/domain/network/network-nodes-section-props.js";
import { Button } from "../../ui/button.js";
import { ConfirmDialog } from "../../ui/confirm-dialog.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Pill } from "../../ui/pill.js";

const STATUS_CLASS: Record<NetworkNodeData["status"], string> = {
  PENDING_APPROVAL: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ACTIVE: "bg-growth/10 text-growth",
  SUSPENDED: "bg-surface-2 text-text-subtle",
  QUARANTINED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  REVOKED: "bg-destructive/10 text-destructive",
};

/**
 * Administração da rede cooperativa: os nós, o estado de cada um e a chave de API.
 *
 * <p>A chave em claro existe uma única vez, no painel que abre em seguida à emissão. Fechar sem
 * copiar não perde acesso por acidente: gerar de novo revoga a anterior, e a tela diz isso — a
 * alternativa (guardar a chave em claro) seria pior para todo mundo.</p>
 */
export function NetworkNodesSection({
  nodes,
  loading = false,
  error = false,
  onRefresh,
  refreshPending = false,
  onIssueKey,
  issueKeyPending = false,
  onRevokeKey,
  revokeKeyPending = false,
  onApprove,
  approvePending = false,
  onChangeStatus,
  statusPending = false,
  issuedKey,
  onDismissIssuedKey,
}: NetworkNodesSectionProps) {
  const messages = useMessages().networkNodesSection;
  const [revokeTarget, setRevokeTarget] = useState<NetworkNodeData | null>(null);
  const [copied, setCopied] = useState(false);

  const busy =
    issueKeyPending || revokeKeyPending || approvePending || statusPending || refreshPending;

  if (loading && nodes.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-text-subtle">
          {messages.title}
        </h2>

        <ListRowSkeletons />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-text-subtle">
            {messages.title}
          </h2>

          <p className="max-w-2xl text-sm text-muted-foreground">{messages.description}</p>
        </div>

        <Button
          variant="outline"
          className="rounded-full"
          disabled={refreshPending}
          onClick={onRefresh}
        >
          {refreshPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}

          {messages.refresh}
        </Button>
      </div>

      {error && (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {messages.error}
        </p>
      )}

      {nodes.length === 0 && !error ? (
        <div className="surface-card">
          <EmptyState icon={Server} title={messages.empty} description={messages.emptyHint} />
        </div>
      ) : (
        <ul className="space-y-3">
          {nodes.map((node) => (
            <li key={node.id} className="surface-card space-y-3 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold text-text-strong">
                      {node.displayName}
                    </p>

                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        STATUS_CLASS[node.status],
                      )}
                    >
                      {messages.status[node.status]}
                    </span>
                  </div>

                  <p className="text-xs font-normal text-text-subtle">
                    {messages.owner(node.ownerUserId)}
                  </p>

                  {node.profiles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {node.profiles.map((profile) => (
                        <Pill key={profile} size="sm" active>
                          {profile}
                        </Pill>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {node.status === "PENDING_APPROVAL" && (
                    <Button
                      className="rounded-full"
                      disabled={busy}
                      onClick={() => onApprove(node.id)}
                    >
                      <Check className="h-4 w-4" />

                      {messages.approve}
                    </Button>
                  )}

                  {node.status !== "REVOKED" && (
                    <Button
                      variant="outline"
                      className="rounded-full"
                      disabled={busy}
                      onClick={() => onChangeStatus(node.id, "SUSPENDED")}
                    >
                      {messages.suspend}
                    </Button>
                  )}

                  {node.status !== "REVOKED" && (
                    <Button
                      variant="outline"
                      className="rounded-full"
                      disabled={busy}
                      onClick={() => setRevokeTarget(node)}
                    >
                      <ShieldOff className="h-4 w-4" />

                      {messages.revoke}
                    </Button>
                  )}
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                <div>
                  <dt className="text-text-subtle">{messages.regionLabel}</dt>

                  <dd className="text-text-strong">{node.region ?? "—"}</dd>
                </div>

                <div>
                  <dt className="text-text-subtle">{messages.runtimeLabel}</dt>

                  <dd className="text-text-strong">{node.runtimeVersion ?? "—"}</dd>
                </div>

                <div>
                  <dt className="text-text-subtle">{messages.lastSeenLabel}</dt>

                  <dd className="text-text-strong">
                    {node.lastSeenAtLabel
                      ? messages.lastSeen(node.lastSeenAtLabel)
                      : messages.neverSeen}
                  </dd>
                </div>

                <div>
                  <dt className="text-text-subtle">{messages.healthLabel}</dt>

                  <dd>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        node.degraded
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-growth/10 text-growth",
                      )}
                    >
                      {node.degraded
                        ? node.quarantineReason
                          ? messages.healthDegradedReason(node.quarantineReason)
                          : messages.healthDegraded
                        : messages.healthOk}
                    </span>
                  </dd>
                </div>

                <div>
                  <dt className="text-text-subtle">{messages.latencyLabel}</dt>

                  <dd className="text-text-strong">
                    {node.latencyMs === null
                      ? messages.latencyUnknown
                      : messages.latency(node.latencyMs)}
                  </dd>
                </div>

                <div>
                  <dt className="text-text-subtle">{messages.failureStreakLabel}</dt>

                  <dd
                    className={cn("text-text-strong", node.failureStreak > 0 && "text-destructive")}
                  >
                    {messages.failureStreak(node.failureStreak)}
                  </dd>
                </div>
              </dl>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-soft pt-3">
                <div className="space-y-0.5">
                  {node.keyPrefix ? (
                    <>
                      <p className="font-mono text-xs text-text-strong">
                        {messages.keyPrefix(node.keyPrefix)}
                      </p>

                      <p className="text-[11px] text-text-subtle">
                        {node.keyUsed ? messages.keyUsed : messages.keyNeverUsed}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-text-subtle">{messages.noKey}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {node.keyPrefix && (
                    <Button
                      variant="outline"
                      className="rounded-full"
                      disabled={busy}
                      onClick={() => onRevokeKey(node.id)}
                    >
                      {messages.revokeKey}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="rounded-full"
                    disabled={busy || node.status === "REVOKED"}
                    onClick={() => onIssueKey(node.id)}
                  >
                    <KeyRound className="h-4 w-4" />

                    {node.keyPrefix ? messages.reissueKey : messages.issueKey}
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={revokeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRevokeTarget(null);
        }}
        title={messages.revokeTitle}
        description={revokeTarget ? messages.revokeDescription(revokeTarget.displayName) : ""}
        confirmLabel={messages.revokeConfirm}
        cancelLabel={messages.cancel}
        destructive
        pending={statusPending}
        onConfirm={() => {
          if (revokeTarget) onChangeStatus(revokeTarget.id, "REVOKED");
          setRevokeTarget(null);
        }}
      />

      {issuedKey && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="issued-key-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="surface-card w-full max-w-lg space-y-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 id="issued-key-title" className="text-base font-semibold text-text-strong">
                {messages.issuedTitle}
              </h3>

              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  setCopied(false);
                  onDismissIssuedKey();
                }}
              >
                <X className="h-4 w-4" />

                <span className="sr-only">{messages.issuedDismiss}</span>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              {messages.issuedDescription(
                nodes.find((node) => node.id === issuedKey.nodeId)?.displayName ?? issuedKey.nodeId,
              )}
            </p>

            <p className="break-all rounded-xl bg-surface-2 px-3 py-2 font-mono text-xs text-text-strong">
              {issuedKey.apiKey}
            </p>

            <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300">
              {messages.issuedWarning}
            </p>

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  void navigator.clipboard?.writeText(issuedKey.apiKey);
                  setCopied(true);
                }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}

                {copied ? messages.issuedCopied : messages.issuedCopy}
              </Button>

              <Button
                className="rounded-full"
                onClick={() => {
                  setCopied(false);
                  onDismissIssuedKey();
                }}
              >
                {messages.issuedDismiss}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
