import { Check } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CaughtUpDividerProps } from "../../types/domain/post/caught-up-divider-props.js";

/**
 * A calm stopping point in the feed: the app renders it before the first post at or older than
 * the `lastSeenAt` of the first feed page.
 */
export function CaughtUpDivider({ className }: CaughtUpDividerProps) {
  const messages = useMessages().caughtUpDivider;

  return (
    <div
      role="separator"
      aria-label={`${messages.title}. ${messages.subline}`}
      className={cn("flex flex-col items-center gap-1 py-6 text-center", className)}
    >
      <div aria-hidden className="flex w-full items-center gap-3">
        <span className="h-px flex-1 bg-border-soft" />

        <span className="grid h-7 w-7 place-items-center rounded-full bg-growth/10 text-growth">
          <Check className="h-3.5 w-3.5" />
        </span>

        <span className="h-px flex-1 bg-border-soft" />
      </div>

      <p aria-hidden className="pt-1 text-sm font-medium text-text-strong">
        {messages.title}
      </p>

      <p aria-hidden className="text-xs text-text-subtle">
        {messages.subline}
      </p>
    </div>
  );
}
