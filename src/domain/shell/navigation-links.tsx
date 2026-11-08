import { Star } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { NavigationCommunityData } from "../../types/domain/shell/navigation-community-data.js";
import type { NavigationItemData } from "../../types/domain/shell/navigation-item-data.js";
import type { NavigationLinksProps } from "../../types/domain/shell/navigation-links-props.js";
import type { NavigationSection } from "../../types/domain/shell/navigation-section.js";
import { AppLink } from "../../ui/app-link.js";
import { CommunityMark } from "../../ui/community-mark.js";
import { Signal } from "../../ui/signal.js";

const SECTION_ORDER: NavigationSection[] = ["you", "community", "work", "explore"];

const ROW =
  "relative flex min-h-11 items-center gap-3.5 rounded-2xl px-3.5 text-[15px] font-semibold transition";
const COLLAPSED =
  "group-data-[collapsed=true]/navigation:justify-center group-data-[collapsed=true]/navigation:gap-0 group-data-[collapsed=true]/navigation:px-0";
const LABEL = "min-w-0 flex-1 truncate group-data-[collapsed=true]/navigation:sr-only";
const HEADING =
  "px-3.5 pb-1 pt-4 text-[13px] font-bold text-text-date group-data-[collapsed=true]/navigation:sr-only";

function NavigationRow({
  item,
  onNavigate,
  collapsed,
}: {
  item: NavigationItemData;
  onNavigate?: () => void;
  collapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <AppLink
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={item.active ? "page" : undefined}
      className={cn(
        ROW,
        COLLAPSED,
        item.active ? "bg-primary-soft text-text-strong" : "text-text-strong hover:bg-surface-2",
      )}
    >
      <span className="relative shrink-0">
        <Icon
          className={cn(
            "h-[21px] w-[21px] transition-colors",
            item.active ? "text-primary" : "text-text-subtle",
          )}
        />
        {/* Collapsed rail: the signal rides on the icon, since the label row is gone. */}
        {collapsed && item.signal && (
          <Signal
            signal={item.signal.kind === "today" ? { kind: "new" } : item.signal}
            onIcon
            className="absolute -right-2 -top-2"
          />
        )}
      </span>

      <span className={LABEL}>{item.label}</span>
      {!collapsed && item.signal && <Signal signal={item.signal} />}
    </AppLink>
  );
}

function CommunityRow({
  community,
  favorite,
  onNavigate,
}: {
  community: NavigationCommunityData;
  favorite: boolean;
  onNavigate?: () => void;
}) {
  return (
    <AppLink
      href={community.href}
      onClick={onNavigate}
      className={cn(ROW, "text-text-strong hover:bg-surface-2")}
    >
      <CommunityMark
        name={community.name}
        avatar={community.avatar}
        color={community.color}
        seed={community.id}
        size="xs"
      />

      <span className="min-w-0 flex-1 truncate">{community.name}</span>
      {favorite && <Star aria-hidden className="h-3.5 w-3.5 shrink-0 text-primary" />}
      {community.hasNews && <Signal signal={{ kind: "new" }} />}
    </AppLink>
  );
}

/**
 * The main menu (desktop rail and mobile drawer): entries grouped by section, each with the signal
 * of what is new there, then the person's communities as their colored tables.
 */
export function NavigationLinks({
  items,
  myCommunities,
  favoriteCommunities,
  collapsed = false,
  onNavigate,
  className,
  header,
}: NavigationLinksProps) {
  const messages = useMessages().navigationLinks;

  return (
    <nav data-collapsed={collapsed} className={cn("group/navigation flex flex-col", className)}>
      {header && <div className="mb-2">{header}</div>}

      {SECTION_ORDER.map((section) => {
        const sectionItems = items.filter((item) => (item.section ?? "you") === section);
        if (sectionItems.length === 0) return null;

        return (
          <div
            key={section}
            className={cn("flex flex-col gap-0.5", section === "explore" && "mt-3")}
          >
            {/* "explore" is one door to the hub: a heading would just repeat the item's name. */}
            {(section === "community" || section === "work") && (
              <p className={HEADING}>{messages.sections[section]}</p>
            )}
            {sectionItems.map((item) => (
              <NavigationRow
                key={item.href}
                item={item}
                onNavigate={onNavigate}
                collapsed={collapsed}
              />
            ))}
          </div>
        );
      })}

      {!collapsed && favoriteCommunities.length > 0 && (
        <div className="flex flex-col gap-0.5">
          <p className={HEADING}>{messages.favoriteCommunities}</p>
          {favoriteCommunities.map((community) => (
            <CommunityRow
              key={community.id}
              community={community}
              favorite
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

      {!collapsed && myCommunities.length > 0 && (
        <div className="flex flex-col gap-0.5">
          <p className={HEADING}>{messages.myCommunities}</p>
          {myCommunities.map((community) => (
            <CommunityRow
              key={community.id}
              community={community}
              favorite={false}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </nav>
  );
}
