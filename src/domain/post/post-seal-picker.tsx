import { Tag } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { PostSealPickerProps } from "../../types/domain/post/post-seal-picker-props.js";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover.js";

import { POST_SEALS } from "./post-seals.js";

/** Seletor de selos do post: entra na fileira das ações (o card é quem sabe os selos do post). */
export function PostSealPicker({
  mySeals,
  onToggle,
  pending = false,
  onRemove,
}: PostSealPickerProps) {
  const messages = useMessages().postSealPicker;
  const sealLabels = useMessages().postSeals;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-2.5 transition hover:bg-muted hover:text-foreground text-muted-foreground"
          title={messages.action}
          aria-label={messages.action}
        >
          <Tag className="h-4 w-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-64 p-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-subtle">
          {messages.title}
        </p>

        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {POST_SEALS.map((seal) => {
            const mine = mySeals.includes(seal.id);
            const label = sealLabels[seal.labelKey];
            return (
              <button
                key={seal.id}
                type="button"
                onClick={() => onToggle(seal.id)}
                disabled={pending}
                title={label}
                aria-label={label}
                aria-pressed={mine}
                className={cn(
                  "flex min-w-0 flex-col items-center gap-1 rounded-lg border px-1 py-2 text-[10px] font-medium transition hover:border-primary/50",
                  mine
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border-soft text-text-subtle",
                )}
              >
                <seal.icon className="h-4 w-4" aria-hidden />

                <span className="max-w-full break-words text-center leading-tight">{label}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-[11px] leading-snug text-text-subtle">{messages.hint}</p>

        {mySeals.length > 0 && (
          <button
            type="button"
            onClick={onRemove}
            className="mt-2 w-full rounded-lg px-2 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10"
          >
            {messages.remove}
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}
