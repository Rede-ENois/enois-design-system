import { Activity, AlertTriangle, Loader2, RefreshCw, Terminal } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { NetworkNodeObservabilityLine } from "../../types/domain/network/network-node-observability-line.js";
import type { NetworkNodeObservabilityProps } from "../../types/domain/network/network-node-observability-props.js";
import type { NetworkNodeObservabilitySample } from "../../types/domain/network/network-node-observability-sample.js";
import { Button } from "../../ui/button.js";

/** Altura do gráfico em px. Fixa porque o SVG calcula os pontos em coordenadas próprias. */
const CHART_HEIGHT = 56;

/** Largura lógica do gráfico: o SVG escala com `w-full` e a proporção se mantém. */
const CHART_WIDTH = 300;

/**
 * O painel de observabilidade de um nó: resumo, série dos últimos minutos e o console do runtime.
 *
 * <p>Três decisões que a view precisa tomar e que o contrato do backend já resolve:</p>
 *
 * <ul>
 * <li><b>lacuna não é zero.</b> Ponto sem medida sai da linha e o trecho fica aberto — um nó que não
 * reportou CPU não é um nó a 0%. Ligar os pontos através da lacuna inventaria uma medida que
 * ninguém fez;</li>
 * <li><b>sem amostra é dito, não escondido.</b> Nó novo aparece com "ainda não enviou amostra", não
 * com um gráfico vazio de aparência saudável;</li>
 * <li><b>a janela é curta e isso está na tela.</b> Quem olha precisa saber que aquilo não é
 * histórico: o console é o que o servidor escreveu há pouco, não um arquivo.</li>
 * </ul>
 */
