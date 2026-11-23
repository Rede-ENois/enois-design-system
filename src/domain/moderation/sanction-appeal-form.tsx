import { useEffect, useId, useRef } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { SanctionsViewProps } from "../../types/domain/moderation/sanctions-view-props.js";
import { Button } from "../../ui/button.js";
import { CharCounter } from "../../ui/char-counter.js";
import { Label } from "../../ui/label.js";
import { Textarea } from "../../ui/textarea.js";

export function SanctionAppealForm({
  appealMessage,
  onAppealMessageChange,
  onAppeal,
  appealSubmitting,
  appealError,
}: Pick<
  SanctionsViewProps,
  "appealMessage" | "onAppealMessageChange" | "onAppeal" | "appealSubmitting" | "appealError"
>) {
  const messages = useMessages().sanctionsView;
  const id = useId();
  const submitted = useRef(false);
  const length = appealMessage.trim().length;
  const valid = length >= 10 && length <= 1000;
  useEffect(() => {
    submitted.current = false;
  }, [appealSubmitting, appealError, appealMessage]);
  return (
    <form
      className="space-y-3 border-t border-border-soft pt-4"
      aria-busy={appealSubmitting}
      onSubmit={(event) => {
        event.preventDefault();
        if (!valid || appealSubmitting || submitted.current) return;
        submitted.current = true;
        onAppeal();
      }}
    >
      <Label htmlFor={id}>{messages.appealLabel}</Label>

      <Textarea
        id={id}
        value={appealMessage}
        onChange={(event) => onAppealMessageChange(event.target.value)}
        disabled={appealSubmitting}
        aria-describedby={`${id}-hint${!valid && length > 0 ? ` ${id}-invalid` : ""}${appealError ? ` ${id}-error` : ""}`}
        aria-invalid={!valid && length > 0}
        rows={4}
      />
      <CharCounter length={length} max={1000} />

      <p id={`${id}-hint`} className="text-sm text-text-strong">
        {messages.appealHint}
      </p>
      {!valid && length > 0 && (
        <p id={`${id}-invalid`} className="text-sm text-text-strong">
          {messages.appealInvalid}
        </p>
      )}
      {appealError && (
        <p role="alert" id={`${id}-error`} className="text-sm text-text-strong">
          {messages.appealError}
        </p>
      )}
      <Button type="submit" disabled={!valid || appealSubmitting}>
        {appealSubmitting ? messages.appealSubmitting : messages.appeal}
      </Button>

      <span role="status" className="sr-only">
        {appealSubmitting && messages.appealSubmitting}
      </span>
    </form>
  );
}
