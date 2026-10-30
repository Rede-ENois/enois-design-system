import type { CosmeticKind } from "../domain/cosmetics/cosmetic-kind.js";

export type CosmeticsMessages = {
  profileCard: {
    label: (name: string) => string;
    status: string;
  };
  profileMiniCard: {
    viewProfile: string;
  };
  cosmeticShop: {
    looksTitle: string;
    looksDescription: string;
    wearLook: (title: string) => string;
    lookOwned: string;
    lookDiscount: (missing: number) => string;
    search: string;
    searchLabel: string;
    collectionsLabel: string;
    classicTab: string;
    kindsLabel: string;
    kinds: Record<CosmeticKind | "ALL", string>;
    kind: Record<CosmeticKind, string>;
    tryItem: (name: string) => string;
    owned: string;
    equipped: string;
    buy: string;
    equip: string;
    unequip: string;
    outOfSeason: string;
    reward: string;
    results: (count: number) => string;
    noResults: (query: string) => string;
    emptyKind: string;
    showMore: string;
    showing: (visible: number, total: number) => string;
    previewLabel: string;
    tryingLook: (title: string) => string;
    trying: (names: string) => string;
    notTrying: string;
    replay: string;
    reset: string;
    memberList: string;
    effectSample: string;
    nameSample: string;
    albumTitle: string;
    albumProgress: (done: number, total: number) => string;
    albumPage: (got: number, total: number) => string;
    albumComplete: string;
    sparks: string;
    loadError: string;
    retry: string;
  };
  saciHalloweenDuel: {
    tag: string;
    title: string;
    text: string;
    teams: { saci: string; halloween: string };
    tally: (saci: number, halloween: number) => string;
    noVotes: string;
    choose: string;
    chosen: (team: string) => string;
    upcoming: string;
    closed: string;
    winner: (team: string) => string;
    tie: string;
  };
  hiddenSaci: {
    label: string;
    found: string;
  };
};
