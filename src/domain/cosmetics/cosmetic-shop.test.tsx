// @vitest-environment node
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { CosmeticShopCollection } from "../../types/domain/cosmetics/cosmetic-shop-collection.js";

import { SHOP_COLLECTIONS, SHOP_ITEMS } from "./cosmetic-shop.fixture.js";
import { CosmeticShop } from "./cosmetic-shop.js";

const noop = () => {};
const handlers = { onRetry: noop, onBuy: noop, onBuyLook: noop, onEquip: noop, onUnequip: noop };
const user = { name: "Ana Souza", username: "ana" };

/** The shop as the API lists it for this viewer: the Saci look is theirs and on the profile. */
const mineCollections = (equipped: boolean): CosmeticShopCollection[] =>
  SHOP_COLLECTIONS.map((collection) =>
    collection.id === "saci"
      ? {
          ...collection,
          looks: collection.looks.map((look) => ({ ...look, owned: true, equipped })),
        }
      : collection,
  );

describe("CosmeticShop", () => {
  it("opens on the collection in season, one page of cards and every look", () => {
    const html = renderToStaticMarkup(
      <CosmeticShop items={SHOP_ITEMS} collections={SHOP_COLLECTIONS} user={user} {...handlers} />,
    );

    expect(html.match(/class="cos-item /g)?.length).toBeLessThanOrEqual(24);
    expect(html).toContain("Provar Redemoinho no perfil");
    expect(html.match(/class="cos-look /g)).toHaveLength(SHOP_COLLECTIONS.length);
    expect(html).toContain("Prêmio de evento");
    expect(html).toContain("Clássicos");
  });

  it("marks out-of-season items and looks instead of selling them", () => {
    const html = renderToStaticMarkup(
      <CosmeticShop
        items={SHOP_ITEMS}
        collections={SHOP_COLLECTIONS}
        user={user}
        initialCollection="natal"
        {...handlers}
      />,
    );

    expect(html).toContain("Fora de temporada");
    expect(html).not.toContain(">Comprar<");
  });

  it("shows the error state with a retry action", () => {
    const html = renderToStaticMarkup(<CosmeticShop error user={user} {...handlers} />);

    expect(html).toContain('role="alert"');
    expect(html).toContain("Tentar novamente");
  });

  it("a look that is already the viewer's is worn, not tried on", () => {
    const wear = vi.fn();
    const takeOff = vi.fn();
    const html = renderToStaticMarkup(
      <CosmeticShop
        items={SHOP_ITEMS}
        collections={mineCollections(false)}
        user={user}
        onEquipLook={wear}
        onUnequipLook={takeOff}
        {...handlers}
      />,
    );

    // Off the profile: the card offers the click that wears it...
    expect(html).toContain("Vestir o meu look Saci-pererê");
    expect(html).toContain("Vestir");
    expect(html).not.toContain("Vestindo");
    // ...and nothing is being tried on by simply listing it.
    expect(html).not.toContain('class="cos-look is-on');
  });

  it("the look on the profile says so and offers to come off", () => {
    const html = renderToStaticMarkup(
      <CosmeticShop
        items={SHOP_ITEMS}
        collections={mineCollections(true)}
        user={user}
        onEquipLook={noop}
        onUnequipLook={noop}
        {...handlers}
      />,
    );

    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("Tirar o look Saci-pererê do meu perfil");
    expect(html).toContain("Vestindo");
    expect(html).toContain("is-worn");
    // Nada de "Vestir" solto no rodapé quando o look já está no perfil.
    expect(html).not.toContain(">Vestir<");
  });

  it("the look being worn ignores clicks until the server answers", () => {
    const html = renderToStaticMarkup(
      <CosmeticShop
        items={SHOP_ITEMS}
        collections={mineCollections(false)}
        user={user}
        onEquipLook={noop}
        onUnequipLook={noop}
        lookPending="look-saci"
        {...handlers}
      />,
    );

    const stage = /<button[^>]*class="cos-look__stage"[^>]*>/.exec(html)?.[0] ?? "";
    expect(stage).toContain("disabled");
  });
});
