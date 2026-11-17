// @vitest-environment jsdom
import { type ReactNode, act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { RoleplayCampaignData } from "../../types/domain/roleplay/roleplay-campaign-data.js";
import type { RoleplayCampaignPageProps } from "../../types/domain/roleplay/roleplay-campaign-page-props.js";

import { RoleplayCampaignPage } from "./roleplay-campaign-page.js";

// The Radix portal is not under test: the dialog parts render inline.
vi.mock("../../ui/dialog.js", () => {
  const Plain = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  return {
    Dialog: ({ open, children }: { open: boolean; children?: ReactNode }) =>
      open ? <div>{children}</div> : null,
    DialogContent: Plain,
    DialogHeader: Plain,
    DialogTitle: Plain,
    DialogDescription: Plain,
  };
});

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const container = document.createElement("div");
document.body.append(container);
const root = createRoot(container);

afterEach(() => act(() => root.render(null)));

const campaign: RoleplayCampaignData = {
  id: "c1",
  slug: "a-sombra-sobre-valdria",
  name: "A Sombra sobre Valdria",
  description: "Mistério urbano.",
  gameSystem: "dnd5e",
  systemFamily: "D20",
  visibility: "PUBLIC",
  status: "ACTIVE",
  members: 5,
  viewerRole: "GAME_MASTER",
  joined: true,
};

const panels: RoleplayCampaignPageProps["panels"] = {
  tables: {
    tables: [
      {
        id: "t1",
        name: "Sessão de sexta",
        voiceOpen: true,
        scene: "A chuva castiga a cidade.",
        turnOrder: ["Ana", "Bruno"],
        activeTurn: "Ana",
        canAdvanceTurn: true,
      },
    ],
    canCreateTable: true,
    onCreateTable: () => undefined,
    onJoinVoice: () => undefined,
    canEditScene: true,
    onSaveScene: () => undefined,
    onAdvanceTurn: () => undefined,
  },
  sheet: {
    templateFields: [
      { key: "forca", label: "Força" },
      { key: "astucia", label: "Astúcia" },
    ],
    sheet: {
      name: "Irata Nyx",
      values: { forca: "3", astucia: "4" },
      derived: [{ label: "Vigor", value: "9" }],
    },
    board: [
      {
        id: "s2",
        name: "Personagem de outrem",
        fields: [{ label: "Força", value: "2" }],
        published: false,
      },
    ],
    onSave: () => undefined,
    onPublish: () => undefined,
    onUnpublish: () => undefined,
  },
  dice: {
    rolls: [{ id: "r1", expression: "2d6+3", dice: [4, 6], total: 13, label: "ataque" }],
    onRoll: () => undefined,
  },
  chat: {
    messages: [
      { id: "m1", channel: "IC", content: "Eu abro a porta.", pinned: false },
      { id: "m2", channel: "OOC", content: "Boa, anota isso.", pinned: true },
    ],
    presence: [{ name: "Ana", role: "PLAYER" }],
    onSend: () => undefined,
    onTogglePin: () => undefined,
  },
  world: {
    entries: [
      {
        id: "w1",
        kind: "LOCALE",
        title: "Taverna do Grifo Dourado",
        body: "O ponto de partida.",
        tags: ["cidade"],
        linkedSheetName: null,
        canEdit: true,
      },
    ],
    onSaveEntry: () => undefined,
    onDeleteEntry: () => undefined,
  },
};

const base: RoleplayCampaignPageProps = {
  header: { campaign, systemLabel: "Dungeons & Dragons 5e" },
  panels,
};

const render = (props: Partial<RoleplayCampaignPageProps> = {}) =>
  act(() => root.render(<RoleplayCampaignPage {...base} {...props} />));

const text = () => container.textContent ?? "";
const buttons = (label: string) =>
  [...container.querySelectorAll("button")].filter((b) => b.textContent?.includes(label));

function type(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
  const proto = Object.getPrototypeOf(el) as object;
  Object.getOwnPropertyDescriptor(proto, "value")!.set!.call(el, value);
  el.dispatchEvent(
    new Event(el instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }),
  );
}

/** Radix switches tabs on mousedown, not on click. */
const openTab = async (label: string) => {
  const trigger = Array.from(document.body.querySelectorAll<HTMLElement>('[role="tab"]')).find(
    (tab) => tab.textContent?.includes(label),
  );
  await act(async () => {
    trigger?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }));
  });
};