export function NetworkNodeObservability({
  panel,
  loading = false,
  error = null,
  onRefresh,
  refreshedAtLabel = null,
}: NetworkNodeObservabilityProps) {
  const messages = useMessages().networkNodeObservability;

  const header = (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <h3 className="flex items-center gap-2 text-base font-semibold text-text-strong">
          <Activity className="size-4 text-text-subtle" aria-hidden="true" />
          {messages.title}
        </h3>

        <p className="max-w-prose text-xs text-text-subtle">{messages.description}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        {onRefresh ? (
          <Button type="button" variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
            {loading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <RefreshCw className="size-4" aria-hidden="true" />
            )}
            {loading ? messages.refreshing : messages.refresh}
          </Button>
        ) : null}

        {refreshedAtLabel ? (
          <span className="text-[11px] text-text-subtle">
            {messages.refreshedAt(refreshedAtLabel)}
          </span>
        ) : null}
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="space-y-3">
        {header}

        <p className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      </div>
    );
  }

  if (panel === null) {
    return (
      <div className="space-y-3">
        {header}

        <p className="flex items-center gap-2 text-sm text-text-subtle">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          {loading ? messages.loading : messages.empty}
        </p>
      </div>
    );
  }

  const { summary, series, console: lines, consoleLevels } = panel;

  const summaryItem = (label: string, value: string | null) => (
    <div className="rounded-xl bg-surface-2 px-3 py-2">
      <dt className="text-[11px] uppercase tracking-wide text-text-subtle">{label}</dt>

      <dd
        className={
          value === null ? "text-sm text-text-subtle" : "text-sm font-semibold text-text-strong"
        }
      >
        {value ?? messages.notReported}
      </dd>
    </div>
  );

  const levelLabel = (level: string) => {
    switch (level.toUpperCase()) {
      case "WARN":
        return messages.levelWarn;
      case "ERROR":
        return messages.levelError;
      case "DEBUG":
        return messages.levelDebug;
      default:
        return messages.levelInfo;
    }
  };

  const levelClass = (level: string) => {
    switch (level.toUpperCase()) {
      case "WARN":
        return "text-signal-today";
      case "ERROR":
        return "text-destructive";
      case "DEBUG":
        return "text-text-subtle";
      default:
        return "text-text-strong";
    }
  };

  return (
    <div className="space-y-3">
      {header}

      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {summaryItem(
          messages.summaryCpuAvg,
          summary.cpuAvgPercent === null ? null : messages.percent(summary.cpuAvgPercent),
        )}

        {summaryItem(
          messages.summaryCpuMax,
          summary.cpuMaxPercent === null ? null : messages.percent(summary.cpuMaxPercent),
        )}

        {summaryItem(
          messages.summaryMemory,
          summary.memoryMbLatest === null ? null : messages.memoryMb(summary.memoryMbLatest),
        )}

        {summaryItem(
          messages.summaryDisk,
          summary.diskFreeMbLatest === null ? null : messages.diskMb(summary.diskFreeMbLatest),
        )}

        {summaryItem(
          messages.summaryTasks,
          summary.runningTasksLatest === null ? null : messages.tasks(summary.runningTasksLatest),
        )}

        {summaryItem(messages.seriesTitle, messages.summarySamples(summary.sampleCount))}
      </dl>

      {series.length === 0 ? (
        <p className="rounded-xl bg-surface-2 px-3 py-2 text-sm text-text-subtle">
          {messages.empty}
        </p>
      ) : (
        <Sparkline
          series={series}
          emptyLabel={messages.seriesEmpty}
          pointLabel={messages.seriesPoint}
        />
      )}

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-text-strong">
            <Terminal className="size-4 text-text-subtle" aria-hidden="true" />
            {messages.consoleTitle}
          </h4>

          <span className="text-[11px] text-text-subtle">
            {messages.consoleLevels(
              consoleLevels.INFO ?? 0,
              consoleLevels.WARN ?? 0,
              consoleLevels.ERROR ?? 0,
            )}
          </span>
        </div>

        {lines.length === 0 ? (
          <p className="rounded-xl bg-surface-2 px-3 py-2 text-sm text-text-subtle">
            {messages.consoleEmpty}
          </p>
        ) : (
          <ol className="max-h-56 space-y-1 overflow-y-auto rounded-xl bg-surface-2 px-3 py-2 font-mono text-xs">
            {lines.map((line: NetworkNodeObservabilityLine) => (
              <li key={line.id} className="flex gap-2">
                <span className="shrink-0 text-text-subtle">{line.at}</span>

                <span className={`shrink-0 uppercase ${levelClass(line.level)}`}>
                  {levelLabel(line.level)}
                </span>

                <span className="break-words text-text-strong">{line.message}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <p className="text-[11px] text-text-subtle">{messages.windowHint(60, 200)}</p>
    </div>
  );
}

/** A série de CPU em sparkline. Não há dependência de gráfico: 60 pontos cabem num `<polyline>`. */
function Sparkline({
  series,
  emptyLabel,
  pointLabel,
}: {
  series: NetworkNodeObservabilitySample[];
  emptyLabel: string;
  pointLabel: (time: string, cpu: string) => string;
}) {
  const measured = series.filter((sample) => sample.cpuPercent !== null);

  if (measured.length === 0) {
    return (
      <p className="rounded-xl bg-surface-2 px-3 py-2 text-sm text-text-subtle">{emptyLabel}</p>
    );
  }

  const maxCpu = Math.max(100, ...measured.map((sample) => sample.cpuPercent ?? 0));
  const stepX = series.length > 1 ? CHART_WIDTH / (series.length - 1) : CHART_WIDTH;

  // Um segmento por trecho CONTÍGUO de medidas: a lacuna interrompe a linha em vez de cruzá-la.
  const segments: string[] = [];
  let current: string[] = [];
  series.forEach((sample, index) => {
    if (sample.cpuPercent === null) {
      if (current.length > 0) {
        segments.push(current.join(" "));
        current = [];
      }
      return;
    }

    const x = index * stepX;
    const y = CHART_HEIGHT - (sample.cpuPercent / maxCpu) * CHART_HEIGHT;
    current.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  });

  if (current.length > 0) {
    segments.push(current.join(" "));
  }

  return (
    <div className="rounded-xl bg-surface-2 px-3 py-2">
      <svg
        role="img"
        aria-label={pointLabel(series[0]?.sampledAt ?? "", `${Math.round(maxCpu)}%`)}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        className="h-14 w-full"
      >
        {segments.map((points) => (
          <polyline
            key={points}
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="text-accent"
          />
        ))}
      </svg>

      <div className="mt-1 flex justify-between text-[11px] text-text-subtle">
        <span>{series[0]?.sampledAt ?? ""}</span>

        <span>{series[series.length - 1]?.sampledAt ?? ""}</span>
      </div>
    </div>
  );
}
