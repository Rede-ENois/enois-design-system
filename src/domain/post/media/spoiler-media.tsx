import { useEffect, useState } from "react";

import { Eye } from "lucide-react";

import { cn } from "../../../lib/utils.js";
import { useSpoilerPreference } from "../../../media/spoiler-preference.js";
import type { SpoilerMediaProps } from "../../../types/domain/post/spoiler-media-props.js";

export function SpoilerMedia({ active = false, label, children }: SpoilerMediaProps) {
  // Preferência de quem lê: "sempre revelar" faz o véu nem existir para esta mídia.
  const prefereRevelar = useSpoilerPreference();
  const [revealed, setRevealed] = useState(!active || prefereRevelar);

  useEffect(() => {
    setRevealed(!active || prefereRevelar);
  }, [active, prefereRevelar]);

  if (!active || prefereRevelar) return children(true);

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        aria-hidden={!revealed}
        className={cn(
          "transition duration-300",
          !revealed && "pointer-events-none select-none blur-2xl scale-[1.03]",
        )}
      >
        {children(revealed)}
      </div>
      {!revealed && (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-surface-0/55 px-4 text-sm font-medium text-text shadow-lg backdrop-blur-sm transition hover:bg-surface-0/45"
          aria-label={label}
        >
          <Eye className="size-4" aria-hidden="true" />
          {label}
        </button>
      )}
    </div>
  );
}
