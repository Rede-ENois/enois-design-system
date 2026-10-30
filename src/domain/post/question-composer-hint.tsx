import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";

/** One calm line the composer shows when the author picks the QUESTION type. */
export function QuestionComposerHint({ className }: { className?: string }) {
  const hint = useMessages().questionComposer.hint;
  return <p className={cn("text-xs font-normal text-text-subtle", className)}>{hint}</p>;
}
