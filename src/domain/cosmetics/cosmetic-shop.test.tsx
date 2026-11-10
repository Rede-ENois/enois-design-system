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
    // Every look of every collection in season, not one per collection: Essenciais holds several.
    const looks = SHOP_COLLECTIONS.filter((collection) => collection.available).reduce(
      (total, collection) => total + collection.looks.length,
      0,
    );
    expect(html.match(/class="cos-look /g)).toHaveLength(looks);
    expect(html).toContain("Prêmio de evento");
    expect(html).toContain("Clássicos");
  });

  it("não mostra a coleção fora da temporada: nem aba, nem peça, nem look", () => {
    const html = renderToStaticMarkup(
      <CosmeticShop
        items={SHOP_ITEMS}
        collections={SHOP_COLLECTIONS}
        user={user}
        initialCollection="natal"
        {...handlers}
      />,
    );

    // O Natal está fora da janela: não é aba, não tem peça na grade e não tem look pronto.
    expect(html).not.toContain(">Natal<");
    expect(html).not.toContain("Natal na praia");
    expect(html).not.toContain("Fora de temporada");
    expect(html).not.toContain(">Comprar<");
  });

  it("a peça que já é sua continua na loja depois da temporada, pronta para equipar", () => {
    const owned = SHOP_ITEMS.map((item) =>
      item.collection === "natal" ? { ...item, owned: true } : item,
    );
    const html = renderToStaticMarkup(
      <CosmeticShop
        items={owned}
        collections={SHOP_COLLECTIONS}
        user={user}
        initialCollection="natal"
        {...handlers}
      />,
    );

    // É sua: a etiqueta diz isso e a ação é equipar, não comprar.
    expect(html).toContain('<span class="cos-item__tag is-owned">Seu</span>');
    expect(html).toContain(">Equipar<");
    expect(html).not.toContain(">Comprar<");
    // A coleção dele continua sem aba: não dá para comprar o que não está na temporada.
    expect(html).not.toContain(">Natal<");
    expect(html).not.toContain("Vestir o look Natal na praia");
    // Mas a peça dele não fica sem preço nem com etiqueta de fora de temporada.
    expect(html).not.toContain("Fora de temporada");
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
