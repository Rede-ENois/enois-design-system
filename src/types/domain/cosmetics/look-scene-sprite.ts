/**
 * A Kenney (CC0) sprite in a look's scene, placed in the card's 100×100 box and tinted with
 * `color`. The sprite is a white silhouette, so it becomes an SVG mask and the fill comes from a
 * rect underneath.
 */
export type LookSceneSprite = {
  src: string;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity?: number;
};
