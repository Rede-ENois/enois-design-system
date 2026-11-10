// @vitest-environment jsdom
import { act } from "react";

import { type Root, createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DEFAULT_THEME_SETTINGS } from "../../lib/theme/theme-defaults.js";
import { defaultMessages } from "../../messages/default-messages.js";
import type { AppearanceDialogProps } from "../../types/domain/appearance/appearance-dialog-props.js";

import { AppearanceDialog } from "./appearance-dialog.js";

const messages = defaultMessages.appearanceDialog;

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

function render(props: Partial<AppearanceDialogProps> = {}) {
  const all: AppearanceDialogProps = {
    open: true,
    onOpenChange: () => {},
    profileName: "Marina Rocha",
    nameStyle: { theme: null, font: null, color: null },
    onNameStyleChange: () => {},
    mode: "light",
    onModeChange: () => {},
    settings: DEFAULT_THEME_SETTINGS,
    onSettingsChange: () => {},
    collectionId: null,
    activeCollection: null,
    onCollectionSelect: () => {},
    onCollectionPreview: () => {},
    widgetBackground: null,
    onWidgetBackgroundChange: () => {},
    pageBackground: null,
    onPageBackgroundChange: () => {},
    onExport: () => {},
    onImport: () => {},
    fileStatus: null,
    onSell: () => {},
    onReset: () => {},
    ...props,
  };
  act(() => root.render(<AppearanceDialog {...all} />));
}

const text = () => document.body.textContent ?? "";
const button = (label: string) =>
  [...document.body.querySelectorAll("button")].find((b) => b.textContent?.includes(label));

/** Radix troca de aba no mousedown do gatilho. */
function openTab(label: string) {
  const trigger = [...document.body.querySelectorAll('[role="tab"]')].find(
    (tab) => tab.textContent === label,
  )!;
  act(() => {
    trigger.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, button: 0 }));
  });
}

beforeEach(() => {
  host = document.createElement("div");
  document.body.appendChild(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  host.remove();
});

describe("AppearanceDialog", () => {
  it("opens on the global tab with themes, mode and file actions, but no name style", () => {
    render();

    expect(text()).toContain(messages.tabGlobal);
    expect(text()).toContain(messages.tabIdentity);
    expect(text()).toContain(messages.collectionsHint);
    expect(text()).toContain(messages.mode);
    expect(text()).toContain(messages.exportTheme);
    expect(text()).not.toContain(messages.nameStyleTitle);
    // O rodapé fica fora das abas.
    expect(button(messages.reset)).toBeDefined();
  });

  it("collapses and expands the theme collections", () => {
    render();

    act(() => button(messages.themesCollapse)!.click());
    expect(text()).not.toContain(messages.collectionsHint);
    expect(button(messages.themesExpand)!.getAttribute("aria-expanded")).toBe("false");

    act(() => button(messages.themesExpand)!.click());
    expect(text()).toContain(messages.collectionsHint);
  });

  it("shows purchased themes only when the app passes them", () => {
    render();
    expect(text()).not.toContain(defaultMessages.purchasedThemes.title);

    const onApply = vi.fn();
    render({
      purchasedThemes: { themes: [{ itemId: "t1", title: "Meu tema comprado" }], onApply },
    });
    act(() => button("Meu tema comprado")!.click());
    expect(onApply).toHaveBeenCalledWith("t1");
  });

  it("moves name style and contributor tag to the identity tab", () => {
    const onNameStyleChange = vi.fn();
    render({ onNameStyleChange, onContributorTagColorChange: () => {} });

    openTab(messages.tabIdentity);

    expect(text()).toContain(messages.nameStyleTitle);
    expect(text()).toContain(messages.contributorTagTitle);
    expect(text()).not.toContain(messages.mode);

    act(() => button(messages.nameStyleThemes.RETRO)!.click());
    expect(onNameStyleChange).toHaveBeenCalledWith(expect.objectContaining({ theme: "RETRO" }));
  });

  it("separates experimentar (prévia) de aplicar (grava a escolha)", () => {
    const onCollectionPreview = vi.fn();
    const onCollectionSelect = vi.fn();
    render({ onCollectionPreview, onCollectionSelect, collectionId: null });

    const card = [...document.body.querySelectorAll("button")].find((b) =>
      b.getAttribute("aria-label")?.startsWith(defaultMessages.collectionGrid.tryTheme),
    )!;
    const tryButtons = [...document.body.querySelectorAll("button")].filter(
      (b) => b.textContent === defaultMessages.collectionGrid.tryTheme,
    );
    const applyButtons = [...document.body.querySelectorAll("button")].filter(
      (b) => b.textContent === defaultMessages.collectionGrid.applyTheme,
    );

    expect(card).toBeDefined();
    expect(tryButtons.length).toBeGreaterThan(1);
    expect(applyButtons.length).toBeGreaterThan(1);

    act(() => tryButtons[1].click());
    expect(onCollectionPreview).toHaveBeenCalled();

    act(() => applyButtons[1].click());
    expect(onCollectionSelect).toHaveBeenCalled();
  });

  it("hides the contributor tag without its callback", () => {
    render();
    openTab(messages.tabIdentity);

    expect(text()).toContain(messages.nameStyleTitle);
    expect(text()).not.toContain(messages.contributorTagTitle);
  });
});

describe("AppearanceDialog: owned items tab (#566)", () => {
  it("shows the Itens tab with the app's content when itemsSlot is given", () => {
    render({ itemsSlot: <p>Moldura Saci equipada</p> });

    openTab(messages.tabItems);
    expect(text()).toContain("Moldura Saci equipada");
  });

  it("hides the tab without itemsSlot", () => {
    render();

    const tabs = [...document.body.querySelectorAll('[role="tab"]')].map((t) => t.textContent);
    expect(tabs).not.toContain(messages.tabItems);
  });
});
