import { useMessages } from "../../messages/messages-context.js";
import type { RecruitmentScore } from "../../types/domain/jobs/recruitment-score.js";
import { Badge } from "../../ui/badge.js";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover.js";

/**
 * The score as a small pill that opens the breakdown: every point is a written signal, never a
 * bare number. When the job says nothing to compare against, the pill says that instead of 0 —
 * "0" reads as "bad candidate" and this is not that.
 */
export function RecruitmentScoreLine({ score }: { score: RecruitmentScore | null }) {
  const messages = useMessages().recruitment;

  if (!score || !score.available) {
    return <Badge variant="outline">{messages.scoreUnavailable}</Badge>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="rounded-md border px-2.5 py-0.5 text-xs font-semibold text-foreground hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {messages.scoreTotal(score.total)}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-72 space-y-2" aria-label={messages.scoreBreakdownTitle}>
        <p className="text-xs font-semibold text-text-strong">{messages.scoreBreakdownTitle}</p>

        <ul className="space-y-1">
          {score.components.map((component) => (
            <li key={component.code} className="text-xs text-muted-foreground">
              {messages.scorePart(component.label, component.points, component.maxPoints)}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
