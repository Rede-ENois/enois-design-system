import { Briefcase } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ComposerCrossPostProps } from "../../types/domain/post/composer-cross-post-props.js";

/**
 * The "also publish in the professional feed" row under the composer text. Ticked by default when
 * the person has an active professional profile and picked a type that belongs there too, so the
 * post reaches both audiences as one publication, signed by the professional profile.
 */
export function ComposerCrossPost({
  checked,
  onChange,
  unavailableReason,
  error,
}: ComposerCrossPostProps) {
  const messages = useMessages().composerCrossPost;

  if (unavailableReason) {
    return (
      <div className="mt-2 space-y-1">
        <p className="flex items-start gap-1.5 rounded-xl bg-surface-2 px-3 py-2 text-xs text-text-subtle">
          <Briefcase aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />

          <>{unavailableReason}</>
        </p>

        {error && (
          <p role="alert" className="px-3 text-xs font-medium text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-1">
      <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-primary-soft px-3 py-2 text-xs font-medium text-text-strong">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.currentTarget.checked)}
          className="h-4 w-4 shrink-0 accent-primary"
        />
        <Briefcase aria-hidden className="h-3.5 w-3.5 shrink-0 text-primary" />

        <span className="min-w-0">{messages.label}</span>
      </label>

      <p className="px-3 text-xs text-text-subtle">{messages.hint}</p>

      {error && (
        <p role="alert" className="px-3 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
