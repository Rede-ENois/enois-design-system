import { ArrowRight, Briefcase, UsersRound } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ContextSwitcherProps } from "../../types/domain/shell/context-switcher-props.js";
import type { InterfaceContext } from "../../types/domain/shell/interface-context.js";
import { AppLink } from "../../ui/app-link.js";

const OPTIONS: { value: InterfaceContext; icon: typeof UsersRound }[] = [
  { value: "SOCIAL", icon: UsersRound },
  { value: "PROFESSIONAL", icon: Briefcase },
];

/**
 * Social / Profissional: the two interfaces of the same account. It sits on top of the main
 * navigation (sidebar and mobile drawer), so switching is always one tap away.
 */
export function ContextSwitcher({
  value,
  onChange,
  collapsed = false,
  professionalSetupHref,
  onNavigate,
  className,
}: ContextSwitcherProps) {
  const messages = useMessages().contextSwitcher;
  const labelOf = (context: InterfaceContext) =>
    context === "SOCIAL" ? messages.social : messages.professional;

  if (collapsed) {
    const next: InterfaceContext = value === "SOCIAL" ? "PROFESSIONAL" : "SOCIAL";
    const Current = value === "SOCIAL" ? UsersRound : Briefcase;
    const switchLabel = next === "SOCIAL" ? messages.switchToSocial : messages.switchToProfessional;
    return (
      <button
        type="button"
        onClick={() => onChange(next)}
        title={switchLabel}
        aria-label={`${labelOf(value)}. ${switchLabel}`}
        data-context={value.toLowerCase()}
        className={cn(
          "mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-border-soft bg-surface-2 text-primary transition hover:bg-surface-3",
          className,
        )}
      >
        <Current className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className={cn("space-y-2", className)} data-context={value.toLowerCase()}>
      <div
        role="group"
        aria-label={messages.label}
        className="grid grid-cols-2 gap-1 rounded-2xl border border-border-soft bg-surface-2 p-1"
      >
        {OPTIONS.map(({ value: option, icon: Icon }) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                if (!selected) onChange(option);
              }}
              className={cn(
                "flex min-w-0 items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-sm transition lg:py-2 lg:text-[13px]",
                selected
                  ? "bg-surface-card font-medium text-text-strong shadow-card"
                  : "text-text-subtle hover:text-text-strong",
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", selected && "text-primary")} />

              <span className="truncate">{labelOf(option)}</span>
            </button>
          );
        })}
      </div>

      <p className="px-1 text-xs text-text-subtle">
        {value === "SOCIAL" ? messages.socialHint : messages.professionalHint}
      </p>

      {value === "PROFESSIONAL" && professionalSetupHref && (
        <AppLink
          href={professionalSetupHref}
          onClick={onNavigate}
          className="flex items-center justify-between gap-2 rounded-xl border border-dashed border-border-soft px-3 py-2 text-xs font-medium text-primary transition hover:bg-surface-3"
        >
          <span className="min-w-0">{messages.setupProfessional}</span>

          <ArrowRight className="h-3.5 w-3.5 shrink-0" />
        </AppLink>
      )}
    </div>
  );
}
