import { useId } from "react";

import { useMessages } from "../../messages/messages-context.js";
import type { ProfileCityPrivacyProps } from "../../types/domain/profile/profile-city-privacy-props.js";
import { Label } from "../../ui/label.js";
import { Switch } from "../../ui/switch.js";

/** Whether the city shows on the public profile. The city itself is set by `CityStateField`. */
export function ProfileCityPrivacy({ value, onChange, pending }: ProfileCityPrivacyProps) {
  const messages = useMessages().profileCityPrivacy;
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
