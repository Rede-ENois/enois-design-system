import { cn } from "../lib/utils.js";
import { useMessages } from "../messages/messages-context.js";
import type { SignalProps } from "../types/components/ui/signal-props.js";

/** Counts above 99 read as "99+": the exact number stops helping past that point. */
function shortCount(count: number) {
  return count > 99 ? "99+" : String(count);
}

/**
 * The semantic signal vocabulary of the app. Shape says what it is (pill = things to handle,
 * balloon = messages, dot = news, "hoje" = happening today); none of them blink.
 */
export function Signal({ signal, onIcon = false, className }: SignalProps) {
  const messages = useMessages().signal;
  const ring = onIcon && "shadow-[0_0_0_2px_var(--color-background)]";

  if (signal.kind === "new") {
    return (
      <span
        role="img"
        aria-label={messages.new}
        className={cn(
          "inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-primary",
          onIcon
            ? "shadow-[0_0_0_2px_var(--color-background)]"
            : "shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_22%,transparent)]",
          className,
        )}
      />
    );
  }

  if (signal.kind === "today") {
    return (
      <span
        className={cn(
          "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full bg-signal-today-soft px-2.5 text-xs font-bold text-signal-today",
          className,
        )}
      >
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal-today" />
        {messages.today}
      </span>
    );
  }

  if (signal.count <= 0) return null;

  return (
    <span
      role="img"
      aria-label={
        signal.kind === "messages" ? messages.messages(signal.count) : messages.count(signal.count)
      }
      className={cn(
        "inline-grid h-[22px] min-w-[22px] shrink-0 place-items-center px-1.5 text-xs font-extrabold tabular-nums",
        "bg-primary text-primary-foreground",
        signal.kind === "messages" ? "rounded-[11px_11px_11px_3px]" : "rounded-full",
        ring,
        className,
      )}
    >
      {shortCount(signal.count)}
    </span>
  );
}
