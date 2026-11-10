import { useId, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";

import { Plus, X } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { TokenInputProps } from "../../types/patterns/token-input-props.js";
import { Pill } from "../../ui/pill.js";

const keyOf = (value: string) => value.toLocaleLowerCase("pt-BR");

/**
 * Controlled tokens with a local draft; commas also commit through mobile input events.
 * Removing a chip returns focus to the input after the controlled values update.
 */
export function TokenInput({
  values,
  onAdd,
  onRemove,
  label,
  hint,
  placeholder,
  max,
  maxLength,
  allowMultiple = true,
  suggestions = [],
  suggestionsLabel,
  limitMessage,
  duplicateMessage,
  count,
  removeLabel,
  disabled = false,
  id: providedId,
  ref,
}: TokenInputProps) {
  const messages = useMessages().tokenInput;
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<string | null>(null);
  const composing = useRef(false);
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const draftRef = useRef("");
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const full = values.length >= max;
  const taken = new Set(values.map(keyOf));
  const visibleSuggestions =
    full || disabled
      ? []
      : suggestions
          .filter((value) => !taken.has(keyOf(value)) && keyOf(value).includes(keyOf(draft.trim())))
          .slice(0, 8);

  const updateDraft = (value: string) => {
    draftRef.current = value;
    setDraft(value);
  };

  const commit = (raw: string, all = true): string[] | null => {
    if (disabled || composing.current) return null;
    const parts = raw.split(",");
    if (!allowMultiple && parts.filter((part) => part.trim()).length > 1) {
      updateDraft(raw);
      setError(messages.singleItem);
      return null;
    }
    const remainder = all ? "" : parts.pop()!;
    const next = [...valuesRef.current];
    const keys = new Set(next.map(keyOf));
    const added: string[] = [];
    let duplicate = false;
    for (const part of parts) {
      const token = part.trim();
      if (!token) continue;
      if (keys.has(keyOf(token))) {
        duplicate = true;
        continue;
      }
      if (token.length > maxLength || next.length >= max) {
        setError(token.length > maxLength ? messages.tooLong(maxLength) : messages.tooMany(max));
        updateDraft(raw);
        return null;
      }
      keys.add(keyOf(token));
      next.push(token);
      added.push(token);
    }
    valuesRef.current = next;
    updateDraft(remainder);
    setError(duplicate ? (duplicateMessage ?? null) : null);
    added.forEach((token) => onAdd(token));
    return next;
  };

  useImperativeHandle(ref, () => ({ commit: () => commit(draftRef.current) }));

  useLayoutEffect(() => {
    if (pendingFocusRef.current === null || values.includes(pendingFocusRef.current)) return;
    pendingFocusRef.current = null;
    // At the item limit, the input becomes enabled only after the removal renders.
    inputRef.current?.focus();
  }, [values]);

  const remove = (token: string) => {
    pendingFocusRef.current = token;
    valuesRef.current = valuesRef.current.filter((value) => value !== token);
    onRemove(token);
    setError(null);
  };

  return (
    <div
      ref={rootRef}
      className="space-y-3"
      onBlur={(event) => {
        const target = event.relatedTarget;
        if (rootRef.current?.contains(target)) return;
        // An action commits through the handle. Updating chips/suggestions on
        // pointer-down can move that action before pointer-up and cancel its click.
        if (target instanceof HTMLElement && target.closest("button, a, [role='button']")) return;
        commit(draftRef.current);
      }}
    >
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-text-strong">
          {label}
        </label>

        <span aria-live="polite" className="shrink-0 text-xs tabular-nums text-text-subtle">
          {(count ?? messages.count)(values.length, max)}
        </span>
      </div>

      <p id={`${id}-hint`} className="text-xs text-text-subtle">
        {full ? (limitMessage ?? messages.full) : (hint ?? messages.hint)}
      </p>

      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-input bg-transparent px-2 py-1.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        {values.map((token) => (
          <span
            key={token}
            data-token
            className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-full bg-surface-2 py-1 pl-3 pr-1 text-sm text-text-strong"
          >
            <span className="min-w-0 truncate">{token}</span>

            <button
              type="button"
              disabled={disabled}
              aria-label={(removeLabel ?? messages.remove)(token)}
              onClick={() => remove(token)}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-text-subtle transition hover:bg-surface-3 hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed"
            >
              <X aria-hidden className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={id}
          value={draft}
          disabled={disabled || (full && !draft)}
          aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
          aria-invalid={!!error}
          placeholder={values.length === 0 ? placeholder : undefined}
          onChange={(event) => {
            const raw = event.target.value;
            if (!composing.current && raw.includes(",")) commit(raw, false);
            else {
              updateDraft(raw);
              setError(null);
            }
          }}
          onCompositionStart={() => {
            composing.current = true;
          }}
          onCompositionEnd={(event) => {
            composing.current = false;
            const raw = event.currentTarget.value;
            if (raw.includes(",")) commit(raw, false);
          }}
          onKeyDown={(event) => {
            if (composing.current || event.nativeEvent.isComposing || event.keyCode === 229) return;
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              commit(draftRef.current);
            } else if (event.key === "Backspace" && !draftRef.current && values.length) {
              event.preventDefault();
              remove(values[values.length - 1]);
            }
          }}
          className="h-8 min-w-0 basis-32 flex-1 bg-transparent px-1 text-base text-text-strong placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed md:text-sm"
        />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
      {visibleSuggestions.length > 0 && (
        <div
          role="group"
          aria-label={suggestionsLabel ?? messages.suggestions}
          className="flex flex-wrap gap-1.5"
        >
          {visibleSuggestions.map((suggestion) => (
            <Pill key={suggestion} size="sm" onClick={() => commit(suggestion)}>
              <span className="inline-flex items-center gap-1">
                <Plus aria-hidden className="h-3 w-3" />

                <>{suggestion}</>
              </span>
            </Pill>
          ))}
        </div>
      )}
    </div>
  );
}
