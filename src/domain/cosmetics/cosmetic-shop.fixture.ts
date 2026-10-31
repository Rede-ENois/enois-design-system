import type { CosmeticKind } from "../../types/domain/cosmetics/cosmetic-kind.js";
import type { CosmeticShopCollection } from "../../types/domain/cosmetics/cosmetic-shop-collection.js";
import type { CosmeticShopItem } from "../../types/domain/cosmetics/cosmetic-shop-item.js";

import { CATALOG_COLLECTIONS, CATALOG_LOOKS, CATALOG_REWARDS } from "./cosmetic-catalog.fixture.js";

/** Test and story fixture: the seasonal catalog shaped as the shop receives it from the app. */

const KINDS: Record<string, CosmeticKind> = {
  frame: "FRAME",
  badge: "BADGE",
  name: "NAME_STYLE",
  plate: "NAMEPLATE",
  banner: "BANNER",
  theme: "CARD_THEME",
  effect: "PROFILE_EFFECT",
};

const IN_SEASON = new Set(["saci", "halloween"]);
const FRAME_PRICE = 5;

const rewardCollection = (id: string): string => (id.includes("halloween") ? "halloween" : "saci");

export const SHOP_ITEMS: CosmeticShopItem[] = [
  ...CATALOG_COLLECTIONS.flatMap((collection) =>
    collection.items.map((item): CosmeticShopItem => ({
      id: item.id,
      kind: KINDS[item.kind],
      collection: collection.id,
      name: item.name,
      description: item.description,
      priceLabel: String("priceFaiscas" in item ? item.priceFaiscas : FRAME_PRICE),
      available: IN_SEASON.has(collection.id),
      purchasable: true,
    })),
  ),
  ...CATALOG_REWARDS.filter((reward) => /saci|halloween/.test(reward.id)).map(
    (reward): CosmeticShopItem => ({
      id: reward.id,
      kind: KINDS[reward.kind],
      collection: rewardCollection(reward.id),
      name: reward.name,
      description: "Prêmio de evento.",
      priceLabel: "0",
      available: true,
      purchasable: false,
    }),
  ),
  {
    id: "moldura-ambar",
    kind: "FRAME",
    collection: null,
    name: "Âmbar",
    description: "Um anel dourado.",
    priceLabel: "2",
    available: true,
    purchasable: true,
  },
  ...[
    ["garden-cerrado", "Jardim do cerrado", "Ipê amarelo, canela-de-ema e buriti."],
    ["garden-mata-atlantica", "Jardim da mata atlântica", "Palmeira juçara, bromélias e pitanga."],
    ["garden-caatinga", "Jardim da caatinga", "Mandacaru em flor, xique-xique e umbu."],
    ["garden-pampa", "Jardim do pampa", "Corticeira, macela no campo e butiá."],
  ].map(([id, name, description]): CosmeticShopItem => ({
    id,
    kind: "GARDEN",
    collection: null,
    name,
    description,
    priceLabel: "6",
    available: true,
    purchasable: true,
  })),
];

export const SHOP_COLLECTIONS: CosmeticShopCollection[] = CATALOG_COLLECTIONS.map(
  (collection): CosmeticShopCollection => ({
    id: collection.id,
    name: collection.name,
    available: IN_SEASON.has(collection.id),
    looks: CATALOG_LOOKS.filter((look) => look.collection === collection.id).map((look) => ({
      id: `look-${look.collection}`,
      title: look.title,
      items: [
        look.theme,
        look.frame,
        look.nameStyle,
        look.effect,
        look.banner,
        look.plate,
        ...look.badges,
      ].filter((id): id is string => Boolean(id)),
      statusIcon: look.statusIcon,
      statusText: look.statusText,
      priceLabel: "23",
    })),
  }),
);
