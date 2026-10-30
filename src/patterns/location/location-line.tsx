import { MapPin } from "lucide-react";

import { cn } from "../../lib/utils.js";
import type { LocationLineProps } from "../../types/patterns/location-line-props.js";

import { formatLocation } from "./city-state.js";

/** Quiet "Belo Horizonte, MG" line with a pin. Renders nothing when there is no location. */
export function LocationLine({ city, state, className }: LocationLineProps) {
  const label = formatLocation(city, state);
  if (!label) return null;

  return (
    <span
      className={cn("inline-flex min-w-0 items-center gap-1.5 text-xs text-text-subtle", className)}
    >
      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />

      <span className="truncate">{label}</span>
    </span>
  );
}
