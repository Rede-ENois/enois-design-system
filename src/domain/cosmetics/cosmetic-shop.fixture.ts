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
      available: collection.id === "essenciais" || IN_SEASON.has(collection.id),
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
  // Original frames: outside every collection, so they are always on sale and the ready-made
  // Essenciais looks can pair them with the permanent pieces.
  ...[
    ["moldura-ambar", "Âmbar", "Um anel dourado.", "2"],
    ["moldura-violeta", "Moldura Violeta", "O roxo da marca, no seu rosto.", "5"],
    [
      "moldura-trepadeira",
      "Trepadeira",
      "Vinhas que brotam folhas e abrem uma flor no topo.",
      "10",
    ],
    ["moldura-solar", "Solar", "Um brilho quente e vivo.", "5"],
    ["moldura-coral", "Moldura Coral", "Um aro coral para o seu retrato.", "2"],
    ["moldura-esmeralda", "Moldura Esmeralda", "Verde de vitrine.", "2"],
    [
      "moldura-vaga-lumes",
      "Vaga-lumes",
      "Capim ao pé do retrato e vaga-lumes voando em volta.",
      "10",
    ],
    ["moldura-glacial", "Glacial", "Cristais de gelo que cintilam no frio.", "10"],
    ["moldura-nebulosa", "Nebulosa", "Nuvens cósmicas e estrelas envolvendo o seu avatar.", "10"],
  ].map(([id, name, description, priceLabel]): CosmeticShopItem => ({
    id,
    kind: "FRAME",
    collection: null,
    name,
    description,
    priceLabel,
    available: true,
    purchasable: true,
  })),
  ...[
    ["garden-cerrado", "Jardim do Cerrado", "Ipê amarelo, canela-de-ema e buriti."],
    ["garden-mata-atlantica", "Jardim da Mata Atlântica", "Palmeira juçara, bromélias e pitanga."],
    ["garden-caatinga", "Jardim da Caatinga", "Mandacaru em flor, xique-xique e umbu."],
    ["garden-pampa", "Jardim do Pampa", "Corticeira, macela no campo e butiá."],
  ].map(([id, name, description]): CosmeticShopItem => ({
    id,
    kind: "GARDEN",
    collection: null,
    name,
    description,
    priceLabel: "4",
    available: true,
    purchasable: true,
  })),
];

export const SHOP_COLLECTIONS: CosmeticShopCollection[] = CATALOG_COLLECTIONS.map(
  (collection): CosmeticShopCollection => ({
    id: collection.id,
    name: collection.name,
    available: collection.id === "essenciais" || IN_SEASON.has(collection.id),
    looks: CATALOG_LOOKS.filter((look) => look.collection === collection.id).map((look) => ({
      // A collection may hold several looks, so the id comes from the look, never from the collection.
      id: look.id,
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
