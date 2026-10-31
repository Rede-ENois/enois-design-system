import type { ProfileGardenData } from "./profile-garden-data.js";
import type { ProfileGardenStyle } from "./profile-garden-style.js";

export type ProfileGardenProps = {
  garden: ProfileGardenData;
  /** Defaults to `quintal`. Map an equipped GARDEN item with `gardenStyleOf`. */
  style?: ProfileGardenStyle;
  /** Shows the owner a short hint about the part that grows next. Never shown to visitors. */
  isOwner?: boolean;
  className?: string;
};
