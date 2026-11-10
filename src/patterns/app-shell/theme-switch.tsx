import { Moon, Sun } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ThemeName } from "../../types/patterns/theme-name.js";
import type { ThemeSwitchProps } from "../../types/patterns/theme-switch-props.js";

const OPTIONS: { value: ThemeName; icon: typeof Sun }[] = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
];

/** Light / dark as a small segmented control, for a menu row (the header no longer carries it). */
export function ThemeSwitch({ theme, onChange }: ThemeSwitchProps) {
  const messages = useMessages().themeSwitch;

  return (
    <div
      role="radiogroup"
      aria-label={messages.label}
      className="flex gap-0.5 rounded-full bg-surface-2 p-0.5"
    >
      {OPTIONS.map(({ value, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={messages[value]}
          title={messages[value]}
          onClick={() => onChange(value)}
          className={cn(
            "grid h-8 w-9 place-items-center rounded-full transition",
            theme === value
              ? "bg-primary-soft text-primary"
              : "text-text-subtle hover:text-text-strong",
          )}
        >
          <Icon aria-hidden className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
