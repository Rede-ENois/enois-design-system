import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/react-vite";

import { SandboxedHtmlFrame } from "../../patterns/html-frame/sandboxed-html-frame.js";
import { CommunityCardSkeletons } from "./community-card-skeletons.js";
import { CommunityCard } from "./community-card.js";
import { CommunityChannels } from "./community-channels.js";
import { CommunityFavoriteButton } from "./community-favorite-button.js";
import { CommunityLocationFilter } from "./community-location-filter.js";
import { LocalCommunitiesSection } from "./local-communities-section.js";

const meta: Meta = {
  title: "Domain/Communities",
};

export default meta;

const community = {
  id: "c1",
  name: "Mulheres na Tecnologia",
  description:
    "Troca de experiências, vagas e mentorias para mulheres que trabalham com tecnologia.",
  topicLabel: "Tecnologia",
  members: 1280,
  joined: false,
  cover: null,
  avatar: null,
};

export const Card: StoryObj = {
  render: function CardStory() {
    const [joined, setJoined] = useState(false);
    const [favorite, setFavorite] = useState(false);

    return (
      <div className="max-w-sm">
        <CommunityCard
          community={{ ...community, joined }}
          href="#"
          joinPending={false}
          leavePending={false}
          ownerBlocked={false}
          onJoin={() => setJoined(true)}
          onLeave={() => setJoined(false)}
          favorite={
            <CommunityFavoriteButton
              isFavorite={favorite}
              pending={false}
              onToggle={() => setFavorite((value) => !value)}
            />
          }
          renderHtmlFrame={(props) => <SandboxedHtmlFrame {...props} theme="light" />}
        />
      </div>
    );
  },
};

export const CardWithHtmlCover: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <CommunityCard
        community={{
          ...community,
          bannerHtml:
            '<div style="height:128px;background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;display:flex;align-items:center;justify-content:center;font-family:sans-serif"><p style="margin:0;font-size:22px;font-weight:700">capa em HTML</p></div>',
        }}
        href="#"
        joinPending={false}
        leavePending={false}
        ownerBlocked={false}
        onJoin={() => {}}
        onLeave={() => {}}
        renderHtmlFrame={(props) => <SandboxedHtmlFrame {...props} theme="light" />}
      />
    </div>
  ),
};

export const CardWithPhotoCover: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <CommunityCard
        community={{
          ...community,
          cover:
            "data:image/svg+xml;utf8," +
            encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="256"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><rect width="640" height="256" fill="url(#g)"/></svg>',
            ),
        }}
        href="#"
        joinPending={false}
        leavePending={false}
        ownerBlocked={false}
        onJoin={() => {}}
        onLeave={() => {}}
      />
    </div>
  ),
};

export const CardWithLocation: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <CommunityCard
        community={{ ...community, city: "Belo Horizonte", state: "MG" }}
        href="#"
        joinPending={false}
        leavePending={false}
        ownerBlocked={false}
        onJoin={() => {}}
        onLeave={() => {}}
      />
    </div>
  ),
};

export const OwnerBlocked: StoryObj = {
  render: () => (
    <div className="max-w-sm">
      <CommunityCard
        community={{ ...community, joined: true }}
        href="#"
        joinPending={false}
        leavePending={false}
        ownerBlocked
        onJoin={() => {}}
        onLeave={() => {}}
      />
    </div>
  ),
};

export const Loading: StoryObj = {
  render: () => <CommunityCardSkeletons count={3} />,
};

const topics = [
  { value: "TECNOLOGIA", label: "Tecnologia" },
  { value: "CARREIRA", label: "Carreira" },
];

export const Channels: StoryObj = {
  render: () => (
    <CommunityChannels
      joined
      loading={false}
      topics={topics}
      channels={[
        { id: "ch1", name: "Bastidores", href: "#", topicLabel: "Carreira", description: null },
        { id: "ch2", name: "Dúvidas", href: "#", topicLabel: null, description: "Pergunte aqui." },
      ]}
      onCreate={async () => null}
    />
  ),
};

export const ChannelsLocked: StoryObj = {
  render: () => (
    <CommunityChannels
      joined={false}
      loading={false}
      topics={topics}
      channels={[]}
      onCreate={async () => null}
    />
  ),
};

const localItems = [
  {
    id: "l1",
    name: "Devs BH",
    avatar: null,
    members: 312,
    city: "Belo Horizonte",
    state: "MG",
    href: "#",
  },
  {
    id: "l2",
    name: "Café com Código Contagem",
    avatar: null,
    members: 48,
    city: "Contagem",
    state: "MG",
    href: "#",
  },
  {
    id: "l3",
    name: "Mineiras na TI",
    avatar: null,
    members: 1024,
    city: null,
    state: "MG",
    href: "#",
  },
];

const localBase = {
  viewerCity: "Belo Horizonte",
  viewerState: "MG",
  items: localItems,
  loading: false,
  error: false,
  onRetry: () => {},
  onSetCity: () => {},
};

export const NearYou: StoryObj = {
  render: () => (
    <div className="max-w-xl">
      <LocalCommunitiesSection {...localBase} />
    </div>
  ),
};

export const NearYouLoading: StoryObj = {
  render: () => (
    <div className="max-w-xl">
      <LocalCommunitiesSection {...localBase} loading />
    </div>
  ),
};

export const NearYouEmpty: StoryObj = {
  render: () => (
    <div className="max-w-xl">
      <LocalCommunitiesSection {...localBase} items={[]} />
    </div>
  ),
};

export const NearYouError: StoryObj = {
  render: () => (
    <div className="max-w-xl">
      <LocalCommunitiesSection {...localBase} error />
    </div>
  ),
};

export const NearYouWithoutCity: StoryObj = {
  render: () => (
    <div className="max-w-xl">
      <LocalCommunitiesSection {...localBase} viewerCity={null} viewerState={null} />
    </div>
  ),
};

export const LocationFilter: StoryObj = {
  render: function LocationFilterStory() {
    const [value, setValue] = useState({ city: "", state: "" });

    return (
      <div className="max-w-md space-y-4">
        <CommunityLocationFilter
          value={value}
          onApply={setValue}
          onClear={() => setValue({ city: "", state: "" })}
        />

        <p className="text-xs text-text-subtle">Filtro aplicado: {JSON.stringify(value)}</p>
      </div>
    );
  },
};
