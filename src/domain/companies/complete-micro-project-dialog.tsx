import { useId, useState } from "react";

import { CircleCheck, Loader2, Star } from "lucide-react";

import { FOCUS_RING } from "../../lib/focus-ring.js";
import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { CompleteMicroProjectDialogProps } from "../../types/domain/companies/complete-micro-project-dialog-props.js";
import { Button } from "../../ui/button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog.js";
import { Label } from "../../ui/label.js";
import { Textarea } from "../../ui/textarea.js";

const RATINGS = [1, 2, 3, 4, 5] as const;
const TEXT_MAX = 500;

/**
 * Completing a microproject, with an optional review of the person who delivered it. The rating
 * is a real radio group (native radios, so arrows move and Tab enters once); the comment only
 * goes together with a rating.
 */
export function CompleteMicroProjectDialog({
  open,
  onOpenChange,
  personName,
  pending,
  error,
  onConfirm,
}: CompleteMicroProjectDialogProps) {
  const copy = useMessages().completeMicroProjectDialog;
  const [rating, setRating] = useState<(typeof RATINGS)[number] | null>(null);
  const [text, setText] = useState("");
  const [tried, setTried] = useState(false);
  const id = useId();
  const trimmed = text.trim();
  const textWithoutRating = tried && trimmed.length > 0 && rating === null;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setRating(null);
      setText("");
      setTried(false);
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>

          <DialogDescription>{copy.hint}</DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className="min-w-0 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setTried(true);
            if (trimmed && rating === null) return;
            onConfirm(rating === null ? {} : { rating, ...(trimmed ? { text: trimmed } : {}) });
          }}
        >
          <fieldset className="min-w-0 space-y-2">
            <legend className="mb-2 break-words text-sm font-medium text-text-strong">
              {copy.ratingLegend(personName)}
            </legend>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex gap-1">
                {RATINGS.map((value) => (
                  <label
                    key={value}
                    className="cursor-pointer rounded-lg p-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/50"
                  >
                    <input
                      type="radio"
                      name={`${id}-rating`}
                      value={value}
                      checked={rating === value}
                      onChange={() => setRating(value)}
                      className="sr-only"
                    />

                    <span className="sr-only">{copy.star(value)}</span>

                    <Star
                      aria-hidden
                      className={cn(
                        "h-7 w-7 transition-colors",
                        rating !== null && value <= rating
                          ? "fill-primary text-primary"
                          : "text-text-subtle hover:text-primary",
                      )}
                    />
                  </label>
                ))}
              </div>

              <span aria-live="polite" className="min-w-0 text-sm text-text-subtle">
                {rating !== null && copy.ratingHint[rating]}
              </span>
            </div>

            {rating !== null && (
              <button
                type="button"
                onClick={() => setRating(null)}
                className={cn(
                  "text-xs text-text-subtle underline-offset-4 hover:underline",
                  FOCUS_RING,
                )}
              >
                {copy.clearRating}
              </button>
            )}
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor={`${id}-text`}>{copy.textLabel}</Label>

            <Textarea
              id={`${id}-text`}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={copy.textPlaceholder}
              rows={4}
              maxLength={TEXT_MAX}
              aria-invalid={textWithoutRating || undefined}
              aria-describedby={textWithoutRating ? `${id}-text-error` : undefined}
            />

            {textWithoutRating && (
              <p id={`${id}-text-error`} className="text-xs text-destructive">
                {copy.textNeedsRating}
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-9 rounded-full px-4"
              disabled={pending}
              onClick={() => handleOpenChange(false)}
            >
              {copy.cancel}
            </Button>

            <Button type="submit" size="sm" className="h-9 rounded-full px-4" disabled={pending}>
              {pending ? (
                <Loader2 className="animate-spin" aria-hidden />
              ) : (
                <CircleCheck aria-hidden />
              )}
              {pending ? copy.confirming : copy.confirm}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
