import { useId } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { RecruiterModeSwitchProps } from "../../types/domain/profile/recruiter-mode-switch-props.js";
import { Label } from "../../ui/label.js";
import { Switch } from "../../ui/switch.js";

/**
 * "Sou recrutador" standing on its own, outside the edit-profile dialog: the declaration opens
 * the recruitment hub and the talent bank, so it has to be switchable right where those live.
 */
export function RecruiterModeSwitch({ value, onChange, pending }: RecruiterModeSwitchProps) {
  const messages = useMessages().recruiterMode;
  const id = useId();

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 space-y-1">
        <Label htmlFor={id}>{messages.label}</Label>

        <p id={`${id}-hint`} className="text-xs leading-relaxed text-text-subtle">
          {messages.hint}
        </p>
      </div>

      <Switch
        id={id}
        checked={value}
        disabled={pending}
        aria-busy={pending || undefined}
        aria-describedby={`${id}-hint`}
        onCheckedChange={onChange}
        className="mt-0.5"
      />
    </div>
  );
}
