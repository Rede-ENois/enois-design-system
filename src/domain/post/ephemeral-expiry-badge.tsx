import { useEffect, useReducer } from "react";

import { Clock } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { PostType } from "../../types/domain/post/post-type.js";

const MINUTE_MS = 60_000;
const HOUR_MS = 3_600_000;
/** O rótulo muda por minuto; re-render leve a cada 30s o mantém honesto sem timer fino. */
const TICK_MS = 30_000;

/**
 * Prazo de um post efêmero (Momento 24h, Instante 1h) no cartão: o Instante mostra minutos
 * porque em uma hora "algumas horas" não diz nada; o Momento segue em horas, como sempre.
 */
export function EphemeralExpiryBadge({ type, expiresAt }: { type: PostType; expiresAt: string }) {
  const messages = useMessages().postCard;
  const [, tick] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const remaining = new Date(expiresAt).getTime() - Date.now();
  if (remaining <= 0) {
    return null;
  }
  const label =
    type === "INSTANTE"
      ? messages.instanteExpiry(Math.max(1, Math.ceil(remaining / MINUTE_MS)))
      : messages.momentExpiry(Math.max(1, Math.ceil(remaining / HOUR_MS)));
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 px-2 py-1 text-xs font-normal text-amber-600 dark:text-amber-400"
      title={type === "INSTANTE" ? messages.instanteExpiryTitle : messages.momentExpiryTitle}
    >
      <Clock className="h-3 w-3" />
      {label}
    </span>
  );
}
