import { cn } from "../../lib/utils.js";
import type { OfficialBannerProps } from "../../types/domain/cosmetics/official-banner-props.js";
import { round, seededRandom } from "../avatar/avatar-frames.js";
import { keyed, place } from "../avatar/frames/seasonal/frame-kit.js";
import { useFxId } from "../avatar/frames/use-fx-id.js";

import { KenneyBannerSprite } from "./kenney-banner-sprite.js";
import { OFFICIAL_BANNERS } from "./official-banners.js";

const GROUND = "M0 84 C60 72 110 94 170 82 C220 72 260 88 300 80 V100 H0Z";

/** An official banner, drawn in SVG and covering its box (slice, like a cover photo). */
export function OfficialBanner({ banner, className }: OfficialBannerProps) {
  const id = useFxId();
  if (!Object.hasOwn(OFFICIAL_BANNERS, banner)) return null;
  const {
    sky,
    ground,
    icons,
    count = 9,
    seed = 3,
    y = [18, 64],
    scale = [0.9, 1.6],
    extra,
    sprites = [],
  } = OFFICIAL_BANNERS[banner];
  const rnd = seededRandom(seed);
  const scattered = Array.from({ length: count }, (_, i) =>
    place(
      icons[i % icons.length],
      16 + (i + rnd() * 0.6) * (268 / count),
      y[0] + rnd() * (y[1] - y[0]),
      round(scale[0] + rnd() * (scale[1] - scale[0])),
      (rnd() - 0.5) * 24,
    ),
  );
  return (
    <svg
      viewBox="0 0 300 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      className={cn("h-full w-full", className)}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>

      <rect width={300} height={100} fill={`url(#${id}-sky)`} />
      {extra}
      {sprites
        .filter((sprite) => !sprite.front)
        .map((sprite, i) => (
          <KenneyBannerSprite key={i} {...sprite} />
        ))}
      {ground && <path d={GROUND} fill={ground} />}
      {sprites
        .filter((sprite) => sprite.front)
        .map((sprite, i) => (
          <KenneyBannerSprite key={`front-${i}`} {...sprite} />
        ))}
      {keyed(scattered)}
    </svg>
  );
}
