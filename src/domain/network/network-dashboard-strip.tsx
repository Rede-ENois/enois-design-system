import { Loader2 } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { NetworkDashboardStripProps } from "../../types/domain/network/network-dashboard-strip-props.js";

/**
 * A faixa de resumo no topo do painel Énóis Network: como a rede está agora.
 *
 * <p>Contagens são fotografia do momento da consulta. As médias de CPU/memória só aparecem com a
 * contagem de amostras — média sem saber de quantos nós é média não diz nada. As versões de
 * runtime em campo expõem nó defasado antes que ele falhe: mais de uma versão é o sinal de que
 * alguém precisa atualizar.</p>
 */
export function NetworkDashboardStrip({ dashboard, loading = false }: NetworkDashboardStripProps) {
  const messages = useMessages().networkDashboardStrip;
  const versions = Object.entries(dashboard.runtimeVersions);

  const cell = (value: string, label: string, tone?: "warn") => (
    <div className="min-w-0">
      <p className="truncate text-lg font-semibold text-text-strong">{value}</p>

      <p
        className={cn(
          "truncate text-[11px] uppercase tracking-wide",
          tone === "warn" ? "text-amber-600 dark:text-amber-400" : "text-text-subtle",
        )}
      >
        {label}
      </p>
    </div>
  );

  return (
    <div className="surface-card p-4" data-loading={loading || undefined}>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {cell(String(dashboard.total), messages.total)}
        {cell(String(dashboard.active), messages.active)}
        {cell(String(dashboard.alive), messages.alive)}
        {cell(
          String(dashboard.degraded),
          messages.degraded,
          dashboard.degraded > 0 ? "warn" : undefined,
        )}
        {cell(
          String(dashboard.quarantined),
          messages.quarantined,
          dashboard.quarantined > 0 ? "warn" : undefined,
        )}
        {cell(String(dashboard.freeSlots), messages.freeSlots)}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-border-soft pt-3 text-xs sm:grid-cols-4">
        <div>
          <dt className="text-text-subtle">{messages.declaredCpu}</dt>

          <dd className="text-text-strong">{messages.cores(dashboard.declaredCpuCores)}</dd>
        </div>

        <div>
          <dt className="text-text-subtle">{messages.declaredMemory}</dt>

          <dd className="text-text-strong">{messages.memoryMb(dashboard.declaredMemoryMb)}</dd>
        </div>

        <div>
          <dt className="text-text-subtle">{messages.avgCpu}</dt>

          <dd className="text-text-strong">
            {dashboard.avgCpuPercent === null
              ? messages.noSamples
              : messages.cpuPercent(dashboard.avgCpuPercent, dashboard.cpuSamples)}
          </dd>
        </div>

        <div>
          <dt className="text-text-subtle">{messages.avgMemory}</dt>

          <dd className="text-text-strong">
            {dashboard.avgMemoryMb === null
              ? messages.noSamples
              : messages.memoryMb(dashboard.avgMemoryMb)}
          </dd>
        </div>
      </dl>

      {versions.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border-soft pt-3 text-xs">
          <span className="text-text-subtle">{messages.versions}</span>

          {loading && <Loader2 className="h-3 w-3 animate-spin text-text-subtle" />}

          {versions.map(([version, count]) => (
            <span
              key={version}
              className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-text-strong"
            >
              {version} × {count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
