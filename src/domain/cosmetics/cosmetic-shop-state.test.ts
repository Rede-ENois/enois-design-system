import { describe, expect, it } from "vitest";

import {
  EMPTY_TRY_ON,
  albumPage,
  countByKind,
  defaultCollection,
  filterShopItems,
  isTryingOn,
  lookMissing,
  previewProfile,
  toggleTryItem,
  tryLook,
} from "./cosmetic-shop-state.js";
import { SHOP_COLLECTIONS, SHOP_ITEMS } from "./cosmetic-shop.fixture.js";

const byId = new Map(SHOP_ITEMS.map((item) => [item.id, item]));
const item = (id: string) => {
  const found = byId.get(id);
  if (!found) throw new Error(id);
  return found;
};
const user = { name: "Ana", avatarFrame: "moldura-ambar", badges: ["/a.png"], statusText: "Oi" };

describe("filterShopItems", () => {
  it("lists one collection tab, by kind", () => {
    const frames = filterShopItems(SHOP_ITEMS, SHOP_COLLECTIONS, {
      collection: "saci",
      kind: "FRAME",
      query: "",
    });

    expect(frames.map((i) => i.id)).toContain("moldura-redemoinho");
    expect(frames.every((i) => i.collection === "saci" && i.kind === "FRAME")).toBe(true);
  });

  it("lists the classic items without a collection", () => {
    const classic = filterShopItems(SHOP_ITEMS, SHOP_COLLECTIONS, {
      collection: null,
      kind: "ALL",
      query: "",
    });

    expect(classic.map((i) => i.id)).toEqual([
      "moldura-ambar",
      "garden-cerrado",
      "garden-mata-atlantica",
      "garden-caatinga",
      "garden-pampa",
    ]);
  });

  it("searches every collection by name, description and collection name, ignoring case", () => {
    const search = (query: string) =>
      filterShopItems(SHOP_ITEMS, SHOP_COLLECTIONS, { collection: "saci", kind: "ALL", query });

    expect(search("PIPA").map((i) => i.collection)).toContain("criancas");
    expect(search("dia do programador").every((i) => i.collection === "dev")).toBe(true);
    expect(search("  zzz  ")).toEqual([]);
  });

  it("counts the view by kind", () => {
    const counts = countByKind(SHOP_ITEMS.filter((i) => i.collection === "namorados"));

    expect(counts).toMatchObject({ ALL: 9, FRAME: 3, BADGE: 2, NAME_STYLE: 1, BANNER: 0 });
  });

  it("filters and counts the garden kind", () => {
    const gardens = filterShopItems(SHOP_ITEMS, SHOP_COLLECTIONS, {
      collection: null,
      kind: "GARDEN",
      query: "",
    });

    expect(gardens).toHaveLength(4);
    expect(countByKind(gardens)).toMatchObject({ ALL: 4, GARDEN: 4, FRAME: 0 });
  });
});

describe("try-on", () => {
  it("tries an item on and takes it off on a second click", () => {
    const on = toggleTryItem(EMPTY_TRY_ON, item("moldura-teia"));
    expect(on.items.FRAME).toBe("moldura-teia");
    expect(previewProfile(user, on).avatarFrame).toBe("moldura-teia");

    const off = toggleTryItem(on, item("moldura-teia"));
    expect(isTryingOn(off)).toBe(false);
    expect(previewProfile(user, off).avatarFrame).toBe("moldura-ambar");
  });

  it("puts a tried badge first, keeping the current ones", () => {
    const preview = previewProfile(user, toggleTryItem(EMPTY_TRY_ON, item("emblema-pe")));

    expect(preview.badges).toEqual(["emblema-pe", "/a.png"]);
  });

  it("wears a whole look: every slot, its badges and its status", () => {
    const look = SHOP_COLLECTIONS.find((c) => c.id === "halloween")!.looks[0];
    const tryOn = tryLook(look, byId);
    const preview = previewProfile(user, tryOn);

    expect(tryOn.look).toBe("look-halloween");
    expect(preview).toMatchObject({
      cardTheme: "tema-halloween",
      avatarFrame: "moldura-asas-morcego",
      nameStyle: { theme: "nome-assombrado" },
      profileEffect: "efeito-morcegos",
      bannerItem: "banner-halloween",
      nameplate: "placa-teia",
      statusIcon: "morcego",
      statusText: "Deploy na sexta 13, vai dar bom",
    });
    expect(preview.badges).toHaveLength(5);
  });

  it("leaves the look but keeps its other slots when one item changes", () => {
    const look = SHOP_COLLECTIONS.find((c) => c.id === "saci")!.looks[0];
    const tryOn = toggleTryItem(tryLook(look, byId), item("moldura-folhas"));

    expect(tryOn.look).toBeNull();
    expect(tryOn.items.CARD_THEME).toBe("tema-saci");
    expect(tryOn.items.FRAME).toBe("moldura-folhas");
  });

  it("lists the look items still missing", () => {
    const look = SHOP_COLLECTIONS.find((c) => c.id === "namorados")!.looks[0];
    const owned = new Map(byId);
    owned.set("tema-namorados", { ...item("tema-namorados"), owned: true });

    expect(lookMissing(look, owned)).not.toContain("tema-namorados");
    expect(lookMissing(look, owned)).toHaveLength(look.items.length - 1);
  });
});

describe("album and tabs", () => {
  it("counts the sellable pieces of a collection, leaving event rewards out", () => {
    const owned = SHOP_ITEMS.map((i) => (i.id === "emblema-pe" ? { ...i, owned: true } : i));
    const page = albumPage(owned, "saci");

    expect(page.got).toBe(1);
    expect(page.pieces.some((i) => !i.purchasable)).toBe(false);
  });

  it("opens the first collection in season unless asked otherwise", () => {
    expect(defaultCollection(SHOP_COLLECTIONS, undefined)).toBe("saci");
    expect(defaultCollection(SHOP_COLLECTIONS, "dev")).toBe("dev");
    expect(defaultCollection([], undefined)).toBeNull();
  });
});
