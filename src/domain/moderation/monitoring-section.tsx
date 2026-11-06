import { useState } from "react";

import {
  Activity,
  AlertTriangle,
  Coins,
  Copy,
  Pause,
  Play,
  RefreshCw,
  Search,
  Server,
} from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { MonitoringEventData } from "../../types/domain/moderation/monitoring-event-data.js";
import type { MonitoringEventLevel } from "../../types/domain/moderation/monitoring-event-level.js";
import type { MonitoringMinutePoint } from "../../types/domain/moderation/monitoring-minute-point.js";
import type { MonitoringResource } from "../../types/domain/moderation/monitoring-resource.js";
import type { MonitoringSectionProps } from "../../types/domain/moderation/monitoring-section-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { LoadingState } from "../../ui/loading-state.js";
import { useToast } from "../../ui/toast-context.js";

const number = new Intl.NumberFormat("pt-BR");

const LEVEL_CLASS: Record<MonitoringEventLevel, string> = {
  ERROR: "bg-destructive/10 text-destructive",
  WARN: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  INFO: "bg-primary-soft text-primary-text",
  DEBUG: "bg-surface-2 text-text-subtle",
};

/**
 * Monitorabilidade do painel admin: KPIs, séries por minuto e a lista de eventos/logs/erros.
 * O backend já entrega tudo pronto; aqui só desenhamos os gráficos em SVG (sem lib) e atualizamos
 * por polling curto, que é o "tempo real" sem manter uma conexão SSE aberta por admin.
 */
