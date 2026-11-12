import type { ProfileEffectMotion } from "./profile-effect-motion.js";

export type ProfileEffectSpec = {
  /** Icon of the effect in the shop and in the card's ambient sparkles. */
  icon: string;
  motion: ProfileEffectMotion;
  /** Icons of the particles, used in turn. */
  icons: readonly string[];
  /** Raster sprites (Kenney CC0) used in turn instead of the icons. */
  sprites?: readonly string[];
  /** Fill of each sprite, in the same order; white when absent. */
  tints?: readonly string[];
  count: number;
  /** Particle size in px. */
  size: number;
  /** Falling particles fade out before reaching the bottom. */
  melt?: boolean;
  /** Crossing particles spin twice while they cross. */
  spin?: boolean;
  /** Delay between crossing particles, in ms. */
  gap?: number;
};
