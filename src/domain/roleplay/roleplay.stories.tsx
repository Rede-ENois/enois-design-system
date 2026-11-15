import type { Meta, StoryObj } from "@storybook/react-vite";

import type { RoleplayCampaignData } from "../../types/domain/roleplay/roleplay-campaign-data.js";
import type { RoleplayCampaignPageProps } from "../../types/domain/roleplay/roleplay-campaign-page-props.js";
import type { RoleplayDirectoryProps } from "../../types/domain/roleplay/roleplay-directory-props.js";
import type { RoleplaySystemOption } from "../../types/domain/roleplay/roleplay-system-option.js";

import { RoleplayCampaignPage } from "./roleplay-campaign-page.js";
import { RoleplayDirectory } from "./roleplay-directory.js";

const meta: Meta = {
  title: "Domain/Roleplay",
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

export default meta;

const noop = () => {};

const systems: RoleplaySystemOption[] = [
  { id: "dnd5e", label: "Dungeons & Dragons 5e", systemFamily: "D20" },
  { id: "coc", label: "Call of Cthulhu 7e", systemFamily: "D100" },
  { id: "own", label: "Regras da casa", systemFamily: "CUSTOM" },
];

const campaigns: RoleplayCampaignData[] = [
  {
    id: "c1",
    slug: "a-sombra-sobre-valdria",
    name: "A Sombra sobre Valdria",
    description: "Mistério urbano em um reino onde a magia foi proibida.",
    gameSystem: "dnd5e",
    systemFamily: "D20",
    visibility: "PUBLIC",
    status: "ACTIVE",
    members: 5,
    viewerRole: "GAME_MASTER",
    joined: true,
  },
  {
    id: "c2",
    slug: "investigadores-do-harbor",
    name: "Investigadores do Harbor",
    description:
      "Campanha longa de investigação com nome de mesa bem comprido para testar truncamento de texto em telas estreitas.",
    gameSystem: "coc",
    systemFamily: "D100",
    visibility: "PUBLIC",
    status: "ACTIVE",
    members: 1,
    viewerRole: null,
    joined: false,
  },
  {
    id: "c3",
    slug: "torre-do-arquivista",
    name: "Torre do Arquivista",
    description: null,
    gameSystem: "own",
    systemFamily: "CUSTOM",
    visibility: "PUBLIC",
    status: "ARCHIVED",
    members: 12,
    viewerRole: "PLAYER",
    joined: true,
  },
];

const base: RoleplayDirectoryProps = {
  campaigns,
  mine: campaigns.filter((c) => c.joined),
  onOpen: noop,
  systems,
  onCreateSubmit: noop,
};

export const Directory: StoryObj = { render: () => <RoleplayDirectory {...base} /> };

export const WithoutSession: StoryObj = {
  render: () => <RoleplayDirectory {...base} mine={undefined} />,
};

export const MineEmpty: StoryObj = {
  render: () => <RoleplayDirectory {...base} mine={[]} />,
};

export const Loading: StoryObj = { render: () => <RoleplayDirectory {...base} loading /> };

export const LoadError: StoryObj = {
  render: () => <RoleplayDirectory {...base} loadError onRetry={noop} />,
};

export const Empty: StoryObj = { render: () => <RoleplayDirectory {...base} campaigns={[]} /> };

export const Creating: StoryObj = {
  render: () => <RoleplayDirectory {...base} creating createError={null} />,
};

export const Searching: StoryObj = {
  render: () => <RoleplayDirectory {...base} searchValue="" onSearch={noop} />,
};

const masterCampaign: RoleplayCampaignData = campaigns[0];

const pagePanels: RoleplayCampaignPageProps["panels"] = {
  tables: {
    tables: [
      {
        id: "t1",
        name: "Sessão de sexta",
        voiceOpen: true,
        scene: "A chuva castiga a cidade e a guarda procura alguém.",
        turnOrder: ["Ana", "Bruno", "Caro"],
        activeTurn: "Ana",
        canAdvanceTurn: true,
      },
      {
        id: "t2",
        name: "Sessão de sábado",
        voiceOpen: false,
        scene: null,
        turnOrder: [],
        activeTurn: null,
        canAdvanceTurn: false,
      },
    ],
    canCreateTable: true,
    onCreateTable: noop,
    onJoinVoice: noop,
    canEditScene: true,
    onSaveScene: noop,
    onAdvanceTurn: noop,
  },
  sheet: {
    templateFields: [
      { key: "forca", label: "Força" },
      { key: "astucia", label: "Astúcia" },
      { key: "vigor", label: "Vigor" },
    ],
    sheet: {
      name: "Irata Nyx",
      values: { forca: "3", astucia: "4", vigor: "2" },
      derived: [{ label: "Vigor", value: "9" }],
    },
    board: [
      {
        id: "s2",
        name: "Personagem de outrem",
        fields: [{ label: "Força", value: "2" }],
        published: true,
      },
    ],
    onSave: noop,
    onPublish: noop,
    onUnpublish: noop,
  },
  dice: {
    rolls: [
      { id: "r1", expression: "2d6+3", dice: [4, 6], total: 13, label: "ataque" },
      { id: "r2", expression: "1d20", dice: [7], total: 7, label: null },
    ],
    onRoll: noop,
  },
  chat: {
    messages: [
      { id: "m1", channel: "IC", content: "Eu abro a porta devagar.", pinned: false },
      { id: "m2", channel: "OOC", content: "Boa, anota isso na ficha.", pinned: true },
    ],
    presence: [
      { name: "Ana", role: "PLAYER" },
      { name: "Bruno", role: "GAME_MASTER" },
    ],
    onSend: noop,
    onTogglePin: noop,
  },
  world: {
    entries: [
      {
        id: "w1",
        kind: "LOCALE",
        title: "Taverna do Grifo Dourado",
        body: "O ponto de partida da mesa.",
        tags: ["cidade", "encontro"],
        linkedSheetName: null,
        canEdit: true,
      },
      {
        id: "w2",
        kind: "CHARACTER",
        title: "Arquivista Sem Nome",
        body: "Sabe demais sobre o reino proibido.",
        tags: ["npc"],
        linkedSheetName: "Irata Nyx",
        canEdit: false,
      },
    ],
    onSaveEntry: noop,
    onDeleteEntry: noop,
  },
};

export const CampaignPage: StoryObj = {
  render: () => (
    <RoleplayCampaignPage
      header={{ campaign: masterCampaign, systemLabel: "Dungeons & Dragons 5e" }}
      panels={pagePanels}
    />
  ),
};

export const CampaignPageVisitor: StoryObj = {
  render: () => (
    <RoleplayCampaignPage
      header={{
        campaign: { ...campaigns[1], viewerRole: null, joined: false },
        systemLabel: "Call of Cthulhu 7e",
        canJoin: true,
        onJoin: noop,
      }}
    />
  ),
};