export function MonitoringSection({
  loading,
  overview: data,
  fetching,
  onRefresh,
  generatedAtLabel,
  supply,
  paused,
  onTogglePaused,
  levels,
  level,
  onLevelChange,
  types,
  type,
  onTypeChange,
  search,
  onSearchChange,
  from,
  to,
  onFromChange,
  onToChange,
  onLastHour,
  onClearDates,
  onlyFailures,
  onOnlyFailures,
  filtered,
  rows,
  hasNextPage,
  fetchingNextPage,
  onLoadMore,
}: MonitoringSectionProps) {
  const messages = useMessages().monitoringSection;
  const { toast } = useToast();

  const copiarLinhas = async (linhas: MonitoringEventData[]) => {
    const ok = await copyText(linhas.map(eventLine).join("\n"));
    toast(ok ? messages.copied : messages.copyFailed, ok ? "success" : "error");
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!data) {
    return (
      <section className="surface-card p-4 text-sm text-text-subtle">{messages.error}</section>
    );
  }

  const heapPercent =
    data.jvm.heapMaxBytes > 0 ? (data.jvm.heapUsedBytes / data.jvm.heapMaxBytes) * 100 : 0;

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-base font-medium">
            <Activity className="h-5 w-5 text-primary" />
            {messages.title}
          </h2>

          <p className="mt-1 text-xs text-text-subtle">{messages.description}</p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
              paused ? "bg-surface-2 text-text-subtle" : "bg-growth/10 text-growth",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                paused ? "bg-text-subtle" : "animate-pulse bg-growth",
              )}
            />

            <>{paused ? messages.paused : messages.live}</>
          </span>

          <Button
            size="sm"
            variant="outline"
            className="rounded-full gap-1.5"
            onClick={onTogglePaused}
          >
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}

            <>{paused ? messages.resume : messages.pause}</>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="rounded-full"
            title={messages.refresh}
            aria-label={messages.refresh}
            onClick={onRefresh}
          >
            <RefreshCw className={cn("h-4 w-4", fetching && "animate-spin")} />
          </Button>
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4">
        <Kpi label={messages.requestsPerSecond} value={data.requestsPerSecond.toFixed(1)} />
        <Kpi label={messages.requestsPerMinute} value={number.format(data.requestsLastMinute)} />
        <Kpi
          label={messages.inFlight}
          value={`${number.format(data.inFlight)} / ${number.format(data.peakInFlight)}`}
        />
        <Kpi label={messages.requestsTotal} value={number.format(data.requestsTotal)} />
        <Kpi label={messages.p50} value={`${number.format(data.p50Ms)} ms`} />
        <Kpi label={messages.p95} value={`${number.format(data.p95Ms)} ms`} />
        <Kpi label={messages.p99} value={`${number.format(data.p99Ms)} ms`} />
        <Kpi label={messages.maxLatency} value={`${number.format(data.maxMs)} ms`} />
        <Kpi
          label={messages.errors5xx}
          value={number.format(data.errors5xxLastMinute)}
          tone="danger"
        />
        <Kpi
          label={messages.errors4xx}
          value={number.format(data.errors4xxLastMinute)}
          tone="warn"
        />
        <Kpi label={messages.slow} value={number.format(data.slowLastMinute)} tone="warn" />
        <Kpi
          label={messages.rateLimited}
          value={number.format(data.rateLimitedLastMinute)}
          tone="danger"
        />
        <Kpi label={messages.errorRate} value={`${data.errorRate.toFixed(1)}%`} />
        <Kpi label={messages.uptime} value={formatUptime(data.uptimeSeconds)} />
        <Kpi
          label={messages.heap}
          value={`${formatBytes(data.resources.heapUsedBytes)} / ${formatBytes(data.resources.heapMaxBytes)}`}
        />
        <Kpi label={messages.threads} value={number.format(data.resources.threads)} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {data.statusCounts.map((item) => (
          <span
            key={item.label}
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-medium",
              item.label === "5xx"
                ? "bg-destructive/10 text-destructive"
                : item.label === "4xx"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-surface-2 text-text-subtle",
            )}
          >
            {item.label}: {number.format(item.count)}
          </span>
        ))}

        {data.methodCounts.map((item) => (
          <span
            key={item.label}
            className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-text-subtle"
          >
            {item.label}: {number.format(item.count)}
          </span>
        ))}
      </div>

      {data.droppedEvents > 0 && (
        <p className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {messages.dropped(data.droppedEvents)}
        </p>
      )}

      <div className="grid min-w-0 gap-3 lg:grid-cols-[1.6fr_1fr]">
        <div className="surface-card min-w-0 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
              {messages.chartTitle}
            </p>

            <div className="flex items-center gap-2 text-[10px] text-text-subtle">
              <Legend color="var(--primary)" label={messages.legendRequests} />
              <Legend color="var(--destructive)" label={messages.legendErrors} />
            </div>
          </div>

          <TrafficChart series={data.series} />
        </div>

        <div className="surface-card min-w-0 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-subtle">
            {messages.topRoutes}
          </p>

          {data.topRoutes.length === 0 ? (
            <p className="text-xs text-text-subtle">{messages.noRoutes}</p>
          ) : (
            <ul className="space-y-1.5">
              {data.topRoutes.map((item) => (
                <li
                  key={item.label}
                  className="flex min-w-0 items-center justify-between gap-2 text-xs"
                >
                  <span className="truncate font-mono text-text-strong">{item.label}</span>

                  <span className="shrink-0 tabular-nums text-text-subtle">
                    {number.format(item.count)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3 border-t border-border-soft pt-2 text-[11px] text-text-subtle">
            <p className="flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5" />
              {messages.jvmLine(Math.round(heapPercent), data.jvm.processors, data.droppedEvents)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-3 lg:grid-cols-2">
        <div className="surface-card min-w-0 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
              {messages.latencyTitle}
            </p>

            <div className="flex items-center gap-2 text-[10px] text-text-subtle">
              <Legend color="var(--primary)" label="p95" />
              <Legend color="var(--destructive)" label="p99" />
              <Legend color="#f59e0b" label="max" />
            </div>
          </div>

          <LatencyChart series={data.series} />
        </div>

        <div className="surface-card min-w-0 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-subtle">
            {messages.resourceChartTitle}
          </p>

          <ResourceChart series={data.series} />
        </div>
      </div>

      <ResourcePanel resource={data.resources} />

      {supply && (
        <div className="surface-card min-w-0 p-3">
          <div className="mb-2 flex items-center gap-2">
            <Coins className="h-4 w-4 text-primary" />

            <p className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
              {messages.moedaTitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Kpi label={messages.moedaTotal} value={supply.totalLabel} />
            <Kpi label={messages.moedaCofre} value={supply.cofreLabel} />
            <Kpi label={messages.moedaCirculacao} value={supply.circulacaoLabel} />
          </div>

          <p
            className={cn("mt-2 text-[11px]", supply.coerente ? "text-growth" : "text-destructive")}
          >
            {supply.coerente ? messages.moedaCoerente : messages.moedaDivergente}
          </p>
        </div>
      )}

      {supply && (
        <div className="surface-card min-w-0 p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-text-subtle">
              <Coins className="h-3.5 w-3.5" />
              {messages.moedaTitle}
            </p>

            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                supply.coerente ? "bg-growth/10 text-growth" : "bg-destructive/10 text-destructive",
              )}
              title={supply.coerente ? messages.moedaCoerente : messages.moedaDivergente}
            >
              {supply.coerente ? "✓" : "⚠"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              [messages.moedaTotal, supply.totalLabel],
              [messages.moedaCofre, supply.cofreLabel],
              [messages.moedaCirculacao, supply.circulacaoLabel],
            ].map(([label, value]) => (
              <div
                key={label}
                className="min-w-0 rounded-xl border border-border-soft bg-surface-card p-2"
              >
                <p className="truncate text-[10px] uppercase tracking-wide text-text-subtle">
                  {label}
                </p>

                <p className="text-sm font-semibold text-text-strong">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="surface-card min-w-0 p-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-subtle">
            {messages.eventsTitle}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-subtle">
              {messages.updatedAt(generatedAtLabel)}
            </span>

            {rows.length > 0 && (
              <button
                type="button"
                onClick={() => copiarLinhas(rows)}
                className="inline-flex h-7 items-center gap-1 rounded-lg border border-border-soft px-2 text-[10px] text-text-subtle transition hover:text-text-strong"
              >
                <Copy className="h-3 w-3" />
                {messages.copyAll}
              </button>
            )}
          </div>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <select
            value={level}
            onChange={(event) => onLevelChange(event.target.value)}
            aria-label={messages.levelFilter}
            className="h-8 rounded-lg border border-border-soft bg-surface-1 px-2 text-xs text-text-strong"
          >
            <option value="">{messages.allLevels}</option>

            {levels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(event) => onTypeChange(event.target.value)}
            aria-label={messages.typeFilter}
            className="h-8 max-w-[11rem] rounded-lg border border-border-soft bg-surface-1 px-2 text-xs text-text-strong"
          >
            <option value="">{messages.allTypes}</option>
            {types.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={from}
            onChange={(event) => onFromChange(event.target.value)}
            aria-label={messages.fromLabel}
            title={messages.fromLabel}
            className="h-8 rounded-lg border border-border-soft bg-surface-1 px-2 text-base md:text-xs text-text-strong"
          />
          <input
            type="datetime-local"
            value={to}
            onChange={(event) => onToChange(event.target.value)}
            aria-label={messages.toLabel}
            title={messages.toLabel}
            className="h-8 rounded-lg border border-border-soft bg-surface-1 px-2 text-base md:text-xs text-text-strong"
          />

          <button
            type="button"
            onClick={onLastHour}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs",
              from && !to
                ? "bg-primary/10 text-primary"
                : "border border-border-soft text-text-subtle hover:text-primary",
            )}
          >
            {messages.lastHour}
          </button>

          {(from || to) && (
            <button
              type="button"
              onClick={onClearDates}
              className="inline-flex h-8 items-center rounded-lg border border-border-soft px-2 text-xs text-text-subtle hover:text-text-strong"
            >
              {messages.clearDates}
            </button>
          )}

          <div className="relative min-w-[10rem] flex-1">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-subtle" />
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder={messages.searchPlaceholder}
              className="h-8 pl-7 text-xs"
              aria-label={messages.searchPlaceholder}
            />
          </div>

          <button
            type="button"
            onClick={onOnlyFailures}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs",
              onlyFailures
                ? "bg-destructive text-primary-foreground"
                : "border border-border-soft text-text-subtle hover:text-destructive",
            )}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {messages.onlyFailures}
          </button>
        </div>

        {rows.length === 0 ? (
          <p className="py-6 text-center text-xs text-text-subtle">
            {filtered ? messages.noFiltered : messages.empty}
          </p>
        ) : (
          <div className="max-h-[28rem] overflow-auto rounded-lg border border-border-soft">
            <table className="w-full min-w-[42rem] border-collapse text-left text-xs">
              <thead className="sticky top-0 z-10 bg-surface-2 text-[10px] uppercase tracking-wide text-text-subtle">
                <tr>
                  <th className="px-2 py-1.5">{messages.colTime}</th>

                  <th className="px-2 py-1.5">{messages.colLevel}</th>

                  <th className="px-2 py-1.5">{messages.colType}</th>

                  <th className="px-2 py-1.5">{messages.colMessage}</th>

                  <th className="px-2 py-1.5">{messages.colHttp}</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((event) => (
                  <EventRow key={event.id} event={event} onCopy={() => copiarLinhas([event])} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered && hasNextPage && (
          <div className="mt-2 text-center">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              disabled={fetchingNextPage}
              onClick={onLoadMore}
            >
              {messages.loadMore}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone?: "danger" | "warn" }) {
  return (
    <div className="min-w-0 rounded-xl border border-border-soft bg-surface-card p-3">
      <p className="truncate text-[10px] uppercase tracking-wide text-text-subtle">{label}</p>

      <p
        className={cn(
          "mt-1 truncate text-lg font-semibold tabular-nums",
          tone === "danger"
            ? "text-destructive"
            : tone === "warn"
              ? "text-amber-600 dark:text-amber-400"
              : "text-text-strong",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-3 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function TrafficChart({ series }: { series: MonitoringMinutePoint[] }) {
  const messages = useMessages().monitoringSection;
  const width = 600;
  const height = 120;
  const max = Math.max(
    1,
    ...series.map((point) => Math.max(point.requests, point.errors4xx + point.errors5xx)),
  );
  const step = width / Math.max(1, series.length - 1);

  const line = (value: (point: MonitoringMinutePoint) => number) =>
    series
      .map((point, index) => `${index * step},${height - (value(point) / max) * (height - 8)}`)
      .join(" ");

  const requestArea = `M0,${height} L${line((point) => point.requests).replaceAll(" ", " L")} L${width},${height} Z`;
  const errorLine = line((point) => point.errors4xx + point.errors5xx);

  return (
    <div className="min-w-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-32 w-full"
        role="img"
        aria-label={messages.chartTitle}
      >
        {[0.25, 0.5, 0.75].map((fraction) => (
          <line
            key={fraction}
            x1={0}
            x2={width}
            y1={height * fraction}
            y2={height * fraction}
            stroke="var(--border)"
            strokeDasharray="3 4"
            strokeWidth={0.5}
          />
        ))}

        <path d={requestArea} fill="var(--primary)" opacity={0.12} />
        <polyline
          points={line((point) => point.requests)}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2}
        />
        <polyline points={errorLine} fill="none" stroke="var(--destructive)" strokeWidth={1.5} />
      </svg>

      <div className="flex justify-between text-[10px] text-text-subtle">
        <span>{messages.last60}</span>

        <span>
          {messages.peak}: {number.format(max)}
        </span>
      </div>
    </div>
  );
}

function EventRow({ event, onCopy }: { event: MonitoringEventData; onCopy: () => void }) {
  const messages = useMessages().monitoringSection;
  const [expanded, setExpanded] = useState(false);
  const [stackOpen, setStackOpen] = useState(false);
  const long = event.message.length > 140;

  return (
    <tr className="border-t border-border-soft align-top">
      <td className="whitespace-nowrap px-2 py-1.5 font-mono text-[10px] text-text-subtle">
        {event.timeLabel}
      </td>

      <td className="px-2 py-1.5">
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
            LEVEL_CLASS[event.level],
          )}
        >
          {event.level}
        </span>
      </td>

      <td className="whitespace-nowrap px-2 py-1.5 text-[10px] text-text-subtle">{event.type}</td>

      <td className="max-w-[20rem] px-2 py-1.5">
        <p className={cn("break-words text-text-strong", long && !expanded && "line-clamp-2")}>
          {event.message}
        </p>

        <div className="mt-0.5 flex items-center gap-2">
          {long && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="text-[10px] text-primary hover:underline"
            >
              {expanded ? messages.showLess : messages.showMore}
            </button>
          )}

          <button
            type="button"
            onClick={onCopy}
            aria-label={messages.copyEvent}
            title={messages.copyEvent}
            className="inline-flex h-5 w-5 items-center justify-center rounded text-text-subtle transition hover:bg-surface-2 hover:text-text-strong"
          >
            <Copy className="h-3 w-3" />
          </button>
        </div>

        {(event.requestId || event.userId || event.clientIp) && (
          <p className="mt-0.5 truncate font-mono text-[9px] text-text-subtle">
            req {event.requestId}
            {event.userId ? ` · ${event.userId}` : ""}
            {event.clientIp ? ` · ${event.clientIp}` : ""}
          </p>
        )}

        {event.metadata && (
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setStackOpen((v) => !v)}
              className="text-[10px] text-primary hover:underline"
            >
              {stackOpen ? messages.hideStack : messages.showStack}
            </button>

            {stackOpen && (
              <pre className="mt-1 max-h-48 overflow-auto rounded bg-surface-2 p-2 font-mono text-[9px] break-all whitespace-pre-wrap text-text-strong">
                {event.metadata}
              </pre>
            )}
          </div>
        )}
      </td>

      <td className="whitespace-nowrap px-2 py-1.5 font-mono text-[10px] text-text-subtle">
        {event.status
          ? `${event.method ?? ""} ${event.route ?? event.path ?? ""} · ${event.status}`
          : "—"}
        {event.durationMs != null ? ` · ${event.durationMs}ms` : ""}
      </td>
    </tr>
  );
}

function LatencyChart({ series }: { series: MonitoringMinutePoint[] }) {
  const messages = useMessages().monitoringSection;
  const width = 600;
  const height = 110;
  const max = Math.max(
    1,
    ...series.map((point) => Math.max(point.p99Ms, point.maxMs, point.p95Ms)),
  );
  const step = width / Math.max(1, series.length - 1);
  const line = (value: (point: MonitoringMinutePoint) => number) =>
    series
      .map((point, index) => `${index * step},${height - (value(point) / max) * (height - 6)}`)
      .join(" ");

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-28 w-full"
        role="img"
        aria-label={messages.latencyTitle}
      >
        <polyline
          points={line((point) => point.p95Ms)}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={1.8}
        />
        <polyline
          points={line((point) => point.p99Ms)}
          fill="none"
          stroke="var(--destructive)"
          strokeWidth={1.4}
        />
        <polyline
          points={line((point) => point.maxMs)}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={1}
          opacity={0.8}
        />
      </svg>

      <div className="flex justify-between text-[10px] text-text-subtle">
        <span>{messages.last60}</span>

        <span>
          {messages.peak}: {number.format(max)} ms
        </span>
      </div>
    </div>
  );
}

function ResourceChart({ series }: { series: MonitoringMinutePoint[] }) {
  const messages = useMessages().monitoringSection;
  const cpuMax = 100;
  const heapMax = Math.max(1, ...series.map((point) => point.heapMb));

  return (
    <div className="grid grid-cols-2 gap-3">
      <MiniLine
        label={messages.legendCpu}
        values={series.map((point) => point.cpuPercent)}
        max={cpuMax}
        suffix="%"
        color="var(--primary)"
      />
      <MiniLine
        label={messages.legendHeap}
        values={series.map((point) => point.heapMb)}
        max={heapMax}
        suffix="MB"
        color="#8b5cf6"
      />
    </div>
  );
}

function MiniLine({
  label,
  values,
  max,
  suffix,
  color,
}: {
  label: string;
  values: number[];
  max: number;
  suffix: string;
  color: string;
}) {
  const width = 280;
  const height = 80;
  const step = width / Math.max(1, values.length - 1);
  const points = values
    .map((value, index) => `${index * step},${height - (value / Math.max(1, max)) * (height - 4)}`)
    .join(" ");
  const last = values[values.length - 1] ?? 0;

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between text-[10px] text-text-subtle">
        <span>{label}</span>

        <span className="tabular-nums text-text-strong">
          {number.format(Math.round(last))} {suffix}
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-20 w-full" role="img" aria-label={label}>
        <polyline points={points} fill="none" stroke={color} strokeWidth={1.8} />
      </svg>
    </div>
  );
}

function ResourcePanel({ resource }: { resource: MonitoringResource }) {
  const messages = useMessages().monitoringSection;
  const pool = resource.dbPool;
  const diskUsed =
    resource.diskTotalBytes > 0 ? resource.diskTotalBytes - resource.diskFreeBytes : -1;
  const systemUsed =
    resource.systemMemoryTotalBytes > 0
      ? resource.systemMemoryTotalBytes - resource.systemMemoryFreeBytes
      : -1;

  return (
    <div className="surface-card min-w-0 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-subtle">
        {messages.resourcesTitle}
      </p>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <UsageBar
          label={messages.heapUsed}
          used={resource.heapUsedBytes}
          total={resource.heapMaxBytes}
          detail={`${formatBytes(resource.heapUsedBytes)} / ${formatBytes(resource.heapMaxBytes)}`}
        />
        <UsageBar
          label={messages.cpuProcess}
          used={Math.max(0, resource.processCpuPercent)}
          total={100}
          detail={`${resource.processCpuPercent < 0 ? "—" : resource.processCpuPercent.toFixed(0)}%`}
        />
        <UsageBar
          label={messages.cpuSystem}
          used={Math.max(0, resource.systemCpuPercent)}
          total={100}
          detail={`${resource.systemCpuPercent < 0 ? "—" : resource.systemCpuPercent.toFixed(0)}%`}
        />
        <UsageBar
          label={messages.disk}
          used={Math.max(0, diskUsed)}
          total={resource.diskTotalBytes}
          detail={
            resource.diskTotalBytes > 0
              ? messages.diskDetail(
                  formatBytes(resource.diskFreeBytes),
                  formatBytes(resource.diskTotalBytes),
                )
              : "—"
          }
        />
        <UsageBar
          label={messages.systemMemory}
          used={Math.max(0, systemUsed)}
          total={resource.systemMemoryTotalBytes}
          detail={
            resource.systemMemoryTotalBytes > 0
              ? messages.systemMemoryDetail(
                  formatBytes(resource.systemMemoryFreeBytes),
                  formatBytes(resource.systemMemoryTotalBytes),
                )
              : "—"
          }
        />
        <UsageBar
          label={messages.cgroupMemory}
          used={Math.max(0, resource.cgroupMemoryUsedBytes)}
          total={resource.cgroupMemoryMaxBytes}
          detail={
            resource.cgroupMemoryMaxBytes > 0
              ? `${formatBytes(resource.cgroupMemoryUsedBytes)} / ${formatBytes(resource.cgroupMemoryMaxBytes)}`
              : "—"
          }
        />
        <Stat
          label={messages.loadAverage}
          value={resource.loadAverage < 0 ? "—" : resource.loadAverage.toFixed(2)}
        />
        <Stat
          label={messages.threadsPeak}
          value={`${number.format(resource.threads)} / ${number.format(resource.peakThreads)}`}
        />
        <Stat
          label={messages.gc}
          value={`${number.format(resource.gcCount)} · ${number.format(resource.gcTimeMs)} ms`}
        />
        <Stat label={messages.classes} value={number.format(resource.loadedClasses)} />
        <Stat label={messages.nonHeap} value={formatBytes(resource.nonHeapUsedBytes)} />
        <Stat
          label={messages.dbPool}
          value={pool ? messages.dbPoolDetail(pool.active, pool.max, pool.waiting) : "—"}
        />
        <UsageBar
          label={messages.cgroupCpu}
          used={resource.cgroupCpuPercent ?? -1}
          total={100}
          detail={
            resource.cgroupCpuPercent >= 0
              ? resource.cgroupCpuCores > 0
                ? messages.cgroupCpuOfCores(
                    resource.cgroupCpuPercent.toFixed(0),
                    resource.cgroupCpuCores.toFixed(2),
                  )
                : messages.cgroupCpuNoLimit(resource.cgroupCpuPercent.toFixed(0))
              : resource.cgroupCpuCores > 0
                ? messages.cgroupCpuIdle(resource.cgroupCpuCores.toFixed(2))
                : "—"
          }
        />
      </div>
    </div>
  );
}

function UsageBar({
  label,
  used,
  total,
  detail,
}: {
  label: string;
  used: number;
  total: number;
  detail: string;
}) {
  const percent = total > 0 ? Math.min(100, (used / total) * 100) : 0;

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-2 text-[10px] text-text-subtle">
        <span className="truncate">{label}</span>

        <span className="shrink-0 tabular-nums text-text-strong">{percent.toFixed(0)}%</span>
      </div>

      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className={cn("h-full rounded-full", percent >= 90 ? "bg-destructive" : "bg-primary")}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-1 truncate text-[10px] text-text-subtle">{detail}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-border-soft bg-surface-1 px-2 py-1.5">
      <p className="truncate text-[10px] uppercase tracking-wide text-text-subtle">{label}</p>

      <p className="truncate text-xs font-medium tabular-nums text-text-strong">{value}</p>
    </div>
  );
}

function formatBytes(value: number) {
  if (value < 0) return "—";
  if (value >= 1024 ** 3) return `${(value / 1024 ** 3).toFixed(1)} GB`;
  return `${Math.round(value / 1024 / 1024)} MB`;
}

function formatUptime(seconds: number) {
  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor((seconds % 86_400) / 3_600);
  const minutes = Math.floor((seconds % 3_600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/** Uma linha legível do evento, para colar em relatório ou ticket. */
function eventLine(event: MonitoringEventData): string {
  const http = event.status
    ? `${event.method ?? ""} ${event.route ?? event.path ?? ""} ${event.status}`.trim()
    : "";
  return [
    `[${event.createdAt} ${event.level} ${event.type}]`,
    event.message,
    http ? `(${http})` : "",
    event.requestId ? `req=${event.requestId}` : "",
    event.clientIp ? `ip=${event.clientIp}` : "",
    event.metadata ? `\n${event.metadata}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}
