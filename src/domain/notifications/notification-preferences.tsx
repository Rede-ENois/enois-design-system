import { useId } from "react";

import { BellOff, Loader2, ShieldCheck } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { NotificationPreferenceKey } from "../../types/domain/notifications/notification-preference-key.js";
import type { NotificationPreferencesProps } from "../../types/domain/notifications/notification-preferences-props.js";
import { Button } from "../../ui/button.js";
import { Skeleton } from "../../ui/skeleton.js";
import { Switch } from "../../ui/switch.js";

const PUSH_KEYS: NotificationPreferenceKey[] = [
  "pushSocial",
  "pushMessages",
  "pushGroups",
  "pushJobs",
  "pushSystem",
];

/**
 * Preferências de notificação da conta: resumo semanal por e-mail e as categorias de aviso no
 * navegador. Cada switch salva sozinho (o app atualiza `values` de forma otimista); o resultado
 * do último salvamento é anunciado por `aria-live`. Push desligado neste dispositivo não trava as
 * categorias: elas continuam editáveis, com uma nota explicando que só valem com os avisos ligados.
 */
export function NotificationPreferences({
  values,
  loading = false,
  loadError = false,
  onRetry,
  onChange,
  pending = {},
  saveStatus = "idle",
  pushEnabled,
  onEnablePush,
  pushBusy = false,
}: NotificationPreferencesProps) {
  const messages = useMessages().notificationPreferences;

  if (loading && !values) {
    return (
      <div role="status" className="space-y-4">
        <span className="sr-only">{messages.loading}</span>

        {[1, 4].map((rows) => (
          <div key={rows} className="surface-card space-y-4 p-4">
            <Skeleton className="h-4 w-32" />

            {Array.from({ length: rows }, (_, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-3/4" />
                </div>

                <Skeleton className="h-5 w-9 rounded-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (loadError || !values) {
    return (
      <div role="alert" className="surface-card flex flex-wrap items-center gap-3 p-4">
        <p className="min-w-0 flex-1 text-sm text-text-subtle">{messages.loadError}</p>

        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          disabled={loading}
          onClick={onRetry}
        >
          {messages.retry}
        </Button>
      </div>
    );
  }

  const row = (key: NotificationPreferenceKey) => (
    <PreferenceRow
      key={key}
      label={messages.items[key].label}
      hint={messages.items[key].hint}
      savingLabel={messages.saving}
      checked={values[key]}
      pending={Boolean(pending[key])}
      onCheckedChange={(value) => onChange(key, value)}
    />
  );

  return (
    <div className="space-y-4">
      <section className="surface-card p-4">
        <h2 className="text-base font-medium text-text-strong">{messages.emailTitle}</h2>

        <div className="mt-1">{row("weeklyDigest")}</div>
      </section>

      <section className="surface-card p-4">
        <h2 className="text-base font-medium text-text-strong">{messages.pushTitle}</h2>

        <p className="mt-0.5 text-sm text-text-subtle">{messages.pushHint}</p>

        {!pushEnabled && (
          <div className="mt-3 flex flex-wrap items-start gap-3 rounded-xl bg-surface-2 p-3">
            <BellOff aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-text-subtle" />

            <p className="min-w-0 flex-1 basis-48 text-sm text-text-subtle">{messages.pushOff}</p>

            {onEnablePush && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-full"
                disabled={pushBusy}
                onClick={onEnablePush}
              >
                {pushBusy ? messages.enablingPush : messages.enablePush}
              </Button>
            )}
          </div>
        )}

        <div className="mt-1 divide-y divide-border-soft">{PUSH_KEYS.map(row)}</div>
      </section>

      <p className="flex items-center gap-2 px-1 text-xs text-text-subtle">
        <ShieldCheck aria-hidden className="h-3.5 w-3.5 shrink-0" />

        <span className="min-w-0">{messages.securityNote}</span>
      </p>

      {/* One live region: visible only for a failed save, read aloud for every status. */}
      <p
        aria-live="polite"
        className={saveStatus === "error" ? "px-1 text-xs text-destructive" : "sr-only"}
      >
        {
          { idle: "", saving: messages.saving, saved: messages.saved, error: messages.saveError }[
            saveStatus
          ]
        }
      </p>
    </div>
  );
}

function PreferenceRow({
  label,
  hint,
  savingLabel,
  checked,
  pending,
  onCheckedChange,
}: {
  label: string;
  hint: string;
  savingLabel: string;
  checked: boolean;
  pending: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  const id = useId();

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p id={`${id}-label`} className="text-sm font-medium text-text-strong">
          {label}
        </p>

        <p id={`${id}-hint`} className="mt-0.5 text-xs text-text-subtle">
          {hint}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {pending && (
          <Loader2
            role="img"
            aria-label={savingLabel}
            className="h-3.5 w-3.5 animate-spin text-text-subtle motion-reduce:animate-none"
          />
        )}

        <Switch
          checked={checked}
          disabled={pending}
          aria-busy={pending}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-hint`}
          onCheckedChange={onCheckedChange}
        />
      </div>
    </div>
  );
}
