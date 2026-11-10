import { useState } from "react";

import { useAdapters } from "../adapters/adapters-context.js";
import { cn } from "../lib/utils.js";
import type { CommunityMarkProps } from "../types/components/ui/community-mark-props.js";

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
} as const;

function initials(name: string) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 2 || /^[A-Z]/.test(word));
  const picked = (words.length > 1 ? [words[0], words[1]] : [name]).map((word) => word[0]);
  return picked.join("").toUpperCase().slice(0, 2);
}

/**
 * A community is a "table": a squircle in the community's color. People are circles, so the
 * shape alone tells a person from a place.
 */
const TABLE_COLORS = 6;

/** The same seed always lands on the same table color. */
function tableColor(seed: string) {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return `var(--table-${(Math.abs(hash) % TABLE_COLORS) + 1})`;
}

export function CommunityMark({
  name,
  avatar,
  color,
  seed,
  size = "sm",
  className,
}: CommunityMarkProps) {
  const { resolveMediaUrl } = useAdapters();
  const [failedSrc, setFailedSrc] = useState<string | null | undefined>(null);
  const resolved = resolveMediaUrl(avatar);
  const showImage = Boolean(resolved && failedSrc !== resolved);

  return (
    <span
      // ponytail: always decorative, the name is always in the text of the same row (the menu label, the
      // notification title); add a label prop if a mark ever stands alone.
      aria-hidden
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden rounded-[34%] font-extrabold text-white select-none",
        SIZES[size],
        className,
      )}
      style={{ background: color || (seed ? tableColor(seed) : "var(--color-primary)") }}
    >
      {showImage ? (
        <img
          src={resolved}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailedSrc(resolved)}
        />
      ) : (
        initials(name)
      )}
    </span>
  );
}
