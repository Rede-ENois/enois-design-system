import type { CSSProperties } from "react";

import type { FramePoint } from "../../../types/domain/avatar/frame-point.js";
import { round } from "../avatar-frames.js";

/**
 * CSS variables (--x0, --y0, --r0...) for a flight through `points`: each stop banks toward
 * where the bat is heading. A `loop` flight comes back to its first point.
 */
export function batFlight(points: readonly FramePoint[], loop = false): CSSProperties {
  const last = points.length - 1;
  return Object.fromEntries(
    points.flatMap(([x, y], i) => {
      const prev = points[i > 0 ? i - 1 : loop ? last : 0];
      const next = points[i < last ? i + 1 : loop ? 0 : last];
      const bank = Math.max(-25, Math.min(25, (next[0] - prev[0]) * 0.9));
      return [
        [`--x${i}`, `${x}px`],
        [`--y${i}`, `${y}px`],
        [`--r${i}`, `${round(bank)}deg`],
      ];
    }),
  ) as CSSProperties;
}
