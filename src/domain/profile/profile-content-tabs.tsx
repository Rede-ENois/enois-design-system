import { Lock } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ProfileContentTab } from "../../types/domain/profile/profile-content-tab.js";
import type { ProfileContentTabsProps } from "../../types/domain/profile/profile-content-tabs-props.js";

const TABS: ProfileContentTab[] = ["ALL", "POSTS", "REPLIES", "REPOSTS", "MEDIA"];

export function ProfileContentTabs({ activeTab, onTabChange, isOwner }: ProfileContentTabsProps) {
  const messages = useMessages().profileContentTabs;

  const labels: Record<ProfileContentTab, string> = {
    ALL: messages.all,
    POSTS: messages.posts,
    REPLIES: messages.replies,
    REPOSTS: messages.reposts,
    MEDIA: messages.media,
  };

  return (
    <nav role="tablist" className="flex border-b border-border">
      {TABS.map((tab) => {
        const locked = tab === "REPLIES" && !isOwner;
        const active = tab === activeTab;

        return (
          <button
            key={tab}
            role="tab"
            type="button"
            aria-selected={active}
            aria-disabled={locked || undefined}
            disabled={locked}
            title={locked ? messages.repliesLocked : undefined}
            onClick={() => onTabChange(tab)}
            className={cn(
              "relative flex min-w-0 flex-1 items-center justify-center gap-1 px-2 py-3 text-sm font-medium transition-colors",
              "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40",
              active ? "text-primary-text" : "text-muted-foreground",
              locked && "cursor-not-allowed opacity-50",
            )}
          >
            <span className="truncate">{labels[tab]}</span>
            {locked && <Lock className="size-3.5 shrink-0" aria-hidden="true" />}
            {active && (
              <span
                className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-primary"
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
