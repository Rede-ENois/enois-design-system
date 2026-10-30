import { ArrowRight, Briefcase } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { ProfessionalSignatureProps } from "../../types/domain/jobs/professional-signature-props.js";
import { AppLink } from "../../ui/app-link.js";

/**
 * Who sends a work action (application, proposal): always the professional identity. With it, a
 * quiet line says so; without it, the way to create or activate it.
 */
export function ProfessionalSignature({ identity, setupHref }: ProfessionalSignatureProps) {
  const messages = useMessages().professionalSignature;

  if (identity) {
    return (
      <p className="flex min-w-0 items-center gap-2 rounded-xl bg-surface-2 px-3 py-2 text-xs text-text-subtle">
        <Briefcase className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />

        <span className="min-w-0 truncate">
          {messages.sendingAs} <span className="font-medium text-text-strong">{identity.name}</span>
          {" · @"}
          {identity.username}
        </span>
      </p>
    );
  }

  if (!setupHref) return null;

  return (
    <div className="space-y-2 rounded-xl border border-dashed border-border-soft px-4 py-3">
      <p className="text-sm text-text-strong">{messages.needsProfile}</p>

      <AppLink
        href={setupHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        {messages.setup}

        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </AppLink>
    </div>
  );
}
