import type { ProfileGamificationData } from "./profile-gamification-data.js";
import type { ProfileGardenData } from "./profile-garden-data.js";
import type { ProfileGardenStyle } from "./profile-garden-style.js";

export type ProfileGamificationPanelProps = {
  profile: ProfileGamificationData;
  isOwner: boolean;
  postsCount: number;
  /** Saldo já formatado; `null` enquanto a carteira carrega. */
  walletBalance: string | null;
  walletHref: string;
  /** Garden drawn next to the reputation; absent or `null` keeps the plain progress bar. */
  garden?: ProfileGardenData | null;
  gardenStyle?: ProfileGardenStyle;
};