describe("RoleplayCampaignPage", () => {
  it("shows the header with system, family, members and role", () => {
    render();

    expect(text()).toContain("A Sombra sobre Valdria");
    expect(text()).toContain("Dungeons & Dragons 5e");
    expect(text()).toContain("5 participantes");
    expect(text()).toContain("Mestre");
  });

  it("offers the join action to a visitor and reports the click", () => {
    const onJoin = vi.fn();
    render({
      header: {
        campaign: { ...campaign, viewerRole: null, joined: false },
        systemLabel: "D&D 5e",
        canJoin: true,
        onJoin,
      },
      panels: undefined,
    });

    act(() => buttons("Pedir para entrar")[0].click());

    expect(onJoin).toHaveBeenCalledOnce();
    expect(text()).toContain("Quem participa é que vê");
  });

  it("renders the member panels per tab", async () => {
    render();

    await openTab("Mesa");
    expect(text()).toContain("Sessão de sexta");
    expect(text()).toContain("A chuva castiga a cidade.");
    expect(text()).toContain("Vez de: Ana");

    await openTab("Ficha");
    // Nome e valores vivem no value dos inputs, não no texto.
    const sheetInputs = container.querySelectorAll<HTMLInputElement>("input");
    expect(sheetInputs[0].value).toBe("Irata Nyx");
    expect(sheetInputs[1].value).toBe("3");
    expect(text()).toContain("Vigor: 9");
    expect(text()).toContain("Personagem de outrem");

    await openTab("Dados");
    expect(text()).toContain("2d6+3");
    expect(text()).toContain("13 · ataque");

    await openTab("Chat");
    expect(text()).toContain("Eu abro a porta.");
    expect(text()).toContain("Fixada pelo mestre");

    await openTab("Mundo");
    expect(text()).toContain("Taverna do Grifo Dourado");
    expect(text()).toContain("cidade");
  });

  it("rolls from the dice panel with a trimmed expression and cleared fields", async () => {
    const onRoll = vi.fn();
    render({ panels: { ...panels, dice: { rolls: [], onRoll } } });

    await openTab("Dados");

    const inputs = container.querySelectorAll<HTMLInputElement>("input");
    act(() => type(inputs[0], "  3d8  "));
    act(() => type(inputs[1], "dano"));
    act(() => buttons("Rolar")[0].click());

    expect(onRoll).toHaveBeenCalledWith("3d8", "dano");
  });

  it("sends a chat message on the chosen channel", async () => {
    const onSend = vi.fn();
    render({ panels: { ...panels, chat: { ...panels.chat, messages: [], onSend } } });

    await openTab("Chat");

    act(() => buttons("Mesa (OOC)")[0].click());
    const area = container.querySelector<HTMLTextAreaElement>("textarea")!;
    act(() => type(area, "  prepara o mapa  "));
    act(() => buttons("Enviar")[0].click());

    expect(onSend).toHaveBeenCalledWith("OOC", "prepara o mapa");
  });

  it("saves a world entry with the parsed tags", async () => {
    const onSaveEntry = vi.fn();
    render({ panels: { ...panels, world: { ...panels.world, entries: [], onSaveEntry } } });

    await openTab("Mundo");
    act(() => buttons("Registrar")[0].click());

    const title = container.querySelector<HTMLInputElement>("form input")!;
    act(() => type(title, "  Catacumbas  "));
    const body = container.querySelector<HTMLTextAreaElement>("form textarea")!;
    act(() => type(body, "Túneis antigos."));
    const tags = container.querySelectorAll<HTMLInputElement>("form input")[1]!;
    act(() => type(tags, "Cidade, Ruína"));
    act(() => container.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());

    expect(onSaveEntry).toHaveBeenCalledWith(
      { kind: "LOCALE", title: "Catacumbas", body: "Túneis antigos.", tags: ["cidade", "ruína"] },
      null,
    );
  });

  it("refuses an untitled world entry", async () => {
    const onSaveEntry = vi.fn();
    render({ panels: { ...panels, world: { ...panels.world, entries: [], onSaveEntry } } });

    await openTab("Mundo");
    act(() => buttons("Registrar")[0].click());
    act(() => container.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());

    expect(onSaveEntry).not.toHaveBeenCalled();
    expect(text()).toContain("O registro precisa de um título.");
  });

  it("opens a new table with the typed name", async () => {
    const onCreateTable = vi.fn();
    render({ panels: { ...panels, tables: { ...panels.tables, onCreateTable } } });

    await openTab("Mesa");
    act(() => buttons("Abrir mesa")[0].click());

    const name = container.querySelector<HTMLTextAreaElement>("form textarea")!;
    act(() => type(name, "  Sesão extra  "));
    act(() => container.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());

    expect(onCreateTable).toHaveBeenCalledWith("Sesão extra");
  });
});
