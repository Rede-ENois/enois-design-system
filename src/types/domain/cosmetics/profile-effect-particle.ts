/** One particle of a profile effect run: what it draws and how the Web Animations API moves it. */
export type ProfileEffectParticle = {
  /** Cosmetic icon key; absent for the plain dots of the snake and for raster sprites. */
  icon?: string;
  /** Raster sprite URL, drawn as a mask and filled with `color`. */
  sprite?: string;
  color?: string;
  size: number;
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
};
