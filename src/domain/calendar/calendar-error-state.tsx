import { TriangleAlert } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import { Button } from "../../ui/button.js";

/** Load failure of a calendar view: says what failed and offers the retry the app owns. */
export function CalendarErrorState({
  onRetry,
  className,
}: {
  onRetry?: () => void;
  className?: string;
}) {
  const messages = useMessages().calendar;

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-border-soft px-4 py-8 text-center",
        className,
      )}
    >
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-destructive/10 text-destructive">
        <TriangleAlert aria-hidden className="h-5 w-5" />
      </span>

      <p className="text-sm font-normal text-text-strong">{messages.loadError}</p>

      {onRetry && (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          {messages.retry}
        </Button>
      )}
    </div>
  );
}
