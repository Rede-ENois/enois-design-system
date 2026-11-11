import type { ReactNode } from "react";

import type { OfficialBannerSprite } from "./official-banner-sprite.js";

/** A banner drawn in a 300×100 box: sky gradient, optional ground and scattered icons. */
export type OfficialBannerSpec = {
  sky: readonly [string, string];
  ground: string | null;
  icons: readonly string[];
  count?: number;
  seed?: number;
  /** Vertical range of the icons. */
  y?: readonly [number, number];
  /** Scale range of the icons. */
  scale?: readonly [number, number];
  /** Extra layer between the sky and the ground (the sea of a beach). */
  extra?: ReactNode;
  /** Raster sprites (Kenney CC0), behind the ground unless `front` is set. */
  sprites?: readonly OfficialBannerSprite[];
};
