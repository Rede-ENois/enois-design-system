import { type ReactNode, useId } from "react";

import { Label } from "../../ui/label.js";

/**
 * A labelled field of the company forms: label (with an "optional" tag), hint and inline error,
 * wired to the control through `aria-describedby` and `aria-invalid`.
 */
export function FormField({
  label,
  optional,
  hint,
  error,
  children,
}: {
  label: string;
  /** The "optional" tag text, for fields that may stay empty. */
  optional?: string;
  hint?: string;
  error?: string | null;
  children: (control: {
    id: string;
    "aria-invalid": true | undefined;
    "aria-describedby": string | undefined;
  }) => ReactNode;
}) {
  const id = useId();
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");

  return (
    <div className="min-w-0 space-y-1.5">
      <Label htmlFor={id} className="flex flex-wrap items-baseline gap-x-1.5">
        {label}

        {optional && <span className="text-xs font-normal text-text-subtle">{optional}</span>}
      </Label>

      {hint && (
        <p id={`${id}-hint`} className="text-xs text-text-subtle">
          {hint}
        </p>
      )}

      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy || undefined,
      })}

      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
