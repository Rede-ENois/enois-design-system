import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { QuestionStatusFilterProps } from "../../types/domain/post/question-status-filter-props.js";
import type { QuestionStatus } from "../../types/domain/post/question-status.js";

const OPTIONS: QuestionStatus[] = ["all", "open", "resolved"];

/** Segmented "Todas / Abertas / Resolvidas" filter for the questions feed. */
export function QuestionStatusFilter({ value, onChange, className }: QuestionStatusFilterProps) {
  const messages = useMessages().questionStatusFilter;

  return (
    <div
      role="group"
      aria-label={messages.label}
      className={cn(
        "inline-flex max-w-full items-center gap-0.5 rounded-full border border-border-soft bg-surface-1 p-0.5",
        className,
      )}
    >
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "h-8 min-w-0 rounded-full px-3.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === option
              ? "bg-surface-2 text-text-strong"
              : "text-text-subtle hover:text-text-strong",
          )}
        >
          {messages[option]}
        </button>
      ))}
    </div>
  );
}
