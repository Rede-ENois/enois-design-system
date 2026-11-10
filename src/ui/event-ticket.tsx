import { cn } from "../lib/utils.js";
import type { EventTicketProps } from "../types/components/ui/event-ticket-props.js";

/** Two side notches cut out of the ticket: the shape that means "event". */
const NOTCHES =
  "radial-gradient(circle 6px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 6px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat";

export function EventTicket({
  day,
  month,
  tone = "today",
  size = "md",
  className,
}: EventTicketProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 flex-col items-center justify-center font-extrabold",
        size === "md" ? "h-12 w-12 rounded-[10px]" : "h-9 w-9 rounded-lg",
        tone === "today"
          ? "bg-signal-today text-signal-today-foreground"
          : "bg-primary text-primary-foreground",
        className,
      )}
      style={{ mask: NOTCHES, WebkitMask: NOTCHES }}
    >
      <span className={cn("leading-none", size === "md" ? "text-lg" : "text-sm")}>{day}</span>
      {month && size === "md" && (
        <span className="mt-0.5 text-[10px] tracking-[0.06em]">{month}</span>
      )}
    </span>
  );
}
