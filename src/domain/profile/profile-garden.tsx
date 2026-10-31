import { useEffect, useRef } from "react";

import { cn } from "../../lib/utils.js";
import { useMessages } from "../../messages/messages-context.js";
import type { ProfileGardenData } from "../../types/domain/profile/profile-garden-data.js";
import type { ProfileGardenProps } from "../../types/domain/profile/profile-garden-props.js";
import { motionAllowed } from "../cosmetics/motion-allowed.js";

import { ProfileGardenArt } from "./profile-garden-art.js";
import { PROFILE_GARDEN_STYLES } from "./profile-garden-styles.js";

/** Parts in hint priority: on a tie, the ones the owner acts on come before time on the network. */
const PARTS = ["relations", "contribution", "trajectory", "tenure"] as const;
const SATURATION = ["saturate(0.45)", "saturate(0.72)", undefined];

const clamp = (value: number, max: number): number =>
  Number.isFinite(value) ? Math.min(max, Math.max(0, Math.round(value))) : 0;

/** The part that grows next (lowest stage), or `null` when every part is at its peak. */
function weakestGardenPart(
  garden: Omit<ProfileGardenData, "health">,
): (typeof PARTS)[number] | null {
  const part = PARTS.reduce((low, key) =>
    clamp(garden[key], 3) < clamp(garden[low], 3) ? key : low,
  );
  return clamp(garden[part], 3) === 3 ? null : part;
}

/**
 * The profile garden: reputation drawn as a small static garden (tree, flowers, raised bed,
 * grass) in the biome of the equipped GARDEN item. Health only softens the colors; nothing ever
 * dries or dies. Plays one short grow-in on mount when decorative motion is allowed.
 */
export function ProfileGarden({
  garden,
  style = "quintal",
  isOwner = false,
  className,
}: ProfileGardenProps) {
  const messages = useMessages().profileGarden;
  const artRef = useRef<SVGSVGElement>(null);
  const stages = {
    trajectory: clamp(garden.trajectory, 3),
    relations: clamp(garden.relations, 3),
    contribution: clamp(garden.contribution, 3),
    tenure: clamp(garden.tenure, 3),
  };
  const health = clamp(garden.health, 2);
  const palette = PROFILE_GARDEN_STYLES[style] ?? PROFILE_GARDEN_STYLES.quintal;
  const parts = [
    messages.stages.trajectory[stages.trajectory],
    messages.stages.relations[stages.relations],
    messages.stages.contribution[stages.contribution],
    messages.stages.tenure[stages.tenure],
    ...(health < 2 ? [messages.health[health]] : []),
  ];
  const label = messages.label(messages.style[style] ?? messages.style.quintal, parts);
  const weakest = weakestGardenPart(stages);

  useEffect(() => {
    const art = artRef.current;
    if (!art?.animate || !motionAllowed()) return;
    // Starts from an already visible garden, so a server-rendered one only settles in place.
    const growIn = art.animate(
      [
        { transform: "scale(0.94)", opacity: 0.6 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
    return () => growIn.cancel();
  }, []);

  return (
    <div className={cn("profile-garden", className)}>
      <svg
        ref={artRef}
        viewBox="0 12 240 112"
        role="img"
        aria-label={label}
        className="profile-garden__art"
        style={{ filter: SATURATION[health] }}
      >
        <ProfileGardenArt garden={stages} palette={palette} />
      </svg>
      {isOwner && <p className="profile-garden__hint">{messages.hint[weakest ?? "complete"]}</p>}
    </div>
  );
}
