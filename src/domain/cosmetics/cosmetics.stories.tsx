import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { SaciHalloweenTeam } from "../../types/domain/cosmetics/saci-halloween-team.js";
import type { ProfileNameTheme } from "../../types/lib/theme/profile-name-theme.js";
import { Button } from "../../ui/button.js";
import { SEASONAL_FRAME_ART } from "../avatar/frames/seasonal/seasonal-frame-art.js";
import { UserAvatar } from "../avatar/user-avatar.js";
import { OfficialBadge } from "../badges/official-badge.js";
import { OFFICIAL_BADGE_ICONS } from "../badges/official-badges.js";
import { StyledName } from "../name/styled-name.js";

import { CATALOG_COLLECTIONS, CATALOG_LOOKS } from "./cosmetic-catalog.fixture.js";
import { SHOP_COLLECTIONS, SHOP_ITEMS } from "./cosmetic-shop.fixture.js";
import { CosmeticShop } from "./cosmetic-shop.js";
import { HiddenSaci } from "./hidden-saci.js";
import { Nameplate } from "./nameplate.js";
import { NAMEPLATES } from "./nameplates.js";
import { OfficialBanner } from "./official-banner.js";
import { OFFICIAL_BANNERS } from "./official-banners.js";
import { ProfileCard } from "./profile-card.js";
import { PROFILE_EFFECTS } from "./profile-effects.js";
import { ProfileMiniCard } from "./profile-mini-card.js";
import { SaciHalloweenDuel } from "./saci-halloween-duel.js";

const meta: Meta = {
  title: "Domain/Cosmetics",
};

export default meta;

const person = {
  name: "Ana Souza",
  username: "ana",
  pronouns: "ela/dela",
  bio: "Front-end, mentora de quem está começando e fã de deploy na sexta. Café sem açúcar.",
};

/** Every look of the catalog, worn on the profile card. */
const looks = CATALOG_LOOKS.map((look) => ({
  ...person,
  avatarFrame: look.frame,
  nameStyle: { theme: look.nameStyle as ProfileNameTheme },
  badges: look.badges,
  bannerItem: look.banner,
  cardTheme: look.theme,
  profileEffect: look.effect,
  statusIcon: look.statusIcon,
  statusText: look.statusText,
  nameplate: look.plate,
}));

const grid = "grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6";

export const PlainCard: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <ProfileCard profile={person} actions={<Button size="sm">Conectar</Button>} />
    </div>
  ),
};

export const LookCards: StoryObj = {
  render: function LookCardsStory() {
    const [replay, setReplay] = useState(0);
    return (
      <div className="grid gap-4">
        <Button className="w-fit" size="sm" onClick={() => setReplay((n) => n + 1)}>
          Rever efeitos
        </Button>

        <div className={grid}>
          {looks.map((profile) => (
            <ProfileCard key={profile.cardTheme} profile={profile} effectReplayKey={replay} />
          ))}
        </div>
      </div>
    );
  },
};

export const MiniCard: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <div className="w-72">
        <ProfileMiniCard profile={looks[0]} href="/perfil/ana" />
      </div>

      <div className="w-72">
        <ProfileMiniCard profile={person} onViewProfile={() => {}} />
      </div>
    </div>
  ),
};

export const Frames: StoryObj = {
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-8 p-6">
      {Object.keys(SEASONAL_FRAME_ART).map((frame) => (
        <figure key={frame} className="grid justify-items-center gap-6 text-xs">
          <UserAvatar alt="Ana Souza" frame={frame} className="h-20 w-20" />

          <figcaption>{frame}</figcaption>
        </figure>
      ))}
    </div>
  ),
};

export const Badges: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {Object.keys(OFFICIAL_BADGE_ICONS).map((badge) => (
        <OfficialBadge key={badge} badge={badge} title={badge} className="h-10 w-10" />
      ))}
    </div>
  ),
};

export const NameStyles: StoryObj = {
  render: () => (
    <ul className="grid gap-2 text-2xl font-extrabold">
      {CATALOG_COLLECTIONS.flatMap((c) => c.items)
        .filter((item) => item.kind === "name")
        .map((item) => (
          <li key={item.id}>
            <StyledName name={item.name} style={{ theme: item.id as ProfileNameTheme }} />
          </li>
        ))}
    </ul>
  ),
};

