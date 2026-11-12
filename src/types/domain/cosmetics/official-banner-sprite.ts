/** A raster sprite (Kenney CC0) placed in the banner's 300×100 box and tinted with `color`. */
export type OfficialBannerSprite = {
  src: string;
  x: number;
  y: number;
  size: number;
  color?: string;
  opacity?: number;
  /** Drawn in front of the ground instead of behind it. */
  front?: boolean;
};
