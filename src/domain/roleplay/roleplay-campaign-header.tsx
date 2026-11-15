import { Loader2, Users } from "lucide-react";

import { useMessages } from "../../messages/messages-context.js";
import type { RoleplayCampaignHeaderProps } from "../../types/domain/roleplay/roleplay-campaign-header-props.js";
import { Button } from "../../ui/button.js";
import { Pill } from "../../ui/pill.js";

import { RoleplaySystemFamilyLabel } from "./roleplay-system-family-label.js";

/** The campaign header: what the table plays, who is in, and the join action for a visitor. */
export function RoleplayCampaignHeader({
  campaign: c,
  systemLabel,
  canJoin = false,
  joining = false,
  onJoin,
}: RoleplayCampaignHeaderProps) {
  const messages = useMessages().roleplay;
  const role =
    c.viewerRole === "GAME_MASTER"
      ? messages.roleMaster
      : c.viewerRole === "PLAYER"
        ? messages.rolePlayer
        : messages.visitor;

  return (
    <section className="surface-card space-y-4 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <h1 className="min-w-0 break-words text-xl font-semibold text-text-strong">{c.name}</h1>

          {c.description && (
            <p className="max-w-prose text-sm text-muted-foreground">{c.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs text-text-date">
            <Pill size="sm">{systemLabel}</Pill>

            <Pill size="sm">
              <RoleplaySystemFamilyLabel family={c.systemFamily} />
            </Pill>

            <span>{messages.members(c.members)}</span>

            <span>{role}</span>

            {c.status === "ARCHIVED" && <Pill size="sm">{messages.archived}</Pill>}
          </div>
        </div>

        {canJoin && onJoin && (
          <Button className="w-auto rounded-full" disabled={joining} onClick={onJoin}>
            {joining && <Loader2 className="animate-spin" aria-hidden />}
            <Users aria-hidden />
            {joining ? messages.joining : messages.join}
          </Button>
        )}
      </div>

      {c.status === "ARCHIVED" && (
        <p className="border-t border-border-soft pt-3 text-sm text-text-subtle">
          {messages.archived}
        </p>
      )}
    </section>
  );
}
