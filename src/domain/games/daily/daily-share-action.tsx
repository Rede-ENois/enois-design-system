import { Share2 } from "lucide-react";

import { useMessages } from "../../../messages/messages-context.js";
import type { DailyShareActionProps } from "../../../types/domain/games/daily-share-action-props.js";
import { Button } from "../../../ui/button.js";

/** "Share result" button plus a polite live line with the outcome of the last attempt. */
export function DailyShareAction({
  onShare,
  status = "idle",
  block = false,
}: DailyShareActionProps) {
  const messages = useMessages().dailyShare;
  const feedback = status === "idle" ? "" : messages[status];

  return (
    <div className={block ? "flex w-full flex-col items-center gap-2 text-center" : "contents"}>
      <Button
        type="button"
        variant={block ? "default" : "outline"}
        className={block ? "w-full gap-2" : "gap-2"}
        onClick={onShare}
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
        {messages.button}
      </Button>

      {/* Always mounted (and one line tall) so screen readers catch the change and nothing jumps. */}
      <p aria-live="polite" className="order-last min-h-5 w-full text-sm text-muted-foreground">
        {feedback}
      </p>
    </div>
  );
}
