import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { MobileDockItem } from "../../types/patterns/mobile-dock-item.js";
import type { MobileDockProps } from "../../types/patterns/mobile-dock-props.js";
import { AppLink } from "../../ui/app-link.js";
import { Signal } from "../../ui/signal.js";

function DockLink({ item }: { item: MobileDockItem }) {
  const Icon = item.icon;

  return (
    <AppLink
      href={item.href}
      aria-current={item.active ? "page" : undefined}
      className={cn(
        "flex min-w-0 flex-col items-center gap-0.5 py-1 text-[11px] font-semibold transition",
        item.active ? "text-text-strong" : "text-text-date hover:text-text-strong",
      )}
    >
      <span
        className={cn(
          "relative grid h-7 w-7 place-items-center transition",
          item.active && "text-primary",
        )}
      >
        <Icon className="h-[22px] w-[22px]" />
        {item.signal && (
          <Signal
            signal={item.signal.kind === "today" ? { kind: "new" } : item.signal}
            onIcon
            className={cn(
              "absolute",
              item.signal.kind === "new" || item.signal.kind === "today"
                ? "-right-1 -top-0.5"
                : "-right-2.5 -top-1.5",
            )}
          />
        )}
      </span>

      <span className="max-w-full truncate">{item.label}</span>
    </AppLink>
  );
}

/**
 * Flat bottom navigation bar (X-style): flush at the bottom edge, full width, subtle top
 * border. The publish action sits inline with the navigation instead of floating above it.
 * Hidden from `lg` up, where the side rail takes over.
 */
export function MobileDock({ items, action }: MobileDockProps) {
  const messages = useMessages().mobileDock;
  const ActionIcon = action.icon;
  const left = items.slice(0, 2);
  const right = items.slice(2, 4);

  return (
    <nav
      aria-label={messages.label}
      className="fixed inset-x-0 bottom-0 z-40 grid h-[3.5rem] grid-cols-5 items-center border-t border-border-soft bg-surface-card/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {left.map((item) => (
        <DockLink key={item.href} item={item} />
      ))}

      <button
        type="button"
        onClick={action.onClick}
        aria-label={action.label}
        title={action.label}
        className="grid h-9 w-9 place-items-center justify-self-center rounded-full bg-primary text-primary-foreground transition active:scale-95"
      >
        <ActionIcon className="h-5 w-5" />
      </button>

      {right.map((item) => (
        <DockLink key={item.href} item={item} />
      ))}
    </nav>
  );
}
