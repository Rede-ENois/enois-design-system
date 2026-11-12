import { useState } from "react";

import { Loader2, RefreshCw, Server } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import { ListRowSkeletons } from "../../patterns/skeletons/list-row-skeletons.js";
import type { MyNetworkNodeData } from "../../types/domain/network/my-network-node-data.js";
import type { MyNetworkNodesProps } from "../../types/domain/network/my-network-nodes-props.js";
import { Button } from "../../ui/button.js";
import { ConfirmDialog } from "../../ui/confirm-dialog.js";
import { EmptyState } from "../../ui/empty-state.js";
import { Pill } from "../../ui/pill.js";

const STATUS_CLASS: Record<MyNetworkNodeData["status"], string> = {
  PENDING_APPROVAL: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ACTIVE: "bg-growth/10 text-growth",
  SUSPENDED: "bg-surface-2 text-text-subtle",
  QUARANTINED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  REVOKED: "bg-destructive/10 text-destructive",
};

const STATUS_MESSAGE_KEY = {
  PENDING_APPROVAL: "PENDING_APPROVAL",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  QUARANTINED: "QUARANTINED",
  REVOKED: "REVOKED",
} as const;

/**
 * A interface do participante: os próprios servidores, o que cedeu, o que a rede observou e a
 * contribuição medida. Só vê os seus — o backend trava, e a tela não pede nada de outro
 * participante. A desconexão é voluntária e reversível (suspensão, não revogação), mas cai as
 * chaves na hora: servidor desligado a próprio pedido não continua autenticando.
 */
export function MyNetworkNodes({
  nodes,
  loading = false,
  error = false,
  onRefresh,
  refreshPending = false,
  onDisconnect,
  disconnectPending = false,
}: MyNetworkNodesProps) {
  const messages = useMessages().myNetworkNodes;
  const [disconnectTarget, setDisconnectTarget] = useState<MyNetworkNodeData | null>(null);

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
                      {messages.status[STATUS_MESSAGE_KEY[node.status]]}
                    </span>
                  </div>

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

                {node.status !== "REVOKED" &&
                  node.status !== "SUSPENDED" &&
                  node.status !== "PENDING_APPROVAL" && (
                    <Button
                      variant="outline"
                      className="rounded-full"
                      disabled={disconnectPending}
                      onClick={() => setDisconnectTarget(node)}
                    >
                      {messages.disconnect}
                    </Button>
                  )}
              </div>

              <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                <div>
                  <dt className="text-text-subtle">{messages.contributionLabel}</dt>

                  <dd className="text-text-strong">{messages.tasksDone(node.tasksDone)}</dd>
                </div>

                <div>
                  <dt className="text-text-subtle">{messages.cpuLabel}</dt>

                  <dd className="text-text-strong">
                    {node.observedCpuPercent === null
                      ? messages.ofDeclared(messages.cores(node.declaredCpuCores))
                      : messages.observedOf(
                          messages.percent(node.observedCpuPercent),
                          messages.cores(node.declaredCpuCores),
                        )}
                  </dd>
                </div>

                <div>
                  <dt className="text-text-subtle">{messages.memoryLabel}</dt>

                  <dd className="text-text-strong">
                    {node.observedMemoryMb === null
                      ? messages.ofDeclared(messages.memoryMb(node.declaredMemoryMb))
                      : messages.observedOf(
                          messages.memoryMb(node.observedMemoryMb),
                          messages.memoryMb(node.declaredMemoryMb),
                        )}
                  </dd>
                </div>

                <div>
                  <dt className="text-text-subtle">{messages.lastSeenLabel}</dt>

                  <dd className="text-text-strong">{node.lastSeenAtLabel ?? messages.neverSeen}</dd>
                </div>
              </dl>

              {node.quarantineReason && (
                <p className="rounded-xl bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300">
                  {messages.quarantineReason(node.quarantineReason)}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={disconnectTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDisconnectTarget(null);
        }}
        title={messages.disconnectTitle}
        description={
          disconnectTarget ? messages.disconnectDescription(disconnectTarget.displayName) : ""
        }
        confirmLabel={messages.disconnectConfirm}
        cancelLabel={messages.cancel}
        destructive
        pending={disconnectPending}
        onConfirm={() => {
          if (disconnectTarget) onDisconnect(disconnectTarget.id);
          setDisconnectTarget(null);
        }}
      />
    </section>
  );
}
