import type { CosmeticKind } from "../../types/domain/cosmetics/cosmetic-kind.js";
import type { CosmeticShopCollection } from "../../types/domain/cosmetics/cosmetic-shop-collection.js";
import type { CosmeticShopFilter } from "../../types/domain/cosmetics/cosmetic-shop-filter.js";
import type { CosmeticShopItem } from "../../types/domain/cosmetics/cosmetic-shop-item.js";
import type { CosmeticShopLook } from "../../types/domain/cosmetics/cosmetic-shop-look.js";
import type { CosmeticTryOn } from "../../types/domain/cosmetics/cosmetic-try-on.js";
import type { ProfileCardData } from "../../types/domain/cosmetics/profile-card-data.js";
import type { ProfileNameTheme } from "../../types/lib/theme/profile-name-theme.js";
import { MAX_BADGES } from "../badges/max-badges.js";

/** Kinds in the order of the shop chips (and of the slots of a look). */
export const COSMETIC_KINDS: readonly CosmeticKind[] = [
  "CARD_THEME",
  "FRAME",
  "BADGE",
  "NAME_STYLE",
  "NAMEPLATE",
  "BANNER",
  "PROFILE_EFFECT",
  "GARDEN",
];

export const EMPTY_TRY_ON: CosmeticTryOn = {
  items: {},
  badges: null,
  look: null,
  statusIcon: null,
  statusText: null,
};

const normalize = (text: string): string => text.toLocaleLowerCase("pt-BR");

/**
 * Items of the current view: with a search text, every collection (name, description and
 * collection name); without it, the collection tab (`null` = classic items). Both by kind.
 */
export function filterShopItems(
  items: readonly CosmeticShopItem[],
  collections: readonly CosmeticShopCollection[],
  { collection, kind, query }: CosmeticShopFilter,
): CosmeticShopItem[] {
  const ofKind = (item: CosmeticShopItem): boolean => kind === "ALL" || item.kind === kind;
  const text = normalize(query.trim());
  if (!text) {
    return items.filter((item): boolean => ofKind(item) && item.collection === collection);
  }
  const names = new Map(collections.map((c): [string, string] => [c.id, c.name]));
  return items.filter(
    (item): boolean =>
      ofKind(item) &&
      normalize(
        `${item.name} ${item.description} ${(item.collection && names.get(item.collection)) ?? ""}`,
      ).includes(text),
  );
}

/** How many items of each kind the view has (the chip counters). */
export function countByKind(
  items: readonly CosmeticShopItem[],
): Record<CosmeticKind | "ALL", number> {
  const counts = Object.fromEntries(
    ["ALL", ...COSMETIC_KINDS].map((kind): [string, number] => [kind, 0]),
  ) as Record<CosmeticKind | "ALL", number>;
  for (const item of items) {
    counts.ALL += 1;
    counts[item.kind] += 1;
  }
  return counts;
}

/** Tries an item on (or takes it off when it is already being tried). */
export function toggleTryItem(tryOn: CosmeticTryOn, item: CosmeticShopItem): CosmeticTryOn {
  const items = { ...tryOn.items };
  if (items[item.kind] === item.id) delete items[item.kind];
  else items[item.kind] = item.id;
  return {
    ...tryOn,
    items,
    look: null,
    badges: item.kind === "BADGE" ? null : tryOn.badges,
  };
}

/** Tries a whole look on: every slot, its badge list and its status. */
export function tryLook(
  look: CosmeticShopLook,
  itemsById: ReadonlyMap<string, CosmeticShopItem>,
): CosmeticTryOn {
  const items: CosmeticTryOn["items"] = {};
  const badges: string[] = [];
  for (const id of look.items) {
    const kind = itemsById.get(id)?.kind;
    if (kind === "BADGE") badges.push(id);
    else if (kind) items[kind] = id;
  }
  return {
    items,
    badges: badges.slice(0, MAX_BADGES),
    look: look.id,
    statusIcon: look.statusIcon ?? null,
    statusText: look.statusText ?? null,
  };
}

export function isTryingOn(tryOn: CosmeticTryOn): boolean {
  return tryOn.look !== null || tryOn.badges !== null || Object.keys(tryOn.items).length > 0;
}

/** The profile as it would look with the tried items, starting from what the user wears. */
export function previewProfile(user: ProfileCardData, tryOn: CosmeticTryOn): ProfileCardData {
  const { items } = tryOn;
  const current = (user.badges?.length ? user.badges : [user.badge]).filter(
    (badge): badge is string => Boolean(badge),
  );
  const tried = items.BADGE;
  const badges =
    tryOn.badges ??
    (tried
      ? [tried, ...current.filter((badge): boolean => badge !== tried)].slice(0, MAX_BADGES)
      : current);
  return {
    ...user,
    avatarFrame: items.FRAME ?? user.avatarFrame,
    nameStyle: items.NAME_STYLE
      ? // The id comes from the API; an id this client does not know paints as DEFAULT.
        { theme: items.NAME_STYLE as ProfileNameTheme }
      : user.nameStyle,
    nameplate: items.NAMEPLATE ?? user.nameplate,
    bannerItem: items.BANNER ?? user.bannerItem,
    cardTheme: items.CARD_THEME ?? user.cardTheme,
    profileEffect: items.PROFILE_EFFECT ?? user.profileEffect,
    badges,
    badge: null,
    statusText: tryOn.statusText ?? user.statusText,
    statusIcon: tryOn.statusText ? tryOn.statusIcon : user.statusIcon,
  };
}

/** Items of the look the user does not own yet. */
export function lookMissing(
  look: CosmeticShopLook,
  itemsById: ReadonlyMap<string, CosmeticShopItem>,
): string[] {
  return look.items.filter((id): boolean => !itemsById.get(id)?.owned);
}

/** The album page of a collection: its sellable pieces and how many the user owns. */
export function albumPage(
  items: readonly CosmeticShopItem[],
  collection: string,
): { pieces: CosmeticShopItem[]; got: number } {
  const pieces = items.filter(
    (item): boolean => item.collection === collection && item.purchasable,
  );
  return { pieces, got: pieces.filter((item): boolean => Boolean(item.owned)).length };
}

/** Collections whose every sellable piece is owned. */
export function completedCollections(
  items: readonly CosmeticShopItem[],
  collections: readonly CosmeticShopCollection[],
): number {
  return collections.filter((collection): boolean => {
    const { pieces, got } = albumPage(items, collection.id);
    return pieces.length > 0 && got === pieces.length;
  }).length;
}

/** The tab opened first: the requested one, else the first collection in season. */
export function defaultCollection(
  collections: readonly CosmeticShopCollection[],
  initial: string | null | undefined,
): string | null {
  if (initial !== undefined) return initial;
  return (collections.find((c): boolean => c.available) ?? collections[0])?.id ?? null;
}
