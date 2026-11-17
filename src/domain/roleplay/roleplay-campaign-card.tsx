import { ChevronRight, Dices } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { RoleplayCampaignData } from "../../types/domain/roleplay/roleplay-campaign-data.js";

/**
 * Uma campanha na lista (minhas, descoberta). O nome e o sistema entram em destaque: escolher
 * mesa é escolher sistema, e a família diz em uma palavra como aquela mesa joga.
 */
export function RoleplayCampaignCard({
  campaign: c,
  onOpen,
}: {
  campaign: RoleplayCampaignData;
  onOpen: (campaign: RoleplayCampaignData) => void;
}) {
  const messages = useMessages().roleplay;
  const role = c.viewerRole === "GAME_MASTER" ? messages.roleMaster : messages.rolePlayer;

  return (
    <li className="min-w-0">
      <button
        type="button"
        onClick={() => onOpen(c)}
        aria-label={messages.openCampaign(c.name)}
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl border border-border-soft bg-surface-card p-4 text-left transition-colors",
          "hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        )}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Dices aria-hidden className="h-5 w-5" />
        </span>

        <span className="min-w-0 flex-1 space-y-0.5">
          <span className="flex min-w-0 items-center gap-2">
            <span className="min-w-0 truncate text-sm font-semibold text-text-strong">
              {c.name}
            </span>

            {c.joined && (
              <span className="shrink-0 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">
                {role}
              </span>
            )}

            {c.status === "ARCHIVED" && (
              <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-text-subtle">
                {messages.archived}
              </span>
            )}
          </span>

          {c.description && (
            <span className="block truncate text-sm text-text-subtle">{c.description}</span>
          )}

          <span className="block text-xs text-text-date">
            {messages.systemFamilies[c.systemFamily] ?? c.systemFamily}
            <span aria-hidden> · </span>
            {messages.members(c.members)}
          </span>
        </span>

        <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-text-subtle" />
      </button>
    </li>
  );
}