export const Nameplates: StoryObj = {
  render: () => (
    <ul className="grid max-w-xs gap-2">
      {Object.keys(NAMEPLATES).map((plate) => (
        <li key={plate}>
          <Nameplate plate={plate}>Ana Souza</Nameplate>
        </li>
      ))}
    </ul>
  ),
};

export const Banners: StoryObj = {
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      {Object.keys(OFFICIAL_BANNERS).map((banner) => (
        <div key={banner} className="h-28 overflow-hidden rounded-xl">
          <OfficialBanner banner={banner} />
        </div>
      ))}
    </div>
  ),
};

export const Effects: StoryObj = {
  render: function EffectsStory() {
    const [effect, setEffect] = useState("efeito-morcegos");
    const [replay, setReplay] = useState(0);
    return (
      <div className="grid max-w-sm gap-3">
        <select value={effect} onChange={(event) => setEffect(event.target.value)}>
          {Object.keys(PROFILE_EFFECTS).map((id) => (
            <option key={id}>{id}</option>
          ))}
        </select>

        <Button size="sm" onClick={() => setReplay((n) => n + 1)}>
          Rever efeito
        </Button>

        <ProfileCard
          profile={{ ...person, profileEffect: effect, cardTheme: "tema-dev" }}
          effectReplayKey={replay}
        />
      </div>
    );
  },
};

export const Shop: StoryObj = {
  render: function ShopStory() {
    const [items, setItems] = useState(SHOP_ITEMS);
    const own = (id: string, equipped: boolean) =>
      setItems((list) => list.map((i) => (i.id === id ? { ...i, owned: true, equipped } : i)));
    return (
      <CosmeticShop
        items={items}
        collections={SHOP_COLLECTIONS}
        user={{ ...person, avatarFrame: "moldura-ambar", badges: ["emblema-cafe"] }}
        onRetry={() => {}}
        onBuy={(id) => own(id, true)}
        onBuyLook={(lookId) => {
          const look = SHOP_COLLECTIONS.flatMap((c) => c.looks).find((l) => l.id === lookId);
          look?.items.forEach((id) => own(id, true));
        }}
        onEquip={(id) => own(id, true)}
        onUnequip={(id) => own(id, false)}
        renderCollectionExtra={(id) =>
          id === "saci" ? (
            <SaciHalloweenDuel
              active
              counts={{ saci: 58, halloween: 42 }}
              myChoice={null}
              winner={null}
              onChoose={() => {}}
            />
          ) : null
        }
      />
    );
  },
};

/** The classic tab, where the GARDEN items live. */
export const ShopClassics: StoryObj = {
  render: () => (
    <CosmeticShop
      items={SHOP_ITEMS}
      collections={SHOP_COLLECTIONS}
      user={person}
      initialCollection={null}
      onRetry={() => {}}
      onBuy={() => {}}
      onBuyLook={() => {}}
      onEquip={() => {}}
      onUnequip={() => {}}
    />
  ),
};

export const ShopLoading: StoryObj = {
  render: () => (
    <CosmeticShop
      loading
      user={person}
      onRetry={() => {}}
      onBuy={() => {}}
      onBuyLook={() => {}}
      onEquip={() => {}}
      onUnequip={() => {}}
    />
  ),
};

export const Duel: StoryObj = {
  render: function DuelStory() {
    const [choice, setChoice] = useState<SaciHalloweenTeam | null>(null);
    return (
      <div className="grid max-w-3xl gap-4">
        <SaciHalloweenDuel
          active
          counts={{ saci: 58 + (choice === "saci" ? 1 : 0), halloween: 42 }}
          myChoice={choice}
          winner={null}
          onChoose={setChoice}
        />
        <SaciHalloweenDuel
          active={false}
          counts={{ saci: 1203, halloween: 980 }}
          myChoice="saci"
          winner="saci"
          onChoose={() => {}}
        />
        <SaciHalloweenDuel
          active={false}
          counts={{ saci: 10, halloween: 10 }}
          myChoice={null}
          winner={null}
          onChoose={() => {}}
        />
      </div>
    );
  },
};

export const Hunt: StoryObj = {
  render: function HuntStory() {
    const [found, setFound] = useState(false);
    return (
      <div className="flex items-center gap-4">
        <HiddenSaci spot="feed" found={found} onFound={() => setFound(true)} />
        <HiddenSaci spot="vagas" found onFound={() => {}} />
      </div>
    );
  },
};
