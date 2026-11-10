import { useState } from "react";

import { Loader2, Pause, Play, RefreshCw, ShieldCheck } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import { ListRowSkeletons } from "../../patterns/skeletons/list-row-skeletons.js";
import type { IdentityReleaseSectionProps } from "../../types/domain/moderation/identity-release-section-props.js";
import { Button } from "../../ui/button.js";
import { Input } from "../../ui/input.js";
import { Label } from "../../ui/label.js";

const number = new Intl.NumberFormat("pt-BR");

const STATE_CLASS: Record<string, string> = {
  COMPLETED: "bg-growth/10 text-growth",
  PAUSED: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  RUNNING: "bg-primary-soft text-primary-text",
  PENDING: "bg-surface-2 text-text-subtle",
  CANCELLED: "bg-destructive/10 text-destructive",
};

/**
 * Verificação de identidade, para a administração: fila, consumo do ciclo e as réguas da rodada.
 *
 * Não existe botão para dar o selo a ninguém — o selo só nasce do desfecho confirmado pelo
 * provedor. O que a administração faz aqui é operar a fila (rodada, tamanho, frequência, pausa) e
 * ler o consumo; toda intervenção é registrada pela auditoria no backend.
 */
export function IdentityReleaseSection({
  overview,
  loading = false,
  error = false,
  onRefresh,
  refreshPending = false,
  onRunRound,
  runPending = false,
  onSavePolicy,
  savePending = false,
  rounds,
}: IdentityReleaseSectionProps) {
  const messages = useMessages().identityReleaseSection;
  const [draft, setDraft] = useState<Partial<Record<string, string>>>({});

  const policy = overview?.policy;

  const field = (key: keyof NonNullable<typeof policy>, label: string, hint: string) => {
    const current = policy ? policy[key] : "";
    const value = draft[key as string] ?? String(current);
    return (
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground" htmlFor={`release-${String(key)}`}>
          {label}
        </Label>

        <Input
          id={`release-${String(key)}`}
          inputMode="numeric"
          value={value}
          onChange={(event) => setDraft({ ...draft, [key as string]: event.target.value })}
          disabled={savePending}
        />

        <p className="text-xs font-normal text-text-subtle">{hint}</p>
      </div>
    );
  };

  if (loading) {
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

          <p className="text-sm text-muted-foreground">{messages.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
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

          <Button className="gap-1.5 rounded-full" disabled={runPending} onClick={onRunRound}>
            {runPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ShieldCheck className="h-4 w-4" />
            )}

            {messages.runRound}
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {messages.error}
        </p>
      )}

      {overview && (
        <>
          {/* Fila e consumo: o que a administração precisa para decidir se roda uma rodada. */}
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              [messages.totalUsers, number.format(overview.totalUsers)],
              [messages.releasedUsers, number.format(overview.releasedUsers)],
              [messages.inFlight, number.format(overview.inFlight)],
              [messages.startedThisCycle, number.format(overview.startedThisCycle)],
              [messages.remainingCapacity, number.format(overview.remainingCapacity)],
              [messages.minReputationNow, number.format(overview.policy.minReputation)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border-soft bg-surface-card p-3">
                <dt className="text-[11px] font-normal text-text-subtle">{label}</dt>

                <dd className="mt-0.5 text-lg font-semibold text-text-strong">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="grid gap-3 rounded-2xl border border-border-soft bg-surface-card p-4 sm:grid-cols-2">
            <p className="text-sm text-muted-foreground">
              {messages.budget(overview.estimatedSpentUsdLabel, overview.budgetUsdLabel)}
            </p>

            <p className="text-sm text-muted-foreground">
              {messages.monthlyLimit(overview.monthlyLimit)}
            </p>

            {!overview.providerAvailable && (
              <p className="rounded-xl bg-surface-2 px-3 py-2 text-xs text-text-subtle sm:col-span-2">
                {messages.providerUnavailable}
              </p>
            )}

            <p className="text-sm text-muted-foreground sm:col-span-2">
              {overview.policy.nextRoundAtLabel
                ? messages.nextRound(overview.policy.nextRoundAtLabel)
                : messages.noNextRound}
            </p>
          </div>

          {/* As réguas da rodada. Nada de tamanho fixo no código: tudo isto é o que manda. */}
          <div className="space-y-3 rounded-2xl border border-border-soft bg-surface-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-text-strong">{messages.policyTitle}</p>

              <Button
                variant="outline"
                className={cn("rounded-full", overview.policy.paused && "text-destructive")}
                disabled={savePending}
                onClick={() => onSavePolicy({ paused: !overview.policy.paused })}
              >
                {overview.policy.paused ? (
                  <Play className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}

                {overview.policy.paused ? messages.resume : messages.pause}
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {field("usersPerRound", messages.usersPerRound, messages.usersPerRoundHint)}
              {field("intervalMinutes", messages.intervalMinutes, messages.intervalMinutesHint)}
              {field("minReputation", messages.minReputation, messages.minReputationHint)}
              {field(
                "reservedQuotaPercent",
                messages.reservedQuotaPercent,
                messages.reservedQuotaPercentHint,
              )}
              {field("maxSimultaneous", messages.maxSimultaneous, messages.maxSimultaneousHint)}
            </div>

            <Button
              className="rounded-full"
              disabled={savePending || Object.keys(draft).length === 0}
              onClick={() => {
                const next = Object.fromEntries(
                  Object.entries(draft)
                    .map(([key, value]) => [key, Number(value)])
                    .filter(([, value]) => Number.isFinite(value) && Number(value) >= 0),
                );
                onSavePolicy(next);
                setDraft({});
              }}
            >
              {savePending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}

              {messages.save}
            </Button>
          </div>

          {/* Histórico: cada rodada com o que liberou e por que parou. */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-text-strong">{messages.historyTitle}</p>

            {rounds.length === 0 ? (
              <p className="rounded-2xl border border-border-soft bg-surface-card p-4 text-sm text-text-subtle">
                {messages.historyEmpty}
              </p>
            ) : (
              <ul className="space-y-2">
                {rounds.map((round) => (
                  <li
                    key={round.id}
                    className="rounded-xl border border-border-soft bg-surface-card p-3 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-medium",
                          STATE_CLASS[round.state] ?? STATE_CLASS.PENDING,
                        )}
                      >
                        {messages.state[round.state] ?? round.state}
                      </span>

                      <span className="text-text-strong">{round.executedAtLabel}</span>

                      <span className="text-text-subtle">
                        {messages.roundSummary(
                          round.releasedCount,
                          round.eligibleCount,
                          round.minReputation,
                        )}
                      </span>
                    </div>

                    {round.note && (
                      <p className="mt-1 text-xs font-normal text-text-subtle">{round.note}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}
