import { AlertTriangle, CalendarDays, ExternalLink, RefreshCw } from "lucide-react";

import { safeHref } from "../../lib/safe-href.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ExternalJobOriginLineProps } from "../../types/domain/jobs/external-job-origin-line-props.js";

const DAY_MS = 86_400_000;

const DATE_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function parse(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Dias inteiros entre a data e agora; negativo vira 0 (relógio adiantado não vira "há -1 dia"). */
function daysSince(date: Date, now: Date): number {
  return Math.max(0, Math.floor((now.getTime() - date.getTime()) / DAY_MS));
}

/**
 * A linha de origem de uma vaga externa: de onde veio, quando foi publicada, quando foi verificada
 * pela última vez e se ainda está no ar.
 *
 * O requisito é transparência, então a tela nunca arredonda para cima: sem data de publicação na
 * fonte, ela diz que a fonte não informa, em vez de mostrar a data de importação como se fosse a
 * publicação. Vaga removida ou expirada aparece marcada, não some sem explicação.
 */
export function ExternalJobOriginLine({ origin, now = new Date() }: ExternalJobOriginLineProps) {
  const messages = useMessages().externalJobOrigin;

  const published = parse(origin.publishedAt);
  const lastSeen = parse(origin.lastSeenAt);
  const removed = parse(origin.removedAt);
  const expires = parse(origin.expiresAt);
  const expired = expires !== null && expires.getTime() <= now.getTime();
  // O link da fonte vem de fora: só http(s) passa, o resto vira nenhum link em vez de href inseguro.
  const sourceHref = safeHref(origin.sourceUrl);

  const relative = (date: Date): string => {
    const days = daysSince(date, now);
    if (days === 0) return messages.today;
    if (days === 1) return messages.yesterday;
    return messages.relative(days);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-subtle">
      <span className="inline-flex items-center gap-1 font-medium text-text-strong">
        <ExternalLink className="h-3 w-3" aria-hidden />
        {messages.from(origin.platform)}
      </span>

      <span className="inline-flex items-center gap-1">
        <CalendarDays className="h-3 w-3" aria-hidden />
        {published ? messages.published(DATE_FORMAT.format(published)) : messages.publishedUnknown}
      </span>

      <span className="inline-flex items-center gap-1">
        <RefreshCw className="h-3 w-3" aria-hidden />
        {lastSeen ? messages.lastSeen(relative(lastSeen)) : messages.lastSeenUnknown}
      </span>

      {removed && (
        <span className="inline-flex items-center gap-1 font-medium text-destructive">
          <AlertTriangle className="h-3 w-3" aria-hidden />
          {messages.removed}
        </span>
      )}

      {!removed && expired && (
        <span className="inline-flex items-center gap-1 font-medium text-destructive">
          <AlertTriangle className="h-3 w-3" aria-hidden />
          {messages.expired}
        </span>
      )}

      {sourceHref && (
        <a
          href={sourceHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
        >
          {messages.openSource}
        </a>
      )}
    </div>
  );
}
