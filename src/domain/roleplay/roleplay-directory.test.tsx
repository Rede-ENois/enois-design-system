// @vitest-environment jsdom
import { type ReactNode, act } from "react";

import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { RoleplayCampaignData } from "../../types/domain/roleplay/roleplay-campaign-data.js";
import type { RoleplayDirectoryProps } from "../../types/domain/roleplay/roleplay-directory-props.js";
import type { RoleplaySystemOption } from "../../types/domain/roleplay/roleplay-system-option.js";

import { RoleplayDirectory } from "./roleplay-directory.js";

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

const systems: RoleplaySystemOption[] = [
  { id: "dnd5e", label: "D&D 5e", systemFamily: "D20" },
  { id: "coc", label: "Call of Cthulhu", systemFamily: "D100" },
];

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

const other: RoleplayCampaignData = {
  ...campaign,
  id: "c2",
  slug: "outra-mesa",
  name: "Outra mesa",
  viewerRole: null,
  joined: false,
};

function render(props: Partial<RoleplayDirectoryProps> = {}) {
  act(() =>
    root.render(
      <RoleplayDirectory
        campaigns={[campaign, other]}
        onOpen={() => {}}
        systems={systems}
        {...props}
      />,
    ),
  );
}

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

describe("RoleplayDirectory", () => {
  it("opens a campaign when its card is pressed", () => {
    const onOpen = vi.fn();
    render({ onOpen });

    act(() => buttons("A Sombra sobre Valdria")[0].click());

    expect(onOpen).toHaveBeenCalledWith(campaign);
  });

  it("splits my campaigns from discovery without repeating one in both", () => {
    render({ mine: [campaign] });

    expect(text()).toContain("Suas campanhas");
    expect(text()).toContain("A Sombra sobre Valdria");
    expect(text()).toContain("Outra mesa");
  });

  it("does not build discovery by filtering when there is no session", () => {
    render({ mine: undefined });

    expect(text()).not.toContain("Suas campanhas");
    expect(text()).toContain("Outra mesa");
  });

  it("states loading, error and empty honestly", () => {
    const { unmount } = { unmount: () => act(() => root.render(null)) };
    render({ loading: true });
    expect(container.querySelector("[role=status]")).not.toBeNull();
    void unmount;

    render({ loadError: true, onRetry: () => {} });
    expect(container.querySelector("[role=alert]")!.textContent).toContain(
      "Não foi possível carregar",
    );
    void unmount;

    render({ campaigns: [] });
    expect(text()).toContain("Nenhuma campanha pública encontrada.");
  });

  it("submits a create request with the trimmed values and the resolved family", () => {
    const onCreateSubmit = vi.fn();
    render({ mine: undefined, onCreateSubmit, systems });

    act(() => buttons("Criar campanha")[0].click());

    // The directory's own search input comes first in the DOM: the dialog fields live in the form.
    const nameInput = container.querySelector<HTMLInputElement>("form input")!;
    act(() => type(nameInput, "  Mesa de teste  "));
    act(() => type(container.querySelector<HTMLSelectElement>("form select")!, "coc"));

    act(() => container.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());

    expect(onCreateSubmit).toHaveBeenCalledWith({
      name: "Mesa de teste",
      description: null,
      setting: null,
      gameSystem: "coc",
      systemFamily: "D100",
      visibility: "PUBLIC",
    });
  });

  it("refuses to submit without a name and without a system", () => {
    const onCreateSubmit = vi.fn();
    render({ mine: undefined, onCreateSubmit, systems });

    act(() => buttons("Criar campanha")[0].click());
    act(() => container.querySelector<HTMLButtonElement>('button[type="submit"]')!.click());

    expect(onCreateSubmit).not.toHaveBeenCalled();
    expect(text()).toContain("A campanha precisa de um nome.");
    expect(text()).toContain("Escolha o sistema de regras da mesa.");
  });

  it("reports search text to the app when the search is controlled", () => {
    const onSearch = vi.fn();
    render({ mine: undefined, searchValue: "", onSearch });

    const input = container.querySelector<HTMLInputElement>("input")!;
    act(() => type(input, "valdria"));

    expect(onSearch).toHaveBeenCalledWith("valdria");
  });

  it("hides create when there is no action for it", () => {
    render({ mine: undefined });

    expect(buttons("Criar campanha")).toHaveLength(0);
  });
});
