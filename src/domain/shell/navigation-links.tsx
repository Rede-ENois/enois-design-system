import { Star } from "lucide-react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { NavigationLinksProps } from "../../types/domain/shell/navigation-links-props.js";
import { AppLink } from "../../ui/app-link.js";

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
    <nav
      data-collapsed={collapsed}
      className={cn("group/navigation flex flex-col gap-1", className)}
    >
      {header && <div className="mb-2">{header}</div>}

      {items.map((item) => {
        const Icon = item.icon;

        return (
          <AppLink
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              // py-3 no toque (gaveta do celular); no desktop o menu inteiro precisa caber sem rolar.
              "flex items-center gap-3 rounded-xl border-l-2 px-3 py-3 text-sm font-normal transition lg:py-2",
              "group-data-[collapsed=true]/navigation:justify-center group-data-[collapsed=true]/navigation:gap-0 group-data-[collapsed=true]/navigation:px-0",
              item.active
                ? "border-primary bg-surface-2 text-primary"
                : "border-transparent text-text-subtle hover:bg-surface-3 hover:text-text-strong",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5 shrink-0 transition-colors lg:h-4 lg:w-4",
                item.active && "text-primary",
              )}
            />

            <span className="whitespace-nowrap transition-all duration-300 group-data-[collapsed=true]/navigation:w-0 group-data-[collapsed=true]/navigation:overflow-hidden group-data-[collapsed=true]/navigation:opacity-0">
              {item.label}
            </span>
          </AppLink>
        );
      })}

      {!collapsed && myCommunities.length > 0 && (
        <div className="mt-1 space-y-0.5">
          <p className="px-3 text-xs font-medium uppercase tracking-wider text-text-subtle">
            {messages.myCommunities}
          </p>

          {myCommunities.map((community) => (
            <AppLink
              key={community.id}
              href={community.href}
              onClick={onNavigate}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-normal text-text-subtle transition hover:bg-surface-3 hover:text-text-strong"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />

              <span className="truncate">{community.name}</span>
            </AppLink>
          ))}
        </div>
      )}

      {!collapsed && favoriteCommunities.length > 0 && (
        <div className="mt-1 space-y-0.5">
          <p className="px-3 text-xs font-medium uppercase tracking-wider text-text-subtle">
            {messages.favoriteCommunities}
          </p>

          {favoriteCommunities.map((community) => (
            <AppLink
              key={community.id}
              href={community.href}
              onClick={onNavigate}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-normal text-text-subtle transition hover:bg-surface-3 hover:text-text-strong"
            >
              <Star className="h-3.5 w-3.5 shrink-0 text-primary" />

              <span className="truncate">{community.name}</span>
            </AppLink>
          ))}
        </div>
      )}
    </nav>
  );
}
