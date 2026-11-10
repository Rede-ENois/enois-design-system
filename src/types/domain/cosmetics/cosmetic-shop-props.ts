import type { ReactNode } from "react";

import type { CosmeticShopCollection } from "./cosmetic-shop-collection.js";
import type { CosmeticShopItem } from "./cosmetic-shop-item.js";
import type { ProfileCardData } from "./profile-card-data.js";

export type CosmeticShopProps = {
  /** Whole catalog; `undefined` while loading or after an error. */
  items?: CosmeticShopItem[];
  collections?: CosmeticShopCollection[];
  /** Who is shopping: the preview card starts from what they wear today. */
  user: ProfileCardData;
  loading?: boolean;
  error?: boolean;
  onRetry: () => void;
  /** A purchase or equip is in flight: action buttons are disabled. */
  actionPending?: boolean;
  onBuy: (itemId: string) => void;
  onBuyLook: (lookId: string) => void;
  onEquip: (itemId: string) => void;
  onUnequip: (itemId: string) => void;
  /** Wear or take off a look that is already the viewer's: its card toggles like a switch. */
  onEquipLook?: (lookId: string) => void;
  onUnequipLook?: (lookId: string) => void;
  /** The look wear/take-off in flight: its card ignores clicks until the server answers. */
  lookPending?: string | null;
  /** Extra content under a collection heading (events such as the Saci × Halloween duel). */
  renderCollectionExtra?: (collectionId: string) => ReactNode;
  /** Collection tab opened first; defaults to the first collection in season. */
  initialCollection?: string | null;
};
